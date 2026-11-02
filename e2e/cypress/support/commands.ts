import { faker } from "@faker-js/faker";

Cypress.Commands.add("addClub", () => {
    const url = Cypress.expose("apiUrl") + "/clubs";

    cy.env(["apiBearerToken"]).then(({ apiBearerToken }) => {
        return cy.request({
            method: "GET",
            url,
            auth: {
                bearer: apiBearerToken,
            },
        }).then(({ body }) => {
            Cypress.expose("club", body.data[0]);
        });
    });
});

Cypress.Commands.add("addMembershipTypes", () => {
    const url =
        Cypress.expose("apiUrl") +
        `/clubs/${Cypress.expose("club").id}/membership-types`;

    cy.env(["apiBearerToken"]).then(({ apiBearerToken }) => {
        return cy.request({
            method: "GET",
            url,
            auth: {
                bearer: apiBearerToken,
            },
        }).then(({ body }) => {
            Cypress.expose("membershipTypes", body.data);
        });
    });
});

Cypress.Commands.add("fillOutPersonsForm", (index) => {
    cy.get(`[data-cy="firstName-${index}"]`).type(faker.person.firstName());
    cy.get(`[data-cy="lastName-${index}"]`).type(faker.person.lastName());
    cy.get(`[data-cy="birthday-${index}"]`).type("2000-01-01");
    cy.get(`[data-cy="gender-${index}"]`).select(
        faker.helpers.arrayElement(["male", "female", "other"]),
    );
    cy.get(`[data-cy="members.${index}.hasConsentedMediaPublication"]`).check();

    if (index > 0) {
        cy.get(`[data-cy="members.${index}.sameContactAndAddress"]`).uncheck();
    }

    cy.get(`[data-cy="email-${index}"]`).type(faker.internet.email());
    cy.get(`[data-cy="phoneNumber-${index}"]`).type(faker.phone.number());
    cy.get(`[data-cy="address-${index}"]`).type(faker.location.streetAddress());
    cy.get(`[data-cy="zipCode-${index}"]`).type(faker.location.zipCode());
    cy.get(`[data-cy="city-${index}"]`).type(faker.location.city());
    cy.get(`[data-cy="country-${index}"]`).select(
        faker.helpers.arrayElement(["germany", "denmark"]),
    );
});

Cypress.Commands.add("localizeBaseUrl", (overrideLocale?: string) => {
    const baseUrl = Cypress.config("baseUrl");
    const locale = overrideLocale ?? Cypress.expose("locale");
    const localizedUrl = `${baseUrl}/${locale}`;

    Cypress.config("baseUrl", localizedUrl);
});

Cypress.Commands.add(
    "login",
    (username = "club-admin-1@example.org", password = "password") => {
        cy.visit("/login");
        cy.url().should("contain", "/en/admin/auth/login");
        cy.get('[data-cy="email"]').type(username);
        cy.get('[data-cy="password"]').type(password);
        cy.get('[data-cy="submit-login-form"]').click();
        cy.url().should("include", "/dashboard");
    },
);
