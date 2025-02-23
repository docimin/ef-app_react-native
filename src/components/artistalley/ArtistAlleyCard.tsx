import { Moment } from "moment/moment";
import React, { FC, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { ArtistAlleyDetails } from "../../store/eurofurence/types";
import { assetSource } from "../../util/assets";
import { appStyles } from "../AppStyles";
import { Image } from "../generic/atoms/Image";
import { Label } from "../generic/atoms/Label";
import { sourceFromImage } from "../generic/atoms/Image.common";
import { isPresent, joinOffDays } from "./utils";

export type ArtistAlleyDetailsInstance = {
    details: ArtistAlleyDetails;
    present: boolean;
    offDays: string;
};

/**
 * Creates the artist from the time and precomputed values.
 * @param details The details to use.
 * @param now The moment to check against.
 * @param day1 The first day label.
 * @param day2 The second day label.
 * @param day3 The third day label.
 */
export function artistInstanceForAny(details: ArtistAlleyDetails, now: Moment, day1: string, day2: string, day3: string) {
    return {
        details,
        present: isPresent(details, now),
        offDays: joinOffDays(details, day1, day2, day3),
    };
}

export type ArtistAlleyCardProps = {
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    artist: ArtistAlleyDetailsInstance;
    onPress?: (artist: ArtistAlleyDetails) => void;
    onLongPress?: (artist: ArtistAlleyDetails) => void;
};

export const ArtistAlleyCard: FC<ArtistAlleyCardProps> = ({ containerStyle, style, artist, onPress, onLongPress }) => {
    // Details and properties dereference.
    const name = artist.details.DisplayNameOrAttendeeNickname;
    const present = artist.present;
    const description = artist.details.Categories?.join(", ");
    const offDays = artist.offDays;
    const avatar = sourceFromImage(artist.details.ArtistThumbnail) ?? sourceFromImage(artist.details.Artist) ?? assetSource("ych");

    // Translation object.
    const { t } = useTranslation("ArtistAlley");

    // Dependent and independent styles.
    const styleBackground = useThemeBackground("background");
    const stylePre = useThemeBackground(present ? "primary" : "darken");
    const avatarBackground = useThemeBackground("primary");

    const onPressBind = useCallback(() => onPress?.(artist.details), [artist.details, onPress]);
    const onLongPressBind = useCallback(() => onLongPress?.(artist.details), [artist.details, onLongPress]);

    return (
        <TouchableOpacity containerStyle={containerStyle} style={[styles.container, appStyles.shadow, styleBackground, style]} onPress={onPressBind} onLongPress={onLongPressBind}>
            <View style={[styles.pre, stylePre]}>
                <Image
                    style={[avatarBackground, styles.avatarCircle]}
                    source={avatar}
                    contentFit="contain"
                    placeholder={assetSource("ych")}
                    transition={60}
                    recyclingKey={artist.details.Id}
                />
            </View>

            <View style={styles.main}>
                <Label type="h3">{name}</Label>

                {!description ? null : (
                    <Label key="artistDescription" type="h4" variant="narrow" ellipsizeMode="tail" numberOfLines={2}>
                        {description}
                    </Label>
                )}

                {!offDays ? null : (
                    <Label key="artistOffDays" style={styles.tag} type="regular" ellipsizeMode="head" numberOfLines={1}>
                        {t("not_attending_on", { offDays })}
                    </Label>
                )}
            </View>
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
    background: {
        position: "absolute",
        width: undefined,
        height: undefined,
    },
    pre: {
        overflow: "hidden",
        width: 80,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarCircle: {
        position: "absolute",
        width: 70,
        height: 70,
        borderRadius: 35,
    },
    image: {
        position: "absolute",
        width: undefined,
        height: undefined,
        left: -10,
        top: -10,
        right: -10,
        bottom: -10,
    },
    imageOverlay: {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
    },
    main: {
        flex: 1,
        padding: 12,
    },
    tag: {
        textAlign: "right",
    },
});
