Cypress.Commands.add('visitAsUser', {}, (username, password, url) => {
  Cypress.log({
    name: 'loginViaAuth0'
  })

  cy.visit("/login")
  cy.get("input.login-page__username").type(username)
  cy.get("input.login-page__password").type(password)
  cy.get(".login-page__login-btn").click()
  cy.location('pathname').should('not.include', 'login')
  cy.visit(url)
})
