import { basename } from 'path'

Cypress.Commands.add('selectFile', { prevSubject: 'element' }, (subject, fileName) => {
  cy.fixture(fileName).then(function (res) {
    const dt = new DataTransfer()

    const file = new File([res], basename(fileName));
    file.type = "image/jpeg";

    dt.items.add(file)

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
