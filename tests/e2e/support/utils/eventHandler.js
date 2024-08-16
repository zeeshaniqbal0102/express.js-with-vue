/* eslint-disable no-unused-vars */
Cypress.Commands.add('eventHandler', () => {
  Cypress.on('uncaught:exception', (_err, _runnable) => false)
})
