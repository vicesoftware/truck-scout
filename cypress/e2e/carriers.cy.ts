describe('Carriers Page', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err, runnable) => {
      console.error('Uncaught exception:', err);
      return false;
    });
  });

  it('displays the carriers title', () => {
    cy.visit('/carriers');
    cy.get('[data-test-id="carriers-title"]').should('contain', 'Carriers')
  })

  it('displays the add new carrier button', () => {
    cy.visit('/carriers');
    cy.get('[data-test-id="add-carrier-button"]').should('exist')
  })

  it('displays the correct total number of carriers', () => {
    // Mock the API response
    cy.intercept('GET', '/api/carriers*', {
      statusCode: 200,
      body: [
          { id: 1, name: 'Carrier 1' },
          { id: 2, name: 'Carrier 2' },
          { id: 3, name: 'Carrier 3' },
        ]
    }).as('getCarriers');

    cy.visit('/carriers');

    // Wait for the API call to complete
    cy.wait('@getCarriers');
    cy.get('[data-test-id="total-carriers"]').should('contain', '3');
  })

  it('allows searching for carriers', () => {
    // Mock the API response for initial load
    cy.intercept('GET', '/api/carriers*', {
        statusCode: 200,
        body: [
            { id: 1, name: 'Carrier 1' },
            { id: 2, name: 'Carrier 2' },
            { id: 3, name: 'Carrier 3' },
          ]
      }).as('getCarriers');

    cy.visit('/carriers');
    
    cy.wait('@getCarriers');

    cy.get('[data-test-id="search-carriers"]').type('Test Carrier');

    // Check if the table updates with search results
    cy.get('[data-test-id^="carrier-row-"]').should('have.length', 1);
    cy.get('[data-test-id^="carrier-row-"]').should('contain', 'Test Carrier');
  })

  it.skip('opens the add carrier dialog when clicking the add button', () => {
    cy.get('[data-test-id="add-carrier-button"]').click()
    cy.get('[data-test-id="carrier-dialog-title"]').should('contain', 'Add New Carrier')
  })

  it.skip('allows adding a new carrier', () => {
    cy.get('[data-test-id="add-carrier-button"]').click()
    cy.get('[data-test-id="carrier-name-input"]').type('New Test Carrier')
    cy.get('[data-test-id="carrier-mc-number-input"]').type('MC123456')
    cy.get('[data-test-id="carrier-dot-number-input"]').type('DOT789012')
    cy.get('[data-test-id="carrier-phone-input"]').type('1234567890')
    cy.get('[data-test-id="carrier-status-select"]').click()
    cy.get('.select-item').contains('Active').click()
    cy.get('[data-test-id="save-carrier-button"]').click()
    // Add assertion to check if the new carrier appears in the table
  })

  it.skip('allows editing an existing carrier', () => {
    // Assuming the first carrier in the list is editable
    cy.get('[data-test-id^="carrier-row-"]').first().find('[data-test-id^="carrier-actions-"]').click()
    cy.get('[data-test-id^="edit-carrier-"]').click()
    cy.get('[data-test-id="carrier-name-input"]').clear().type('Updated Carrier Name')
    cy.get('[data-test-id="save-carrier-button"]').click()
    // Add assertion to check if the carrier name was updated in the table
  })

  it.skip('allows deleting a carrier', () => {
    // Assuming the first carrier in the list is deletable
    cy.get('[data-test-id^="carrier-row-"]').first().find('[data-test-id^="carrier-actions-"]').click()
    cy.get('[data-test-id^="delete-carrier-"]').click()
    // Add assertion to check if the carrier was removed from the table
  })

  it.skip('displays the correct number of entries and allows pagination', () => {
    cy.get('.pagination').should('exist')
    // Add more specific assertions for pagination functionality
  })

  it.skip('allows exporting carriers to CSV', () => {
    cy.get('[data-test-id="export-button"]').click()
    // Add assertion to check if the CSV file was downloaded
  })
})