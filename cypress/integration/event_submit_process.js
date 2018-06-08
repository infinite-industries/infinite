describe('Testing event submission flow', function() {

  beforeEach(function(){
    cy.visit('/submit-event')
  })

  // it('Visits Submission page and check all fields', function() {
  //   cy.contains('.form-label', 'Event Title')
  //   cy.contains('.form-label', 'Event Date')
  //   cy.contains('.form-label', 'Event Time')
  //   cy.contains('.form-label', 'Event Image')
  //   cy.contains('.form-label', 'Social Media Image')
  //   cy.contains('.form-label', 'Select a Venue')
  //   cy.contains('.form-label', 'Brief Description')
  //   cy.contains('.form-label', 'Admission Fee')
  //   cy.contains('.form-label', 'Your Contact Email')
  //   cy.contains('.form-label', 'Event Website Link')
  //   cy.contains('.form-label', 'Ticket Link')
  //   cy.contains('.form-label', 'Facebook Event Link')
  //   cy.contains('.form-label', 'Eventbrite Link')
  //
  //   cy.contains('Full Event Description')
  // })

  it('Inputs dummy data into event submission form', function(){
    cy.get('.event-title input').type("Test Event")

    cy.get('.event-start-date i').click()
    cy.contains('13').click()       // lucky number ;)

    cy.get('.start-time .hour').type("9")
    cy.get('.start-time .minute').type("00")

    cy.get('.stop-time .hour').type("10")
    cy.get('.stop-time .minute').type("00")

    // selectFile is a custom command; see cypress/support/commands.js
    cy.get('#event-image').selectFile('images/event_sample_image.jpg');

    cy.get('.brief-description input').type("still testing")
    cy.get('.submitter-email input').type("test@te.st")


  })
})
