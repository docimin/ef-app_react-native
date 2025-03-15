import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { RecordId } from "../eurofurence/types";

type AuxiliaryState = {
    lastViewTimesUtc?: Record<RecordId, string>;
    hiddenEvents?: RecordId[];
    favoriteDealers?: RecordId[];
    deviceWarningsHidden?: boolean;
    languageWarningsHidden?: boolean;
    timeZoneWarningsHidden?: boolean;
};
const initialState: AuxiliaryState = {
    lastViewTimesUtc: {},
    hiddenEvents: [],
    favoriteDealers: [],
    deviceWarningsHidden: false,
    languageWarningsHidden: false,
    timeZoneWarningsHidden: false,
};

export const auxiliary = createSlice({
    name: "auxiliary",
    initialState,
    reducers: {
        setViewed(state, action: PayloadAction<{ id: RecordId | RecordId[]; nowUtc: string }>) {
            state.lastViewTimesUtc ??= {};
            if (Array.isArray(action.payload.id)) {
                for (const id in action.payload.id) {
                    state.lastViewTimesUtc[id] = action.payload.nowUtc;
                }
            } else {
                state.lastViewTimesUtc[action.payload.id] = action.payload.nowUtc;
            }
        },
        hideEvent(state, action: PayloadAction<RecordId>) {
            state.hiddenEvents ??= [];
            state.hiddenEvents.push(action.payload);
        },
        unhideEvent(state, action: PayloadAction<RecordId>) {
            state.hiddenEvents ??= [];
            const index = state.hiddenEvents.indexOf(action.payload);
            if (index >= 0) state.hiddenEvents.splice(index, 1);
        },
        toggleEventHidden(state, action: PayloadAction<RecordId>) {
            state.hiddenEvents ??= [];
            const index = state.hiddenEvents.indexOf(action.payload);
            if (index >= 0) state.hiddenEvents.splice(index, 1);
            else state.hiddenEvents.push(action.payload);
        },
        unhideAllEvents(state) {
            state.hiddenEvents ??= [];
            state.hiddenEvents.splice(0, state.hiddenEvents.length);
        },

        favoriteDealer(state, action: PayloadAction<RecordId>) {
            state.favoriteDealers ??= [];
            state.favoriteDealers.push(action.payload);
        },
        unfavoriteDealer(state, action: PayloadAction<RecordId>) {
            state.favoriteDealers ??= [];
            const index = state.favoriteDealers.indexOf(action.payload);
            if (index >= 0) state.favoriteDealers.splice(index, 1);
        },
        toggleDealerFavorite(state, action: PayloadAction<RecordId>) {
            state.favoriteDealers ??= [];
            const index = state.favoriteDealers.indexOf(action.payload);
            if (index >= 0) state.favoriteDealers.splice(index, 1);
            else state.favoriteDealers.push(action.payload);
        },
        hideDeviceWarnings(state) {
            state.deviceWarningsHidden = true;
        },
        showDeviceWarnings(state) {
            state.deviceWarningsHidden = false;
        },
        toggleShowDeviceWarnings(state) {
            state.deviceWarningsHidden = !state.deviceWarningsHidden;
        },
        hideLanguageWarnings(state) {
            state.languageWarningsHidden = true;
        },
        showLanguageWarnings(state) {
            state.languageWarningsHidden = false;
        },
        toggleShowLanguageWarnings(state) {
            state.languageWarningsHidden = !state.languageWarningsHidden;
        },
        hideTimeZoneWarnings(state) {
            state.timeZoneWarningsHidden = true;
        },
        showTimeZoneWarnings(state) {
            state.timeZoneWarningsHidden = false;
        },
        toggleShowTimeZoneWarnings(state) {
            state.timeZoneWarningsHidden = !state.timeZoneWarningsHidden;
        },
    },
});

export const {
    setViewed,
    hideEvent,
    unhideEvent,
    toggleEventHidden,
    unhideAllEvents,
    favoriteDealer,
    unfavoriteDealer,
    toggleDealerFavorite,
    hideDeviceWarnings,
    showDeviceWarnings,
    toggleShowDeviceWarnings,
    hideLanguageWarnings,
    showLanguageWarnings,
    toggleShowLanguageWarnings,
    hideTimeZoneWarnings,
    showTimeZoneWarnings,
    toggleShowTimeZoneWarnings,
} = auxiliary.actions;
