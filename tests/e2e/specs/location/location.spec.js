import {
  locationList,

} from '@Labels/tags'

beforeEach(() => {
  cy.login()
  cy.visit('/location/dashboard')
  cy.eventHandler()
})

describe('Location Test', () => {
  it('Search test', () => {
    cy.get(locationList.new)
      .click()
    cy.wait(500)
    cy.url()
      .should('include', '/location/create')
  })
})
