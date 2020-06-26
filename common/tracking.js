/** ######################## **/
/* _$PROJECT$_ Tracking Code _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

var currentUrl = location.href;
var initialStateChangeFired = false;
var pendingSearch = 0;
var lastFileId = '';
// create tracking settings including overrides if present
var pageId, pageName, pageType, preventTracking;
var extanaSettings = Object.assign({
    system: 'coyo',
    trackStateChanges: true,
    trackCoyoStateClass: true,
    trackCoyoStateClassVisit: true,
    debug: false,
    pkInitiate: true,
    pkId: MATOMO_TARGET_ID,
    pkLibPathPHP: MATOMO_TARGET_PHP,
    pkLibPathJS: MATOMO_TARGET_JS,
    pkDomains: [location.hostname],
    pkLogUserUID: false,
    pkHashUserUID: true,
    pkActivateHeartbeat: true,
    pkTrackMiddleRightMouseClick: true,
    pkContentTracking: true,
    pkContentTrackingDOMNode: '.content',
    pkContentTrackingScanForMedia: true,
    pkContentTrackingScanForForms: true,
    pkContentTrackingAutoRefresh: true,
    pkContentTrackingRefreshDelay: 750,
    delayForStateChange: 10,
    logAllApiCalls: false,
    logAllApiCallsEvent: ['API', 'Call']
}, extanaSettingsOverride || {});

var _paq = _paq || [];
extanaSettings.pkDomains !== null ? _paq.push(['setDomains', extanaSettings.pkDomains]) : null;
(function() {
    _paq.push(['setTrackerUrl', extanaSettings.pkLibPathPHP]);
    _paq.push(['setSiteId', extanaSettings.pkId]);
    var uid = coyoTrackingUtils.getUserIdHash();
    if(uid !== '0') _paq.push(['setUserId', uid]);
    var d = document;
    var g = d.createElement('script');
    var s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = extanaSettings.pkLibPathJS;
    s.parentNode.insertBefore(g, s);
})();

if(typeof MATOMO_HEARTBEAT === 'number' && MATOMO_HEARTBEAT > 0) _paq.push(['enableHeartBeatTimer', MATOMO_HEARTBEAT]);
//disable matomo defaut downloadtracking
_paq.push(['setDownloadExtensions', ""]);

// Element.closest() polyfill for IE
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
}
if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        var el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// List of tracked requests
var coyoRequestTrackingConfig = [
// {
//     urlPattern: /web\/message-channels$/g,
//     method: 'POST',
//     execute: function(responseUrl, response) {
//         sendTrackingEvent('chat-channel', 'Create', response.type);
//     }
// }, 
{
    urlPattern: /web\/message-channels\/[0-9a-fA-F-]*\/messages$/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        sendTrackingEvent('chat-message', 'Create', '');
    }
}, {
    urlPattern: /web\/comments/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var item = coyoTrackingDBHelper.getObjectData(response.target.id);
        sendTrackingEvent(response.target.typeName, 'Comment', item.name, item);
    }
}, {
    urlPattern: /subscriptions$/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var item = coyoTrackingDBHelper.getObjectData(response.targetId);
        sendTrackingEvent(item.type, 'Subscribe', item.name, item);
    }
}, {
    urlPattern: /subscriptions\/favorite/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var queryParams = coyoTrackingUtils.parseQueryString(responseUrl.replace(/.*\?/i, '?'));
        if(queryParams.targetId) {
            var item = coyoTrackingDBHelper.getObjectData(queryParams.targetId);
            sendTrackingEvent(item.type, 'Subscribe', item.name, item);
        }
    }
}, {
    urlPattern: /subscriptions.*\?targetId=/g,
    method: 'DELETE',
    execute: function(responseUrl, response) {
        var targetMatch = (/targetId=([^\&]*)/g).exec(responseUrl);
        if (targetMatch && targetMatch.length > 1) {
            var item = coyoTrackingDBHelper.getObjectData(targetMatch[1]);
            sendTrackingEvent(item.type || 'unknown-type', 'Unsubscribe', item.name, item);
        }
    }
}, {
    urlPattern: /web\/like-targets\//g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var typeMatch = (/like-targets\/([\w-]*)\/([0-9a-fA-F-]*)/g).exec(responseUrl);
        if (typeMatch && typeMatch.length > 1) {
            var type = typeMatch[1];
            var item = coyoTrackingDBHelper.getObjectData(typeMatch[2]);
            var entry = item.name || coyoTrackingUtils.getPageConfig().trackingTitle || '';
            sendTrackingEvent(type, 'Like', entry, item);
        }
    }
}, {
    urlPattern: /web\/like-targets\//g,
    method: 'DELETE',
    execute: function(responseUrl, response) {
        var typeMatch = (/like-targets\/([\w-]*)\/([0-9a-fA-F-]*)/g).exec(responseUrl);
        if (typeMatch && typeMatch.length > 1) {
            var type = typeMatch[1];
            var item = coyoTrackingDBHelper.getObjectData(typeMatch[2]);
            var entry = item.name || coyoTrackingUtils.getPageConfig().trackingTitle || '';
            sendTrackingEvent(type, 'Unlike', entry, item);
        }
    }
}, {
    urlPattern: /web\/timeline-items/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var title = '';
        if (response.recipients && response.recipients.length > 0) {
            var parentType = coyoTrackingUtils.typeNameOverrides(response.recipients[0].typeName);
            var parentTitle = coyoTrackingDBHelper.buildTrackingTitle(response.recipients[0]);
            title = parentType + ' >> ' + parentTitle;
            sendTrackingEvent('timeline-item', 'Create', title, { type: 'timeline-item', author: response.author.slug });
        }
    }
}, {
    urlPattern: /web\/timeline-items/g,
    method: 'DELETE',
    execute: function(responseUrl, response) {
        var itemMatch = (/\/web\/timeline-items\/([0-9a-fA-F-]*)$/g).exec(responseUrl);
        if (itemMatch && itemMatch.length > 1) {
            var item = coyoTrackingDBHelper.getObjectData(itemMatch[1]);
            sendTrackingEvent('timeline-item', 'Delete', item.name, item);
        }
    }
}, {
    urlPattern: /web\/users\/([a-z0-9-]+)\/presence-status/g,
    method: 'PUT',
    execute: function(responseUrl, response) {
        // get presence status
        var status = (response.state || 'not defined').toLowerCase();
        sendTrackingEvent(status, 'Change Status', '');
    }
}, {
    urlPattern: /web\/quick-entity-search/g,
    method: 'GET',
    execute: function(responseUrl, response) {
        //quicksearch handling: do not track every response on typing, wait some time and track the last (possible complete) term
        setTimeout(function(){
            pendingSearch--;
            if(pendingSearch == 0) {
                sendSearchEvent(responseUrl,response, true);
            }
        },1000);
    }
}, {
    urlPattern: /web\/search(?!.*filters=\w)/g,
    method: 'GET',
    execute: function(responseUrl, response) {
        sendSearchEvent(responseUrl, response, false)
    }
}, {
    urlPattern: /web\/senders\/.*\/documents/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        sendTrackingEvent('Media', 'Upload', response.displayName);
    }
}, {
    // document/files use nearly the same handler because different widgets and filetypes work with different requests
    // depending on which one gets executed we track the file view and lastFileId prevents double tracking (also for multiple calls when opening modal)
    // examples: 
    // single-file-widget + documents panel
    //  images: first call = /files/ + /documents/, further calls just /documents/
    //  videos: first call = /files/ + /stream/, further calls nothing catchable, sometimes /stream/ based on currently streamed data
    //  other docs: first call = /files/ + further calls nothing catchable
    // media-widget:
    //  images: always /files/, nothing else
    //  videos: always /stream/ HEAD, nothing else
    // embedded video in posts:
    //  no modal, no xhr requests, so we do our own HEAD request to get the title
    urlPattern: /web\/senders\/.*\/documents/g,
    method: 'GET',
    execute: function(responseUrl, response) {
        var docMatch = (/documents\/([0-9a-fA-F-]*)/g).exec(responseUrl);
        var modal = document.querySelector('.modal-dialog');
        if(docMatch && docMatch[1] && modal) {
            var objData = coyoTrackingDBHelper.getObjectData(docMatch[1]);
            if(lastFileId !== objData.name) sendTrackingEvent('Media', 'Ansicht', objData.name);
            lastFileId = objData.name;
            setTimeout(function(){
                lastFileId = '';
            }, 5000);
        }
    }
},
{
    urlPattern: /web\/senders\/.*\/files/g,
    method: 'GET',
    execute: function(responseUrl, response, requestData, respHeader) {
        var modal = document.querySelector('.modal-dialog');
        if(modal && response && response.displayName && response.displayName.length) {
            if(lastFileId !== response.displayName) sendTrackingEvent('Media', 'Ansicht', response.displayName);
            lastFileId = response.displayName;
            setTimeout(function(){
                lastFileId = '';
            }, 5000);
        }
    }
}, 
{
    urlPattern: /web\/senders\/.*\/stream/g,
    method: 'HEAD',
    execute: function(responseUrl, response, requestData, respHeader) {
        var modal = document.querySelector('.modal-dialog');
        if(modal) {
            coyoTrackingUtils.getVideoInfo(responseUrl,function(filename){
                sendTrackingEvent('Media', 'Ansicht', filename, null)
            });
        }
    }
},
{
    urlPattern: /web\/shares\/(!multiple)/g,
    method: 'POST',
    saveRequestData: true,
    execute: function(responseUrl, response, requestData) {
        var itemID = requestData ? requestData.itemId : '';
        var item = coyoTrackingDBHelper.getObjectData(itemID);
        sendTrackingEvent(item.type, 'Share', item.name, item);
    }
}, {
    urlPattern: /web\/shares\/multiple\//g,
    method: 'POST',
    saveRequestData: true,
    execute: function(responseUrl, response, requestData) {
        if (!requestData) {
            return;
        }
        for (var i = 0; i < requestData.length; i++) {
            var itemID = requestData[i].itemId;
            var item = coyoTrackingDBHelper.getObjectData(itemID);
            var share = response[i];
            if (!share || !share.recipient) {
                continue;
            }
            sendTrackingEvent(item.type, 'Share', item.name, item);
        }
    }
},
//     urlPattern: /web\/.*\/(wiki|blog)\/articles/g,
//     method: 'POST',
//     execute: function(responseUrl, response) {
//         var parent = coyoTrackingDBHelper.getObjectData(response.senderId);
//         var label = coyoTrackingUtils.typeNameOverrides(parent.type) + ' >> ' + parent.name;
//         sendTrackingEvent(response.typeName, 'Create', label);
//     }
// }, {
// }, {
//     urlPattern: /web\/events/g,
//     method: 'POST',
//     execute: function(responseUrl, response) {
//         sendTrackingEvent(response.event.typeName, 'Create', coyoTrackingDBHelper.buildTrackingTitle(response.event));
//     }
// }, {
//     urlPattern: /web\/pages/g,
//     method: 'POST',
//     execute: function(responseUrl, response) {
//         sendTrackingEvent(response.typeName, 'Create', coyoTrackingDBHelper.buildTrackingTitle(response));
//     }
];

function sendTrackingEvent(targetType, action, title, checkUserItem, hasSearchResults) {
    if (coyoTrackingUtils.excludeUser(checkUserItem)) return;

    // check for platform specific type name overrides
    var pageConfig   = coyoTrackingUtils.getPageConfig();
    var pageType     = pageConfig.contentGroup[1] || null;
    var pageTitle    = pageConfig.contentGroup[2] || null;
    var pageTitle    = pageConfig.contentGroup[2] || null;
    var appType      = pageConfig.contentGroup[3] || null;
    var appTitle     = pageConfig.contentGroup[4] || null;

    //handle 'create' for chat vs others like timeline
    if(targetType === 'chat-message' && action === 'Create') action = 'Nachricht senden';
    //handle 'create' for timeline (do not track title)
    if(targetType === 'timeline-item' && action === 'Create') title = '';
    targetType = coyoTrackingUtils.typeNameOverrides(targetType);
    action = coyoTrackingUtils.typeNameOverrides(action);
    coyoTrackingUtils.cleanupCustomDimensions();
    if(pageType) {
        _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETYPE_EVENT, coyoTrackingUtils.typeNameOverrides(pageType)]);
        // _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETYPE_EVENT_VISIT, coyoTrackingUtils.typeNameOverrides(pageType)]);
    }
    if(pageTitle) {
        _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE_EVENT, coyoTrackingUtils.typeNameOverrides(pageTitle)]);
        // _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE_EVENT_VISIT, coyoTrackingUtils.typeNameOverrides(pageTitle)]);
    }
    // prevent tracking apptype 'Show', 
    // this happens either after a new Page/Workspace is created and there is no app setup or if redirects take longer then our debounce allows
    if (appType && appType !== 'show') {
        _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTYPE_EVENT, coyoTrackingUtils.typeNameOverrides(appType)]);
        // _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTYPE_EVENT_VISIT, coyoTrackingUtils.typeNameOverrides(appType)]);
    }
    if(appTitle) {
        _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTITLE_EVENT, coyoTrackingUtils.typeNameOverrides(appTitle)]);
        // _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTITLE_EVENT_VISIT, coyoTrackingUtils.typeNameOverrides(appTitle)]);
    }

    // special search handling
    if(typeof hasSearchResults === 'boolean') {
        _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE_EVENT, (hasSearchResults ? 'Suchergebnis' : 'Kein Suchergebnis')]);
    }
    _paq.push(['trackEvent', targetType, action, title]);
    // _paq.push(['trackEvent', targetType, action, title, null, {
    //     dimension6: pageType, 
    //     dimension7: pageTitle, 
    //     dimension8: appType,
    //     dimension9: appTitle
    // }]);
    coyoTrackingUtils.cleanupCustomDimensions();
}

function sendSearchEvent(responseUrl, response, isQuicksearch) {
    var pageConfig   = coyoTrackingUtils.getPageConfig();
    var queryParams = coyoTrackingUtils.parseQueryString(responseUrl.replace(/.*\?/i, '?'));
    if (response && queryParams && 'object' === typeof queryParams && 'term' in queryParams && 'object' === typeof queryParams.term) {
        var pageConfig = coyoTrackingUtils.getPageConfig();
        var searchedTerm = queryParams.term.length === 1 ? decodeURIComponent(queryParams.term[0].toString()) : '';
        var rspFoundEleCount = typeof response.totalElements === 'number' ? parseInt(response.totalElements) : false;
        if(pageConfig.contentGroup[1]) {
            _paq.push(['trackSiteSearch', searchedTerm, isQuicksearch ? coyoTrackingUtils.typeNameOverrides('quicksearch') : coyoTrackingUtils.typeNameOverrides('search'), rspFoundEleCount]);
            coyoTrackingUtils.cleanupCustomDimensions();
            if(typeof isQuicksearch !== 'boolean' || !isQuicksearch){
                debounce(function() {
                    setTimeout(function() {
                        trackPageView(rspFoundEleCount);
                    }, extanaSettings.delayForStateChange || 2);
                }, 250)();
            }
        }
    }
    return false;
}

function initDownloadListener() {
    // add download tracking for coyo internal files
    window.mtmDownloadListener = window.mtmDownloadListener || setInterval(function() {
        // [].slice.call for IE compatibility
        [].slice.call(document.querySelectorAll('a[coyo-download]:not(.piwik_ignore), a[href^="/web/senders/"][href*="/documents/"]:not(.piwik_ignore)')).forEach(function(elem) {
            elem.classList.add('piwik_ignore');
            if (!coyoTrackingUtils.excludeFromTracking()) {
                elem.addEventListener('mousedown', function() {
                    function getLink(elem) {
                        var parent = elem.closest('.modal-file-details, .fl-table-row.file');
                        if (parent) {
                            var url = parent.querySelector('coyo-copy-file-link .copy-link a').dataset.clipboardText
                            var linkparts = url.split('/');
                            var filename = decodeURIComponent(linkparts[linkparts.length-1]);
                            var lastSpace = filename.lastIndexOf(' ');
                            return {
                                url: url,
                                filename: filename.substr(0,lastSpace) + '.' + filename.substr(lastSpace+1)
                            }
                        }

                        // change URL from '/web/senders/*senderID*/documents/*docID*' to '/files/*senderID*/*docID*/*docTitle*' and send it as url param
                        if (/web\/senders\/([a-z0-9-]+)\/documents\/([a-z0-9-]+)/gi.exec(elem.href)) {
                            var url = elem.href.replace('/web/senders/', '/files/').replace('/documents/', '/');
                            url = url.lastIndexOf('/') === url.length - 1 ? url : url + '/';
                            url += encodeURIComponent(elem.innerText.trim());
                            return {
                                url: url,
                                filename: elem.innerText.trim()
                            }
                        }

                        if(elem.getAttribute('coyo-download')){
                            // handle download-widget (content)
                            var child = elem.firstElementChild;
                            var filename = '';
                            if(child.className === 'file-name') {
                                filename = child.innerText.trim();
                            } else if ((parent = elem.closest('.single-file-widget-details-text')) !== null) {
                                filename = parent.firstElementChild.innerText.trim();
                            }
                            return {
                                url: '', // TODO: try to add get the url from somewhere, if required someday...
                                filename: filename
                            }
                        }
                        return null;
                    }
                    var link = getLink(elem);
                    if (link.filename && link.filename.length) {
                        sendTrackingEvent('Media', 'Download', link.filename);
                        // _paq.push(['trackLink', link, 'download']);
                    }
                });
            }
        });
    }, 500);
}

// debounce function to supress page views being triggered during coyo redirects
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        initialStateChangeFired = true;
        var context = this;
        var args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
};

function trackPageView(searchResults) {
    if (typeof coyoTrackingUtils != "object") {
        console.log("Coyo tracking utils not defined.");
        return;
    }
    var pageConfig   = coyoTrackingUtils.getPageConfig();
    var pageId       = coyoTrackingUtils.pageIdToString(pageConfig.contentGroup);
    var pageType     = pageConfig.contentGroup[1] || null;
    var pageTitle    = pageConfig.contentGroup[2] || null;
    var appType      = pageConfig.contentGroup[3] || null;
    var appTitle     = pageConfig.contentGroup[4] || null;
    var contentTitle = pageConfig.contentGroup[5] || null;
    if (coyoTrackingUtils.excludeFromTracking() || !pageId || pageId.indexOf(window.location.host + '..') == 0) {
        // if(ENV === 'dev'){console.log('pageview abort excluded',coyoTrackingUtils.excludeFromTracking(), pageId, pageId.indexOf(window.location.host + '..') );}
        return;
    }
    initDownloadListener();

    if(pageType === 'filelibrary' && DOCUMENTTITLE_AS_CONTENT) {
        contentTitle    = pageTitle;
        pageTitle       = null;
    }

    // var userCount = coyoTrackingUtils.getRegisteredUsers();
    if(!coyoTrackingUtils.excludeFromTracking(EXCLUDED_GROUPINGPATHS))  {
        if (pageType) {
            _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETYPE, coyoTrackingUtils.typeNameOverrides(pageType)]);
            // _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETYPE_VISIT, coyoTrackingUtils.typeNameOverrides(pageType)]);
        }
        if (pageTitle) {
            _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE, coyoTrackingUtils.typeNameOverrides(pageTitle)]);
            // _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE_VISIT, coyoTrackingUtils.typeNameOverrides(pageTitle)]);
        }
        // prevent tracking apptype 'Show', 
        // this happens either after a new Page/Workspace is created and there is no app setup or if redirects take longer then our debounce allows
        if (appType && appType !== 'show') {
            _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTYPE, coyoTrackingUtils.typeNameOverrides(appType)]);
            // _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTYPE_VISIT, coyoTrackingUtils.typeNameOverrides(appType)]);
        }
        if (appTitle) {
            _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTITLE, coyoTrackingUtils.typeNameOverrides(appTitle)]);
            // _paq.push(['setCustomDimension', CUSTOMDIMENSION_APPTITLE_VISIT, coyoTrackingUtils.typeNameOverrides(appTitle)]);
        }
        if (contentTitle) {
            _paq.push(['setCustomDimension', CUSTOMDIMENSION_CONTENTTITLE, coyoTrackingUtils.typeNameOverrides(contentTitle)]);
            // _paq.push(['setCustomDimension', CUSTOMDIMENSION_CONTENTTITLE_VISIT, coyoTrackingUtils.typeNameOverrides(contentTitle)]);
        }
    }
    _paq.push(['setReferrerUrl', currentUrl]);
    currentUrl = window.location.href;
    _paq.push(['setCustomUrl', currentUrl]);
    _paq.push(['setDocumentTitle', pageId]);
    _paq.push(['setGenerationTimeMs', 0]);

    if(pageType === 'search') {
        if(typeof searchResults !== 'undefined') {
            if(searchResults > 0) { 
                _paq.push(['setDocumentTitle', pageId + '.suchergebnis']);
                _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE, 'Suchergebnis']);
              } else {
                _paq.push(['setDocumentTitle', pageId + '.kein-suchergebnis']);
                _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE, 'Kein Suchergebnis']);
            }
        } else {
            // if(ENV === 'dev'){console.log('pageview abort search',searchResults);}
            return
        }
    }

    if (extanaSettings.pkContentTracking) {
        var content = jQuery(extanaSettings.pkContentTrackingSelector).get(0);
        if (extanaSettings.pkContentTrackingScanForMedia)
            _paq.push(['MediaAnalytics::scanForMedia', content]);
        if (extanaSettings.pkContentTrackingScanForForms)
            _paq.push(['FormAnalytics::scanForForms', content]);
        if (extanaSettings.pkContentTrackingMode === 'node')
            _paq.push(['trackContentImpressionsWithinNode', content]);
        else if (extanaSettings.pkContentTrackingMode === 'delay')
            _paq.push(['trackVisibleContentImpressions', true, extanaSettings.pkContentTrackingRefreshDelay || 750]);
    }
    if (extanaSettings.pkTrackMiddleRightMouseClick) {
        _paq.push(["enableLinkTracking", true]);
    } else {
        _paq.push(["enableLinkTracking"]);
    }
    if(ENV !== 'prod'){console.debug('pageview sending',pageConfig );}
     _paq.push(['trackPageView']);
     _paq.push(['enableHeartBeatTimer', 0]);
     _paq.push(['enableHeartBeatTimer', MATOMO_HEARTBEAT]);
    coyoTrackingUtils.cleanupCustomDimensions();
    // if(ENV === 'dev'){console.log('pageview done');}
}

// page view tracking
window.document.addEventListener('stateChangeSuccess', debounce(function() {
    if(ENV !== 'prod'){console.debug('stateChangeSuccess event');}
    setTimeout(function() {
        trackPageView();
    }, extanaSettings.delayForStateChange || 2);
}, 1000), false);

// request event tracking
var openPrototypeTracking = XMLHttpRequest.prototype.open;
var sendPrototypeTracking = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function() {
    var method = arguments[0];
    var reqURL = arguments[1];
    var that = this;

    // special case for getting request data from send() method
    coyoRequestTrackingConfig.forEach(function(item) {
        if (method == item.method && reqURL && reqURL.match(item.urlPattern) && item.saveRequestData) {
            that.saveRequestData = true;
        }
    });

    //quicksearch handling: do not track every response on typing, wait some time and track the last (possible complete) term 
    if(reqURL.match(/web\/quick-entity-search/g)){
        pendingSearch++;
    }

    this.addEventListener('load', function(e) {
        if (coyoTrackingUtils.excludeFromTracking()) {
            return;
        }
        var resp = {};
        var rspPayload = null;
        var reqQueryParams = null;
        resp.responseType = this.responseType;
        resp.responseURL = this.responseURL || reqURL;
        resp.requestData = this.requestData;
        resp.headers = {};
        resp.headers = coyoTrackingUtils.getResponseHeaders(that);
        try {
            resp.responseText = this.responseText;

            rspPayload = e.currentTarget.responseText.length > 0 ? JSON.parse(e.currentTarget.responseText) : null;
            reqQueryParams = coyoTrackingUtils.parseQueryString(reqURL.replace(/.*\?/i, '?'));
        } catch (e) { }
        setTimeout(function() {
            if (typeof coyoTrackingDBHelper == 'undefined') {
                console.log('Coyo tracking name data base not defined.');
                return;
            }

            var response;
            try {
                if ((resp.responseType == '' || resp.responseType == 'text' || resp.responseType == 'document' || resp.responseType == 'moz-chunked-text') && resp.responseText) {
                    response = eval("(" + resp.responseText + ")");
                }
            } catch (e) { }

            // check all defined listener
            coyoRequestTrackingConfig.forEach(function(item) {
                if (method == item.method && resp.responseURL.match(item.urlPattern) && typeof item.execute == 'function') {
                    item.execute(resp.responseURL, response, resp.requestData, resp.headers);
                    return;
                }
            });
        });
    }, 2);
    openPrototypeTracking.apply(this, arguments);
};

XMLHttpRequest.prototype.send = function() {
    try {
        if (arguments && arguments[0] && this.saveRequestData) {
            this.requestData = JSON.parse(arguments[0]);
        }
    } catch (e) { }

    sendPrototypeTracking.apply(this, arguments);
};

// fix for using this script with matomo tag manager / container:
// the container will be loaded async, this results in 2 cases
// a) the container with this code finished loading BEFORE the app finishes with a stateChangeSuccess -> everything works normal, initial pagewview is catched by the event
// b) AFTER that -> we missed the first stateChangeSuccess and therefore have to trigger it manually
if(USE_TAGMANAGER){
    setTimeout(function() {
        if(!initialStateChangeFired) {
            if(ENV !== 'prod'){console.debug('initial page call');}
            trackPageView();
            initialStateChangeFired = true;
        }
    }, extanaSettings.delayForStateChange || 2);
}
