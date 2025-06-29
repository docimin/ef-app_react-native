import { Platform } from "react-native";

import { renderHook } from "../../testUtils";
import { useEventCalendar } from "./useEventCalendar";

// Mock expo-calendar
jest.mock("expo-calendar", () => ({
    requestCalendarPermissionsAsync: jest.fn(),
    getCalendarsAsync: jest.fn(),
    createEventAsync: jest.fn(),
    EntityTypes: {
        EVENT: "event",
    },
}));

// Mock Sentry
jest.mock("@sentry/react-native", () => ({
    captureException: jest.fn(),
}));

describe("useEventCalendar", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with correct default values", () => {
        const { result } = renderHook(() => useEventCalendar(), {});

        expect(result.current.isExporting).toBe(false);
        expect(result.current.isAlreadyExported).toBe(false);
        expect(typeof result.current.exportEventToCalendar).toBe("function");
        expect(typeof result.current.exportEventWithConfirmation).toBe("function");
        expect(typeof result.current.requestCalendarPermissions).toBe("function");
    });

    it("should not be supported on web platform", () => {
        // Test web platform detection
        const originalOS = Platform.OS;
        (Platform as any).OS = "web";

        const { result } = renderHook(() => useEventCalendar(), {});

        expect(result.current.isSupported).toBe(false);

        // Restore platform
        (Platform as any).OS = originalOS;
    });

    it("should be supported on mobile platforms", () => {
        // Test default platform (usually iOS in tests)
        const { result } = renderHook(() => useEventCalendar(), {});

        expect(result.current.isSupported).toBe(true);
    });
});