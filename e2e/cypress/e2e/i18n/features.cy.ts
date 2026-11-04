describe("Application form", () => {
    Cypress.expose("supportedLocales")?.forEach((locale: string) => {
        it(`can be visited with locale path '${locale}'`, () => {
            const url = `${locale}/${Cypress.expose("club").attributes.slug}/apply`;
            cy.visit(url);
            cy.contains(Cypress.expose("club").attributes.title);
        });
    });
});
