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
import { selectEventsByRoom } from "../../store/eurofurence/selectors/events";
import { eventRoomsSelectors } from "../../store/eurofurence/selectors/records";
import { AreasRouterParamsList } from "../AreasRouter";
import { IndexRouterParamsList } from "../IndexRouter";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";
import { useEventsRouterContext } from "./EventsRouterContext";
import { EventsRouterParamsList } from "./EventsRouter";
import { useEventOtherGroups } from "./Events.common";

/**
 * Params handled by the screen in route.
 */
export type EventsByRoomParams = object;

/**
 * The properties to the screen as a component. TODO: Unify and verify types.
 */
export type EventsByRoomProps =
    // Route carrying from events tabs screen at "Room", own navigation via own parameter list.
    CompositeScreenProps<
        MaterialTopTabScreenProps<EventsRouterParamsList, string>,
        MaterialTopTabScreenProps<EventsRouterParamsList> & BottomTabScreenProps<AreasRouterParamsList> & StackScreenProps<IndexRouterParamsList>
    >;

export const EventsByRoom: FC<EventsByRoomProps> = ({ navigation, route }) => {
    const { t } = useTranslation("Events");
    const isFocused = useIsFocused();
    const now = useNow(isFocused ? 5 : "static");

    const { setSelected } = useEventsRouterContext();

    // Use all events in room and group generically.
    const zone = useZoneAbbr();
    const room = useAppSelector((state) => eventRoomsSelectors.selectById(state, route.name));
    const eventsInRoom = useAppSelector((state) => selectEventsByRoom(state, room?.Id ?? ""));
    const eventsGroups = useEventOtherGroups(t, now, zone, eventsInRoom);

    return (
        <EventsSectionedList
            navigation={navigation}
            eventsGroups={eventsGroups}
            select={setSelected}
            leader={
                <Label type="lead" variant="middle" mt={30}>
                    {room?.Name ?? ""}
                </Label>
            }
            cardType="time"
        />
    );
};
