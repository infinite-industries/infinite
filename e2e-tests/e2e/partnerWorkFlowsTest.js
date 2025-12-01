/// <reference types="Cypress" />

context('Partner Work Flows', () => {
  const PARTNER_NAME = 'random-displacement-shipping'
  const PARTNER_LOGO_URL = '/images/partners/random-displacement-shipping.png'
  const PARTNER_ADMIN_USERNAME = Cypress.env('partner_admin_username')
  const PARTNER_ADMIN_PASSWORD = Cypress.env('partner_admin_password')
  const ADMIN_USERNAME = Cypress.env('admin_auth_username')
  const ADMIN_PASSWORD = Cypress.env('admin_auth_password')

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

  it('Submits event with partner query parameter', () => {
    const guid = crypto.randomUUID()
    const PARTNER_EVENT_NAME = `Partner Test Event-${guid}`
    
    submitEvent(PARTNER_EVENT_NAME, PARTNER_ADMIN_USERNAME, PARTNER_ADMIN_PASSWORD)
    
    // Login as partner-admin
    cy.visitAsUser(PARTNER_ADMIN_USERNAME, PARTNER_ADMIN_PASSWORD, '/')
    
    cy.wait(750) // hydration?
    cy.get('#hamburger').click()
    
    // Verify Partner Admin link exists and Admin link does not exist
    cy.get('#nav-list li').contains('a', 'Partner Admin').should('exist')
    // Check that no link with exact text "Admin" exists (not "Partner Admin")
    cy.get('#nav-list li a').then(($links) => {
      const adminLinks = Array.from($links).filter(link => link.textContent.trim() === 'Admin')
      expect(adminLinks.length).to.equal(0)
    })
    
    // Click Partner Admin link
    cy.get('#nav-list li').contains('a', 'Partner Admin').click()
    cy.location('pathname').should('include', 'partner-admin')
    
    // Verify the event appears in unverified events list
    cy.get('.unverified-events').contains('tr', PARTNER_EVENT_NAME).should('exist')
    
    // Verify partner logo is displayed in the OWNER column
    cy.get('.unverified-events').contains('tr', PARTNER_EVENT_NAME).within(() => {
      cy.get('td').first().find('img')
        .should('exist')
        .should('have.attr', 'src', PARTNER_LOGO_URL)
        .should('have.attr', 'alt', PARTNER_NAME)
    })
    
    // Click Edit on the event to navigate to edit page
    cy.get('.unverified-events').contains('tr', PARTNER_EVENT_NAME).contains('Edit').click()
    cy.location('pathname').should('include', 'admin-event-edit')
    
    // Verify the event
    cy.get('button.btn-verify').click()
    
    // Should redirect back to partner-admin page
    cy.location('pathname').should('include', 'partner-admin')
    
    // Verify the event is no longer in unverified events list
    cy.get('.unverified-events').contains('tr', PARTNER_EVENT_NAME).should('not.exist')
    
    // Verify the event is now in verified events list
    cy.get('.verified-events').contains('tr', PARTNER_EVENT_NAME).should('exist')
    
    // Navigate to edit page to delete the event
    cy.get('.verified-events').contains('tr', PARTNER_EVENT_NAME).contains('Edit').click()
    cy.location('pathname').should('include', 'admin-event-edit')
    
    // Delete the event
    cy.get('.edit-container button').contains('Delete').click()
    cy.get('[role="dialog"] button').contains('Kill').click()
    
    // Verify event is deleted and we're redirected
    cy.location('pathname').should('include', 'partner-admin')
    cy.get('.verified-events').contains('tr', PARTNER_EVENT_NAME).should('not.exist')
  })

  it('Partner admin cannot see events submitted without partner query parameter', () => {
    const guid = crypto.randomUUID()
    const NON_PARTNER_EVENT_NAME = `Non-Partner Test Event-${guid}`
    
    // Submit event without partner query parameter
    submitEvent(NON_PARTNER_EVENT_NAME, PARTNER_ADMIN_USERNAME, PARTNER_ADMIN_PASSWORD, null)
    
    // Login as partner-admin
    cy.visitAsUser(PARTNER_ADMIN_USERNAME, PARTNER_ADMIN_PASSWORD, '/')
    
    cy.wait(750) // hydration?
    cy.get('#hamburger').click()
    
    // Click Partner Admin link
    cy.get('#nav-list li').contains('a', 'Partner Admin').click()
    cy.location('pathname').should('include', 'partner-admin')
    
    // Verify the event does NOT appear in unverified events list
    cy.get('.unverified-events').contains('tr', NON_PARTNER_EVENT_NAME).should('not.exist')
    
    // Verify the event does NOT appear in verified events list
    cy.get('.verified-events').contains('tr', NON_PARTNER_EVENT_NAME).should('not.exist')
    
    // Clean up: Login as infinite-admin and delete the event
    cy.visitAsUser(ADMIN_USERNAME, ADMIN_PASSWORD, '/')
    
    cy.wait(750) // hydration?
    cy.get('#hamburger').click()
    
    // Click Admin link
    cy.get('#nav-list li').contains('a', 'Admin').click()
    cy.location('pathname').should('include', 'admin')
    
    // Verify the event appears in unverified events list (admin can see it)
    cy.get('.unverified-events').contains('tr', NON_PARTNER_EVENT_NAME).should('exist')
    
    // Click Edit on the event to navigate to edit page
    cy.get('.unverified-events').contains('tr', NON_PARTNER_EVENT_NAME).contains('Edit').click()
    cy.location('pathname').should('include', 'admin-event-edit')
    
    // Delete the event
    cy.get('.edit-container button').contains('Delete').click()
    cy.get('[role="dialog"] button').contains('Kill').click()
    
    // Verify event is deleted and we're redirected back to admin page
    cy.location('pathname').should('include', 'admin')
    cy.get('.unverified-events').contains('tr', NON_PARTNER_EVENT_NAME).should('not.exist')
  })


  it('Preserves partner query parameter when navigating', () => {
    // Visit home page with partner query parameter
    cy.visit(`/?partner=${PARTNER_NAME}`)

    // Verify partner query parameter is present
    cy.url().should('include', `partner=${PARTNER_NAME}`)

    cy.wait(1000) // hydration?

    // Click on the "SUBMIT" button in the top right toolbar
    cy.get('#submit').click()

    // Wait for navigation to complete and middleware to process
    // The middleware should add the partner param, so wait for it to appear
    cy.url({ timeout: 10000 }).should('include', '/submit-event')
    cy.url({ timeout: 5000 }).should('include', `partner=${PARTNER_NAME}`)
  })

  // === Helper Functions ===
  function submitEvent(eventTitle, userName, userPassword, partnerName = PARTNER_NAME) {
    const EVENT_EMAIL = 'partner-test@te.st'
    
    const url = partnerName ? `/submit-event?partner=${partnerName}` : '/submit-event'
    cy.visit(url)
    
    // Verify partner information is displayed only if partner is provided
    if (partnerName) {
      cy.get('.partner').should('exist')
    } else {
      cy.get('.partner').should('not.exist')
    }
    
    // Fill out event submission form
    cy.get('.event-title input').type(eventTitle)
    
    cy.get('.event-mode input[value="in-person"]').check()
    cy.get('.event-category input[value="single-day-event"]').check()
    
    // Advance calendar one month and select the first day
    cy.get('#cal-container .flatpickr-next-month').click()
    cy.wait(1000) // wait for calendar animation to complete
    cy.get('#cal-container .flatpickr-day').contains('1').click()
    
    cy.get('.start-hour').type('9')
    cy.get('.start-minute').type('00')
    cy.get('select[name=start_ampm]').select('PM')
    
    cy.get('.end-hour').type('10')
    cy.get('.end-minute').type('00')
    cy.get('select[name=end_ampm]').select('PM')
    cy.get('.date-time-picker_new-date:not([disabled])').click()
    
    cy.get('.venue').focus()
    cy.get('.results-container > :first-child').click()
    
    // selectFile is a custom command; see cypress/support/commands.js
    cy.get('#event-image').selectFile('fixtures/images/event_sample_image.jpg')
    
    cy.get('.brief-description input').type('partner event test')
    cy.get('.submitter-email input').type(EVENT_EMAIL)
    
    // Preview submission
    cy.get('.submit-container button').click()
    cy.get('.event-preview').should('exist')
    cy.get('.event .event-heading h1').contains(eventTitle).should('exist')
    
    // Submit event
    cy.get('.preview-controls button:first-child').click()
    cy.get('h1.centered-header').contains('Thank you!').should('exist')
  }
})
