beforeEach(() => {
  cy.viewport(1025, 900);
  cy.visit("http://localhost:3000/dashboard");
});

it("Opens the email app", () => {
  const supportButton = cy
    .get("nav")
    .find("ul")
    .eq(1)
    .find("li")
    .eq(0)
    .find("button");

  supportButton.click();
});
