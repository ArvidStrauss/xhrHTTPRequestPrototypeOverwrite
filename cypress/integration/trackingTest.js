/// <reference types="Cypress" />

describe('Tracking', function () {
  before(() => {
    cy.visit('/f/login').wait(2000);

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

    cy.url().should('not.contain', '/f/login');
    cy.wait(400);
    cy.url().should(
      'include',
      '/home/timeline'
    );
  });

  beforeEach(function () {
    Cypress.Cookies.preserveOnce('COYOSESSION');
    console.error('WURSTI! 1');
  });

  context('opening test page', () => {
    it('check page', () => {
      cy.get('.user-name').should('be.visible').should('contain', 'Robert Lang');
    });
    it('check tracking script', () => {
      // debugger
      cy.window().then(($win) => {
        expect($win.coyoTrackingUtils).to.exist;
        expect($win.coyoTrackingDBHelper).to.exist;
        expect($win.coyoClickTracking).to.exist;
      });
    });
  });

  context('pageviews', () => {
    function trackingEvent(type, triggerFn) {
      return new Promise(resolve => {
        cy.window().then($win => {
          cy.document().then($doc => {
            $doc.removeEventListener('MMS:TRACKING:'+type.toUpperCase(),$win.testEventFunction);
            $win.testEventFunction = function(data){
              let config = $win.coyoTrackingUtils.getPageConfig();
              resolve({$win: $win, config: config, tracking: data.detail});
            };
            $doc.addEventListener('MMS:TRACKING:'+type.toUpperCase(),$win.testEventFunction);
            triggerFn();
          });
        });
      });
    }

    beforeEach(() => {
      Cypress.Cookies.preserveOnce('COYOSESSION');
    })

    it('pageview pages', () => {
      cy.wrap(trackingEvent('PAGEVIEW', function(){
        cy.get('.navbar-main a[href="/pages"]').click();
      }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
        expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
        expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('pages'));
      });
    });
    it('pageview workspaces', () => {
      cy.wrap(trackingEvent('PAGEVIEW', function(){
        cy.get('.navbar-main a[href="/workspaces"]').click();
      }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
        expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
        expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('workspaces'));
      });
    });
    it('pageview events', () => {
      cy.wrap(trackingEvent('PAGEVIEW', function(){
        cy.get('.navbar-main a[href="/events"]').click();
      }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
        expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
        expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('events'));
      });
    });
    it('pageview homepage timeline', () => {
      cy.wrap(trackingEvent('PAGEVIEW', function(){
        cy.get('.navbar-main a[href="/home"]').click();
      }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
        expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
        expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('home'));
        expect(tracking.cd.pageTitle).to.equal($win.coyoTrackingUtils.typeNameOverrides('timeline'));
      });
    });
  });
});