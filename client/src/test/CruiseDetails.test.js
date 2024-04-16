import React from "react";
import { render, waitFor } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthTokenProvider } from "../AuthTokenContext";
import CruiseDetails from "../component/CruiseDetails";

// Mock Auth0Provider for testing
const MockAuth0Provider = ({ children }) => (
  <Auth0Provider
    domain="your-auth0-domain"
    clientId="your-auth0-client-id"
    redirectUri="http://localhost"
  >
    {children}
  </Auth0Provider>
);

// Mock AuthTokenProvider for testing
const MockAuthTokenProvider = ({ children }) => (
  <AuthTokenProvider>{children}</AuthTokenProvider>
);

test("renders cruise details correctly", async () => {
  // Mock data
  const mockCruiseDetails = {
    name: "Test Cruise",
    description: "This is a test cruise",
    start_date: "2024-05-15T00:00:00.000Z",
    end_date: "2024-05-20T00:00:00.000Z",
    status: "Available", // Assuming this is the status
  };

  // Mock fetch function
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve({ data: mockCruiseDetails }),
    })
  );

  // Render the component with mock providers and router
  const { getByText } = render(
    <MockAuthTokenProvider>
      <MemoryRouter initialEntries={["/cruise/1"]}>
        <Routes>
          <Route path="/cruise/:id" element={<CruiseDetails />} />
        </Routes>
      </MemoryRouter>
    </MockAuthTokenProvider>
  );

  // Wait for cruise details to load
  await waitFor(() => {
    expect(getByText("Test Cruise")).toBeInTheDocument();
    expect(getByText("This is a test cruise")).toBeInTheDocument();
    expect(getByText("2024-05-15")).toBeInTheDocument();
    expect(getByText("2024-05-20")).toBeInTheDocument();
  });
});
