describe("Date Range Input", () => {
    beforeEach(() => {
        cy.login();
        cy.visit("/en/admin/finances/receipts");
    });

    it("should display date range picker trigger", () => {
        cy.get('[data-cy="date-range-trigger"]').should("exist");
        cy.get('[data-cy="date-range-trigger"]').should("be.visible");
    });

    it("should open date picker dropdown when trigger is clicked", () => {
        cy.get('[data-cy="date-range-trigger"]').click();

        cy.get('[data-cy="date-range-dropdown"]').should("be.visible");
        cy.get('[data-cy="date-range-calendar"]').should("be.visible");
        cy.get('[data-cy="date-range-apply-button"]').should("be.visible");
        cy.get('[data-cy="date-range-clear-button"]').should("be.visible");
    });

    it("should allow selecting a date range", () => {
        cy.get('[data-cy="date-range-trigger"]').click();

        cy.get('[data-cy="date-range-calendar"]').should("be.visible");

        cy.get('[data-cy="date-range-calendar"] button')
            .not("[disabled]")
            .contains(/^1[5-9]$|^2[0-5]$/)
            .first()
            .click();

        cy.get('[data-cy="date-range-calendar"] button')
            .not("[disabled]")
            .contains(/^2[6-9]$|^3[0-1]$/)
            .first()
            .click();

        cy.get('[data-cy="date-range-apply-button"]').click();

        cy.get('[data-cy="date-range-dropdown"]').should("not.exist");
    });

    it("should update URL parameters when date range is applied", () => {
        cy.get('[data-cy="date-range-trigger"]').click();

        cy.get('[data-cy="date-range-calendar"]').should("be.visible");
        cy.get('[data-cy="date-range-calendar"] button')
            .not("[disabled]")
            .contains(/^1[0-5]$/)
            .first()
            .click();
        cy.get('[data-cy="date-range-calendar"] button')
            .not("[disabled]")
            .contains(/^2[0-5]$/)
            .first()
            .click();

        cy.get('[data-cy="date-range-apply-button"]').click();

        cy.url().should("match", /bookingDateFrom=\d{4}-\d{2}-\d{2}/);
        cy.url().should("match", /bookingDateTo=\d{4}-\d{2}-\d{2}/);
    });

    // it("should clear date range when clear button is clicked", () => {
    //     cy.get('[data-cy="date-range-trigger"]').click();
    //     cy.get('[data-cy="date-range-calendar"] button')
    //         .not("[disabled]")
    //         .contains(/^1[0-5]$/)
    //         .first()
    //         .click();
    //     cy.get('[data-cy="date-range-calendar"] button')
    //         .not("[disabled]")
    //         .contains(/^2[0-5]$/)
    //         .first()
    //         .click();
    //     cy.get('[data-cy="date-range-apply-button"]').click();

    //     cy.url().should("match", /bookingDateFrom=\d{4}-\d{2}-\d{2}/);

    //     cy.get('[data-cy="date-range-trigger"]').click();
    //     cy.get('[data-cy="date-range-clear-button"]').as("btn");
    //     cy.get("@btn").click();

    //     cy.url().should("not.include", "bookingDateFrom=");
    //     cy.url().should("not.include", "bookingDateTo=");
    // });

    it("should show visual indicator when date filter is active", () => {
        // Initially no active filter indicator should be present
        cy.get('[data-cy="date-range-active-badge"]').should("not.exist");

        // Set a date range
        cy.get('[data-cy="date-range-trigger"]').click();
        cy.get('[data-cy="date-range-calendar"] button')
            .not("[disabled]")
            .contains(/^1[0-5]$/)
            .first()
            .click();
        cy.get('[data-cy="date-range-calendar"] button')
            .not("[disabled]")
            .contains(/^2[0-5]$/)
            .first()
            .click();
        cy.get('[data-cy="date-range-apply-button"]').click();

        // Should show active filter indicator (badge)
        cy.get('[data-cy="date-range-active-badge"]').should("exist");
        cy.get('[data-cy="date-range-active-badge"]').should("be.visible");
    });

    it("should handle single date selection", () => {
        cy.get('[data-cy="date-range-trigger"]').click();

        cy.get('[data-cy="date-range-calendar"] button')
            .not("[disabled]")
            .contains(/^1[2-8]$/)
            .first()
            .click();

        cy.get('[data-cy="date-range-apply-button"]').should("not.be.disabled");
        cy.get('[data-cy="date-range-apply-button"]').click();

        cy.url().should("match", /bookingDateFrom=\d{4}-\d{2}-\d{2}/);
    });
});
