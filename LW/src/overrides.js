/** ######################## **/
/* _$PROJECT$_ Custom Overrides _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

/**
 * This file contains all customer specific adjustments in addition to the feature toggles
 */

// this replaces the internal coyo-names by the ones, the customer wants (like german translations)
coyoTrackingUtils.OVERRIDES = {
  // this struct is used by coyoTrackingUtils.typeNameOverrides and replaces everything in eventtracking params and custom dimensions
  TYPE: {
      'workspaces': 'Groups',
      'workspace': 'Groups',
  },
  // this struct is used by coyoTrackingUtils.typeNameOverridesPageId and replaces keywords in the actionurl / pageid
  PAGEID: {
      'workspaces': 'groups',
  },
}

// you can override complete functionality like this:
// coyoTrackingUtils.translateText = function(text) { ... }

// custom click tracking
document.addEventListener('click', function(evt) {
  var item = evt.target && evt.target.parentElement && evt.target.parentElement.className === 'share-item-more' ? evt.target.parentElement : null;
  var closed = item && item.children.length && item.children[0].classList.contains('zmdi-chevron-up') ? true : false;
  if(item && closed) {
    try{
      var originItem = coyoTrackingDBHelper.getObjectData(item.closest('article').children[0].getAttribute('id').replace('item-',''));
    }
    catch(e){console.error(e);var originItem = null;}
    console.warn(originItem);
    sendTrackingEvent(coyoTrackingUtils.typeNameOverrides('Timeline-Item'), coyoTrackingUtils.typeNameOverrides('Click'), coyoTrackingUtils.typeNameOverrides('ReadMore'), originItem);
  }
});
