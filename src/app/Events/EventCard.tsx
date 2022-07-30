import moment from "moment";
import React, { FC, useMemo } from "react";
import { useTranslation } from "react-i18next";

import { Label } from "../../components/Atoms/Label";
import { Col } from "../../components/Containers/Col";
import { useTheme } from "../../context/Theme";
import { useEventIsDone, useEventIsHappening } from "../../hooks/useEventProperties";
import { EventWithDetails } from "../../store/eurofurence.selectors";
import { EventCardContent } from "./EventCardContent";

export type EventCardProps = {
    type?: "duration" | "time";
    event: EventWithDetails;
    onPress?: () => void;
    onLongPress?: () => void;
};

export const EventCard: FC<EventCardProps> = ({ type = "duration", event, onPress, onLongPress }) => {
    const { t } = useTranslation("Event");
    const theme = useTheme();

    // Resolve event statuses.
    const happening = useEventIsHappening(event);
    const done = useEventIsDone(event);

    // Renders the override or default. The override will receive if it needs to
    // render on inverted color, i.e., background.
    const pre = useMemo(() => {
        // Convert event start and duration to readable.
        const start = moment(event.StartDateTimeUtc);
        const duration = moment.duration(event.Duration);

        const day = start.format("ddd");
        const time = start.format("LT");
        const runtime = duration.asMinutes() > 59 ? duration.asHours() + "h" : duration.asMinutes() + "m";

        if (type === "duration") {
            // Return simple label with duration text.
            return (
                <Col type="center">
                    <Label type="h4" color={done ? "important" : "invText"}>
                        {runtime}
                    </Label>
                    <Label color={done ? "important" : "invText"}>{time}</Label>
                </Col>
            );
        } else {
            return (
                <Col type="center">
                    <Label type="caption" color={done ? "important" : "invText"}>
                        {day}
                    </Label>
                    <Label color={done ? "important" : "invText"}>{time}</Label>
                </Col>
            );
        }
    }, [t, type, event, done, theme]);

    return (
        <EventCardContent
            background={event.BannerImageUrl ? { uri: event.BannerImageUrl } : undefined}
            pre={pre}
            title={event.Title}
            subtitle={event.ConferenceRoom?.Name}
            tag={event.PanelHosts}
            happening={happening}
            done={done}
            onPress={onPress}
            onLongPress={onLongPress}
        />
    );
};