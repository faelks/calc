
it("can add numbers together", () => {
  cy.visit("/");
  cy.get("[data-testid='action-7']").click()
  cy.get("[data-testid='action-multiply']").click();
  cy.get("[data-testid='action-6']").click()
  cy.get("[data-testid='action-equals']").click()

  cy.get("[data-testid='calculator-input']").should("have.value", "42")
});