import React, { useState } from "react";
import axios from "axios";

function App() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const calculateResult = async () => {
    setError("");
    try {
      setResult("");
      const response = await axios.post("http://localhost:8000/calculate", {
        numbers: input,
      });
      setResult(response.data.result);
      setError("");
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
      setResult("");
    }
  };

  const examples = [
    { label: "Empty string", value: "" },
    { label: "Single number", value: "1" },
    { label: "Two numbers", value: "1,5" },
    { label: "Multiple numbers", value: "1,2,3,4,5" },
    { label: "Numbers with newline", value: "1\n2,3" },
    { label: "Custom delimiter", value: "//;\n1;2" },
    { label: "Negative numbers", value: "1,-2,3,-4" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <h1
                  className="text-3xl font-bold text-center mb-8 text-gray-800"
                  data-testid="heading"
                >
                  String Calculator
                </h1>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="input"
                  >
                    Enter string
                  </label>
                  <textarea
                    data-testid="input"
                    id="input"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    rows="3"
                    placeholder="Enter numbers (e.g., 1,2,3 or //;\n1;2)"
                  />
                </div>

                <button
                  data-testid="calculate-btn"
                  onClick={calculateResult}
                  className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Calculate
                </button>

                {result !== "" && (
                  <div className="mt-4 p-4 bg-green-100 rounded">
                    <p className="text-green-700" data-testid="result">
                      Result: {result}
                    </p>
                  </div>
                )}

                {error && (
                  <div className="mt-4 p-4 bg-red-100 rounded">
                    <p className="text-red-700" data-testid="error">
                      Error: {error}
                    </p>
                  </div>
                )}

                <div className="mt-8">
                  <h2 className="text-xl font-bold mb-4">Examples:</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {examples.map((example, index) => (
                      <button
                        data-testid={`example-${index}`}
                        key={index}
                        onClick={() => setInput(example.value)}
                        className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded"
                      >
                        {example.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
