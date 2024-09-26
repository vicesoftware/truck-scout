describe('Carriers Page', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      console.error('Uncaught exception:', err);
      return false;
    });
  });

  it('displays the carriers title', () => {
    cy.visit('/carriers');
    cy.get('[data-testid="carriers-title"]').should('contain', 'Carriers')
  })

  it('displays the add new carrier button', () => {
    cy.visit('/carriers');
    cy.get('[data-testid="add-carrier-button"]').should('exist')
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
    cy.get('[data-testid="total-carriers"]').should('contain', '3');
  })

  it('allows searching for carriers', () => {
    // Mock the API response for initial load
    cy.intercept('GET', '/api/carriers*', {
        statusCode: 200,
        body: [
            { id: 1, name: 'Carrier 1' },
            { id: 2, name: 'Test Carrier' },
            { id: 3, name: 'Carrier 3' },
          ]
      }).as('getCarriers');

    cy.visit('/carriers');
    
    cy.wait('@getCarriers');

    // Wait for the element to be visible and interactable
    cy.get('[data-testid="search-carriers"]').should('be.visible').as('searchInput');
    
    cy.get('@searchInput').type('Test Carrier');

    cy.get('@searchInput').should('have.value', 'Test Carrier')

    // Check if the table updates with search results
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'Test Carrier');
  })

  it('handles case-insensitive search', () => {
    cy.intercept('GET', '/api/carriers*', {
      statusCode: 200,
      body: [
        { id: 1, name: 'ABC Logistics' },
        { id: 2, name: 'XYZ Transport' },
        { id: 3, name: 'Fast Freight' },
      ]
    }).as('getCarriers');

    cy.visit('/carriers');
    cy.wait('@getCarriers');

    cy.get('[data-testid="search-carriers"]').as('searchInput');
    
    cy.get('@searchInput').type('abc');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'ABC Logistics');

    cy.get('@searchInput').clear().type('TRANSPORT');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'XYZ Transport');
  })

  it('handles partial word search', () => {
    cy.intercept('GET', '/api/carriers*', {
      statusCode: 200,
      body: [
        { id: 1, name: 'Global Shipping' },
        { id: 2, name: 'Express Delivery' },
        { id: 3, name: 'Rapid Logistics' },
      ]
    }).as('getCarriers');

    cy.visit('/carriers');
    cy.wait('@getCarriers');

    cy.get('[data-testid="search-carriers"]').as('searchInput');
    
    cy.get('@searchInput').type('lo');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 2);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'Global Shipping');
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'Rapid Logistics');
  })

  it('resets search results when clearing the search input', () => {
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

    cy.get('[data-testid="search-carriers"]').as('searchInput');
    
    cy.get('@searchInput').type('Carrier 1');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);

    cy.get('@searchInput').clear();
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 3);
  })

  it.skip('opens the add carrier dialog when clicking the add button', () => {
    cy.get('[data-testid="add-carrier-button"]').click()
    cy.get('[data-testid="carrier-dialog-title"]').should('contain', 'Add New Carrier')
  })

  it.skip('allows adding a new carrier', () => {
    cy.get('[data-testid="add-carrier-button"]').click()
    cy.get('[data-testid="carrier-name-input"]').type('New Test Carrier')
    cy.get('[data-testid="carrier-mc-number-input"]').type('MC123456')
    cy.get('[data-testid="carrier-dot-number-input"]').type('DOT789012')
    cy.get('[data-testid="carrier-phone-input"]').type('1234567890')
    cy.get('[data-testid="carrier-status-select"]').click()
    cy.get('.select-item').contains('Active').click()
    cy.get('[data-testid="save-carrier-button"]').click()
    // Add assertion to check if the new carrier appears in the table
  })

  it.skip('allows editing an existing carrier', () => {
    // Assuming the first carrier in the list is editable
    cy.get('[data-testid^="carrier-row-"]').first().find('[data-testid^="carrier-actions-"]').click()
    cy.get('[data-testid^="edit-carrier-"]').click()
    cy.get('[data-testid="carrier-name-input"]').clear().type('Updated Carrier Name')
    cy.get('[data-testid="save-carrier-button"]').click()
    // Add assertion to check if the carrier name was updated in the table
  })

  it.skip('allows deleting a carrier', () => {
    // Assuming the first carrier in the list is deletable
    cy.get('[data-testid^="carrier-row-"]').first().find('[data-testid^="carrier-actions-"]').click()
    cy.get('[data-testid^="delete-carrier-"]').click()
    // Add assertion to check if the carrier was removed from the table
  })

  it.skip('displays the correct number of entries and allows pagination', () => {
    cy.get('.pagination').should('exist')
    // Add more specific assertions for pagination functionality
  })

  it.skip('allows exporting carriers to CSV', () => {
    cy.get('[data-testid="export-button"]').click()
    // Add assertion to check if the CSV file was downloaded
  })
})