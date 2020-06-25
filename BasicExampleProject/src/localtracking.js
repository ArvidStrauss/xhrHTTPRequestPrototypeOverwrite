/** ######################## **/
/* _$PROJECT$_ Custom Code _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

// Adjust matomo tracking settings here
// If you adjust the following params, you have to adjust the src of the image tag above aswell
const MATOMO_TARGET_ID = '0';
const MATOMO_TARGET_PHP = 'https://di-tools.t-systems-mms.eu/matomo/matomo.php';
const MATOMO_TARGET_JS = 'https://di-tools.t-systems-mms.eu/matomo/matomo.js';
const MATOMO_HEARTBEAT = 5;

const CUSTOMDIMENSION_PAGETYPE = 1
const CUSTOMDIMENSION_PAGETITLE = 2
const CUSTOMDIMENSION_APPTYPE = 3
const CUSTOMDIMENSION_APPTITLE = 4
const CUSTOMDIMENSION_CONTENTTITLE = 5
const CUSTOMDIMENSION_PAGETYPE_EVENT = 6
const CUSTOMDIMENSION_PAGETITLE_EVENT = 7
const CUSTOMDIMENSION_APPTYPE_EVENT = 8
const CUSTOMDIMENSION_APPTITLE_EVENT = 9

const CUSTOMDIMENSION_PAGETYPE_VISIT = 10
const CUSTOMDIMENSION_PAGETITLE_VISIT = 11
const CUSTOMDIMENSION_APPTYPE_VISIT = 12
const CUSTOMDIMENSION_APPTITLE_VISIT = 13
const CUSTOMDIMENSION_CONTENTTITLE_VISIT = 14
const CUSTOMDIMENSION_PAGETYPE_EVENT_VISIT = 15
const CUSTOMDIMENSION_PAGETITLE_EVENT_VISIT = 16
const CUSTOMDIMENSION_APPTYPE_EVENT_VISIT = 17
const CUSTOMDIMENSION_APPTITLE_EVENT_VISIT = 18

// list timeline item tracked users here with profile uri endpoint
// posts by these users in a timeline wont be tracked (likes,comments,...)
const EXCLUDE_TIMELINETRACKINGUSERS = []; //'ian-bold', 'robert-lang'
// do not track at all on these paths
const EXCLUDED_PATHS = ['/admin','/events']; // '/workspaces/', '/admin/'
// track, but do not send custom dimensions on these paths
const EXCLUDED_GROUPINGPATHS = ['/profile','/account']; // '/workspaces/', '/admin/'
const ENV = 'dev';
const CONTENTBASE = 'wilma';
const USE_TAGMANAGER = false;
// if we track documents, skip the default logic and use the doctitle as CUSTOMDIMENSION_CONTENTTITLE instead of PAGETITLE, APPTYPE or APPTITLE
const DOCUMENTTITLE_AS_CONTENT = true;

const SELECTORS = {
    HEAD_NAVIGATION: '.navbar-main .nav-left a',
    HEAD_SUBNAVIGATION: '.navbar-sub a',
    NAV_SIDEBAR: '.sidebar .nav-sidebar-item a',
    SIDEBAR_SUBSCRIPTIONS: 'coyo-subscription-widget a',
    SIDEBAR_BOOKMARKS: 'coyo-bookmarking-show a',
    SEARCHFILTER_TYPE: 'coyo-filter[title-key="MODULE.SEARCH.TYPE"] a',
    SEARCHFILTER_MODIFIED: 'coyo-filter[title-key="MODULE.SEARCH.MODIFIED"] a',
    SEARCHFILTER_LOCATION: 'coyo-filter[title-key="MODULE.SEARCH.LOCATION"] a',
    SEARCHFILTER_AUTHOR: 'coyo-filter[title-key="MODULE.SEARCH.AUTHOR"] a',
}

var extanaSettingsOverride = {
    debug: true
};