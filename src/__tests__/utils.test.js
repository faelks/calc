import { removeLeadingChars, isNumber, isOperator } from "../utils";

describe("removeLeadingChars()", () => {
  it.each`
    inputString   | charToRemove | result
    ${"01"}       | ${"0"}       | ${"1"}
    ${"ccccc1+3"} | ${"c"}       | ${"1+3"}
    ${"aaaa"}     | ${"a"}       | ${""}
  `(
    "$inputString with leading $charToRemove removed is $result",
    ({ inputString, charToRemove, result }) => {
      expect(removeLeadingChars(charToRemove, inputString)).toEqual(result);
    }
  );
});

describe("isNumber()", () => {
  it.each`
    input   | expected
    ${0}    | ${true}
    ${"1"}  | ${true}
    ${"a"}  | ${false}
    ${NaN}  | ${false}
    ${true} | ${false}
  `("isNumber($input) should be $expected", ({ input, expected }) => {
    expect(isNumber(input)).toEqual(expected);
  });
});

describe("isOperator()", () => {
  it.each`
    input  | expected
    ${"+"} | ${true}
    ${"+"} | ${true}
    ${"+"} | ${true}
    ${"+"} | ${true}
    ${"a"} | ${false}
    ${1}   | ${false}
  `("isOperator($input) should be $expected", ({ input, expected }) => {
    expect(isOperator(input)).toEqual(expected);
  });
});
