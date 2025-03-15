import { ListRenderItemInfo } from "@react-native/virtualized-lists/Lists/VirtualizedList";
import _ from "lodash";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet } from "react-native";
import { SectionListData } from "react-native/Libraries/Lists/SectionList";

import { Label } from "../../components/generic/atoms/Label";
import { Header } from "../../components/generic/containers/Header";
import { PrivateMessageCard } from "../../components/pm/PrivateMessageCard";
import { NoData } from "../../components/util/NoData";
import { useAppNavigation } from "../../hooks/nav/useAppNavigation";
import { useThemeBackground } from "../../hooks/themes/useThemeHooks";
import { useGetCommunicationsQuery } from "../../store/eurofurence/service";
import { CommunicationRecord } from "../../store/eurofurence/types";
import { Query } from "../../types";

export const PmList = () => {
    const { t } = useTranslation("PrivateMessageList");
    const navigation = useAppNavigation("PrivateMessageList");
    const { data, refetch, isFetching }: Query<CommunicationRecord[]> = useGetCommunicationsQuery(undefined, {
        refetchOnFocus: true,
    });

    const navigateTo = useCallback(
        (item: CommunicationRecord) =>
            navigation.navigate("PrivateMessageItem", {
                id: item.Id,
                message: item,
            }),
        [navigation],
    );
    const onPress = useCallback((item: CommunicationRecord) => navigateTo(item), [navigateTo]);

    const sectionedData = useMemo(() => {
        const [unread, read] = _.partition(data, (it) => it.ReadDateTimeUtc === null);

        const readSections = _.chain(read)
            .orderBy(["AuthorName", "SentDateTimeUtc"], ["asc", "desc"])
            .groupBy((it) => (it.AuthorName ? t("from", { author: it.AuthorName?.trim() }) : t("from_unknown")))
            .map((messages, author) => ({
                title: author,
                data: messages,
            }))
            .value();

        const unreadSections = _.isEmpty(unread)
            ? []
            : [
                  {
                      title: t("unread"),
                      data: unread,
                  },
              ];

        return [...unreadSections, ...readSections];
    }, [data, t]);

    const sectionStyle = useThemeBackground("background");

    const keyExtractor = useCallback(({ Id }: CommunicationRecord, index: number) => Id + index, []);
    const emptyComponent = useMemo(() => <NoData text={t("no_data")} />, [t]);
    const headerComponent = useMemo(() => <Header>Private Messages</Header>, []);
    const renderSection = useCallback(
        ({ section }: SectionListData<any, any>) => {
            return (
                <Label type="h2" style={[styles.section, sectionStyle]}>
                    {_.startCase(section.title)}
                </Label>
            );
        },
        [sectionStyle],
    );
    const renderItem = useCallback(
        ({ item }: ListRenderItemInfo<CommunicationRecord>) => {
            return <PrivateMessageCard key={item.Id} containerStyle={styles.item} onPress={onPress} item={item} />;
        },
        [onPress],
    );
    return (
        <SectionList
            style={StyleSheet.absoluteFill}
            sections={sectionedData}
            contentContainerStyle={styles.container}
            keyExtractor={keyExtractor}
            stickySectionHeadersEnabled
            onRefresh={refetch}
            refreshing={isFetching}
            ListEmptyComponent={emptyComponent}
            ListHeaderComponent={headerComponent}
            renderSectionHeader={renderSection}
            renderItem={renderItem}
        />
    );
};

const styles = StyleSheet.create({
    section: { padding: 20 },
    action: {
        flex: 3,
    },
    item: {
        paddingHorizontal: 20,
    },
    container: {
        paddingBottom: 100,
    },
});
