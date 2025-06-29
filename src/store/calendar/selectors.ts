import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../index";

const selectCalendarState = (state: RootState) => state.calendar;

export const selectExportedEvents = createSelector([selectCalendarState], (calendar) => calendar.exportedEvents);

export const selectIsEventExported = createSelector(
    [selectExportedEvents, (_state: RootState, eventId: string) => eventId],
    (exportedEvents, eventId) => eventId in exportedEvents
);

export const selectEventCalendarMapping = createSelector(
    [selectExportedEvents, (_state: RootState, eventId: string) => eventId],
    (exportedEvents, eventId) => exportedEvents[eventId]
);

export const selectAutoUpdateEvents = createSelector([selectExportedEvents], (exportedEvents) =>
    Object.values(exportedEvents).filter((mapping) => mapping.autoUpdate)
);

export const selectExportedEventCount = createSelector([selectExportedEvents], (exportedEvents) => Object.keys(exportedEvents).length);