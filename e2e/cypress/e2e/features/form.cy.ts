import { faker } from "@faker-js/faker";

describe("Application form", () => {
    before(function () {
        cy.localizeBaseUrl();
    });
    beforeEach(function () {
        cy.visit(`/${Cypress.expose("club").attributes.slug}/apply`);
    });

    it("membership can be chosen", () => {
        cy.get(
            `[data-cy="choose-${Cypress.expose("membershipTypes")[0].id}"]`,
        ).click();
        cy.get('[data-cy="add-persons-form"]');
    });

    it("needs required personal data", () => {
        cy.get(
            `[data-cy="choose-${Cypress.expose("membershipTypes")[0].id}"]`,
        ).click();
        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy="firstName-0"]').invoke("prop", "validationMessage");
    });

    it("can be filled with personal data", () => {
        cy.get(
            `[data-cy="choose-${Cypress.expose("membershipTypes")[0].id}"]`,
        ).click();

        cy.get('[data-cy^="firstName-"]').then((listing) => {
            for (let i = 0; i < listing.length; i++) {
                cy.fillOutPersonsForm(i);
            }
        });

        cy.get('[data-cy="next-button"]').click();
        cy.get('[data-cy^="firstName-"]').should("not.exist");
    });

    it("can be submitted with minimal data", () => {
        cy.get(
            `[data-cy="choose-${Cypress.expose("membershipTypes")[0].id}"]`,
        ).click();

        cy.get('[data-cy^="firstName-"]').then((listing) => {
            for (let i = 0; i < listing.length; i++) {
                cy.fillOutPersonsForm(i);
            }
        });

        cy.get('[data-cy="next-button"]').click();

        // only skip division step when choosen membership doesn't have divisions attached
        cy.get("body").then(($body) => {
            if ($body.find('[id^="headlessui-combobox-input"]').length > 0) {
                cy.get('[data-cy="next-button"]').click();
            }
        });

        cy.get('[data-cy="next-button"]').click();

        cy.get('[data-cy="bankIban"]').type("DE123123123123123123");
        cy.get('[data-cy="bankAccountHolder"]').type(faker.person.fullName());
        cy.get("body").then(($body) => {
            if ($body.find('[data-cy="paymentPeriod"]').length > 0) {
                cy.get('[data-cy="paymentPeriod"]').select(
                    faker.helpers.arrayElement([1, 2, 3]),
                );
            }
        });

        cy.get('[data-cy="next-button"]').click();

        cy.get('[data-cy="club-terms-accepted"]').check();
        cy.get('[data-cy="vereinfacht-terms-accepted"]').check();

        cy.get('[data-cy="confirm-button"]').click();

        cy.url().should(
            "include",
            `${Cypress.expose("club").attributes.slug}/success?membershipType=`,
        );
    });
});
