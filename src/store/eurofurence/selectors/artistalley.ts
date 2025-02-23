import { createSelector } from "@reduxjs/toolkit";
import { artistAlleyAdapter } from "../slice";
import { RootState } from "../../index";

const selectArtistAlleyState = (state: RootState) => state.eurofurenceCache.artistAlley;

const artistAlleySelectors = artistAlleyAdapter.getSelectors(selectArtistAlleyState);

export const selectAllArtistAlley = artistAlleySelectors.selectAll;

export const selectArtistAlleyById = (id: string) => createSelector(selectArtistAlleyState, (state) => artistAlleySelectors.selectById(state, id));

export const selectArtistCategoryMapper = createSelector(selectAllArtistAlley, (artists) => {
    const categoryMap: Record<string, string> = {};
    artists.forEach((artist) => {
        if (artist.Categories) {
            artist.Categories.forEach((category) => {
                categoryMap[artist.Id] = category;
            });
        }
    });
    return (artist: { Id: string }) => categoryMap[artist.Id];
});
