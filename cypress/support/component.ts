import { mount } from "cypress/react18";

// Import global styles
import '../../src/app/globals.css'

// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  // Add any global styles here
  const styles = document.createElement('style')
  styles.innerHTML = `
    /* Add any global styles needed for testing here */
    *, *::before, *::after {
      box-sizing: border-box;
    }
    body {
      margin: 0;
      padding: 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
        'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
        sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    #root {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
  `
  document.head.appendChild(styles)

  // Create a root element for React to render into
  const root = document.createElement('div')
  root.id = 'root'
  document.body.appendChild(root)

  return mount(component, {
    ...options,
    // @ts-expect-error this is just for testing
    root: '#root',
  })
})

// Example use:
// cy.mount(<MyComponent />)