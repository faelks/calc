function inputSequence(...actionIds) {
  for (let actionId of actionIds) {
    cy.get(`[data-testid="action-${actionId}`).click();
  }
}

function assertInputAttribute(expected, attribute = "value") {
  cy.get("[data-testid='calculator-input']").should(
    `have.${attribute}`,
    `${expected}`
  );
}

function assertPreviewValue(expected) {
  cy.get("[data-testid='calculator-preview-value']").should(
    "have.text",
    `${expected}`
  );
}

beforeEach(() => {
  cy.visit("/");
});

it("can add numbers together", () => {
  inputSequence(7, "multiply", 6, "equals");
  assertInputAttribute(42);
});

it("can remove characters from input", () => {
  inputSequence(1, "remove");
  assertInputAttribute("");
});

it("can use parenthesis in expressions", () => {
  inputSequence(
    "parenthesis",
    2,
    "subtract",
    7,
    "parenthesis",
    "multiply",
    5,
    "equals"
  );
  assertInputAttribute(-25);
});

it("applies rules of precedence", () => {
  inputSequence(2, "add", 9, "multiply", 2, "equals");
  assertInputAttribute(20);
});

it("can be cleared", () => {
  inputSequence(1, 2, 3, "clear");
  assertInputAttribute("");
});

it("can convert values to percentages", () => {
  inputSequence(4, 2, "percentage", "equals");
  assertInputAttribute(0.42);
});

it("does not add operators if there is not a preceding operand", () => {
  inputSequence("add", "subtract", "divide", "multiply");
  assertInputAttribute("");
});

it("can work with point numbers", () => {
  inputSequence("point", 1, "add", "point", 2, "equals");
  assertInputAttribute(0.3);
});

it("the expression is evaluated on every action and result displayed under input", () => {
  inputSequence(1, "add", 1);
  assertPreviewValue(2);
});

it.only("displays the result in blue text after evaluating an expression", () => {
  assertInputAttribute("text-black", "class");
  inputSequence(4, "multiply", 5, "equals");
  assertInputAttribute("text-blue-500", "class");
})
