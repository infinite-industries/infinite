// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// custom command for populating an input for file upload
// it's hard to programmatically change an input[type=file]'s files property
// for security reasons; it can be overridden with a FileList, which cannot
// be created on its own, but we can get one from a DataTransfer object
// (used with drop events)
Cypress.Commands.add('selectFile', { prevSubject: 'element' }, (subject, file, options) => {
  cy.fixture(file).then(function(res) {
    var dt = new DataTransfer()
    dt.items.add(new File([res], 'event_sample_image.jpg'))
    subject[0].files = dt.files
    subject[0].dispatchEvent(new Event('change', { bubbles: true }))
  })
})

import { getIDTokenForUser, getAccessTokenForUser } from './login_utils'

Cypress.Commands.add('visitAsUser', {}, (url, user, options) => {
  // load private key for signing token (can't get `fs` to work in this context)
  cy.fixture(Cypress.env('auth_token_signing_key')).then(function(key) {
  // get user info from file
    cy.fixture('users/' + user + '.json').then(function(res) {
      cy.visit(url, {
        onBeforeLoad: function(win) {
          win.localStorage.setItem('access_token', getAccessTokenForUser(res, key))
          win.localStorage.setItem('id_token', getIDTokenForUser(res, key))
        }
      })
    })
  })
})
