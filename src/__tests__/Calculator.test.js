import { Calculator } from "../Calculator";

function getRandomInteger(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

let calc;
let someNumber = getRandomInteger(10, 100);

beforeEach(() => {
  calc = new Calculator();
  someNumber = getRandomInteger(10, 100);
});

it("initiates with empty value", () => {
  expect(calc.getExpression()).toEqual("");
});

it("can be cleared", () => {
  calc.addNumber(someNumber);
  expect(calc.getExpression()).toEqual(`${someNumber}`);

  calc.clear();
  expect(calc.getExpression()).toEqual("");
  expect(calc.getValue()).toEqual(null);
});

it("can add numbers", () => {
  calc.addNumber(1);
  expect(calc.getExpression()).toEqual("1");

  calc.addNumber(someNumber);
  expect(calc.getExpression()).toEqual(`1${someNumber}`);
});

it.each`
  method        | a                  | b             | result
  ${"add"}      | ${someNumber}      | ${someNumber} | ${someNumber + someNumber}
  ${"subtract"} | ${someNumber + 10} | ${10}         | ${someNumber}
  ${"multiply"} | ${someNumber}      | ${5}          | ${someNumber * 5}
  ${"divide"}   | ${someNumber}      | ${3}          | ${someNumber / 3}
`(`can perform $method`, ({ method, a, b, result }) => {
  calc.addNumber(a);
  calc[method]();
  calc.addNumber(b);
  calc.evaluate();
  expect(calc.getValue()).toEqual(result);
});

it("can use parens", () => {
  calc.addParenthesis();
  calc.addNumber(someNumber);
  calc.add();
  calc.addNumber(1);
  calc.addParenthesis();
  calc.addParenthesis();
  calc.addNumber(5);
  calc.addParenthesis();

  expect(calc.getExpression()).toEqual(`(${someNumber}+1)x(5)`);
  calc.evaluate();
  expect(calc.getValue()).toEqual((someNumber + 1) * 5);
});

it("can apply the special percentage action", () => {
  calc.addNumber(someNumber);
  calc.percent();

  expect(calc.getExpression()).toEqual(`${someNumber}%`);

  calc.evaluate();
  expect(calc.getValue()).toEqual(someNumber / 100);
});

it("can apply the negate operation", () => {
  calc.addNumber(someNumber);
  calc.negate();
  calc.addParenthesis();

  expect(calc.getExpression()).toEqual(`(-${someNumber})`);

  calc.evaluate();
  expect(calc.getValue()).toEqual(-someNumber);
});
