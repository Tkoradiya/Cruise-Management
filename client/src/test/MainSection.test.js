import React from "react";
import { render, waitFor } from "@testing-library/react";
import MainSection from "../component/MainSection";
import { responseData } from "./testData";
import { BrowserRouter as Router } from "react-router-dom";

test("MainSection renders correctly after API response", async () => {
  window.alert = jest.fn();

  jest.spyOn(global, "fetch").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve(responseData),
    })
  );

  // Render the component
  const { getByText } = render(
    <Router>
      <MainSection />
    </Router>
  );

  // Wait for the element to appear in the DOM
  await waitFor(() => expect(getByText("Newly Added")).toBeInTheDocument());

  // Ensure the UI elements are rendered
  expect(getByText("Available")).toBeInTheDocument();
  expect(getByText("Upcoming")).toBeInTheDocument();
});
