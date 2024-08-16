context('API Login Test', () => {
  it('Goto dashboard Page', () => {
    cy.clearLocalStorage()
    cy.login()
      .then(() => {
        cy.wait(500)
        cy.visit('/invoice/list')
        cy.url()
          .should('include', '/invoice/list')
      })
  })
})
