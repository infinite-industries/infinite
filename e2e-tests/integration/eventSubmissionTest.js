/// <reference types="Cypress" />

/**
 * The tests in this file are cumulative and must be ran in sequence
 */

context('Event Submission', () => {
  const EVENT_NAME = 'Test Event'
  const ADMIN_USERNAME = Cypress.env('admin_auth_username')
  const ADMIN_PASSWORD = Cypress.env('admin_auth_password')

  // Performs cleanup after all specs in this file have run
  after(() => {
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/')

    cy.contains('.infinite-card', EVENT_NAME)
      .contains('.more-info', 'More Info').click()
      .get('.event-heading')
      .url().then((url) => {
      // open the admin-event-edit page for the event
        cy.visit('/admin-event-edit/' + url.split('/').pop())

        // delete the event
        cy.get('.edit-container button').contains('Delete').click()
        cy.get('.v-dialog.v-dialog--active button').contains('Kill').click()

        // event should no longer be present
        cy.visit('/')
        cy.contains('.infinite-card h3', EVENT_NAME).should('not.exist')
      })
  })

  it('Inputs dummy data into event submission form', () => {
    cy.visit('/submit-event')
    cy.get('.event-title input').type(EVENT_NAME)

    // can't select dates in the past
    // advance calendar one month and select the first
    cy.get('#cal-container .v-date-picker-header > button:last-child').click()
    cy.wait(1000) // wait for calendar animation to complete
    cy.get('#cal-container .v-date-picker-table button').contains('1').click()

    cy.get('.start-hour').type('9')
    cy.get('.start-minute').type('00')
    cy.get('select[name=start_ampm]').select('PM')

    cy.get('.end-hour').type('10')
    cy.get('.end-minute').type('00')
    cy.get('select[name=end_ampm]').select('PM')
    cy.get('.time-confirm:not([disabled])').click()

    // selectFile is a custom command; see cypress/support/commands.js
    cy.get('#event-image').selectFile('images/event_sample_image.jpg')

    cy.get('.venue').focus()
    cy.get('.results-container > :first-child').click()

    cy.get('.brief-description input').type('still testing')
    cy.get('.submitter-email input').type('test@te.st')

    // submit event and wait for promo tools section to expand on success
    cy.get('.submit-container button').click()
    cy.get('.collapsible-content.expanded')
  })

  it('Submitted events not displayed immediately after submission', function () {
    cy.visit('/')
    cy.contains('.infinite-card h3', EVENT_NAME).should('not.exist')
  })

  it('Admin user can verify event', function () {
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/')

    cy.get('#hamburger').click()
    cy.get('#nav-list li').contains('Admin').click()
    cy.location('pathname').should('include', 'admin')
    cy.contains('.calendar-events-table tr:last-child td', EVENT_NAME)
    cy.get('.calendar-events-table tr:last-child a').contains('Edit').click()
    cy.location('pathname').should('include', 'admin-event-edit')
    cy.get('.submitter-email input').should('have.value', 'test@te.st')

    cy.get('button.btn-verify').click()
    cy.get('.calendar-events-table')
    cy.contains('.calendar-events-table tr:last-child td', EVENT_NAME).should('not.exist')
    // cy.get('.alert.alert--dismissible').contains('Success! Event verified.')
  })

  it('Event is displayed after verification', function () {
    cy.visit('/')
    cy.contains('.infinite-card h3', EVENT_NAME).should('exist')
  })
})
