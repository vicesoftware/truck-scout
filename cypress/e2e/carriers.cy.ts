Cypress.on('uncaught:exception', (err) => {
  if (err.message.includes('URL.canParse is not a function')) {
    return false;
  }
});

describe('Carriers Page', () => {
  beforeEach(() => {
    cy.fixture('carriers.json').then((carriersData) => {
      cy.intercept('GET', '/api/carriers', carriersData).as('getCarriers');
    });
    cy.visit('/carriers');
    cy.wait('@getCarriers'); // Wait for the API call to complete
    cy.get('h1').contains('Carriers').should('be.visible'); // Wait for the page title to be visible
  })

  it('displays the carriers list', () => {
    cy.get('table', { timeout: 10000 }).should('be.visible')
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length.gt', 0)
  })

  it('allows searching for carriers', () => {
    const searchTerm = 'Sample Carrier 1'
    cy.get('input[placeholder="Search carriers"]', { timeout: 10000 }).should('be.visible').type(searchTerm)
    cy.get('table tbody tr', { timeout: 10000 }).should('have.length', 1)
    cy.contains('td', searchTerm).should('be.visible')
  })

  it('can add a new carrier', () => {
    const newCarrier = {
      name: 'New Test Carrier',
      mc_number: 'MC123456',
      dot_number: 'DOT789012',
      phone: '123-456-7890',
      status: 'Active'
    }

    cy.intercept('POST', '/api/carriers', (req) => {
      expect(req.body).to.deep.equal(newCarrier)
      req.reply({ statusCode: 200, body: { id: 999, ...newCarrier } })
    }).as('addCarrier')

    cy.contains('button', 'Add New Carrier', { timeout: 10000 }).should('be.visible').click()
    cy.get('form', { timeout: 10000 }).should('be.visible').within(() => {
      cy.get('input[name="name"]').type(newCarrier.name)
      cy.get('input[name="mc_number"]').type(newCarrier.mc_number)
      cy.get('input[name="dot_number"]').type(newCarrier.dot_number)
      cy.get('input[name="phone"]').type(newCarrier.phone)
      cy.get('select[name="status"]').select(newCarrier.status)
      cy.contains('button', 'Save Carrier').click()
    })

    cy.wait('@addCarrier')
    cy.contains('td', newCarrier.name, { timeout: 10000 }).should('be.visible')
  })

  it('can edit an existing carrier', () => {
    const updatedName = 'Updated Carrier Name'
    
    cy.intercept('PUT', '/api/carriers', (req) => {
      expect(req.body.name).to.equal(updatedName)
      req.reply({ statusCode: 200, body: { ...req.body, name: updatedName } })
    }).as('updateCarrier')

    cy.get('table tbody tr').first().within(() => {
      cy.get('button').click()
    })
    cy.contains('Edit Carrier').click()
    cy.get('form').within(() => {
      cy.get('input[name="name"]').clear().type(updatedName)
      cy.contains('button', 'Update Carrier').click()
    })

    cy.wait('@updateCarrier')
    cy.contains('td', updatedName).should('be.visible')
  })

  it('can delete a carrier', () => {
    cy.intercept('DELETE', '/api/carriers', {
      statusCode: 200,
      body: { message: 'Carrier deleted successfully' }
    }).as('deleteCarrier')

    cy.get('table tbody tr').first().within(() => {
      cy.get('button').click()
    })
    cy.contains('Delete Carrier').click()
    cy.on('window:confirm', () => true)

    cy.wait('@deleteCarrier')
    cy.contains('Carrier deleted successfully').should('be.visible')
  })

  it('paginates the carriers list', () => {
    cy.get('.pagination button').contains('2').click()
    cy.url().should('include', 'page=2')
    cy.get('table tbody tr').should('have.length.gt', 0)
  })

  it('exports carriers to CSV', () => {
    cy.contains('button', 'Export').click()
    cy.readFile('cypress/downloads/carriers_export.csv').should('exist')
  })
})