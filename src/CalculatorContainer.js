import React, { useState } from "react";
import { Calculator } from "./Calculator";

const Styles = {
  ActionButton:
    "bg-white cursor-pointer hover:bg-blue-100 flex justify-center items-center",
};

const calculatorActions = [
  {
    name: "clear",
    symbol: "C",
    description: "clears all inputs",
    func: "clear",
    args: null,
  },
  {
    name: "7",
    symbol: "7",
    description: "adds a seven to the end of input",
    func: "addNumber",
    args: 7,
  },
  {
    name: "4",
    symbol: "4",
    description: "adds a four to the end of input",
    func: "addNumber",
    args: 4,
  },
  {
    name: "1",
    symbol: "1",
    description: "adds a one to the end of input",
    func: "addNumber",
    args: 1,
  },
  {
    name: "negate",
    symbol: "+/-",
    description: "negate the sign of the current input value",
    func: "negate",
    args: null,
  },
  {
    name: "parenthesis",
    symbol: "()",
    description: "add opening and closing parenthesis",
    func: "addParenthesis",
    args: null,
  },
  {
    name: "8",
    symbol: "8",
    description: "adds an eight to the end of input",
    func: "addNumber",
    args: 8,
  },
  {
    name: "5",
    symbol: "5",
    description: "adds a five to the end of input",
    func: "addNumber",
    args: 5,
  },
  {
    name: "2",
    symbol: "2",
    description: "adds a two to the end of input",
    func: "addNumber",
    args: 2,
  },
  {
    name: "0",
    symbol: "0",
    description: "adds a zero to the end of input",
    func: "addNumber",
    args: 0,
  },
  {
    name: "percentage",
    symbol: "%",
    description: "convert the current value to percentage form",
    func: "percent",
    args: null,
  },
  {
    name: "9",
    symbol: "9",
    description: "adds a nine to the end of input",
    func: "addNumber",
    args: 9,
  },
  {
    name: "6",
    symbol: "6",
    description: "adds a six to the end of input",
    func: "addNumber",
    args: 6,
  },
  {
    name: "3",
    symbol: "3",
    description: "adds a three to the end of input",
    func: "addNumber",
    args: 3,
  },
  {
    name: "point",
    symbol: ".",
    description: "add a decimal point to the input",
    func: "noop",
    args: null,
  },
  {
    name: "divide",
    symbol: "/",
    description: "divide the current value",
    func: "divide",
    args: null,
  },
  {
    name: "multiply",
    symbol: "x",
    description: "multiply the current value",
    func: "multiply",
    args: null,
  },
  {
    name: "subtract",
    symbol: "-",
    description: "subtract from the current value",
    func: "subtract",
    args: null,
  },
  {
    name: "add",
    symbol: "+",
    description: "add to the current value",
    func: "add",
    args: null,
  },
  {
    name: "equals",
    symbol: "=",
    description: "calculate the result of the input expression",
    func: "evaluate",
    args: null,
  },
];

const calculator = new Calculator();

export const CalculatorContainer = () => {
  const [input, setInput] = useState("");

  const handleAction = (action) => {
    calculator[action.func](action.args);
    setInput(calculator.expression);
  };

  const handleManualInput = (e) => {
    console.log(e.type, e.target, e.key);
  };

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-800">
      <div className="h-160 w-96 flex flex-col border-2 border-gray-800 bg-white shadow-md">
        <div className="h-48 w-full bg-gray-300 flex justify-center items-center">
          <input
            type="text"
            data-testid="calculator-input"
            autoFocus
            className="w-full bg-gray-300 h-24 text-4xl text-blue-500 outline-none text-right p-4"
            value={input}
            onChange={() => {}}
            onKeyDown={handleManualInput}
          ></input>
        </div>
        <div className="h-16 w-full flex flex-row justify-between bg-gray-300">
          <div className="p-4 cursor-pointer">History</div>
          <div
            className="p-4 cursor-pointer"
            onClick={() => calculator.remove()}
          >
            Remove
          </div>
        </div>
        <div className="w-full flex-grow grid grid-cols-4 grid-rows-5 grid-flow-col border-2 gap-1 bg-gray-300">
          {calculatorActions.map((action) => (
            <div
              key={action.name}
              data-testid={`action-${action.name}`}
              className={Styles.ActionButton}
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
