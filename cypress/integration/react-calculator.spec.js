function inputSequence(...actionIds) {
  for (let actionId of actionIds) {
    cy.get(`[data-testid="action-${actionId}`).click();
  }
}

function assertValue(expected) {
  cy.get("[data-testid='calculator-input']").should(
    "have.value",
    `${expected}`
  );
}

beforeEach(() => {
  cy.visit("/");
});

it("can add numbers together", () => {
  inputSequence(7, "multiply", 6, "equals");
  assertValue(42);
});

it("can remove characters from input", () => {
  inputSequence(1, "remove");
  assertValue("");
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
  assertValue(-25);
});

it("applies rules of precedence", () => {
  inputSequence(2, "add", 9, "multiply", 2, "equals");
  assertValue(20);
});

it("can be cleared", () => {
  inputSequence(1, 2, 3, "clear");
  assertValue("")
});

it("can convert values to percentages", () => {
  inputSequence(4,2,"percentage","equals");
  assertValue(0.42);
})

it("does not add operators if there is not a preceding operand", () => {
  inputSequence("add", "subtract", "divide", "multiply");
  assertValue("")
})
