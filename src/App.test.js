import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "./App";

jest.mock("axios");

describe("App", () => {
  test("renders calculator form", () => {
    render(<App />);
    expect(screen.getByTestId("heading")).toBeDefined();
    expect(screen.getByPlaceholderText(/Enter numbers/)).toBeDefined();
  });

  test("renders calculate btn", () => {
    render(<App />);
    const resultBtn = screen.getByTestId("calculate-btn");
    expect(resultBtn).toBeTruthy();
  });

  test("check input render or not", () => {
    render(<App />);
    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
  });

  test("handles successful calculation", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: 6 } });

    render(<App />);
    const input = screen.getByPlaceholderText(/Enter numbers/);
    fireEvent.change(input, { target: { value: "1,2,3" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 6");
    });
  });

  test("handles calculation error", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "negative numbers not allowed - -1" } },
    });

    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "-1,2,3" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Error: negative numbers not allowed - -1")
      ).toBeDefined();
    });
  });
  test("handles calculation error 2", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { detail: "negative numbers not allowed - -1" } },
    });

    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "//;\n-1;2,-9" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);
    await waitFor(() => {
      expect(
        screen.getByText("Error: negative numbers not allowed - -1")
      ).toBeDefined();
    });
  });
});
