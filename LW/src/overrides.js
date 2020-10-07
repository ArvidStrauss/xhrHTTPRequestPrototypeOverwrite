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