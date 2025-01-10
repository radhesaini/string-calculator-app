class StringCalculator {
  add(num_string) {
    if (!num_string) {
      return 0;
    }
    let delimiters_regex = /[!@#$%^&*()_+={}|\[\]:;<>,.?/~\n` ]/;
    let numbers = num_string.split(delimiters_regex);
    let result = 0;
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
    return result;
  }
}

const obj = new StringCalculator();
try {
  console.log(obj.add("//;\n1;2"));
} catch (err) {
  console.log(err);
}

module.exports = StringCalculator;
