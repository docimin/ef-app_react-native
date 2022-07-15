import {
    DealerRecord,
    EnrichedDealerRecord,
    EnrichedEventRecord,
    EnrichedImageRecord,
    EnrichedMapRecord,
    EventRecord,
    ImageRecord,
    ImageUrl,
    MapRecord,
} from "./eurofurence.types";

const internalCreateImageUrl = (imageId: string | undefined): ImageUrl | undefined => imageId && `https://app.eurofurence.org/EF26/Api/Images/${imageId}/Content`;

export const enrichDealerRecord = (record: DealerRecord): EnrichedDealerRecord => ({
    ...record,
    ArtistImageUrl: internalCreateImageUrl(record.ArtistImageId),
    ArtistThumbnailImageUrl: internalCreateImageUrl(record.ArtistThumbnailImageId),
    ArtPreviewImageUrl: internalCreateImageUrl(record.ArtPreviewImageId),
    FullName: record.DisplayName ?? record.AttendeeNickname,
});

export const enrichMapRecord = (record: MapRecord): EnrichedMapRecord => ({
    ...record,
    ImageUrl: internalCreateImageUrl(record.ImageId),
});

export const enrichImageRecord = (record: ImageRecord): EnrichedImageRecord => ({
    ...record,
    ImageUrl: internalCreateImageUrl(record.Id),
});

export const enrichEventRecord = (record: EventRecord): EnrichedEventRecord => ({
    ...record,
    BannerImageUrl: internalCreateImageUrl(record.BannerImageId),
    PosterImageUrl: internalCreateImageUrl(record.PosterImageId),
});

/**
 * @deprecated Do not export and use this. Enrich a record here instead.
 */
export const createImageUrl = internalCreateImageUrl;
