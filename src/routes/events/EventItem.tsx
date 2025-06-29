import { StyleSheet } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useTranslation } from "react-i18next";

import { appStyles } from "../../components/AppStyles";
import { EventContent } from "../../components/events/EventContent";
import { Label } from "../../components/generic/atoms/Label";
import { Floater, padFloater } from "../../components/generic/containers/Floater";
import { Header } from "../../components/generic/containers/Header";
import { useAppRoute } from "../../hooks/nav/useAppNavigation";
import { useUpdateSinceNote } from "../../hooks/records/useUpdateSinceNote";
import { useLatchTrue } from "../../hooks/util/useLatchTrue";
import { useAppSelector } from "../../store";
import { eventsSelector } from "../../store/eurofurence/selectors/records";
import { platformShareIcon } from "../../components/generic/atoms/Icon";
import { shareEvent } from "./Events.common";

/**
 * Params handled by the screen in route.
 */
export type EventItemParams = {
    /**
     * The ID, needed if the event is not passed explicitly, i.e., as an external link.
     */
    id: string;
};

export const EventItem = () => {
    const { t } = useTranslation("Event");
    const route = useAppRoute("Event");
    const event = useAppSelector((state) => eventsSelector.selectById(state, route.params.id));

    // Get update note. Latch so it's displayed even if reset in background.
    const updated = useUpdateSinceNote(event);
    const showUpdated = useLatchTrue(updated);

    return (
        <ScrollView style={StyleSheet.absoluteFill} stickyHeaderIndices={[0]} stickyHeaderHiddenOnScroll>
            <Header secondaryIcon={platformShareIcon} secondaryPress={() => event && shareEvent(event)}>
                {event?.Title ?? "Viewing event"}
            </Header>
            <Floater contentStyle={appStyles.trailer}>
                {!event ? (
                    <Label type="h2" mt={30} mb={10}>
                        {t("not_available", "This event is no longer available.")}
                    </Label>
                ) : (
                    <EventContent event={event} parentPad={padFloater} updated={showUpdated} />
                )}
            </Floater>
        </ScrollView>
    );
};
