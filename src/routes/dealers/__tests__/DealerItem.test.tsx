import React from "react";
import { render } from "@testing-library/react-native";
import { DealerItem } from "../DealerItem";

// Mock the navigation hooks
jest.mock("../../hooks/nav/useAppNavigation", () => ({
    useAppRoute: jest.fn(() => ({
        params: { id: "test-dealer-id" },
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

// Mock DealerContent component
jest.mock("../../components/dealers/DealerContent", () => ({
    DealerContent: ({ dealer }: { dealer: any }) => <div>DealerContent for {dealer.DisplayNameOrAttendeeNickname}</div>,
}));

describe("DealerItem", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render dealer when it exists", () => {
        const mockDealer = {
            Id: "test-dealer-id",
            DisplayNameOrAttendeeNickname: "Test Dealer",
            ShortDescription: "This is a test dealer",
        };

        require("../../store").useAppSelector.mockReturnValue(mockDealer);

        const { getByText } = render(<DealerItem />);
        
        expect(getByText("DealerContent for Test Dealer")).toBeTruthy();
    });

    it("should render message when dealer does not exist", () => {
        // Mock that the dealer is not found (returns undefined)
        require("../../store").useAppSelector.mockReturnValue(undefined);

        const { getByText } = render(<DealerItem />);
        
        // Should show the "not available" message instead of rendering nothing
        expect(getByText("This dealer is no longer available.")).toBeTruthy();
    });
});