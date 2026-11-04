import { faker } from "@faker-js/faker";

describe("User Management", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/users");
    });

    describe("Create User", () => {
        it("can create a new user with valid data", () => {
            const userData = {
                name: faker.person.fullName(),
                email: faker.internet.email(),
                password: "SecurePassword123!",
                preferredLocale: "en",
                roles: ["admin"],
            };

            cy.get('[data-cy="create-button"]').click();
            cy.get('[data-cy="user-name-input"]').type(userData.name);
            cy.get('[data-cy="user-email-input"]').type(userData.email);
            cy.get('[data-cy="user-password-input"]').type(userData.password);
            cy.get('[data-cy="preferred-locale"]').select(
                userData.preferredLocale
            );
            cy.get('[role="combobox"]').contains("Select").click();
            userData.roles.forEach((role) => {
                cy.get('[role="option"]')
                    .contains(role, { matchCase: false })
                    .click();
            });

            cy.get('[data-cy="submit-button"]').click();
            cy.url().should("include", "/admin/users");

            cy.get('[data-cy="success-toast"]').should("be.visible");
        });
    });

    describe("Edit User", () => {
        it("can edit an existing user's details", () => {
            const newUserName = faker.person.fullName();
            cy.get('[data-cy^="edit-"][data-cy$="-button"]').first().click();

            cy.get('[data-cy="user-name-input"]').clear().type(newUserName);
            cy.get('[data-cy="submit-button"]').click();

            cy.url().should("include", "/admin/users");
            cy.get('[data-cy="success-toast"]').should("be.visible");
        });
    });
});
