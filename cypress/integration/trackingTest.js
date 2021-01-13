/// <reference types="Cypress" />

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
    Cypress.Cookies.defaults({
      preserve: ['COYOSESSION']
    })
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

  // context('pageviews', () => {

  //   beforeEach(function () {
  //     Cypress.Cookies.defaults({
  //       preserve: ['COYOSESSION']
  //     })
  //     cy
  //       .getCookie('COYOSESSION', {log: true})
  //       .then((cookie) => console.log('Cookie: ' + JSON.stringify(cookie)))
  //   });

  //   it('pageview pages', () => {
  //     cy.wrap(trackingEvent('PAGEVIEW', function(){
  //       cy.get('.navbar-main a[href="/pages"]').click();
  //     }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
  //       expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
  //       expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('pages'));
  //     });
  //   });
  //   it('pageview workspaces', () => {
  //     cy.wrap(trackingEvent('PAGEVIEW', function(){
  //       cy.get('.navbar-main a[href="/workspaces"]').click();
  //     }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
  //       expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
  //       expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('workspaces'));
  //     });
  //   });
  //   it('pageview events', () => {
  //     cy.wrap(trackingEvent('PAGEVIEW', function(){
  //       cy.get('.navbar-main a[href="/events"]').click();
  //     }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
  //       expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
  //       expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('events'));
  //     });
  //   });
  //   it('pageview homepage timeline', () => {
  //     cy.wrap(trackingEvent('PAGEVIEW', function(){
  //       cy.get('.navbar-main a[href="/home"]').click();
  //     }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
  //       expect(tracking.action_name).to.equal($win.coyoTrackingUtils.pageIdToString(config.contentGroup));
  //       expect(tracking.cd.pageType).to.equal($win.coyoTrackingUtils.typeNameOverrides('home'));
  //       expect(tracking.cd.pageTitle).to.equal($win.coyoTrackingUtils.typeNameOverrides('timeline'));
  //     });
  //   });
  // });

  context('events/actions', () => {

    before(() => {
      cy.get('.navbar-main a[href="/home"]').click();
    })

    beforeEach(function () {
      Cypress.Cookies.defaults({
        preserve: ['COYOSESSION']
      })
      cy
        .getCookie('COYOSESSION', {log: true})
        .then((cookie) => console.log('Cookie: ' + JSON.stringify(cookie)))
    });

    it('homepage -> timelineitem -> like', () => {
      cy.wrap(trackingEvent('EVENT', function(){
        cy.document().then($doc => {
          console.debug($doc.querySelectorAll('coyo-timeline-stream coyo-timeline-item coyo-like-button button')[0]); 
          cy.debug();
          cy.get('[data-test="like-button"]').first().click();
          // cy.get('coyo-timeline-stream coyo-timeline-item coyo-like-button button').first().click();
        });
      }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
        expect(tracking.e_a).to.equal($win.coyoTrackingUtils.typeNameOverrides('like'));
        expect(tracking.e_c).to.equal($win.coyoTrackingUtils.typeNameOverrides('timeline-item'));
        expect(tracking.e_n).to.equal('robert-lang >> Allem!');
        expect(tracking.cd.originType).to.equal($win.coyoTrackingUtils.typeNameOverrides('users'));
        expect(tracking.cd.originTitle).to.equal('robert-lang');
        expect(tracking.cd.pageType).to.equal('Timeline');
        expect(tracking.cd.pageTitle).to.equal($win.coyoTrackingUtils.typeNameOverrides('homepage'));
      });
    });
    // it('homepage -> timelineitem -> unlike', () => {
    //   cy.wrap(trackingEvent('EVENT', function(){
    //     cy.get('coyo-timeline-stream coyo-timeline-item coyo-like-button button').first().click();
    //   }),{ timeout: 10000 }).then( ({$win, config, tracking}) => {
    //     expect(tracking.e_a).to.equal($win.coyoTrackingUtils.typeNameOverrides('unlike'));
    //     expect(tracking.e_c).to.equal($win.coyoTrackingUtils.typeNameOverrides('timeline-item'));
    //     expect(tracking.e_n).to.equal('robert-lang >> Allem!');
    //     expect(tracking.cd.originType).to.equal($win.coyoTrackingUtils.typeNameOverrides('users'));
    //     expect(tracking.cd.originTitle).to.equal('robert-lang');
    //     expect(tracking.cd.pageType).to.equal('Timeline');
    //     expect(tracking.cd.pageTitle).to.equal($win.coyoTrackingUtils.typeNameOverrides('homepage'));
    //   });
    // });
  });
});