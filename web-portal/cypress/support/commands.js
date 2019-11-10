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

  const options = {
    method: 'POST',
    url: Cypress.env('auth_url'),
    body: {
      grant_type: 'password',
      username: username,
      password: password,
      audience: Cypress.env('auth_audience'),
      scope: 'openid profile',
      client_id: Cypress.env('auth_client_id'),
      client_secret: Cypress.env('auth_client_secret')
    }
  }

  return cy.request(options).then((resp) => {
    return resp.body
  }).then(async (body) => {
    const { access_token, expires_in, id_token } = body

    const auth0State = {
      nonce: '',
      state: 'some-random-state'
    }

    const callbackUrl = `/callback#access_token=${access_token}&scope=openid&id_token=${id_token}` +
      `&expires_in=${expires_in}&token_type=Bearer&state=${auth0State.state}`

    await cy.visit(callbackUrl, {
      onBeforeLoad(win) {
        win.document.cookie = 'com.auth0.auth.some-random-state=' + JSON.stringify(auth0State)
      }
    })

    cy.visit(url)
  })
})
