const removeLeadingChars = (charToRemove, string) => {
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
};

const isNumber = (stringOrNumber) => {
  let number;
  if (typeof stringOrNumber === "string") {
    number = Number.parseInt(stringOrNumber);
  } else {
    number = stringOrNumber;
  }
  return !Number.isNaN(number);
};

const isOperator = (string) => {
  return ["+", "-", "x", "/"].includes(string);
};

export class Calculator {
  constructor() {
    this.VALID_CHAR_REGEXP = /[\d\(\)\.+-x\/]/;
    this.expression = "0";
    this.isCleared = true;
    this.value = 0;
  }

  getExpression() {
    if (this.isCleared) {
      return this.expression;
    }

    return removeLeadingChars("0", this.expression);
  }

  getValue() {
    return this.value;
  }

  operatorGreaterThan(a, b) {
    const operatorPrecedenceMap = {
      "+": 1,
      "-": 1,
      "/": 2,
      x: 2,
    };
    return operatorPrecedenceMap[a] > operatorPrecedenceMap[b];
  }

  parseExpression() {
    const tokens = [];
    let current = "";

    for (let char of this.expression) {
      if (!isNumber(char)) {
        tokens.push(current);
        tokens.push(char);
        current = "";
      } else {
        current += char;
      }
    }

    const result = [...tokens, current];

    // Above implementation can wrap with ""
    return result.filter((i) => i !== "");
  }

  toPostfix(tokens) {
    const outputQueue = []; // FIFO, next item is at index 0
    const operatorStack = []; // LIFO, next item is at last index

    for (let token of tokens) {
      if (isNumber(token)) {
        outputQueue.push(token);
      }

      if (isOperator(token)) {
        while (
          this.operatorGreaterThan(
            operatorStack[operatorStack.length - 1],
            token
          ) &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          const lastOperator = operatorStack.pop();
          outputQueue.push(lastOperator);
        }
        operatorStack.push(token);
      }

      if (token === "(") {
        operatorStack.push(token);
      }

      if (token === ")") {
        // mismatch paren if this fails to find a matching left paren
        while (
          operatorStack.length &&
          operatorStack[operatorStack.length - 1] !== "("
        ) {
          const lastOperator = operatorStack.pop();
          outputQueue.push(lastOperator);
        }

        if (operatorStack[operatorStack.length - 1] !== "(") {
          // discar the remaining left paren
          operatorStack.pop();
        }
      }
    }

    while (operatorStack.length) {
      // if top token is paren there is a paren mismatch
      const lastOperator = operatorStack.pop();
      outputQueue.push(lastOperator);
    }

    return outputQueue;
  }

  evaluatePostfix(postfixTokens) {
    const MAX_ITERATION = 1000;
    let i = 0;
    while (postfixTokens.length > 1 && i < MAX_ITERATION) {
      i++;
      const firstNum = Number.parseInt(postfixTokens.shift());
      const secondNum = Number.parseInt(postfixTokens.shift());
      const operator = postfixTokens.shift();

      switch (operator) {
        case "+":
          postfixTokens.unshift(firstNum + secondNum);
          break;
        case "-":
          postfixTokens.unshift(firstNum - secondNum);
          break;
        case "x":
          postfixTokens.unshift(firstNum * secondNum);
          break;
        case "/":
          postfixTokens.unshift(firstNum / secondNum);
          break;
      }
    }

    return postfixTokens[0];
  }

  evaluate() {
    const tokens = this.parseExpression();
    const postfixExpression = this.toPostfix(tokens);
    this.value = this.evaluatePostfix(postfixExpression);
    this.expression = `${this.value}`;
  }

  add() {
    this.expression += "+";
  }

  subtract() {
    this.expression += "-";
  }

  multiply() {
    this.expression += "x";
  }

  divide() {
    this.expression += "/";
  }

  // Accept string or number
  addNumber(num) {
    if (!isNumber(num)) {
      throw new Error(`addNumber() only accepts number inputs, got: ${num}`);
    }

    this.isCleared = false;
    this.expression = removeLeadingChars("0", this.expression + num);
  }

  clear() {
    this.value = 0;
    this.expression = "0";
    this.isCleared = true;
  }

  noop() {}
}
