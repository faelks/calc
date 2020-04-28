import { removeLeadingChars, isNumber, isOperator } from "./utils";

// A basic calculator, has a fixed amount of actions that can be performed
// which map to action buttons like [+, -, /, x, %, =, [0-9], C]. Every time
// an action is performed the expression is updated.

// expression: the string input which can be evaluated to get a value
// tokens: the output of parsing the expression string
// value: the current value of the expression if interpreted

// When displaying the  either use 'getExpression()' or
// 'getTokens()'

// Public API
// isCleared()
// getExpression()
// getValue()
// getTokens()

export const OPERATOR = {
  plus: "+",
  minus: "-",
  multiply: "x",
  divide: "/",
  percent: "%",
  point: ".",
  leftParen: "(",
  rightParen: ")",
};

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

  getTokens() {
    return this.parseExpression();
  }

  getLastToken() {
    const tokens = this.getTokens();
    return tokens[tokens.length - 1];
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

  parseExpression(
    { translateSpecial, overrideExpression } = {
      translateSpecial: true,
      overrideExpression: null,
    }
  ) {
    const expression = overrideExpression || this.expression;
    const tokens = [];
    let current = "";

    for (let char of expression) {
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

    const expressionValue = this.evaluatePostfix([...postfixExpression]);

    if (!expressionValue) {
      console.error(
        `Could not evaluate expression: ${this.expression} tokens: [${tokens}] postfix: [${postfixExpression}]`
      );
      this.value = null;
    } else {
      this.value = expressionValue;
    }
  }

  // Evaluates the current expression and replaces the current
  // expression with the output of the evaluation.
  equals() {
    this.evaluate();
    this.expression = `${this.value}`;
    this.value = null;
  }

  // Add one of the basic operators [+, -, x, /, %]
  addOperator(operatorId) {
    const operator = OPERATOR[operatorId];

    if (!operator) {
      throw new Error(`Can't add unknown operator ${operatorId}`);
    }

    if (
      this.canAddOperator() &&
      [
        OPERATOR.plus,
        OPERATOR.minus,
        OPERATOR.multiply,
        OPERATOR.divide,
        OPERATOR.percent,
      ].includes(operator)
    ) {
      this.expression += operator;
    }
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

    const lastChar = this.getLastToken();
    if (isNumber(lastChar)) {
      this.expression += ".";
    } else if (isOperator(lastChar) || lastChar === "(") {
      this.expression += "0.";
    } else if (lastChar === ")") {
      this.expression += "x0.";
    }
  }

  addNumber(num) {
    if (!isNumber(num)) {
      throw new Error(`addNumber() only accepts number inputs, got: ${num}`);
    }

    const tokens = this.parseExpression({
      overrideExpression: this.expression + num,
    });
    const tokensWithParsedNumbers = tokens.map((t) =>
      isNumber(t) ? Number.parseFloat(t) : t
    );
    this.expression = tokensWithParsedNumbers.join("");
  }

  clear() {
    this.value = null;
    this.expression = "";
  }

  canAddOperator() {
    const lastToken = this.getLastToken();
    return (!this.isCleared() && isNumber(lastToken)) || lastToken === ")";
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
    const lastToken = this.getLastToken();
    if (isNumber(lastToken) || lastToken === ")") {
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
