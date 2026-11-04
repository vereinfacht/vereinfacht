import "./commands";

declare global {
    namespace Cypress {
        interface Chainable {
            addClub(): Chainable<JQuery<HTMLElement>>;
            addMembershipTypes(): Chainable<JQuery<HTMLElement>>;
            localizeBaseUrl(locale?: string): Chainable<JQuery<HTMLElement>>;
            fillOutPersonsForm(index: number): Chainable<JQuery<HTMLElement>>;
            login(
                username?: string,
                password?: string,
            ): Chainable<JQuery<HTMLElement>>;
        }
    }
}

Cypress.on("window:before:load", (window) => {
    Object.defineProperty(window.navigator, "language", {
        value: Cypress.expose("locale"),
    });
});

before(() => {
    cy.addClub().addMembershipTypes();
});
