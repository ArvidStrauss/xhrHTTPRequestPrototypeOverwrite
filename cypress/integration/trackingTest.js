describe('Tracking', function () {
  before(() => {
    cy.visit('https://192.168.57.68/f/login').wait(1000);

    cy.get('[data-test=input-username]')
      .should('be.visible')
      .wait(300)
      .type('rl')
      .wait(300);
    cy.get('[data-test=input-password]')
      .should('be.visible')
      .type('demo')
      .wait(300);
    cy.get('[data-test=button-submit]').should('be.visible').click().wait(500);

    cy.url().should('not.equal', 'https://192.168.57.68/f/login');
    cy.wait(400);
    cy.url().should(
      'equal',
      'https://192.168.57.68/home/timeline'
    );
  });

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('COYOSESSION');
  });

  context('opening test page', () => {
    it('check page', () => {
      cy.get('.user-name').should('be.visible').should('contain', 'Robert Lang');
    });
  });

  context('pageviews', () => {
    it('pageview homepage', () => {
      
    });
  });
});