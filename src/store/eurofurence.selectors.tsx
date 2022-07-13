import { createSelector } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";

import {
    announcementsAdapter,
    dealersAdapter,
    eventDaysAdapter,
    eventRoomsAdapter,
    eventsAdapter,
    eventTracksAdapter,
    imagesAdapter,
    knowledgeEntriesAdapter,
    knowledgeGroupsAdapter,
    mapsAdapter,
} from "./eurofurence.cache";
import { EventDayRecord, EventRecord, EventRoomRecord, EventTrackRecord, RecordId } from "./eurofurence.types";
import { RootState } from "./index";

// These selectors are basic and we can immediately export them
export const eventDaysSelectors = eventDaysAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventDays);
export const eventRoomsSelectors = eventRoomsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventRooms);
export const eventTracksSelectors = eventTracksAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.eventTracks);
export const knowledgeGroupsSelectors = knowledgeGroupsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeGroups);
export const knowledgeEntriesSelectors = knowledgeEntriesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.knowledgeEntries);
export const imagesSelectors = imagesAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.images);
export const dealersSelectors = dealersAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.dealers);

// Save these selectors as we re-use them later
const baseEventsSelector = eventsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.events);
const baseAnnouncementsSelectors = announcementsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.announcements);
const baseMapsSelectors = mapsAdapter.getSelectors<RootState>((state) => state.eurofurenceCache.maps);

/**
 * An event with the external references as required.
 */
type EventWithDetails = EventRecord & {
    ConferenceRoom: EventRoomRecord;
    ConferenceDay: EventDayRecord;
    ConferenceTrack: EventTrackRecord;
};
export const eventsSelector = {
    ...baseEventsSelector,
    selectByRoom: createSelector([baseEventsSelector.selectAll, (state, itemId: RecordId) => itemId], (events, itemId) => events.filter((it) => it?.ConferenceRoomId === itemId)),
    selectByTrack: createSelector([baseEventsSelector.selectAll, (state, itemId: RecordId) => itemId], (events, itemId) => events.filter((it) => it?.ConferenceTrackId === itemId)),
    selectByDay: createSelector([baseEventsSelector.selectAll, (state, itemId: RecordId) => itemId], (events, itemId) => events.filter((it) => it?.ConferenceDayId === itemId)),
    selectUpcomingEvents: createSelector([baseEventsSelector.selectAll, (events, now: Moment) => now], (events, now) =>
        events.filter((it) => {
            const startMoment = moment(it.StartDateTimeUtc);
            return now.isBetween(startMoment.subtract(30, "minutes"), startMoment);
        })
    ),
    selectFavorites: createSelector([baseEventsSelector.selectAll, (state: RootState) => state.background.notifications], (events, notifications) =>
        notifications
            .filter((it) => it.type === "EventReminder")
            .map((it) => events.find((event) => event.Id === it.recordId))
            .filter((it) => it !== undefined)
    ),
    selectCompleteEventById: createSelector(
        [baseEventsSelector.selectById, eventDaysSelectors.selectEntities, eventTracksSelectors.selectEntities, eventRoomsSelectors.selectEntities],
        (event, days, tracks, rooms): EventWithDetails | undefined =>
            event
                ? ({
                      ...event,
                      ConferenceRoom: event.ConferenceRoomId && rooms[event.ConferenceRoomId],
                      ConferenceDay: event.ConferenceDayId && days[event.ConferenceDayId],
                      ConferenceTrack: event.ConferenceTrackId && tracks[event.ConferenceTrackId],
                  } as any as EventWithDetails)
                : undefined
    ),
};

export const annoucenementsSelectors = {
    ...baseAnnouncementsSelectors,
    selectActiveAnnouncements: createSelector([baseAnnouncementsSelectors.selectAll, (state, now: Moment) => now], (announcements, now) =>
        announcements.filter((it) => now.isBetween(it.ValidFromDateTimeUtc, it.ValidUntilDateTimeUtc))
    ),
};
export const mapsSelectors = {
    ...baseMapsSelectors,
    selectBrowseableMaps: createSelector(baseMapsSelectors.selectAll, (maps) => maps.filter((it) => it.IsBrowseable)),
};
