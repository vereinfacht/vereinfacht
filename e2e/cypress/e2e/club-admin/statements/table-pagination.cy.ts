describe("Statements table pagination", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/finances/statements");
    });

    it("can navigate pagination", () => {
        cy.get('[data-cy="table-pagination-next-button"]').should("be.visible");
        cy.get('[data-cy="table-pagination-previous-button"]').should(
            "be.visible"
        );
        cy.get('[data-cy^="table-pagination-button-"]').should(
            "have.length.greaterThan",
            1
        );

        cy.get('[data-cy="table-pagination-previous-button"]').should(
            "have.attr",
            "disabled"
        );

        cy.get('[data-cy^="table-pagination-button-"]')
            .last()
            .invoke("attr", "data-cy")
            .then((attributes) => {
                if (!attributes) return;

                const lastPage = parseInt(
                    attributes.replace("table-pagination-button-", ""),
                    10
                );

                let previousFirstCell = "";

                cy.get('[data-cy="0_title-cell"]')
                    .invoke("text")
                    .then((text) => {
                        previousFirstCell = text;

                        for (let page = 2; page <= lastPage; page++) {
                            cy.get(
                                '[data-cy="table-pagination-next-button"]'
                            ).click();
                            cy.url().should("include", `page=${page}`);

                            cy.get('[data-cy="0_title-cell"]')
                                .invoke("text")
                                .should((textOnNextPage) => {
                                    expect(textOnNextPage).not.to.eq(
                                        previousFirstCell
                                    );
                                    previousFirstCell = textOnNextPage;
                                });
                        }

                        cy.get(
                            '[data-cy="table-pagination-next-button"]'
                        ).should("have.attr", "disabled");

                        for (let page = lastPage - 1; page >= 1; page--) {
                            cy.get(
                                '[data-cy="table-pagination-previous-button"]'
                            ).click();

                            if (page === 1) {
                                cy.url().should("not.include", "page=");
                            } else {
                                cy.url().should("include", `page=${page}`);
                            }

                            cy.get('[data-cy="0_title-cell"]')
                                .invoke("text")
                                .should((textOnPrevPage) => {
                                    expect(textOnPrevPage).not.to.eq(
                                        previousFirstCell
                                    );
                                    previousFirstCell = textOnPrevPage;
                                });
                        }

                        cy.get(
                            '[data-cy="table-pagination-previous-button"]'
                        ).should("have.attr", "disabled");
                    });
            });
    });
});
