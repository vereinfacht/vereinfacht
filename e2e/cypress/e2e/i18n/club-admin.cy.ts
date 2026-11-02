describe("Club admin", () => {
    it("can select supported languages in login form", () => {
        cy.visit("/login");
        cy.url().should("include", "/en/");

        Cypress.expose("supportedLocales").forEach((locale: string) => {
            cy.get('[data-cy="language-selector"]').click();
            cy.get(`[data-cy="language-selector-${locale}"]`).click();
            cy.url().should("include", `/${locale}/admin/auth/login`);
        });
    });
});
