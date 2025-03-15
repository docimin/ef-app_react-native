import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps, useIsFocused } from "@react-navigation/core";
import { MaterialTopTabScreenProps } from "@react-navigation/material-top-tabs";
import { StackScreenProps } from "@react-navigation/stack";
import { FC } from "react";
import { useTranslation } from "react-i18next";

import { EventsSectionedList } from "../../components/events/EventsSectionedList";
import { Label } from "../../components/generic/atoms/Label";
import { useNow } from "../../hooks/time/useNow";
import { useAppSelector } from "../../store";
import { selectEventsByDay } from "../../store/eurofurence/selectors/events";
import { eventDaysSelectors } from "../../store/eurofurence/selectors/records";
import { EventDetails } from "../../store/eurofurence/types";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";
import { useEventsRouterContext } from "./EventsRouterContext";
import { EventsRouterParamsList } from "./EventsRouter";
import { useEventDayGroups } from "./Events.common";

/**
 * Params handled by the screen in route.
 */
export type EventsByDayParams = object;

/**
 * The properties to the screen as a component.
 */
export type EventsByDayProps =
    // Route carrying from events tabs screen at "Day", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsRouterParamsList, string>,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const EventsByDay: FC<EventsByDayProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const { setSelected } = useEventsRouterContext();

    // Use all events on the day and group generically.
    const zone = useZoneAbbr();
    const day = useAppSelector((state) => eventDaysSelectors.selectById(state, route.name));
    const eventsOnDay: EventDetails[] = useAppSelector((state) => selectEventsByDay(state, day?.Id ?? ""));
    const eventsGroups = useEventDayGroups(t, now, zone, eventsOnDay);

    return (
        <EventsSectionedList
            navigation={navigation}
            eventsGroups={eventsGroups}
            select={setSelected}
            leader={
                <Label type="lead" variant="middle" mt={30}>
                    {day?.Name ?? ""}
                </Label>
            }
        />
    );
};
