import React, { useState } from "react";
import { Calculator } from "./Calculator";
import { ReactComponent as RemoveIcon } from "./assets/remove-icon-30x30.svg";
import { ReactComponent as RulerIcon } from "./assets/ruler-icon-30x30.svg";
import { ReactComponent as MathSignsIcon } from "./assets/math-signs-30x30.svg";

const Styles = {
  ActionButton:
    "bg-100-gray cursor-pointer hover:bg-blue-100 flex justify-center items-center border-t border-l border-400-gray text-2xl font-light tracking-widest",
};

const calculatorActions = [
  {
    name: "clear",
    symbol: "C",
    description: "clears all inputs",
    classNames: "text-red-400",
    func: "clear",
    args: null,
  },
  {
    name: "7",
    symbol: "7",
    description: "adds a seven to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 7,
  },
  {
    name: "4",
    symbol: "4",
    description: "adds a four to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 4,
  },
  {
    name: "1",
    symbol: "1",
    description: "adds a one to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 1,
  },
  {
    name: "negate",
    symbol: "+/-",
    description: "negate the sign of the current input value",
    classNames: "text-gray-700 bg-white border-b",
    func: "negate",
    args: null,
  },
  {
    name: "parenthesis",
    symbol: "()",
    description: "add opening and closing parenthesis",
    classNames: "text-blue-500",
    func: "addParenthesis",
    args: null,
  },
  {
    name: "8",
    symbol: "8",
    description: "adds an eight to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 8,
  },
  {
    name: "5",
    symbol: "5",
    description: "adds a five to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 5,
  },
  {
    name: "2",
    symbol: "2",
    description: "adds a two to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 2,
  },
  {
    name: "0",
    symbol: "0",
    description: "adds a zero to the end of input",
    classNames: "text-gray-700 border-b bg-white",
    func: "addNumber",
    args: 0,
  },
  {
    name: "percentage",
    symbol: "%",
    description: "convert the current value to percentage form",
    classNames: "text-blue-500",
    func: "addOperator",
    args: "percent",
  },
  {
    name: "9",
    symbol: "9",
    description: "adds a nine to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 9,
  },
  {
    name: "6",
    symbol: "6",
    description: "adds a six to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 6,
  },
  {
    name: "3",
    symbol: "3",
    description: "adds a three to the end of input",
    classNames: "text-gray-700",
    func: "addNumber",
    args: 3,
  },
  {
    name: "point",
    symbol: ".",
    description: "add a decimal point to the input",
    classNames: "text-gray-700 border-b bg-white",
    func: "point",
    args: null,
  },
  {
    name: "divide",
    symbol: "/",
    description: "divide the current value",
    classNames: "text-blue-500",
    func: "addOperator",
    args: "divide",
  },
  {
    name: "multiply",
    symbol: "x",
    description: "multiply the current value",
    classNames: "text-blue-500",
    func: "addOperator",
    args: "multiply",
  },
  {
    name: "subtract",
    symbol: "-",
    description: "subtract from the current value",
    classNames: "text-blue-500",
    func: "addOperator",
    args: "minus",
  },
  {
    name: "add",
    symbol: "+",
    description: "add to the current value",
    classNames: "text-blue-500",
    func: "addOperator",
    args: "plus",
  },
  {
    name: "equals",
    symbol: "=",
    description: "calculate the result of the input expression",
    classNames: "text-white bg-blue-500 border-b",
    func: "equals",
    args: null,
  },
];

const calculator = new Calculator();

export const CalculatorContainer = () => {
  const [input, setInput] = useState("");
  const [previewValue, setPreviewValue] = useState("");
  const [isEvaluated, setIsEvaluated] = useState(false);

  const handleAction = (action) => {
    calculator[action.func](action.args);

    if (action.name !== "equals") {
      calculator.evaluate();
      setIsEvaluated(false);
    } else {
      setIsEvaluated(true);
    }

    setInput(calculator.getExpression());
    setPreviewValue(calculator.getValue());

    console.log(calculator.parseExpression());
  };

  const handleManualInput = (e) => {
    console.log(e.type, e.target, e.key);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-800">
      <div className="h-160 w-96 flex flex-col border-2 border-gray-800 bg-white shadow-md">
        <div className="h-56 w-full bg-gray-200 flex flex-col justify-center items-center">
          <input
            type="text"
            data-testid="calculator-input"
            autoFocus
            className={`w-full flex-grow bg-transparent h-24 text-4xl text-${
              isEvaluated ? "blue-500" : "black"
            } outline-none text-right px-8`}
            value={input}
            onChange={() => {}}
            onKeyDown={handleManualInput}
          />
          <p
            className="w-full h-16 text-right px-8 text-2xl text-gray-500 font-thin"
            data-testid="calculator-preview-value"
          >
            {previewValue}
          </p>
        </div>
        <div className="h-16 w-full flex flex-row justify-between bg-gray-200 px-8 text-gray-600">
          <div className="flex flex-row items-center space-x-6">
            <div className="cursor-pointer uppercase">History</div>
            <RulerIcon
              className="cursor-pointer h-6 w-6 text-gray-600"
              onClick={() => console.log("Ruler clicked")}
            />
            <MathSignsIcon
              className="cursor-pointer h-6 w-6 text-gray-600"
              onClick={() => console.log("Signs clicked")}
            />
          </div>
          <div className="flex items-center">
            <RemoveIcon
              className="cursor-pointer h-8 w-8 text-blue-500"
              data-testid="action-remove"
              onClick={() => handleAction({ func: "remove" })}
            />
          </div>
        </div>
        <div className="w-full flex-grow grid grid-cols-4 grid-rows-5 grid-flow-col -mb-1">
          {calculatorActions.map((action) => (
            <div
              key={action.name}
              data-testid={`action-${action.name}`}
              className={`${Styles.ActionButton} ${action.classNames}`}
              title={action.description}
              onClick={() => handleAction(action)}
            >
              <p>{action.symbol}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
