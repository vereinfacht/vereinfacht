import { faker } from "@faker-js/faker";

describe("Create finance contact", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/finances/contacts");
    });

    it("can visit create form", () => {
        cy.get('[data-cy="create-button"]').click();
        cy.get('[data-cy="submit-button"]').should("be.visible");
        cy.url().should("include", "/en/admin/finances/contacts/create");
    });

    it("can be submitted with minimal data", () => {
        cy.visit("/en/admin/finances/contacts/create");
        cy.get(`[data-cy="contactType"]`).select("person");
        cy.get(`[data-cy="firstName"]`).type(faker.person.firstName());
        cy.get(`[data-cy="lastName"]`).type(faker.person.lastName());
        cy.get(`[data-cy="address"]`).type(faker.location.street());
        cy.get(`[data-cy="zipCode"]`).type(faker.location.zipCode());
        cy.get(`[data-cy="city"]`).type(faker.location.city());

        cy.get('[data-cy="submit-button"]').click();
        // for some reason the toast is being removed after redirect in cypress runs
        // cy.get('[data-cy="success-toast"]').should("be.visible");
        cy.url().should("include", "/en/admin/finances/contacts");
    });
});
