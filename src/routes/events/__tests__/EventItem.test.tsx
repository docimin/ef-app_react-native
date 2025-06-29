import React from "react";
import { render } from "@testing-library/react-native";
import { EventItem } from "../EventItem";

// Mock the navigation hooks
jest.mock("../../hooks/nav/useAppNavigation", () => ({
    useAppRoute: jest.fn(() => ({
        params: { id: "test-event-id" },
    })),
}));

// Mock the store hooks
jest.mock("../../store", () => ({
    useAppSelector: jest.fn(),
}));

// Mock translation
jest.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, fallback?: string) => fallback || key,
    }),
}));

// Mock other hooks
jest.mock("../../hooks/records/useUpdateSinceNote", () => ({
    useUpdateSinceNote: jest.fn(() => false),
}));

jest.mock("../../hooks/util/useLatchTrue", () => ({
    useLatchTrue: jest.fn(() => false),
}));

// Mock EventContent component
jest.mock("../../components/events/EventContent", () => ({
    EventContent: ({ event }: { event: any }) => <div>EventContent for {event.Title}</div>,
}));

describe("EventItem", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render event when it exists", () => {
        const mockEvent = {
            Id: "test-event-id",
            Title: "Test Event",
            Abstract: "This is a test event",
        };

        require("../../store").useAppSelector.mockReturnValue(mockEvent);

        const { getByText } = render(<EventItem />);
        
        expect(getByText("EventContent for Test Event")).toBeTruthy();
    });

    it("should render message when event does not exist", () => {
        // Mock that the event is not found (returns undefined)
        require("../../store").useAppSelector.mockReturnValue(undefined);

        const { getByText } = render(<EventItem />);
        
        // Should show the "not available" message instead of rendering nothing
        expect(getByText("This event is no longer available.")).toBeTruthy();
    });

    it("should handle removed events properly", () => {
        // Mock that the event was removed from store
        require("../../store").useAppSelector.mockReturnValue(null);

        const { getByText } = render(<EventItem />);
        
        // Should still show the not available message
        expect(getByText("This event is no longer available.")).toBeTruthy();
    });
});