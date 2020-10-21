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
  var notifications = document.querySelector('#notification-toggle');
  var openPrototypeTracking = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function(e) {
      if(this.responseURL.match(/notifications/) && notifications.getAttribute('data-mms-opened') === null) {
        try {
          var lastopen = localStorage.getItem('mms.notifications.lastopen') || 'activity';
          // var tabs = document.querySelectorAll('#notifications-dialog .notifications-tabs li a');
          // for (var i = 0; i < tabs.length; i++) {
          //   tabs[i].addEventListener('click', function(){
          //     var tabname = this.getAttribute('aria-controls').split('-')[2];
          //     localStorage.setItem('mms.notifications.lastopen',tabname);
          //   });
          // }
          if(lastopen && lastopen.length) {
            var activity = document.querySelector('#notifications-dialog .notifications-tabs li a[aria-controls="notification-panel-'+lastopen+'"]');
            var e = document.createEvent('HTMLEvents');
            e.initEvent('click', false, true);
            activity.dispatchEvent(e);
          }
          notifications.setAttribute('data-mms-opened','');
        } catch(e) {
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