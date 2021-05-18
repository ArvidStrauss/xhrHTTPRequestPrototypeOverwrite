/** ######################## **/
/* _$PROJECT$_ Custom Code _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

// Adjust matomo tracking settings here
// If you adjust the following params, you have to adjust the src of the image tag above aswell
const MATOMO_TARGET_ID = '13';
const MATOMO_BASEPATH = 'https://di-tools.t-systems-mms.eu/matomo/'
const MATOMO_TARGET_PHP = MATOMO_BASEPATH + 'matomo.php';
const MATOMO_TARGET_JS = MATOMO_BASEPATH + 'matomo.js';
// the base (first part) of the action identifier
const CONTENTBASE = 'bep';

// use variables for custom dimensions in case they are setup differently in matomo
const CUSTOMDIMENSION_PAGETYPE = 1
const CUSTOMDIMENSION_PAGETITLE = 2
const CUSTOMDIMENSION_APPTYPE = 3
const CUSTOMDIMENSION_APPTITLE = 4
const CUSTOMDIMENSION_CONTENTTITLE = 5
const CUSTOMDIMENSION_PAGETYPE_EVENT = 6
const CUSTOMDIMENSION_PAGETITLE_EVENT = 7
const CUSTOMDIMENSION_APPTYPE_EVENT = 8
const CUSTOMDIMENSION_APPTITLE_EVENT = 9

// list timeline item tracked users here with profile uri endpoint
// posts by these users in a timeline wont be tracked (likes,comments,...)
const EXCLUDE_TIMELINETRACKINGUSERS = []; //'ian-bold', 'robert-lang'
// do not track at all on these paths
const EXCLUDED_PATHS = ['/admin']; // '/workspaces/', '/admin/'
// track, but do not send custom dimensions on these paths
const EXCLUDED_GROUPINGPATHS = ['/profile','/account']; // '/workspaces/', '/admin/'
// dev/test/prod
const ENV = 'dev';

const TRACKINGSETTINGS = {
    // if we track documents, skip the default logic and use the doctitle as CUSTOMDIMENSION_CONTENTTITLE instead of PAGETITLE, APPTYPE or APPTITLE
    DOCUMENTTITLE_AS_CONTENT: true,
    // use the tagmanager or inline js code for tracking, tagmanager needs some extra logic which is activated here
    USE_TAGMANAGER: false,
    // clicktracking events on the mainnavigation
    NAV_MAIN: false,
    // clicktracking events on the subnavigation
    NAV_SUB: false,
    // clicktracking events on mobile sidemenu, careful: if the admin area is not excluded by EXCLUDED_PATHS this menu is considered as mobile too!
    NAV_MOBILE: false,
    // clicktracking events on subscriptions (sidebar of homepage)
    SIDEBAR_SUBSCRIPTIONS: false,
    // clicktracking events on bookmarks (sidebar of homepage)
    SIDEBAR_BOOKMARKS: false,
    // searchtracking while typing in the inline searchfield
    SEARCH_INLINE: false,
    // searchtracking on main searchresultpage
    SEARCH_MAIN: false,
    // clicktracking events when clicking on filters at searchresultpage
    SEARCHFILTER: false,
    // eventtracking embedded videos onPlay (currently only coyo-uploaded) 
    VIDEOPLAY: false,
    // eventtracking sending of chat-messages
    CHAT_MESSAGES: false,
    // eventtracking creation of new chat channels
    CHAT_CHANNELS: false,

    // eventtracking creation of all kinds of comments
    COMMENTS: false,
    // eventtracking subscribe/unsubscribe
    SUBSCRIPTIONS: false,
    // eventtracking like/unlike
    LIKES: false,
    // eventtracking change of user status
    USER_STATUS: false,
    // eventtracking file uploads
    MEDIA_UPLOAD: false,
    // eventtracking for downloading files, done by downloadlistener in tracking.js
    MEDIA_DOWNLOAD: false,
    // eventtracking file views (when modal with filedetails opens), for all filetypes including videos
    MEDIA_VIEW: false,
    // eventtracking for shares
    SHARE: false,
    // eventtracking creation of articles (wiki,blog)
    CREATE_ARTICLES: false,
    // eventtracking creation of events
    CREATE_EVENTS: false,
    // eventtracking creation of pages/workspaces (groups)
    CREATE_PAGES: false,
    // eventtracking for new timeline entries
    CREATE_TIMELINE: false,
    // eventtracking if timeline items get deleted
    DELETE_TIMELINE: false,
    // track clicks on links to coyo-external files
    TRACKEXTERNALFILES: false,
}

// selectors used by clicktracking
const SELECTORS = {
    HEAD_NAVIGATION: '.navbar-main .nav-left a',
    HEAD_SUBNAVIGATION: '.navbar-sub a',
    NAV_SIDEBAR: '.sidebar .nav-sidebar-item a',
    SIDEBAR_SUBSCRIPTIONS: 'coyo-subscription-widget a',
    SIDEBAR_BOOKMARKS: 'coyo-bookmarking-show a, .bookmarking-widget a',
    SEARCHFILTER_TYPE: 'coyo-filter[title-key="MODULE.SEARCH.TYPE"] a',
    SEARCHFILTER_MODIFIED: 'coyo-filter[title-key="MODULE.SEARCH.MODIFIED"] a',
    SEARCHFILTER_LOCATION: 'coyo-filter[title-key="MODULE.SEARCH.LOCATION"] a',
    SEARCHFILTER_AUTHOR: 'coyo-filter[title-key="MODULE.SEARCH.AUTHOR"] a',
}

// matomo specific tracking settings
const MATOMOSETTINGS = {
    HEARTBEAT: 5,
    // feature untested: if this is empty the following settings starting with CONTENT_ do nothing, 
    // otherwise its used as selector to send content impressions
    CONTENT_NODE: '', // add valid selector here (e.g. '.content')
    // feature untested: sends trackContentImpressionsWithinNode (standard for single page applications) / trackVisibleContentImpressions
    // if this is empty, no content impressions are tracked
    CONTENT_TRACKING_MODE: '', // valid values: node/delay
    // the delay for sending content impressions if CONTENT_TRACKING_MODE is set to 'delay'
    CONTENT_REFRESHDELAY: 750,
    // feature untested: Mediaanalytics
    CONTENT_SCAN_FOR_MEDIA: true,
    // feature untested: Formanalytics
    CONTENT_SCAN_FOR_FORMS: true,
    // feature untested: clicktracking behavior (https://developer.matomo.org/api-reference/tracking-javascript)
    // false = only left clicks count, 
    // true = opening the contextmenu via middle or right button counts too, even before actually leaving the page
    MIDDLERIGHT_MOUSECLICK: true,
    // short delay for internal use doing async things... 
    DELAY_FOR_STATECHANGE: 10,
    // domainfilter that tells matomo to store trackingdata only when sent via these domains (typically just the own/current domain) 
    DOMAINS: [location.hostname],
}