import { createSelector } from "@reduxjs/toolkit";
import moment, { Moment } from "moment/moment";

import { EventDetails, RecordId } from "../types";
import { eventsSelector } from "./records";

export const selectFavoriteEvents = createSelector([eventsSelector.selectAll], (items) => items.filter((item) => item.Favorite));

const baseEventGroupSelector = createSelector([eventsSelector.selectAll], (items) => {
    const result: {
        room: Record<string, EventDetails[]>;
        track: Record<string, EventDetails[]>;
        day: Record<string, EventDetails[]>;
    } = {
        room: {},
        track: {},
        day: {},
    };

    for (const event of items) {
        if (event.ConferenceRoomId) (result.room[event.ConferenceRoomId] ??= []).push(event);
        if (event.ConferenceTrackId) (result.track[event.ConferenceTrackId] ??= []).push(event);
        if (event.ConferenceDayId) (result.day[event.ConferenceDayId] ??= []).push(event);
    }
    return result;
});

// Lists all created already, just re-referenced.
export const selectEventsByRoom = createSelector([baseEventGroupSelector, (_state, roomId: RecordId) => roomId], (events, roomId) => events.room[roomId] ?? []);
export const selectEventsByTrack = createSelector([baseEventGroupSelector, (_state, trackId: RecordId) => trackId], (events, trackId) => events.track[trackId] ?? []);
export const selectEventsByDay = createSelector([baseEventGroupSelector, (_state, dayId: RecordId) => dayId], (events, dayId) => events.day[dayId] ?? []);

export const filterHappeningTodayEvents = <T extends Pick<EventDetails, "StartDateTimeUtc" | "EndDateTimeUtc">>(events: T[], now: Moment) =>
    events.filter((it) => now.isSame(it.StartDateTimeUtc, "day")).filter((it) => now.isBefore(moment.utc(it.EndDateTimeUtc)));

export const filterCurrentEvents = <T extends Pick<EventDetails, "StartDateTimeUtc" | "EndDateTimeUtc">>(events: T[], now: Moment) =>
    events.filter((it) => now.isBetween(moment.utc(it.StartDateTimeUtc), moment.utc(it.EndDateTimeUtc)));

export const filterUpcomingEvents = <T extends Pick<EventDetails, "StartDateTimeUtc">>(events: T[], now: Moment) =>
    events.filter((it) => {
        const startMoment = moment.utc(it.StartDateTimeUtc, true).subtract(30, "minutes");
        const endMoment = moment.utc(it.StartDateTimeUtc, true);
        return now.isBetween(startMoment, endMoment);
    });

export const selectUpdatedFavoriteEvents = createSelector([selectFavoriteEvents, (state) => state.auxiliary.lastViewTimesUtc], (favorites, lastViewTimesUtc) =>
    // Is favorite and has ever been viewed and the update is after when it was viewed.
    favorites.filter((event) => lastViewTimesUtc && event.Id in lastViewTimesUtc && moment.utc(event.LastChangeDateTimeUtc).isAfter(moment.utc(lastViewTimesUtc[event.Id]))),
);
