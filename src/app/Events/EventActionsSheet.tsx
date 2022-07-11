import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { FC, useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

import { EventRecord } from "../../store/eurofurence.types";
import { ContentEvent } from "./ContentEvent";

type EventActionsSheetProps = {
    eventRecord: EventRecord | undefined;
    onClose?: () => void;
};

export const EventActionsSheet: FC<EventActionsSheetProps> = ({ eventRecord, onClose }) => {
    const sheetRef = useRef<BottomSheet>(null);

    useEffect(() => {
        if (eventRecord) {
            sheetRef.current?.snapToIndex(0);
        } else {
            sheetRef.current?.close();
        }
    }, [eventRecord]);

    if (eventRecord === undefined) {
        return null;
    }

    return (
        <BottomSheet snapPoints={["25%", "50%", "75%"]} index={-1} enablePanDownToClose ref={sheetRef} onClose={onClose}>
            <BottomSheetScrollView style={styles.container}>{eventRecord && <ContentEvent event={eventRecord} />}</BottomSheetScrollView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 30,
        paddingBottom: 100,
    },
});