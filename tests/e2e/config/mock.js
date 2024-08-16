/* eslint-disable no-template-curly-in-string */
Cypress.Commands.add('login', () => {
  cy.request({
    method: 'POST',
    url: '${DEV_url}',
    body: {
      email: '${DEV_email}',
      password: '${DEV_password}',
    },
    headers: {
      'x-clientid': '${DEV_clientID}',
    },
  })
    .then((resp) => {
      window.localStorage.setItem('${DEV_token}', resp.body.data.token)
      window.localStorage.setItem('csp4_backoffice_dev_organizationId', resp.body.data.user.Organizations[0].id)
    })
})
