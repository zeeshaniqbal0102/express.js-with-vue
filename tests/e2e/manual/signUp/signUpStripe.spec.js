import {
  signUp,
  login,
  newOrganization,
} from '@Labels/tags'

// storing login and password for newly created user
let userEmail
// use of faker lib
const firstName = cy.faker.name.firstName()
const lastName = cy.faker.name.lastName()
const businessName = cy.faker.company.companyName()
const addressLine1 = cy.faker.address.streetAddress()
const city = cy.faker.address.city()
const zipCode = cy.faker.address.zipCode()

describe('signup test with stripe', () => {
  it('positive test signup without validation and checks', () => {
    cy.visit('/signup')
    cy.wait(500)
    cy.get(signUp.firstName)
      .type(firstName)
    cy.get(signUp.lastName)
      .type(lastName)
    cy.generateRandomString(5)
      .then((generateRandomString) => {
        cy.get(signUp.email)
          .type(`${generateRandomString}@cellsmarttest.biz`)
        userEmail = `${generateRandomString}@cellsmarttest.biz`
      })
    cy.get(signUp.password)
      .type(Cypress.env('password'))
    cy.get(signUp.confirmPassword)
      .type(Cypress.env('password'))
    cy.get(signUp.nextBtn)
      .click()
  })
  it('login with created user for stripe', () => {
    cy.eventHandler()
    cy.visit('/')
    cy.wait(500)
    cy.get(login.email)
      .type(userEmail)
    cy.get(login.password)
      .type(Cypress.env('password'))
    cy.get(login.submitBtn)
      .click()
    cy.wait(200)
    cy.generateRandomString(8)
      .then((generateRandomString) => {
        cy.get(newOrganization.name)
          .type(generateRandomString)
      })
    cy.generateRandomNumber(10)
      .then((generateRandomNumber) => {
        cy.get(newOrganization.phone)
          .type(generateRandomNumber)
      })
    cy.get(newOrganization.email)
      .type(userEmail)
    cy.get(newOrganization.continueBtn)
      .click()
    cy.wait(500)
    cy.get(newOrganization.stageTwo.businessName)
      .type(businessName)
      .should('have.value', businessName)
    cy.get(newOrganization.stageTwo.addressLine1)
      .type(addressLine1, {
        force: true,
      })
    cy.get(newOrganization.stageTwo.city)
      .type(city, {
        force: true,
      })
    cy.get(newOrganization.stageTwo.state)
      .click()
      .type('Alberta{Enter}')
    cy.get(newOrganization.stageTwo.zipCode)
      .type(zipCode, {
        force: true,
      })
    cy.get(newOrganization.stageTwo.country)
      .click()
      .type('Pakistan{Enter}')
    cy.get(newOrganization.stageTwo.continue)
      .click()
    cy.wait(500)
    cy.get(newOrganization.stageThree.plans)
      .eq(1)
      .click({
        force: true,
      })
    // Stripe adding valid card
    cy.get('.StripeElement iframe').then(($iframe) => {
      const $doc = $iframe.contents()
      cy.wrap($doc.find('input[name=cardnumber]')[0])
        .type('4242424242424242022512354600')
    })
    cy.get(newOrganization.stageThree.create)
      .click()
    cy.wait(10000)
    cy.url()
      .should('include', '/location/dashboard')
  })
})
