describe("Statements table sort", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/finances/statements");
    });

    function parseDate(dateString: string) {
        const [day, month, year] = dateString.split(".");
        return new Date(`${year}-${month}-${day}`);
    }

    it("can sort by date", () => {
        cy.get('[data-cy="sort-date"]').click().wait(500);
        cy.url().should("include", "sort=-date");

        cy.get('[data-cy="0_date-cell"]').then(($first) => {
            const firstDate = parseDate($first.text());
            cy.get('[data-cy="1_date-cell"]').then(($second) => {
                const secondDate = parseDate($second.text());
                expect(firstDate).to.be.gte(secondDate);
            });
        });

        cy.get('[data-cy="sort-date"]').click().wait(500);
        cy.url().should("include", "sort=date");

        cy.get('[data-cy="0_date-cell"]').then(($first) => {
            const firstDate = parseDate($first.text());
            cy.get('[data-cy="1_date-cell"]').then(($second) => {
                const secondDate = parseDate($second.text());
                expect(firstDate).to.be.lte(secondDate);
            });
        });
    });
});
