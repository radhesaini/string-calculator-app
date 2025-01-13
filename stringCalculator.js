/**
 * StringCalculator class for adding numbers from a string.
 *
 * This class provides a single method, `add()`, which takes a string of numbers
 * (potentially separated by various delimiters) and returns their sum.
 *
 * @class StringCalculator
 */
class StringCalculator {
  /**
   * Adds numbers from a given string.
   *
   * Handles various scenarios:
   *   - Empty string: Returns 0.
   *   - Single number: Returns the number.
   *   - Multiple numbers separated by commas or newlines: Returns the sum.
   *   - Custom delimiters: Supports custom delimiters defined at the beginning
   *     of the string in the format "//delimiter\n".
   *   - Negative numbers: Throws an error if any negative numbers are found.
   *   - Numbers greater than 1000: Ignores numbers greater than 1000.
   *
   * @param {string} numString - The string containing numbers to be added.
   * @returns {number} - The sum of the numbers.
   * @throws {Error} - Throws an error if negative numbers are found.
   */
  add(num_string) {
    if (!num_string) {
      return 0;
    } //check given input is string or not
    else if (typeof num_string != "string") {
      throw new Error("Invalid user input!");
    }
    let result = 0;
    try {
      // regex of all possible delimiters
      let delimiters_regex = /[!@#$%^&*()_+={}|\[\]:;<>,.?/~\n` ]/;
      // Split numbers by delimiters
      let numbers = num_string.split(delimiters_regex);
      let negative_result = [];
      numbers.forEach((item) => {
        if (item < 0) {
          negative_result.push(item);
        }
        //item > 0 check "", " " and string
        else if (item > 0 && !negative_result.length && item <= 1000) {
          result += parseInt(item, 0);
        }
      });
      if (negative_result.length) {
        throw new Error(`negative numbers not allowed ${negative_result}`);
      }
    } catch (err) {
      throw err;
    }

    return result;
  }
}

module.exports = StringCalculator; // For Node.js or react.js uses we  have exported
