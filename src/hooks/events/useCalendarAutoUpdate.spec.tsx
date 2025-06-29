import { Platform } from "react-native";

import { renderHook } from "../../testUtils";
import { useCalendarAutoUpdate } from "./useCalendarAutoUpdate";

// Mock expo-calendar
jest.mock("expo-calendar", () => ({
    getCalendarPermissionsAsync: jest.fn(),
    updateEventAsync: jest.fn(),
}));

// Mock Sentry
jest.mock("@sentry/react-native", () => ({
    captureException: jest.fn(),
}));

describe("useCalendarAutoUpdate", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with correct default values", () => {
        const { result } = renderHook(() => useCalendarAutoUpdate(), {});

        expect(result.current.pendingUpdates).toBe(0);
        expect(result.current.autoUpdateEnabled).toBe(false);
        expect(typeof result.current.updateCalendarEvent).toBe("function");
        expect(typeof result.current.processUpdatedFavorites).toBe("function");
    });

    it("should not be enabled on web platform", () => {
        // Test web platform detection
        const originalOS = Platform.OS;
        (Platform as any).OS = "web";

        const { result } = renderHook(() => useCalendarAutoUpdate(), {});

        expect(result.current.autoUpdateEnabled).toBe(false);

        // Restore platform
        (Platform as any).OS = originalOS;
    });
});