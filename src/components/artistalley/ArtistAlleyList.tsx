import { FlashList } from "@shopify/flash-list";
import { FC, ReactElement, useCallback } from "react";
import { StyleSheet } from "react-native";

import { useThemeName } from "../../hooks/themes/useThemeHooks";
import { useSynchronizer } from "../sync/SynchronizationProvider";
import { ArtistAlleyDetails } from "../../store/eurofurence/types";
import { ArtistAlleyCard, ArtistAlleyDetailsInstance } from "./ArtistAlleyCard";

export type ArtistAlleyListProps = {
    navigation: any;
    leader?: ReactElement;
    artists: ArtistAlleyDetailsInstance[];
    empty?: ReactElement;
    trailer?: ReactElement;
    padEnd?: boolean;
};

export const ArtistAlleyList: FC<ArtistAlleyListProps> = ({ navigation, leader, artists, empty, trailer, padEnd = true }) => {
    const theme = useThemeName();
    const synchronizer = useSynchronizer();
    const onPress = useCallback(
        (artist: ArtistAlleyDetails) => {
            navigation.navigate("Artist", { id: artist.Id });
        },
        [navigation],
    );
    return (
        <FlashList
            refreshing={synchronizer.isSynchronizing}
            onRefresh={synchronizer.synchronizeUi}
            contentContainerStyle={padEnd ? styles.container : undefined}
            scrollEnabled={true}
            ListHeaderComponent={leader}
            ListFooterComponent={trailer}
            ListEmptyComponent={empty}
            data={artists}
            keyExtractor={(item) => item.details.Id}
            renderItem={({ item }) => {
                return <ArtistAlleyCard containerStyle={styles.item} key={item.details.Id} artist={item} onPress={onPress} />;
            }}
            estimatedItemSize={110}
            extraData={theme}
        />
    );
};

const styles = StyleSheet.create({
    item: {
        paddingHorizontal: 20,
    },
    container: {
        paddingBottom: 100,
    },
});
