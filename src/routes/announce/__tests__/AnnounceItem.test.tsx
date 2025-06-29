import React from "react";
import { render } from "@testing-library/react-native";
import { AnnounceItem } from "../AnnounceItem";

// Mock the navigation hooks
jest.mock("../../hooks/nav/useAppNavigation", () => ({
    useAppRoute: jest.fn(() => ({
        params: { id: "test-announcement-id" },
    })),
}));

// Mock the store hooks
jest.mock("../../store", () => ({
    useAppSelector: jest.fn(),
}));

// Mock translation
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("AnnounceItem", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render announcement when it exists", () => {
        const mockAnnouncement = {
            Id: "test-announcement-id",
            NormalizedTitle: "Test Announcement",
            Content: "This is a test announcement",
            ValidFromDateTimeUtc: "2022-01-01T00:00:00Z",
            Area: "Test Area",
            Author: "Test Author",
        };

        require("../../store").useAppSelector.mockReturnValue(mockAnnouncement);

        const { getByText } = render(<AnnounceItem />);
        
        expect(getByText("Test Announcement")).toBeTruthy();
        expect(getByText("This is a test announcement")).toBeTruthy();
    });

    it("should render message when announcement does not exist", () => {
        // Mock that the announcement is not found (returns undefined)
        require("../../store").useAppSelector.mockReturnValue(undefined);

        const { getByText, queryByText } = render(<AnnounceItem />);
        
        // Should show the "not available" message instead of rendering nothing
        expect(getByText("This announcement is no longer available.")).toBeTruthy();
        expect(queryByText("Test Announcement")).toBeNull();
    });

    it("should handle expired announcements properly", () => {
        const expiredAnnouncement = {
            Id: "expired-announcement-id",
            NormalizedTitle: "Expired Announcement",
            Content: "This announcement has expired",
            ValidFromDateTimeUtc: "2022-01-01T00:00:00Z",
            ValidUntilDateTimeUtc: "2022-01-02T00:00:00Z",
            Area: "Test Area",
            Author: "Test Author",
        };

        require("../../store").useAppSelector.mockReturnValue(expiredAnnouncement);

        const { getByText } = render(<AnnounceItem />);
        
        // Should still render expired announcements
        expect(getByText("Expired Announcement")).toBeTruthy();
        expect(getByText("This announcement has expired")).toBeTruthy();
    });
});