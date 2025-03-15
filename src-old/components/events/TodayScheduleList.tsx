import { Moment } from "moment/moment";
import { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useAppSelector } from "../../store";
import { filterHappeningTodayEvents, selectFavoriteEvents } from "../../store/eurofurence/selectors/events";
import { Section } from "../generic/atoms/Section";
import { useZoneAbbr } from "../../hooks/time/useZoneAbbr";
import { EventCard, eventInstanceForAny } from "./EventCard";

export type TodayScheduleListProps = {
    now: Moment;
};
export const TodayScheduleList: FC<TodayScheduleListProps> = ({ now }) => {
    const { t } = useTranslation("Events");

    const navigation = useAppNavigation("Areas");
    const favorites = useAppSelector(selectFavoriteEvents);
    const zone = useZoneAbbr();
    const events = useMemo(
        () =>
            filterHappeningTodayEvents(favorites, now)
                .filter((item) => !item.Hidden)
                .map((details) => eventInstanceForAny(details, now, zone)),
        [favorites, now, zone],
    );

    if (events.length === 0) {
        return null;
    }

    return (
        <>
            <Section title={t("today_schedule_title")} subtitle={t("today_schedule_subtitle")} icon="book-marker" />
            <View style={styles.condense}>
                {events.map((event) => (
                    <EventCard
                        key={event.details.Id}
                        event={event}
                        type="time"
                        onPress={(event) =>
                            navigation.navigate("Event", {
                                id: event.Id,
                            })
                        }
                    />
                ))}
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    condense: {
        marginVertical: -15,
    },
});
