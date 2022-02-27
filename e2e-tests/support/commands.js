import { basename } from 'path'

Cypress.Commands.add('selectFile', { prevSubject: 'element' }, (subject, file) => {
  cy.fixture(file).then(function (res) {
    const dt = new DataTransfer()

    dt.items.add(new File([res], basename(file)))

    subject[0].files = dt.files
    subject[0].dispatchEvent(new Event('change', { bubbles: true }))
  })
})

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
