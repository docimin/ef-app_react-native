import moment from "moment-timezone";
import { renderHook } from "@testing-library/react-native";
import { useNotificationRespondedManager } from "../useNotificationRespondedManager";

// Mock the expo-notifications module
jest.mock("expo-notifications", () => ({
    useLastNotificationResponse: jest.fn(),
}));

// Mock the navigation hook
jest.mock("../../nav/useAppNavigation", () => ({
    useAppNavigation: jest.fn(() => ({
        navigate: jest.fn(),
    })),
}));

// Mock the notification interaction utils
jest.mock("../useNotificationInteractionUtils", () => ({
    useNotificationInteractionUtils: jest.fn(() => ({
        assertAnnouncement: jest.fn(),
        assertEvent: jest.fn(),
        assertPrivateMessage: jest.fn(),
    })),
}));

describe("useNotificationRespondedManager", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should handle expired announcement notifications", async () => {
        const mockNavigate = jest.fn();
        const mockAssertAnnouncement = jest.fn();
        
        // Mock an expired announcement
        const expiredAnnouncement = {
            Id: "expired-announcement-id",
            ValidFromDateTimeUtc: moment().subtract(2, "days").toISOString(),
            ValidUntilDateTimeUtc: moment().subtract(1, "day").toISOString(),
            NormalizedTitle: "Expired Announcement",
            Content: "This announcement has expired",
        };

        // Mock that assertAnnouncement returns the expired announcement
        mockAssertAnnouncement.mockResolvedValue(expiredAnnouncement);

        // Mock notification response for expired announcement
        const mockResponse = {
            notification: {
                request: {
                    content: {
                        data: {
                            Event: "Announcement",
                            RelatedId: "expired-announcement-id",
                        },
                    },
                },
            },
        };

        require("expo-notifications").useLastNotificationResponse.mockReturnValue(mockResponse);
        require("../../nav/useAppNavigation").useAppNavigation.mockReturnValue({ navigate: mockNavigate });
        require("../useNotificationInteractionUtils").useNotificationInteractionUtils.mockReturnValue({
            assertAnnouncement: mockAssertAnnouncement,
            assertEvent: jest.fn(),
            assertPrivateMessage: jest.fn(),
        });

        renderHook(() => useNotificationRespondedManager());

        // Wait for async operations
        await new Promise(resolve => setTimeout(resolve, 100));

        // Should still navigate to AnnounceItem even for expired announcements
        expect(mockNavigate).toHaveBeenCalledWith("AnnounceItem", {
            id: "expired-announcement-id",
        });
    });
});