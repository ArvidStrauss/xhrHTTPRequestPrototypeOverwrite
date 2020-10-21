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
coyoTrackingUtils.onContentReady(function(){
  var openPrototypeTracking = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function() {
    this.addEventListener('load', function(e) {
      if(this.responseURL.match(/notifications/)){
        var lastopen = localStorage.getItem('mms.notifications.lastopen') || 1;
        lastopen = parseInt(lastopen);
        var tabs = document.querySelectorAll('#notifications-dialog .notifications-tabs li a');
        for (var i = 0; i < tabs.length; i++) {
          tabs[i].classList.remove('active');
          tabs[i].setAttribute('data-num',i);
          tabs[i].addEventListener('click', function(){
            var num = parseInt(this.getAttribute('data-num'));
            localStorage.setItem('mms.notifications.lastopen',num);
          });
          // debugger;
        }
        tabs[lastopen].classList.add('active');
      }
    });
    openPrototypeTracking.apply(this, arguments);
  };
});
// ###############################################
// #### Show first activity tab in notification bell
// ###############################################