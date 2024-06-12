import { createSelector } from "@reduxjs/toolkit";
import moment, { Moment } from "moment";

import { RecordId } from "./eurofurence.types";
import { RootState } from "./index";

export const selectLastViewed = createSelector([(state: RootState) => state.auxiliary.lastViewTimes, (_state, id: RecordId) => id], (lastViewedTimes, id): Moment | null => {
    const lastViewTime = lastViewedTimes[id];
    return lastViewTime ? moment(lastViewTime) : null;
});
