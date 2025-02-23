import * as Clipboard from "expo-clipboard";
import * as Linking from "expo-linking";
import { TFunction } from "i18next";
import moment from "moment-timezone";
import React, { FC, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useToast } from "../../context/ToastContext";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useNow } from "../../hooks/time/useNow";
import { shareArtist } from "../../routes/artistalley/ArtistAlley.common";
import { useAppDispatch, useAppSelector } from "../../store";
import { toggleArtistFavorite } from "../../store/auxiliary/slice";
import { selectValidLinksByTarget } from "../../store/eurofurence/selectors/maps";
import { ArtistAlleyDetails } from "../../store/eurofurence/types";
import { appStyles } from "../AppStyles";
import { Banner } from "../generic/atoms/Banner";
import { FaIcon } from "../generic/atoms/FaIcon";
import { Image } from "../generic/atoms/Image";
import { Label } from "../generic/atoms/Label";
import { Section } from "../generic/atoms/Section";
import { Badge } from "../generic/containers/Badge";
import { Button } from "../generic/containers/Button";
import { ImageExButton } from "../generic/containers/ImageButton";
import { LinkItem } from "../maps/LinkItem";
import { conTimeZone } from "../../configuration";
import { platformShareIcon } from "../generic/atoms/Icon";
import { sourceFromImage } from "../generic/atoms/Image.common";

const ArtistAlleyCategories = ({ t, artist }: { t: TFunction; artist: ArtistAlleyDetails }) => {
    // Nothing to display for no categories.
    if (!artist.Categories?.length) return null;

    return (
        <>
            <Label type="caption">{t("categories")}</Label>
            <View style={artistCategoriesStyles.container}>
                {artist.Categories.map((category: string) => {
                    const keywords = artist.Keywords?.[category];
                    if (keywords?.length)
                        return (
                            <Label key={category} mt={5}>
                                <Label variant="bold">{category}: </Label>
                                {keywords.join(", ")}
                            </Label>
                        );
                    else
                        return (
                            <Label key={category} variant="bold">
                                {category}
                            </Label>
                        );
                })}
            </View>
        </>
    );
};

const artistCategoriesStyles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
});

/**
 * Props to the content.
 */
export type ArtistAlleyContentProps = {
    artist: ArtistAlleyDetails;

    /**
     * The padding used by the parent horizontally.
     */
    parentPad?: number;

    /**
     * True if the artist was updated.
     */
    updated?: boolean;

    /**
     * True if a dedicated share button should be displayed.
     */
    shareButton?: boolean;
};

