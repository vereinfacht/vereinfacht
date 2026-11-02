describe("Statements account filter", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/finances/statements");
    });

    it("can filter statements table by account", () => {
        cy.get('[data-cy^="select-account-"]').each(($card) => {
            const accountId = $card.data("cy").replace("select-account-", "");

            cy.wrap($card).click();

            if (accountId === "all") {
                cy.url().should("not.include", "accountId=");
            } else {
                cy.url().should("include", `accountId=${accountId}`);
                cy.get(`[data-cy="account-card-title-${accountId}"]`)
                    .invoke("text")
                    .then((accountTitle) => {
                        cy.get('[data-cy$="-row"]').each(($row) => {
                            cy.wrap($row).should(
                                "contain.text",
                                accountTitle.trim()
                            );
                        });
                    });
            }
        });
    });
});
