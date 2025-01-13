import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import axios from "axios";
import App from "./App";
import StringCalculator from "./stringCalculator";
jest.mock("axios");
jest.mock("./stringCalculator", () => {
  return jest.fn().mockImplementation(() => {
    return {
      add: jest.fn(),
    };
  });
});
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
    StringCalculator.mockReturnValueOnce({ add: jest.fn().mockReturnValue(6) });

    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "1,2,3" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 6");
    });
  });

  test("handles calculation error", async () => {
    StringCalculator.mockReturnValueOnce({
      add: jest.fn().mockImplementation(() => {
        throw new Error("negative numbers not allowed - -1");
      }),
    });

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
    StringCalculator.mockReturnValueOnce({
      add: jest.fn().mockImplementation(() => {
        throw new Error("negative numbers not allowed - -1");
      }),
    });
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
  test("Ignore numbers greater than 1000", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: 3 } });
    StringCalculator.mockReturnValueOnce({ add: jest.fn().mockReturnValue(3) });
    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "1,2,1001" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 3");
    });
  });

  test("check for sum greater than 1000", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: 1001 } });
    StringCalculator.mockReturnValueOnce({
      add: jest.fn().mockReturnValue(1001),
    });
    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "1000,1" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 1001");
    });
  });
  test("check for Consecutive delimiters", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: 3 } });
    StringCalculator.mockReturnValueOnce({ add: jest.fn().mockReturnValue(3) });
    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "1,,2" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 3");
    });
  });

  test("check for Trailing delimiters", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: 1 } });
    StringCalculator.mockReturnValueOnce({ add: jest.fn().mockReturnValue(1) });
    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "1,." } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 1");
    });
  });
  test("check for Leading delimiters", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: 18 } });
    StringCalculator.mockReturnValueOnce({
      add: jest.fn().mockReturnValue(18),
    });
    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: ",.18" } });

    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 18");
    });
  });
  test("check for Leading and Trailing delimiters", async () => {
    axios.post.mockResolvedValueOnce({ data: { result: 10 } });
    StringCalculator.mockReturnValueOnce({
      add: jest.fn().mockReturnValue(10),
    });
    render(<App />);
    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: ",./10\n" } });
    const button = screen.getByTestId("calculate-btn");
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("result")).toHaveTextContent("Result: 10");
    });
  });
});
