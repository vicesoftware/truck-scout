import { defineConfig } from "cypress";
import webpackConfig from './webpack.config.js';

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "webpack",
      webpackConfig,
    },
    specPattern: "cypress/component/**/*.cy.{js,jsx,ts,tsx}",
    supportFile: "cypress/support/component.ts",
  },
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    setupNodeEvents(on, config) {
      // If port 3000 is in use, use 3000
      if (process.env.PORT === '3000') {
        config.baseUrl = 'http://localhost:3000'
      }
      return config
    },
  },
});
