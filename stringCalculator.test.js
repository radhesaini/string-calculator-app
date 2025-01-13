const StringCalculator = require("./stringCalculator");

describe("StringCalculator", () => {
  const calculator = new StringCalculator();

  test("empty string returns 0", () => {
    expect(calculator.add("")).toBe(0);
  });

  test("single number returns the number", () => {
    expect(calculator.add("1")).toBe(1);
  });

  test("two numbers returns their sum", () => {
    expect(calculator.add("1,5")).toBe(6);
  });

  test("handles multiple numbers", () => {
    expect(calculator.add("1,2,3,4,5")).toBe(15);
  });

  test("handles new lines between numbers", () => {
    expect(calculator.add("1\n2,3")).toBe(6);
  });

  test("supports custom delimiter", () => {
    expect(calculator.add("//;\n1;2")).toBe(3);
  });

  test("throws on negative numbers", () => {
    expect(() => calculator.add("1,-2,3,-4")).toThrow(
      "negative numbers not allowed -2,-4"
    );
  });
  test("check given input is string or not", () => {
    expect(() => calculator.add(["1,3"])).toThrow("Invalid user input!");
  });

  test("Ignore numbers greater than 1000", () => {
    expect(calculator.add("1,2,1001")).toBe(3);
  });

  test("check for sum greater than 1000", () => {
    expect(calculator.add("1000,1")).toBe(1001);
  });
  test("check for Consecutive delimiters", () => {
    expect(calculator.add("1,,2")).toBe(3);
  });
  test("check for Trailing delimiters", () => {
    expect(calculator.add("1,./")).toBe(1);
  });
  test("check for Leading delimiters", () => {
    expect(calculator.add(",./1")).toBe(1);
  });
  test("check for Leading and Trailing delimiters", () => {
    expect(calculator.add("//\\,./1\n\\")).toBe(1);
  });
});
