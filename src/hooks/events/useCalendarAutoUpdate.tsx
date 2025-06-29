import { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import * as Calendar from "expo-calendar";
import moment from "moment-timezone";

import { captureException } from "@sentry/react-native";
import { useAppSelector } from "../../store";
import { selectAutoUpdateEvents } from "../../store/calendar/selectors";
import { selectUpdatedFavoriteEvents } from "../../store/eurofurence/selectors/events";
import { conTimeZone } from "../../configuration";

/**
 * Hook to handle automatic calendar updates for favorite events
 * This will be enhanced when the backend API becomes available
 */
export const useCalendarAutoUpdate = () => {
    const autoUpdateEvents = useAppSelector(selectAutoUpdateEvents);
    const updatedFavoriteEvents = useAppSelector(selectUpdatedFavoriteEvents);

    /**
     * Update a calendar event with new details
     */
    const updateCalendarEvent = useCallback(async (calendarEventId: string, eventDetails: any) => {
        try {
            if (Platform.OS === "web") {
                return false;
            }

            // Check if we have calendar permissions
            const { status } = await Calendar.getCalendarPermissionsAsync();
            if (status !== "granted") {
                return false;
            }

            await Calendar.updateEventAsync(calendarEventId, eventDetails);
            return true;
        } catch (error) {
            captureException(error);
            return false;
        }
    }, []);

    /**
     * Process updates for favorite events that have been changed
     */
    const processUpdatedFavorites = useCallback(async () => {
        if (updatedFavoriteEvents.length === 0 || autoUpdateEvents.length === 0) {
            return;
        }

        // Find events that need updating
        const eventsToUpdate = updatedFavoriteEvents.filter(event => 
            autoUpdateEvents.some(mapping => mapping.eventId === event.Id)
        );

        for (const event of eventsToUpdate) {
            const mapping = autoUpdateEvents.find(m => m.eventId === event.Id);
            if (!mapping) continue;

            // Convert event times to local dates
            const startDate = moment.utc(event.StartDateTimeUtc).tz(conTimeZone).toDate();
            const endDate = moment.utc(event.EndDateTimeUtc).tz(conTimeZone).toDate();

            // Create updated event details
            const eventDetails = {
                title: event.Title || "EF Event",
                startDate,
                endDate,
                timeZone: conTimeZone,
                location: event.ConferenceRoom?.Name,
                notes: event.Abstract || event.Description,
                allDay: false,
            };

            const success = await updateCalendarEvent(mapping.calendarEventId, eventDetails);
            if (success) {
                console.log(`Updated calendar event for: ${event.Title}`);
            }
        }
    }, [updatedFavoriteEvents, autoUpdateEvents, updateCalendarEvent]);

    // Effect to check for updated favorite events
    // This will run when favorite events are updated
    useEffect(() => {
        if (Platform.OS !== "web") {
            processUpdatedFavorites();
        }
    }, [processUpdatedFavorites]);

    return {
        updateCalendarEvent,
        processUpdatedFavorites,
        pendingUpdates: updatedFavoriteEvents.length,
        autoUpdateEnabled: autoUpdateEvents.length > 0,
    };
};