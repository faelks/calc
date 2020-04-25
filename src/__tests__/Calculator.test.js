import { Calculator } from "../Calculator";

let calc;

beforeEach(() => {
  calc = new Calculator();
});

it("initiates with a 0 value", () => {
  expect(calc.getExpression()).toEqual("0");
});

it("can add a number", () => {
  calc.addNumber(1);
  expect(calc.getExpression()).toEqual("1");
});

it("can calculate an expression", () => {
  const randomInteger = Math.round(Math.random() * 10);
  calc.addNumber(randomInteger);
  calc.add();
  calc.addNumber(randomInteger);
  calc.evaluate();
  expect(calc.getValue()).toEqual(randomInteger + randomInteger);
});
