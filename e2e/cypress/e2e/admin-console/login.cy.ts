const adminConsoleUrl = Cypress.expose("apiUrl").split("/api/v1")[0];

describe("Login", () => {
    it("form works with correct credentials", () => {
        cy.visit(`${adminConsoleUrl}/admin/login`);
        cy.get('[id="form.email"]').type("hello@vereinfacht.digital");
        cy.get('[id="form.password"]').type("password");
        cy.get('button[type="submit"]').click();
        cy.url().should("include", "/admin/1");
        cy.contains("Dashboard");
    });
});
