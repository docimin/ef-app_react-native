import { TFunction } from "i18next";
import { FC } from "react";

import { IconNames } from "../generic/atoms/Icon";
import { Section, SectionProps } from "../generic/atoms/Section";

export type ArtistSectionProps = SectionProps;

/**
 * Static category icon mapping.
 */
const categoryIcons: Record<string, IconNames> = {
    Prints: "printer",
    Artwork: "image-frame",
    Commissions: "brush",
    Fursuits: "scissors-cutting",
    Miscellaneous: "shape",
    Unknown: "folder-image",
};

/**
 * Creates the properties for an artist section.
 * @param category The category.
 */
export function artistSectionForCategory(category: string): ArtistSectionProps {
    return {
        title: category,
        icon: categoryIcons[category] ?? categoryIcons.Unknown,
    };
}

/**
 * Creates the properties for an artist section.
 * @param t Translation function.
 * @param isAfterDark True if after dark.
 */
export function artistSectionForLocation(t: TFunction, isAfterDark: boolean): ArtistSectionProps {
    return {
        title: isAfterDark ? t("artists_in_ad") : t("artists_in_regular"),
        icon: isAfterDark ? "weather-night" : "weather-sunny",
    };
}

/**
 * Creates the properties for an artist section.
 * @param title The title.
 */
export function artistSectionForLetter(title: string): ArtistSectionProps {
    return {
        title,
        icon: "bookmark" as IconNames,
    };
}

export const ArtistSection: FC<ArtistSectionProps> = ({ style, title, subtitle, icon }) => {
    return <Section style={style} title={title} subtitle={subtitle} backgroundColor="surface" icon={icon} />;
};
