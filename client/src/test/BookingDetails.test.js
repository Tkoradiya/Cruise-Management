import React from "react";
import { render, waitFor, fireEvent } from "@testing-library/react";
import BookingDetails from "../pages/BookingDetails";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";
import { formatDate } from "../utils/constant";

// Mock useAuth0 hook
jest.mock("@auth0/auth0-react", () => ({
  useAuth0: jest.fn(),
}));

// Mock useAuthToken hook
jest.mock("../AuthTokenContext", () => ({
  useAuthToken: jest.fn(),
}));

describe("BookingDetails component", () => {
  beforeEach(() => {
    // Mock isAuthenticated to be true
    useAuth0.mockReturnValue({
      isAuthenticated: true,
    });

    // Mock accessToken
    useAuthToken.mockReturnValue({
      accessToken: "mock-access-token",
    });

    // Mock fetch function
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            data: [
              {
                id: 1,
                cruise: {
                  name: "Mock Cruise",
                  start_date: "2024-05-15T00:00:00.000Z",
                  end_date: "2024-05-20T00:00:00.000Z",
                },
              },
            ],
          }),
      })
    );
  });

  it("should render booking details", async () => {
    const { getByText } = render(<BookingDetails />);

    // Wait for loading to disappear
    await waitFor(() => expect(getByText("Mock Cruise")).toBeInTheDocument());
    expect(getByText(formatDate("2024-05-15T00:00:00.000Z"))).toBeInTheDocument()
  });
});
