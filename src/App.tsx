import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ScreenStart } from "./app/ScreenStart";
import { PlatformNotificationManager } from "./components/Notifications/NotificationManager";
import { PlatformImageSynchronizer } from "./components/Synchronization/ImageSynchronizer";
import { SynchronizationProvider } from "./components/Synchronization/SynchronizationProvider";

/**
 * Base App. Handles all ui related layout stuff. Context providers go in index.tsx. Actual UI content should be in screens or components
 */
export default function App() {
    return (
        <GestureHandlerRootView style={[StyleSheet.absoluteFill, styles.container]}>
            <BottomSheetModalProvider>
                <SynchronizationProvider>
                    <StatusBar style="auto" />
                    <ScreenStart />

                    <PlatformNotificationManager />
                    <PlatformImageSynchronizer />
                </SynchronizationProvider>
            </BottomSheetModalProvider>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        overflow: "hidden",
    },
});
