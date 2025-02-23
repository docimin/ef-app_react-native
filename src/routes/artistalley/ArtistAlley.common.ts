import { captureException } from "@sentry/react-native";
import { TFunction } from "i18next";
import moment, { Moment } from "moment-timezone";

import { useMemo } from "react";
import { Share } from "react-native";

import { ArtistAlleyDetailsInstance, artistInstanceForAny } from "../../components/artistalley/ArtistAlleyCard";
import { artistSectionForCategory, artistSectionForLetter, artistSectionForLocation, ArtistSectionProps } from "../../components/artistalley/ArtistSection";
import { appBase, conAbbr } from "../../configuration";
import { useAppSelector } from "../../store";
import { selectArtistCategoryMapper } from "../../store/eurofurence/selectors/artistalley";
import { ArtistAlleyDetails } from "../../store/eurofurence/types";

/**
 * Compares category, checks if the categories are adult labeled.
 * @param left Left category.
 * @param right Right category.
 */
const compareCategory = (left: string, right: string) => {
    const leftAdult = left.toLowerCase().includes("adult");
    const rightAdult = right.toLowerCase().includes("adult");
    if (!leftAdult) {
        if (!rightAdult) return left < right ? -1 : left > right ? 1 : 0;
        else return -1;
    } else {
        if (!rightAdult) return 1;
        else return left < right ? -1 : left > right ? 1 : 0;
    }
};

/**
 * Returns a list of artist instances according to conversion rules.
 * @param t The translation function.
 * @param now The current moment.
 * @param items The items to transform.
 */
export const useArtistInstances = (t: TFunction, now: Moment, items: ArtistAlleyDetails[]) => {
    // Return direct mapping.
    return useMemo(() => {
        const day1 = moment().day(1).format("dddd");
        const day2 = moment().day(2).format("dddd");
        const day3 = moment().day(3).format("dddd");
        return items.map((item) => artistInstanceForAny(item, now, day1, day2, day3));
    }, [t, now, items]);
};

/**
 * Returns a list of artist instances or section headers according to conversion rules.
 * @param t The translation function.
 * @param now The current moment.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useArtistGroups = (t: TFunction, now: Moment, results: ArtistAlleyDetails[] | null, all: ArtistAlleyDetails[]) => {
    const categoryOf = useAppSelector(selectArtistCategoryMapper);
    return useMemo(() => {
        const source = results ?? all;
        const day1 = moment().day(1).format("dddd");
        const day2 = moment().day(2).format("dddd");
        const day3 = moment().day(3).format("dddd");

        // Category group selecting is done by adding to the category lists
        // individually and then concatenating them. This needs to be done
        // as the categories can change between subsequent artists.
        const categoryMap: Record<string, ArtistAlleyDetailsInstance[]> = {};

        const result: (ArtistSectionProps | ArtistAlleyDetailsInstance)[] = [];

        // Add item to the categories (if noting search).
        for (const item of source) {
            if (results) {
                // Search is not sectioned.
                result.push(artistInstanceForAny(item, now, day1, day2, day3));
            } else {
                const category = categoryOf(item) ?? "No category";
                (categoryMap[category] ??= []).push(artistInstanceForAny(item, now, day1, day2, day3));
            }
        }

        // Multiple passes needed.
        for (const category of Object.keys(categoryMap).sort(compareCategory)) {
            result.push(artistSectionForCategory(category));
            result.push(...categoryMap[category]);
        }

        return result;
    }, [t, now, results, all, categoryOf]);
};

/**
 * Returns a list of artist instances or section headers according to conversion rules.
 * @param t The translation function.
 * @param now The current moment.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useArtistLocationGroups = (t: TFunction, now: Moment, results: ArtistAlleyDetails[] | null, all: ArtistAlleyDetails[]) => {
    const categoryOf = useAppSelector(selectArtistCategoryMapper);
    return useMemo(() => {
        const source = results ?? all;
        const day1 = moment().day(1).format("dddd");
        const day2 = moment().day(2).format("dddd");
        const day3 = moment().day(3).format("dddd");

        // Location grouping is done by passing the list twice, once for regular
        // and one for after dark.
        let sectionedRegular = false;
        let sectionedAd = false;

        const result: (ArtistSectionProps | ArtistAlleyDetailsInstance)[] = [];
        for (const item of source) {
            if (results) {
                // Search is not sectioned.
                result.push(artistInstanceForAny(item, now, day1, day2, day3));
            } else if (item.IsAfterDark === false) {
                if (!sectionedRegular) {
                    result.push(artistSectionForLocation(t, false));
                    sectionedRegular = true;
                }

                result.push(artistInstanceForAny(item, now, day1, day2, day3));
            }
        }
        for (const item of source) {
            if (results) {
                // Search is not sectioned.
                result.push(artistInstanceForAny(item, now, day1, day2, day3));
            } else if (item.IsAfterDark === true) {
                if (!sectionedAd) {
                    result.push(artistSectionForLocation(t, true));
                    sectionedAd = true;
                }

                result.push(artistInstanceForAny(item, now, day1, day2, day3));
            }
        }

        return result;
    }, [t, now, results, all, categoryOf]);
};

/**
 * Returns a list of artist instances or section headers according to conversion rules.
 * @param t The translation function.
 * @param now The current moment.
 * @param results Results for search if given.
 * @param all General results.
 */
export const useArtistAlphabeticalGroups = (t: TFunction, now: Moment, results: ArtistAlleyDetails[] | null, all: ArtistAlleyDetails[]) => {
    return useMemo(() => {
        const source = results ?? all;
        const day1 = moment().day(1).format("dddd");
        const day2 = moment().day(2).format("dddd");
        const day3 = moment().day(3).format("dddd");

        // Single pass, as name sorting is the default and section changes
        // are consecutive.
        const sectionedLetters: Record<string, boolean> = {};

        const result: (ArtistSectionProps | ArtistAlleyDetailsInstance)[] = [];
        for (const item of source) {
            if (results) {
                // Search is not sectioned.
                result.push(artistInstanceForAny(item, now, day1, day2, day3));
            } else {
                const firstLetter = item.DisplayNameOrAttendeeNickname[0].toUpperCase();
                if (!(firstLetter in sectionedLetters)) {
                    result.push(artistSectionForLetter(firstLetter));
                    sectionedLetters[firstLetter] = true;
                }

                result.push(artistInstanceForAny(item, now, day1, day2, day3));
            }
        }

        return result;
    }, [t, now, results, all]);
};

export const shareArtist = (artist: ArtistAlleyDetails) =>
    Share.share(
        {
            title: artist.DisplayNameOrAttendeeNickname,
            url: `${appBase}/Web/ArtistAlley/${artist.Id}`,
            message: `Check out ${artist.DisplayNameOrAttendeeNickname} on ${conAbbr}!\n${appBase}/Web/ArtistAlley/${artist.Id}`,
        },
        {},
    ).catch(captureException);
