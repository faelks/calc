export function removeLeadingChars(charToRemove, string) {
  let result = "";
  let seenNotMatching = false;

  for (let char of string) {
    if (seenNotMatching) {
      result += char;
    } else {
      if (char !== charToRemove) {
        seenNotMatching = true;
        result += char;
      }
    }
  }

  return result;
}

export function isNumber(stringOrNumber) {
  if (typeof stringOrNumber === "string") {
    stringOrNumber = Number.parseInt(stringOrNumber);
  }

  return typeof stringOrNumber === "number" && !Number.isNaN(stringOrNumber);
}

export function isOperator(string) {
  return ["+", "-", "x", "/"].includes(string);
}
