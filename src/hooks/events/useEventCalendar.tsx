import * as Calendar from "expo-calendar";
import { useCallback, useState } from "react";
import { Platform, Alert } from "react-native";
import moment from "moment-timezone";

import { captureException } from "@sentry/react-native";
import { EventDetails } from "../../store/eurofurence/types";
import { conTimeZone } from "../../configuration";
import { useAppDispatch, useAppSelector } from "../../store";
import { addExportedEvent } from "../../store/calendar/slice";
import { selectIsEventExported } from "../../store/calendar/selectors";

export type CalendarExportResult = {
    success: boolean;
    eventId?: string;
    error?: string;
};

/**
 * Hook for calendar operations including exporting events and managing permissions
 */
export const useEventCalendar = (event?: EventDetails) => {
    const [isExporting, setIsExporting] = useState(false);
    const dispatch = useAppDispatch();
    
    // Check if the current event is already exported (if event is provided)
    const isAlreadyExported = useAppSelector((state) => 
        event ? selectIsEventExported(state, event.Id) : false
    );

    /**
     * Request calendar permissions from the user
     */
    const requestCalendarPermissions = useCallback(async (): Promise<boolean> => {
        try {
            if (Platform.OS === "web") {
                // Calendar is not supported on web
                return false;
            }

            const { status } = await Calendar.requestCalendarPermissionsAsync();
            return status === "granted";
        } catch (error) {
            captureException(error);
            return false;
        }
    }, []);

    /**
     * Get the default calendar for the platform
     */
    const getDefaultCalendar = useCallback(async () => {
        try {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            
            // Find the default calendar
            const defaultCalendar = calendars.find(
                cal => cal.source?.name === "Default" || cal.isPrimary
            ) || calendars[0];

            return defaultCalendar;
        } catch (error) {
            captureException(error);
            return null;
        }
    }, []);

    /**
     * Export an event to the device calendar
     */
    const exportEventToCalendar = useCallback(async (eventToExport: EventDetails): Promise<CalendarExportResult> => {
        if (isExporting) {
            return { success: false, error: "Already exporting an event" };
        }

        setIsExporting(true);

        try {
            if (Platform.OS === "web") {
                setIsExporting(false);
                return { success: false, error: "Calendar export is not supported on web" };
            }

            // Request permissions
            const hasPermission = await requestCalendarPermissions();
            if (!hasPermission) {
                setIsExporting(false);
                return { success: false, error: "Calendar permission not granted" };
            }

            // Get default calendar
            const calendar = await getDefaultCalendar();
            if (!calendar) {
                setIsExporting(false);
                return { success: false, error: "No calendar available" };
            }

            // Convert event times to local dates
            const startDate = moment.utc(eventToExport.StartDateTimeUtc).tz(conTimeZone).toDate();
            const endDate = moment.utc(eventToExport.EndDateTimeUtc).tz(conTimeZone).toDate();

            // Create event details
            const eventDetails: Calendar.Event = {
                title: eventToExport.Title || "EF Event",
                startDate,
                endDate,
                timeZone: conTimeZone,
                location: eventToExport.ConferenceRoom?.Name,
                notes: eventToExport.Abstract || eventToExport.Description,
                allDay: false,
            };

            // Create the calendar event
            const eventId = await Calendar.createEventAsync(calendar.id, eventDetails);

            // Store the mapping in Redux
            dispatch(addExportedEvent({
                eventId: eventToExport.Id,
                calendarEventId: eventId,
                exportedAt: moment.utc().toISOString(),
                autoUpdate: eventToExport.Favorite || false, // Auto-update favorite events
            }));

            setIsExporting(false);
            return { success: true, eventId };

        } catch (error) {
            captureException(error);
            setIsExporting(false);
            return { 
                success: false, 
                error: error instanceof Error ? error.message : "Failed to export event"
            };
        }
    }, [isExporting, requestCalendarPermissions, getDefaultCalendar, dispatch]);

    /**
     * Show a confirmation dialog before exporting an event
     */
    const exportEventWithConfirmation = useCallback(async (eventToExport: EventDetails): Promise<CalendarExportResult> => {
        return new Promise((resolve) => {
            Alert.alert(
                "Export to Calendar",
                `Export "${eventToExport.Title}" to your calendar?`,
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                        onPress: () => resolve({ success: false, error: "User cancelled" }),
                    },
                    {
                        text: "Export",
                        onPress: async () => {
                            const result = await exportEventToCalendar(eventToExport);
                            resolve(result);
                        },
                    },
                ],
                { cancelable: true, onDismiss: () => resolve({ success: false, error: "User cancelled" }) }
            );
        });
    }, [exportEventToCalendar]);

    return {
        exportEventToCalendar,
        exportEventWithConfirmation,
        requestCalendarPermissions,
        isExporting,
        isSupported: Platform.OS !== "web",
        isAlreadyExported,
    };
};