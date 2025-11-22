/// <reference types="Cypress" />

context('Partner Query Parameter Persistence', () => {
  const PARTNER_NAME = 'random-displacement-shipping'
  const PARTNER_LOGO_URL = '/images/partners/random-displacement-shipping.png'

  it('Preserves partner query parameter when navigating from home to submission page', () => {
    // Visit home page with partner query parameter
    cy.visit(`/?partner=${PARTNER_NAME}`)
    cy.reload(true)
    // Verify partner query parameter is present in URL
    cy.url().should('include', `partner=${PARTNER_NAME}`)
    
    // Click on the "SUBMIT" button in the top right toolbar
    cy.get('#submit').click()
    
    // Wait for navigation to complete and middleware to process
    // The middleware should add the partner param, so wait for it to appear
    cy.url({ timeout: 10000 }).should('include', '/submit-event')
    cy.url({ timeout: 5000 }).should('include', `partner=${PARTNER_NAME}`)
    
    // Verify partner information is displayed on submission page
    cy.get('.partner').should('exist')
    cy.get('.partner').contains('Partnering with')
    cy.get('.partner img')
      .should('exist')
      .should('have.attr', 'alt', PARTNER_NAME)
      .should('have.attr', 'src', PARTNER_LOGO_URL)
  })

  xit('Preserves partner query parameter when navigating via submit button', () => {
    // Visit home page with partner query parameter
    cy.visit(`/?partner=${PARTNER_NAME}`)
    
    // Verify partner query parameter is present
    cy.url().should('include', `partner=${PARTNER_NAME}`)
    
    // Click on the "SUBMIT" button in the top right toolbar
    cy.get('#submit').click()
    
    // Wait for navigation to complete and middleware to process
    // The middleware should add the partner param, so wait for it to appear
    cy.url({ timeout: 10000 }).should('include', '/submit-event')
    cy.url({ timeout: 5000 }).should('include', `partner=${PARTNER_NAME}`)
    
    // Verify partner information is displayed
    cy.get('.partner').should('exist')
    cy.get('.partner').contains('Partnering with')
    cy.get('.partner img')
      .should('exist')
      .should('have.attr', 'alt', PARTNER_NAME)
  })
})

