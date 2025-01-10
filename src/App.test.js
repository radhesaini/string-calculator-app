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
import logo from "./logo.svg";
import "./App.css";
import { useState } from "react";

function App() {
  //create state for store user input
  let [userQuery, setQuery] = useState("");
  //create state for store result
  let [result, setResult] = useState([]);

  const add = () => {
    setResult([]);
    //change multiple symbols to single
    userQuery = userQuery.replaceAll(/[/\\n",/]/g, ";");

    //covert string to array
    let digitsArray = userQuery.split(";");

    // define local variable for store current sum
    let current_sum = 0;
    // define local variable for store invalid digits result
    let errorBucket = [];
    for (let item of digitsArray) {
      if (item < 0) {
        //push invalid digits result
        errorBucket.push(`negative numbers not allowed ${item}`);
        continue;
      } else if (item === ";" || !item) {
        continue;
      }
      // update sum
      current_sum += parseInt(item);
    }
    if (errorBucket.length) {
      setResult(errorBucket);
    } else {
      setResult([current_sum]);
    }

    //clear user input
    setQuery("");
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="heading">String Calculator</h1>
      </header>
      <div className="calculator-container">
        <div className="query-container">
          <label htmlFor="user-Input">Ask me: </label>
          <input
            id="user-Input"
            className="input-text"
            type="text"
            name="user_input"
            value={userQuery}
            data-testid="user-input"
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button
          className="calculator-btn"
          data-testid="calculator-btn"
          onClick={add}
        >
          Calculate
        </button>
        <div className="result-container" data-testid="result-container">
          {result.map((item, index) => (
            <div
              className="result"
              key={index}
              style={{ color: result.length < 2 ? "green" : "red" }}
            >
              Result = {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
