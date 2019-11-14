context('Authorization', () => {
  const ADMIN_USERNAME = Cypress.env('admin_auth_username')
  const ADMIN_PASSWORD = Cypress.env('admin_auth_password')

  it('Should initially show login button and no admin button', function () {
    cy.visit('/')
    cy.get('#hamburger').click()

    cy.get('#nav-list li').contains('Admin').should('not.exist')
    cy.get('#nav-list li').contains('Login')
  })

  it('Should logout and admin when logged in as admin and revert when logged out', function () {
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/')
    cy.get('#hamburger').click()

    cy.get('#nav-list li').contains('Admin')
    cy.get('#nav-list li').contains('Logout')
    cy.get('#nav-list li').contains('Login').should('not.exist')

    // logout
    cy.get('#nav-list li').contains('Logout').click()

    cy.get('#hamburger').click()
    cy.get('#nav-list li').contains('Login')
    cy.get('#nav-list li').contains('Logout').should('not.exist')
    cy.get('#nav-list li').contains('Admin').should('not.exist')
  })
})
