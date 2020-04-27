import { removeLeadingChars, isNumber, isOperator } from "./utils";

export class Calculator {
  constructor() {
    this.VALID_CHAR_REGEXP = /[\d\(\)\.+-x\/]/;
    this.expression = "";
    this.isCleared = true;
    this.value = null;
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
      if (!isNumber(char)) {
        tokens.push(current);

        if (translateSpecial && char === "%") {
          tokens.push("/", "100");
        } else {
          tokens.push(char);
        }

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
        const a = Number.parseInt(stack.pop());
        const b = Number.parseInt(stack.pop());

        const operatorToFunctionMap = {
          "+": (a, b) => a + b,
          "-": (a, b) => a - b,
          x: (a, b) => a * b,
          "/": (a, b) => a / b,
        };

        stack.push(operatorToFunctionMap[token](b, a));
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

  percent() {
    this.expression += "%";
  }

  negate() {
    if (this.isCleared) {
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

  // Accept string or number
  addNumber(num) {
    if (!isNumber(num)) {
      throw new Error(`addNumber() only accepts number inputs, got: ${num}`);
    }

    this.isCleared = false;
    this.expression = removeLeadingChars("0", this.expression + num);
  }

  clear() {
    this.value = null;
    this.expression = "";
    this.isCleared = true;
  }

  lastExpressionChar() {
    return this.expression[this.expression.length - 1];
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
    if (isNumber(this.lastExpressionChar())) {
      if (this.hasEvenParens()) {
        this.expression += "(";
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
