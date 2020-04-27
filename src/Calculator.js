import { removeLeadingChars, isNumber, isOperator } from "./utils";

export class Calculator {
  constructor() {
    this.expression = "";
    this.value = null;
  }

  isCleared() {
    return !this.expression;
  }

  getExpression() {
    return this.expression;
  }

  getValue() {
    return this.value;
  }

  operatorGreaterThan(a, b) {
    const operatorPrecedenceMap = {
      "(": 0,
      ")": 0,
      "+": 1,
      "-": 1,
      "/": 2,
      x: 2,
    };
    return operatorPrecedenceMap[a] > operatorPrecedenceMap[b];
  }

  parseExpression({ translateSpecial } = { translateSpecial: true }) {
    const tokens = [];
    let current = "";

    for (let char of this.expression) {
      if (isNumber(char) || char === ".") {
        current += char;
      } else {
        tokens.push(current);

        if (translateSpecial && char === "%") {
          tokens.push("/", "100");
        } else {
          tokens.push(char);
        }

        current = "";
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

        if (operatorStack[operatorStack.length - 1] === "(") {
          // discard the remaining left paren
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
    let stack = [];
    for (let token of postfixTokens) {
      if (isNumber(token)) {
        stack.push(token);
      }

      if (isOperator(token)) {
        const a = Number.parseFloat(stack.pop());
        const b = Number.parseFloat(stack.pop());

        const operatorToFunctionMap = {
          "+": (a, b) => a + b,
          "-": (a, b) => a - b,
          x: (a, b) => a * b,
          "/": (a, b) => a / b,
        };

        const fpResult = operatorToFunctionMap[token](b, a);
        // Get more accurate results for floating point values,
        // avoids results like 0.1 + 0.2 -> 0.30000000000001
        const fixedResult = Math.round(fpResult * 10e14) / 10e14;
        stack.push(fixedResult);
      }
    }

    return stack[0];
  }

  evaluate() {
    const tokens = this.parseExpression();
    const postfixExpression = this.toPostfix(tokens);

    // handle implied values, postfix expressions need to
    // be evaluated in pairs of three so an expression like
    // '99 -' needs to be converted to '0 99 -' and in the
    // division / multiplcation case '99 x' -> '1 99 x'
    if (isOperator(postfixExpression[1])) {
      if (["+", "-"].includes(postfixExpression[1])) {
        postfixExpression.unshift(0);
      }

      if (["x", "/"].includes(postfixExpression[1])) {
        postfixExpression.unshift(1);
      }
    }

    this.value = this.evaluatePostfix([...postfixExpression]);

    if (!this.value) {
      console.log(
        `Could not evaluate expression: ${this.expression} tokens: [${tokens}] postfix: [${postfixExpression}]`
      );
    }

    this.expression = `${this.value}`;
  }

  add() {
    if (this.canAddOperator()) {
      this.expression += "+";
    }
  }

  subtract() {
    if (this.canAddOperator()) {
      this.expression += "-";
    }
  }

  multiply() {
    if (this.canAddOperator()) {
      this.expression += "x";
    }
  }

  divide() {
    if (this.canAddOperator()) {
      this.expression += "/";
    }
  }

  percent() {
    this.expression += "%";
  }

  negate() {
    if (this.isCleared()) {
      this.expression += "(-";
      return;
    }

    const tokens = this.parseExpression({ translateSpecial: false });
    const lastToken = tokens.pop();

    if (isNumber(lastToken)) {
      tokens.push("(", "-", lastToken);
    } else if (isOperator(lastToken)) {
      tokens.push("(", "-");
    } else if (lastToken === "%") {
      tokens.push("x", "(", "-");
    }

    this.expression = tokens.join("");
  }

  point() {
    if (this.isCleared()) {
      this.expression = "0.";
      return;
    }

    const lastChar = this.lastExpressionChar();
    if (isNumber(lastChar)) {
      this.expression += ".";
    } else if (isOperator(lastChar) || lastChar === "(") {
      this.expression += "0.";
    } else if (lastChar === ")") {
      this.expression += "x0.";
    }
  }

  // Accept string or number
  addNumber(num) {
    if (!isNumber(num)) {
      throw new Error(`addNumber() only accepts number inputs, got: ${num}`);
    }

    const expressionWithoutLeadingZeroes = removeLeadingChars(
      "0",
      this.expression + num
    );
    if (expressionWithoutLeadingZeroes[0] === ".") {
      this.expression = `0${expressionWithoutLeadingZeroes}`;
    } else {
      this.expression = expressionWithoutLeadingZeroes;
    }
  }

  clear() {
    this.value = null;
    this.expression = "";
  }

  lastExpressionChar() {
    return this.expression[this.expression.length - 1];
  }

  canAddOperator() {
    const lastChar = this.lastExpressionChar();
    return (!this.isCleared() && isNumber(lastChar)) || lastChar === ")";
  }

  hasEvenParens() {
    const parenCount = {
      "(": 0,
      ")": 0,
    };
    for (let char of this.expression) {
      if (char === "(" || char === ")") {
        parenCount[char]++;
      }
    }

    return parenCount["("] === parenCount[")"];
  }

  addParenthesis() {
    const lastChar = this.lastExpressionChar();
    if (isNumber(lastChar) || lastChar === ")") {
      if (this.hasEvenParens()) {
        this.expression += "x(";
      } else {
        this.expression += ")";
      }
    } else {
      this.expression += "(";
    }
  }

  remove() {
    if (this.expression) {
      this.expression = this.expression.substr(0, this.expression.length - 1);
    }
  }

  noop() {}
}
