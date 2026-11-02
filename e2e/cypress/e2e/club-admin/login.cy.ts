const authRequestUrl = "/api/auth/callback/credentials";

describe("Login", () => {
    it("redirects to login page", () => {
        cy.visit("/login");

        // when using chrome to run cypress tests, no accept-language header is provided and therefore our middleware defaults to 'en'
        cy.url().should("contain", "/en/admin/auth/login");
    });

    it("form works with correct credentials", () => {
        cy.intercept(authRequestUrl).as("loginCheck");

        cy.visit("/login");
        cy.get('[data-cy="email"]').type(
            `club-admin-${Cypress.expose("club").id}@example.org`,
        );
        cy.get('[data-cy="password"]').type("password");
        cy.get('[data-cy="submit-login-form"]').click();
        cy.wait("@loginCheck");
        cy.url().should("include", "/admin/auth/login");
    });

    it("form is invalid with wrong email", () => {
        cy.intercept(authRequestUrl).as("loginCheck");

        cy.visit("/login");
        cy.get('[data-cy="email"]').type("wrong@example.org");
        cy.get('[data-cy="password"]').type("password");
        cy.get('[data-cy="submit-login-form"]').click();
        cy.wait("@loginCheck");
        cy.url().should("include", "/admin/auth/login");
        cy.get('[data-cy="message-box-error"]').should("exist");
    });

    it("form is invalid with wrong password", () => {
        cy.intercept(authRequestUrl).as("loginCheck");

        cy.visit("/login");
        cy.get('[data-cy="email"]').type(
            `club-admin-${Cypress.expose("club").id}@example.org`,
        );
        cy.get('[data-cy="password"]').type("secret");
        cy.get('[data-cy="submit-login-form"]').click();
        cy.wait("@loginCheck");
        cy.url().should("include", "/admin/auth/login");
        cy.get('[data-cy="message-box-error"]').should("exist");
    });
});
