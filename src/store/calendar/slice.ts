import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CalendarEventMapping {
    /** EF event ID */
    eventId: string;
    /** Calendar event ID from the device */
    calendarEventId: string;
    /** When it was exported */
    exportedAt: string;
    /** Whether this event should auto-update */
    autoUpdate: boolean;
}

export interface CalendarState {
    /** Mapping of EF events to calendar events */
    exportedEvents: Record<string, CalendarEventMapping>;
}

const initialState: CalendarState = {
    exportedEvents: {},
};

const calendarSlice = createSlice({
    name: "calendar",
    initialState,
    reducers: {
        addExportedEvent: (state, action: PayloadAction<CalendarEventMapping>) => {
            state.exportedEvents[action.payload.eventId] = action.payload;
        },
        removeExportedEvent: (state, action: PayloadAction<string>) => {
            delete state.exportedEvents[action.payload];
        },
        setAutoUpdate: (state, action: PayloadAction<{ eventId: string; autoUpdate: boolean }>) => {
            const mapping = state.exportedEvents[action.payload.eventId];
            if (mapping) {
                mapping.autoUpdate = action.payload.autoUpdate;
            }
        },
        clearAllExportedEvents: (state) => {
            state.exportedEvents = {};
        },
    },
});

export const { addExportedEvent, removeExportedEvent, setAutoUpdate, clearAllExportedEvents } = calendarSlice.actions;

export default calendarSlice.reducer;