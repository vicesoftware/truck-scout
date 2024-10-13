describe('Carriers Page', () => {
  beforeEach(() => {
    cy.on('uncaught:exception', (err) => {
      console.error('Uncaught exception:', err);
      return false;
    });
  });

  // Define the Carrier type
  type Carrier = {
    id: number;
    name: string;
  };

  // Shared setup function with typed parameter
  const setupCarriersTest = (carriers: Carrier[] = []) => {
    cy.intercept('GET', '/api/carriers*', {
      statusCode: 200,
      body: carriers
    }).as('getCarriers');

    cy.visit('/carriers');
    cy.wait('@getCarriers');
  };

  it('displays the carriers title', () => {
    setupCarriersTest();
    cy.get('[data-testid="carriers-title"]').should('contain', 'Carriers')
  })

  it('displays the add new carrier button', () => {
    setupCarriersTest();
    cy.get('[data-testid="add-carrier-button"]').should('exist')
  })

  it('displays the correct total number of carriers', () => {
    setupCarriersTest([
      { id: 1, name: 'Carrier 1' },
      { id: 2, name: 'Carrier 2' },
      { id: 3, name: 'Carrier 3' },
    ]);
    cy.get('[data-testid="total-carriers"]').should('contain', '3');
  })

  it('allows searching for carriers', () => {
    setupCarriersTest([
      { id: 1, name: 'Carrier 1' },
      { id: 2, name: 'Test Carrier' },
      { id: 3, name: 'Carrier 3' },
    ]);

    cy.get('[data-testid="search-carriers"]').should('be.visible').as('searchInput');
    cy.get('@searchInput').type('Test Carrier');
    cy.get('@searchInput').should('have.value', 'Test Carrier')

    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'Test Carrier');
  })

  it('handles case-insensitive search', () => {
    setupCarriersTest([
      { id: 1, name: 'ABC Logistics' },
      { id: 2, name: 'XYZ Transport' },
      { id: 3, name: 'Fast Freight' },
    ]);

    cy.get('[data-testid="search-carriers"]').as('searchInput');
    
    cy.get('@searchInput').type('abc');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'ABC Logistics');

    cy.get('@searchInput').clear().type('TRANSPORT');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'XYZ Transport');
  })

  it('handles partial word search', () => {
    setupCarriersTest([
      { id: 1, name: 'Global Shipping' },
      { id: 2, name: 'Express Delivery' },
      { id: 3, name: 'Rapid Logistics' },
    ]);

    cy.get('[data-testid="search-carriers"]').as('searchInput');
    
    cy.get('@searchInput').type('lo');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 2);
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'Global Shipping');
    cy.get('[data-testid^="carrier-row-"]').should('contain', 'Rapid Logistics');
  })

  it('resets search results when clearing the search input', () => {
    setupCarriersTest([
      { id: 1, name: 'Carrier 1' },
      { id: 2, name: 'Carrier 2' },
      { id: 3, name: 'Carrier 3' },
    ]);

    cy.get('[data-testid="search-carriers"]').as('searchInput');
    
    cy.get('@searchInput').type('Carrier 1');
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 1);

    cy.get('@searchInput').clear();
    cy.get('[data-testid^="carrier-row-"]').should('have.length', 3);
  })

  it('opens the add carrier dialog when clicking the add button', () => {
    setupCarriersTest();
    cy.get('[data-testid="add-carrier-button"]').as('addCarrierButton')
    cy.get('@addCarrierButton').click()
    cy.get('[data-testid="carrier-dialog-title"]').should('contain', 'Add New Carrier')
  })

  

  it('allows adding a new carrier', () => {
    setupCarriersTest();
  
    // Stub the POST request and capture the request body
    cy.intercept('POST', '/api/carriers', (req) => {
      console.log(req.body)
      // Verify the request body
      expect(req.body).to.deep.equal({
        name: "New Test Carrier",
        mc_number: "MC123456",
        dot_number: "DOT789012",
        phone: "1234567890",
        status: "Pending",
        rating: 0
      });

      // Respond with a mock successful response
      req.reply({
        statusCode: 201,
        body: {
          id: 1,
          ...req.body
        }
      });
    }).as('addCarrier');

    // Stub the subsequent GET request that might occur after adding
    cy.intercept('GET', '/api/carriers*', {
      statusCode: 200,
      body: [{
        id: 1,
        name: "New Test Carrier",
        mc_number: "MC123456",
        dot_number: "DOT789012",
        phone: "1234567890",
        status: "Pending",
        rating: 0
      }]
    }).as('getCarriersAfterAdd');

    cy.get('[data-testid="add-carrier-button"]').click()
    cy.get('[data-testid="carrier-name-input"]').type('New Test Carrier')
    cy.get('[data-testid="carrier-mc-number-input"]').type('MC123456')
    cy.get('[data-testid="carrier-dot-number-input"]').type('DOT789012')
    cy.get('[data-testid="carrier-phone-input"]').type('1234567890')
    
    cy.get('[data-testid="save-carrier-button"]').click()
    
    // Wait for the POST request to complete
    cy.wait('@addCarrier').then((interception) => {
      // Additional verification of the request
      expect(interception.request.method).to.equal('POST');
      expect(interception.request.url).to.include('/api/carriers');
    });
    
    // Wait for any subsequent GET request
    cy.wait('@getCarriersAfterAdd');
    
    // Assert that the new carrier appears in the table
    cy.get('[data-testid="carrier-name"]').should('contain', 'New Test Carrier');
    cy.get('[data-testid="carrier-mc-number"]').should('contain', 'MC123456');
    cy.get('[data-testid="carrier-dot-number"]').should('contain', 'DOT789012');
    cy.get('[data-testid="carrier-status"]').should('contain', 'Pending');

    // Assert that the total number of carriers has increased
    cy.get('[data-testid="total-carriers"]').should('contain', '1');
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

  it('displays all carrier properties correctly in the grid', () => {
    const testCarriers = [
      {
        id: 1,
        name: 'Test Carrier',
        mc_number: 'MC123456',
        dot_number: 'DOT789012',
        phone: '1234567890',
        status: 'Active',
        rating: 4
      },
      {
        id: 2,
        name: 'Another Carrier',
        mc_number: 'MC654321',
        dot_number: 'DOT210987',
        phone: '9876543210',
        status: 'Inactive',
        rating: 2
      }
    ];

    setupCarriersTest(testCarriers);

    testCarriers.forEach((carrier) => {
      cy.get(`[data-testid="carrier-row-${carrier.id}"]`).within(() => {
        cy.get('[data-testid="carrier-name"]').should('contain', carrier.name);
        cy.get('[data-testid="carrier-mc-number"]').should('contain', carrier.mc_number);
        cy.get('[data-testid="carrier-dot-number"]').should('contain', carrier.dot_number);
        cy.get('[data-testid="carrier-status"]').should('contain', carrier.status);
        cy.get('[data-testid="carrier-rating"]').should('contain', carrier.rating);
      });
    });
  });
})