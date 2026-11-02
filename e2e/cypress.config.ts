import { defineConfig } from "cypress";

export default defineConfig({
    env: {
        apiUrl: "http://api/api/v1",
        apiBearerToken: "",
        locale: "de",
        supportedLocales: ["de", "en"],
    },

    e2e: {
        setupNodeEvents(_on, config) {
            // Preserve env overrides while exposing only public configuration.
            config.expose = {
                ...config.expose,
                apiUrl: config.env.apiUrl,
                locale: config.env.locale,
                supportedLocales: config.env.supportedLocales,
            };

            return config;
        },
        baseUrl: "http://tooling:3000",
        experimentalWebKitSupport: true,
        specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
        viewportHeight: 900,
        viewportWidth: 1600,
    },
});
