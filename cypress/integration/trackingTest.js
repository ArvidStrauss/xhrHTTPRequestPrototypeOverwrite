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

  context('awesome test', () => {
    it('check page', () => {
      cy.get('.user-name').should('be.visible').should('contain', 'Robert Lang');
    });
    it('response', () => {
      cy.server();
      cy.route('GET', 'https://di-tools.t-systems-mms.eu/matomo/matomo.php').as('matomo');
      cy.get('.timeline-widget coyo-timeline-item').first().find('coyo-like-button').first().click();
      cy.wait("@matomo").then(xhr => {
        // you can read the full response from `xhr.response.body`
        cy.log(JSON.stringify(xhr.response.body));
      });
    });
  });
});