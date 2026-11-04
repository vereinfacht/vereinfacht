describe("Membership table filter", () => {
    const filterButton = '[data-cy="filter[status]-button"]';

    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/memberships");
    });

    it("can filter memberships table by status", () => {
        const statuses = ["active", "applied", "cancelled"];

        statuses.forEach((status) => {
            const option = `[data-cy="option-${status}"]`;
            const label = `[data-cy="option-${status}-label"]`;

            cy.get(filterButton).click();
            cy.get(option).check({ force: true });

            cy.url().should("include", status);

            cy.get(label)
                .invoke("text")
                .then((labelText) => {
                    cy.get('[data-cy="0_status-cell"]').should(
                        "contain",
                        labelText.trim()
                    );
                });

            cy.get(filterButton).click();
            cy.get(option).click({ force: true });
        });
    });
});
