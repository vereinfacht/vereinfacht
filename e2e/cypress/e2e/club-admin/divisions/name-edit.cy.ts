import { faker } from "@faker-js/faker";

describe("Edit name", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/divisions");
    });

    it("can edit a translation name", () => {
        cy.get('[data-cy="0_title-cell"]')
            .invoke("text")
            .then((originalTitle) => {
                const trimmedOriginal = originalTitle.trim();

                cy.get('[data-cy="edit-1-button"]').click();

                cy.get(`[data-cy="titleTranslations-en"]`)
                    .should("exist")
                    .clear()
                    .type(faker.lorem.words(2));

                cy.get('[data-cy="submit-button"]').click().wait(2000);
                cy.get('[data-cy="en-translation-text"]').should(
                    "not.have.text",
                    trimmedOriginal
                );
            });
    });
});
