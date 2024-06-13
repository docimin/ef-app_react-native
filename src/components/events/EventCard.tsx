import { ImageBackground } from "expo-image";
import moment, { Moment } from "moment";
import React, { FC } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { EventCardTime } from "./EventCardTime";
import { useThemeBackground, useThemeColorValue } from "../../hooks/themes/useThemeHooks";
import { EventDetails } from "../../store/eurofurence.types";
import { appStyles } from "../AppStyles";
import { Icon } from "../generic/atoms/Icon";
import { Label } from "../generic/atoms/Label";
import { Progress } from "../generic/atoms/Progress";
import { Row } from "../generic/containers/Row";

const glyphIconSize = 90;
const badgeIconSize = 20;

export type EventDetailsInstance = {
    details: EventDetails;
    progress: number;
};

/**
 * Creates the event instance props for an upcoming or running event.
 * @param details The details to use.
 * @param now The moment to check against.
 */
export function eventInstanceForAny(details: EventDetails, now: Moment): EventDetailsInstance {
    const progress = (now.valueOf() - moment(details.StartDateTimeUtc).valueOf()) / (moment(details.EndDateTimeUtc).valueOf() - moment(details.StartDateTimeUtc).valueOf());
    return { details, progress };
}

/**
 * Creates the event instance props for an upcoming or running event.
 * @param details The details to use.
 * @param now The moment to check against.
 */
export function eventInstanceForNotPassed(details: EventDetails, now: Moment): EventDetailsInstance {
    const progress = (now.valueOf() - moment(details.StartDateTimeUtc).valueOf()) / (moment(details.EndDateTimeUtc).valueOf() - moment(details.StartDateTimeUtc).valueOf());
    return { details, progress };
}

/**
 * Creates the event instance props for a passed event.
 * @param details The details to use.
 */
export function eventInstanceForPassed(details: EventDetails): EventDetailsInstance {
    return { details, progress: 1.1 };
}

export type EventCardProps = {
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    type?: "duration" | "time";
    event: EventDetailsInstance;
    onPress?: (event: EventDetails) => void;
    onLongPress?: (event: EventDetails) => void;
};

export const EventCard: FC<EventCardProps> = ({ containerStyle, style, type = "duration", event, onPress, onLongPress }) => {
    // Details and properties dereference.
    const badges = event.details.Badges;
    const glyph = event.details.Glyph;
    const title = event.details.Title;
    const subtitle = event.details.SubTitle;
    const tag = event.details.ConferenceRoom?.ShortName ?? event.details.ConferenceRoom?.Name;
    const favorite = event.details.Favorite;
    const happening = event.progress >= 0.0 && event.progress <= 1.0;
    const done = event.progress > 1.0;
    const progress = event.progress;

    // Dependent and independent styles.
    const styleContainer = useThemeBackground("background");
    const stylePre = useThemeBackground(done ? "darken" : favorite ? "notification" : "primary");
    const styleBadgeFrame = useThemeBackground("secondary");
    const colorBadge = useThemeColorValue("white");
    const colorGlyph = useThemeColorValue("lighten");
    const colorHeart = useThemeColorValue(event.details.Banner ? "white" : "text");

    return (
        <TouchableOpacity
            containerStyle={containerStyle}
            style={[styles.container, appStyles.shadow, styleContainer, style]}
            onPress={() => onPress?.(event.details)}
            onLongPress={() => onLongPress?.(event.details)}
        >
            <View style={[styles.pre, stylePre]}>
                {!glyph ? null : (
                    <View style={styles.glyphContainer}>
                        <Icon style={styles.glyph} name={glyph} size={glyphIconSize} color={colorGlyph} />
                    </View>
                )}
                <EventCardTime type={type} event={event.details} done={done} />

                {!happening ? null : (
                    <Label style={styles.happening} type="cap" color={done ? "important" : "white"}>
                        LIVE
                    </Label>
                )}
            </View>

            {event.details.Banner ? (
                <View style={styles.mainPoster}>
                    <ImageBackground source={event.details.Banner.FullUrl} contentFit="cover" style={StyleSheet.absoluteFill} priority="low">
                        <View style={styles.tagArea2}>
                            <View style={styles.tagAreaInner}>
                                <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                                    {title} {subtitle}
                                </Label>
                                {tag && (
                                    <Label style={styles.tag} type="regular" color="white" ellipsizeMode="head" numberOfLines={1}>
                                        {tag}
                                    </Label>
                                )}
                            </View>
                        </View>

                        {!happening ? null : <Progress style={styles.progress} value={progress} color="white" />}
                    </ImageBackground>
                </View>
            ) : (
                <View style={styles.mainText}>
                    <Row>
                        <Label style={styles.title} type="h3">
                            {title}
                        </Label>

                        {badges?.map((icon) => (
                            <View key={icon} style={[styles.badgeFrame, styleBadgeFrame]}>
                                <Icon name={icon} color={colorBadge} size={badgeIconSize} />
                            </View>
                        )) ?? null}
                    </Row>
                    <Label type="h4" variant="narrow">
                        {subtitle}
                    </Label>
                    <Label style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
                        {tag}
                    </Label>

                    {!happening ? null : <Progress style={styles.progress} value={progress} />}
                </View>
            )}

            {!favorite ? null : (
                <View style={styles.favorite}>
                    <Icon name="heart" size={20} color={colorHeart} />
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        minHeight: 80,
        marginVertical: 15,
        borderRadius: 16,
        overflow: "hidden",
        flexDirection: "row",
    },
    glyphContainer: {
        position: "absolute",
        left: -20,
        top: -20,
        right: -20,
        bottom: -20,
        alignItems: "center",
        justifyContent: "center",
    },
    happening: {
        position: "absolute",
        top: 0,
        padding: 2,
        alignItems: "center",
    },
    glyph: {
        opacity: 0.25,
        transform: [{ rotate: "-15deg" }],
    },
    badgeFrame: {
        borderRadius: 20,
        aspectRatio: 1,
        padding: 4,
        marginLeft: 8,
    },
    pre: {
        overflow: "hidden",
        width: 70,
        alignItems: "center",
        justifyContent: "center",
    },
    mainPoster: {
        height: 120,
        flex: 1,
        padding: 12,
    },
    mainText: {
        flex: 1,
        padding: 12,
    },
    title: {
        flex: 1,
    },
    subtitleArea: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    tag: {
        textAlign: "right",
    },
    tagArea: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
        backgroundColor: "#000000A0",
        paddingLeft: 16,
        paddingBottom: 16,
        paddingRight: 16,
        paddingTop: 32,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end",
    },
    tagArea2: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignContent: "flex-start",
        alignItems: "stretch",

        height: "100%",
    },
    tagAreaInner: {
        backgroundColor: "#000000A0",
        padding: 8,
        justifyContent: "space-between",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    favorite: {
        position: "absolute",
        top: 0,
        right: 0,
        padding: 8,
    },
    progress: {
        position: "absolute",
        left: 0,
        bottom: 0,
        right: 0,
    },
});
