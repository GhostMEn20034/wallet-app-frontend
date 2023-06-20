function formatNumber(num) {
    // check if num is a number
    if (typeof num === "number") {
      // define an array of suffixes
      const suffixes = ["", "K", "M", "B"];
      // initialize the index of the suffix to 0
      let index = 0;
      // initialize a variable to store the formatted value
      let value = num;
      // loop while the absolute value of value is greater than or equal to 1000
      while (Math.abs(value) >= 1000) {
        // divide the value by 1000 and increment the index
        value = value / 1000; // this does not change the value of num
        index++;
      }
      // round the value to two decimal places
      value = value.toFixed(2);
      // return the formatted number with the suffix and the sign of num
      return value + suffixes[index]; // this uses the original num for sign
    } else {
      // return the original number if not valid
      return num;
    }
  }

  export default formatNumber;