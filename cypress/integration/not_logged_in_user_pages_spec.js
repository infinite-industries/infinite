describe('Testing if all our pages are still there', function() {
  it('Visits index', function() {
    cy.visit('http://localhost:7779/')
  })

  it('Visits Submission page', function() {
    cy.visit('http://localhost:7779/submit-event')
  })

  it('Visits About page', function() {
    cy.visit('http://localhost:7779/about')
  })

  it('Visits Contact page', function() {
    cy.visit('http://localhost:7779/contact')
  })

  it('Redirects to 404 if wrong page', function() {
    cy.visit('http://localhost:7779/jibberish')
    cy.title().should('include', 'Infinite Industries: Error')
  })

})
