describe('Testing if all our pages are still there', function () {
  it('Visits index', function () {
    cy.visit('/')
  })

  it('Visits Submission page', function () {
    cy.visit('/submit-event')
  })

  it('Visits Our Mission page', function () {
    cy.visit('/our-mission')
  })

  it('Visits Contact page', function () {
    cy.visit('/contact')
  })

  it('Redirects to 404 if wrong page', function () {
    cy.visit('/jibberish', { failOnStatusCode: false })
    cy.title().should('include', '404 Page Not Found - Infinite Industries')
  })
})
