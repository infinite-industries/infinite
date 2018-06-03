describe('Testing if all our pages are still there', function() {
  it('Visits index', function() {
    cy.visit('/')
  })

  it('Visits Submission page', function() {
    cy.visit('/submit-event')
  })

  it('Visits About page', function() {
    cy.visit('/about')
  })

  it('Visits Contact page', function() {
    cy.visit('/contact')
  })

  it('Redirects to 404 if wrong page', function() {
    cy.visit('/jibberish')
    cy.title().should('include', 'Infinite Industries: Error')
  })

})
