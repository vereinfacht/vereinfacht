describe("Statements visit", () => {
    beforeEach(() => {
        cy.login();
    });

    it("can navigate to statements", () => {
        cy.get('[data-cy="navigation-link-statements"]')
            .should("be.visible")
            .click();
        cy.url().should("include", "/admin/finances/statements");
        cy.get('[data-cy="account-card-title-all"]').should("be.visible");
    });
});
