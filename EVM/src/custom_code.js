/** ######################## **/
/* _$PROJECT$_ Customization Code _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

/**
 * This file contains custom code not related to tracking
 * It's used to change UI and its behavior
 * it's packed and attached at the end of our build
 */

// ###############################################
// #### Show first activity tab in notification bell
// ###############################################
coyoTrackingUtils.onContentReady(function() {
  var notifications = document.querySelector('.main-navigation ngx-notification-btn');
  var openPrototypeTracking = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function(e) {
      if (this.responseURL && this.responseURL.match(/notifications\?category=DISCUSSION/gi) && notifications) {
        try {
          // set click listener for storing last opened tab
          var tabs = document.querySelectorAll('coyo-notification-center .tabs-header button.tab-label');
          for (var i = 0; i < 2; i++) {
            tabs[i].setAttribute('tabId', i);
            tabs[i].addEventListener('click', function(event) {
              localStorage.setItem('mms.notifications.tab.lastopen', event.currentTarget.getAttribute('tabId'));
            });
          }

          var lastopen = localStorage.getItem('mms.notifications.tab.lastopen') || 1;
          if (lastopen > 0) {
            var e = document.createEvent('HTMLEvents');
            e.initEvent('click', false, true);
            tabs[lastopen].dispatchEvent(e);
          }
        } catch (e) {
          console.warn(e);
        }
      }
    });
    openPrototypeTracking.apply(this, arguments);
  };
});
// ###############################################
// #### Show first activity tab in notification bell
// ###############################################