export const ArtistAlleyContent: FC<ArtistAlleyContentProps> = ({ artist, parentPad = 0, updated, shareButton }) => {
    const navigation = useAppNavigation("Areas");
    const { t } = useTranslation("ArtistAlley");
    const now = useNow();
    const toast = useToast();

    const dispatch = useAppDispatch();
    const mapLink = useAppSelector((state) => selectValidLinksByTarget(state, artist.Id));

    const toggleFavorite = useCallback(() => dispatch(toggleArtistFavorite(artist.Id)), [dispatch, artist.Id]);

    const days = useMemo(
        () =>
            artist.AttendanceDays
                // Convert to long representation.
                .map((day) => moment.tz(day.Date, conTimeZone).format("dddd"))
                // Join comma separated.
                .join(", "),
        [artist],
    );

    // Check if not-attending warning should be marked.
    const markNotAttending = useMemo(() => {
        // Sun:0, Mon:1 , Tue:2, Wed:3, Thu:4, Fri:5, Sat:6.
        if (now.day() === 4 && !artist.AttendsOnThursday) return true;
        else if (now.day() === 5 && !artist.AttendsOnFriday) return true;
        else if (now.day() === 6 && !artist.AttendsOnSaturday) return true;
        return false;
    }, [now, artist]);

    return (
        <>
            {!updated ? null : (
                <Badge unpad={parentPad} badgeColor="warning" textColor="white">
                    {t("artist_was_updated")}
                </Badge>
            )}

            {!markNotAttending ? null : (
                <Badge unpad={parentPad} badgeColor="warning" textColor="invText">
                    {t("not_attending")}
                </Badge>
            )}

            {!artist.Artist ? null : (
                <View style={[appStyles.shadow, styles.avatarCircle]}>
                    <Image contentFit="cover" style={styles.avatarImage} source={sourceFromImage(artist.Artist)} />
                </View>
            )}

            <Section icon="brush" title={artist.DisplayNameOrAttendeeNickname} />

            <Label type="para">{artist.ShortDescriptionContent}</Label>

            <Button containerStyle={styles.marginBefore} outline={artist.Favorite} icon={artist.Favorite ? "heart-minus" : "heart-plus-outline"} onPress={toggleFavorite}>
                {artist.Favorite ? t("remove_favorite") : t("add_favorite")}
            </Button>

            {!shareButton ? null : (
                <Button containerStyle={styles.marginBefore} icon={platformShareIcon} onPress={() => shareArtist(artist)}>
                    {t("share")}
                </Button>
            )}

            <Section icon="directions-fork" title={t("about")} />
            <Label type="caption">{t("table")}</Label>
            {!artist.ShortDescriptionTable ? null : (
                <Label type="h3" mb={20}>
                    {artist.ShortDescriptionTable}
                </Label>
            )}

            <Label type="caption">{t("attends")}</Label>
            <Label type="h3" mb={20}>
                {days}
            </Label>

            {!artist.IsAfterDark ? null : (
                <>
                    <Label type="caption">{t("after_dark")}</Label>
                    <Label type="h3" mb={20}>
                        {t("in_after_dark")}
                    </Label>
                </>
            )}

            <ArtistAlleyCategories t={t} artist={artist} />

            {artist.Links &&
                artist.Links.map((it) => (
                    <View style={styles.button} key={it.Name}>
                        <LinkItem link={it} />
                    </View>
                ))}

            {artist.TelegramHandle && (
                <Button
                    containerStyle={styles.button}
                    onPress={() => Linking.openURL(`https://t.me/${artist.TelegramHandle}`)}
                    icon={(props) => <FaIcon name="telegram-plane" {...props} />}
                >
                    Telegram: {artist.TelegramHandle}
                </Button>
            )}
            {artist.TwitterHandle && (
                <Button containerStyle={styles.button} onPress={() => Linking.openURL(`https://twitter.com/${artist.TwitterHandle}`)} icon="twitter">
                    Twitter: {artist.TwitterHandle}
                </Button>
            )}
            {artist.DiscordHandle && (
                <Button
                    containerStyle={styles.button}
                    onPress={async () => {
                        if (!artist.DiscordHandle) return null;
                        await Clipboard.setStringAsync(artist.DiscordHandle);
                        toast("info", t("discord_handle_copied", { discordHandle: artist.DiscordHandle }), 5000);
                    }}
                    icon="discord"
                >
                    Discord: {artist.DiscordHandle}
                </Button>
            )}
            {artist.MastodonHandle && (
                <Button containerStyle={styles.button} onPress={() => (artist.MastodonUrl ? Linking.openURL(artist.MastodonUrl) : null)} icon="mastodon">
                    Mastodon: {artist.MastodonHandle}
                </Button>
            )}
            {artist.BlueskyHandle && (
                <Button containerStyle={styles.button} onPress={() => Linking.openURL(`https://bsky.app/profile/${artist.BlueskyHandle}`)} icon="cloud">
                    Bluesky: {artist.BlueskyHandle}
                </Button>
            )}

            {mapLink.map(({ map, entry, link }, i) => (
                <ImageExButton
                    key={i}
                    image={map.Image}
                    target={{ x: entry.X, y: entry.Y, size: entry.TapRadius * 10 }}
                    onPress={() => navigation.navigate("Map", { id: map.Id, entryId: entry.Id, linkId: entry.Links.indexOf(link) })}
                />
            ))}

            {!artist.AboutTheArtText && !artist.ArtPreview ? null : (
                <>
                    <Section icon="film" title={t("about_the_art")} />

                    {!artist.ArtPreview ? null : (
                        <View style={styles.posterLine}>
                            <Banner image={artist.ArtPreview} viewable />

                            <Label mt={10} type="caption" numberOfLines={4} ellipsizeMode="tail">
                                {artist.ArtPreviewCaption}
                            </Label>
                        </View>
                    )}

                    <Label type="para">{artist.AboutTheArtText}</Label>
                </>
            )}

            {!artist.AboutTheArtistText && !artist.ArtistImageId ? null : (
                <>
                    <Section icon="account-circle-outline" title={t("about_the_artist", { name: artist.DisplayNameOrAttendeeNickname })} />

                    {!artist.Artist ? null : (
                        <View style={styles.posterLine}>
                            <Banner image={artist.Artist} viewable />
                        </View>
                    )}

                    <Label type="para">{artist.AboutTheArtistText}</Label>
                </>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    avatarCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: "hidden",
        alignSelf: "center",
        margin: 20,
    },
    avatarImage: {
        width: "100%",
        height: "100%",
    },
    aboutLine: {
        marginBottom: 20,
    },
    posterLine: {
        marginBottom: 20,
        alignItems: "center",
    },
    marginBefore: {
        marginTop: 15,
    },
    button: {
        marginBottom: 20,
    },
});
