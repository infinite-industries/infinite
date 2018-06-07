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

    cy.fixture('images/event_sample_image.jpg').then(function(res) {
      // it's hard to programmatically change an input[type=file]'s files property
      // for security reasons; it can be overridden with a FileList, which cannot
      // be created on its own, but we can get one from a DataTransfer object
      // (used with drop events)
      var dt = new DataTransfer();
      dt.items.add(new File([res], 'event_sample_image.jpg'));
      return cy.get('#event-image').then(function(els) {
        var el = els[0];
        el.files = dt.files;
        el.dispatchEvent(new Event('change', { bubbles: true }));
      })
    });

    cy.get('.brief-description input').type("still testing")
    cy.get('.submitter-email input').type("test@te.st")


  })
})
