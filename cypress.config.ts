import { defineConfig } from "cypress";
import "./polyfills";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Adjust this to match your development server URL
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
