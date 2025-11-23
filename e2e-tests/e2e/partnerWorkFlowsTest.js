/// <reference types="Cypress" />

context('Partner Work Flows', () => {
  const PARTNER_NAME = 'random-displacement-shipping'
  const PARTNER_LOGO_URL = '/images/partners/random-displacement-shipping.png'

  it('Styles the submission page based on partnery query param', () => {
    cy.visit(`/submit-event?partner=${PARTNER_NAME}`)
    
    // Verify partner information and logo are displayed on submission page
    cy.get('.partner').should('exist')
    cy.get('.partner').contains('Partnering with')
    cy.get('.partner img')
      .should('exist')
      .should('have.attr', 'alt', PARTNER_NAME)
      .should('have.attr', 'src', PARTNER_LOGO_URL)
  })

  xit('Preserves partner query parameter when navigating', () => {
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
  })
})
