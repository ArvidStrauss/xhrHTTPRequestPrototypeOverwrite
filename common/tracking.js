/** ######################## **/
/* _$PROJECT$_ Tracking Code _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

var _paq = _paq || [];
MATOMOSETTINGS.DOMAINS !== null ? _paq.push(['setDomains', MATOMOSETTINGS.DOMAINS]) : null;
(function() {
    _paq.push(['setTrackerUrl', MATOMO_TARGET_PHP]);
    _paq.push(['setSiteId', MATOMO_TARGET_ID]);
    var uid = coyoTrackingUtils.getUserIdHash();
    if(uid !== '0') _paq.push(['setUserId', uid]);
    var d = document;
    var g = d.createElement('script');
    var s = d.getElementsByTagName('script')[0];
    g.type = 'text/javascript';
    g.async = true;
    g.defer = true;
    g.src = MATOMO_TARGET_JS;
    s.parentNode.insertBefore(g, s);
})();

// setup heartbeattimer
if(typeof MATOMOSETTINGS.HEARTBEAT === 'number' && MATOMOSETTINGS.HEARTBEAT > 0) _paq.push(['enableHeartBeatTimer', MATOMOSETTINGS.HEARTBEAT]);


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
var coyoRequestTrackingConfig = [];
if(TRACKINGSETTINGS.CHAT_MESSAGES) coyoRequestTrackingConfig.push({
    urlPattern: /web\/message-channels\/[0-9a-fA-F-]*\/messages$/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        sendTrackingEvent('chat-message', 'Create Chatmessage', '');
    }
});
if(TRACKINGSETTINGS.CHAT_CHANNELS) coyoRequestTrackingConfig.push({
    urlPattern: /web\/message-channels$/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        sendTrackingEvent('chat-channel', 'Create Chatchannel', response.type);
    }
});
if(TRACKINGSETTINGS.COMMENTS) coyoRequestTrackingConfig.push({
    urlPattern: /web\/comments/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var item = coyoTrackingDBHelper.getObjectData(response.target.id);
        sendTrackingEvent(response.target.typeName, 'Comment', item.name, item);
    }
});
if(TRACKINGSETTINGS.SUBSCRIPTIONS) {
    coyoRequestTrackingConfig.push({
        urlPattern: /subscriptions$/g,
        method: 'POST',
        execute: function(responseUrl, response) {
            var item = coyoTrackingDBHelper.getObjectData(response.targetId);
            sendTrackingEvent(item.type, 'Subscribe', item.name, item);
        }
    });
    coyoRequestTrackingConfig.push({
        urlPattern: /subscriptions\/favorite/g,
        method: 'POST',
        execute: function(responseUrl, response) {
            var queryParams = coyoTrackingUtils.parseQueryString(responseUrl.replace(/.*\?/i, '?'));
            if(queryParams.targetId) {
                var item = coyoTrackingDBHelper.getObjectData(queryParams.targetId);
                sendTrackingEvent(item.type, 'Subscribe', item.name, item);
            }
        }
    });
    coyoRequestTrackingConfig.push({
        urlPattern: /subscriptions.*\?targetId=/g,
        method: 'DELETE',
        execute: function(responseUrl, response) {
            var targetMatch = (/targetId=([^\&]*)/g).exec(responseUrl);
            if (targetMatch && targetMatch.length > 1) {
                var item = coyoTrackingDBHelper.getObjectData(targetMatch[1]);
                sendTrackingEvent(item.type || 'unknown-type', 'Unsubscribe', item.name, item);
            }
        }
    });
}
if(TRACKINGSETTINGS.LIKES) {
    coyoRequestTrackingConfig.push({
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
    });
    coyoRequestTrackingConfig.push({
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
    });
}
if(TRACKINGSETTINGS.CREATE_TIMELINE) coyoRequestTrackingConfig.push({
    urlPattern: /web\/timeline-items/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var title = '';
        if (response.recipients && response.recipients.length > 0) {
            var parentType = coyoTrackingUtils.typeNameOverrides(response.recipients[0].typeName);
            var parentTitle = coyoTrackingDBHelper.buildTrackingTitle(response.recipients[0]);
            title = parentType + ' >> ' + parentTitle;
            sendTrackingEvent('timeline-item', 'Create Timeline', title, { type: 'timeline-item', author: response.author.slug });
        }
    }
});
if(TRACKINGSETTINGS.DELETE_TIMELINE) coyoRequestTrackingConfig.push({
    urlPattern: /web\/timeline-items/g,
    method: 'DELETE',
    execute: function(responseUrl, response) {
        var itemMatch = (/\/web\/timeline-items\/([0-9a-fA-F-]*)$/g).exec(responseUrl);
        if (itemMatch && itemMatch.length > 1) {
            var item = coyoTrackingDBHelper.getObjectData(itemMatch[1]);
            sendTrackingEvent('timeline-item', 'Delete', item.name, item);
        }
    }
});
if(TRACKINGSETTINGS.USER_STATUS) coyoRequestTrackingConfig.push({
    urlPattern: /web\/users\/([a-z0-9-]+)\/presence-status/g,
    method: 'PUT',
    execute: function(responseUrl, response) {
        // get presence status
        if(response.state) sendTrackingEvent(response.state.toLowerCase(), 'Change Status', '');
    }
});
if(TRACKINGSETTINGS.SEARCH_MAIN) coyoRequestTrackingConfig.push({
    urlPattern: /web\/search(?!.*filters=\w)/g,
    method: 'GET',
    execute: function(responseUrl, response) {
        sendSearchEvent(responseUrl, response, false)
    }
});
if(TRACKINGSETTINGS.SEARCH_INLINE) coyoRequestTrackingConfig.push({
    urlPattern: /web\/quick-entity-search/g,
    method: 'GET',
    execute: function(responseUrl, response) {
        //quicksearch handling: do not track every response on typing, wait some time and track the last (possible complete) term
        setTimeout(function(){
            coyoTrackingUtils._pendingSearch--;
            if(coyoTrackingUtils._pendingSearch == 0) {
                sendSearchEvent(responseUrl,response, true);
            }
        },1000);
    }
});
if(TRACKINGSETTINGS.MEDIA_UPLOAD) coyoRequestTrackingConfig.push({
    urlPattern: /web\/senders\/.*\/documents/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        sendTrackingEvent('Media', 'Upload', response.displayName);
    }
});
if(TRACKINGSETTINGS.MEDIA_VIEW) {
    // document/files use nearly the same handler because different widgets and filetypes work with different requests
    // depending on which one gets executed we track the file view and coyoTrackingUtils._lastFileId prevents double tracking (also for multiple calls when opening modal)
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
    coyoRequestTrackingConfig.push({
        urlPattern: /web\/senders\/.*\/documents/g,
        method: 'GET',
        execute: function(responseUrl, response) {
            var docMatch = (/documents\/([0-9a-fA-F-]*)/g).exec(responseUrl);
            var modal = document.querySelector('.modal-dialog');
            if(docMatch && docMatch[1] && modal) {
                var objData = coyoTrackingDBHelper.getObjectData(docMatch[1]);
                if(coyoTrackingUtils._lastFileId !== objData.name) sendTrackingEvent('Media', 'View', objData.name);
                coyoTrackingUtils._lastFileId = objData.name;
                setTimeout(function(){
                    coyoTrackingUtils._lastFileId = '';
                }, 5000);
            }
        }
    });
    coyoRequestTrackingConfig.push({
        urlPattern: /web\/senders\/.*\/files/g,
        method: 'GET',
        execute: function(responseUrl, response, requestData, respHeader) {
            var modal = document.querySelector('.modal-dialog');
            if(modal && response && response.displayName && response.displayName.length) {
                // events use contentReady+Angular approach to be able to handle both: 
                // direct file views (with id in url) 
                // and opening modals on other pages (no fileid in url)
                coyoTrackingUtils.onContentReady(function() {
                    var filePreview = coyoTrackingUtils.getAngularComponent(document.querySelector('coyo-file-preview'));
                    if(filePreview && filePreview.file && filePreview.file.displayName) {
                        if(coyoTrackingUtils._lastFileId !== filePreview.file.displayName) sendTrackingEvent('Media', 'View', filePreview.file.displayName);
                        coyoTrackingUtils._lastFileId = filePreview.file.displayName;
                        setTimeout(function(){
                            coyoTrackingUtils._lastFileId = '';
                        }, 5000);
                    }
                });
            }
        }
    }); 
    coyoRequestTrackingConfig.push({
        urlPattern: /web\/senders\/.*\/stream/g,
        method: 'HEAD',
        execute: function(responseUrl, response, requestData, respHeader) {
            var modal = document.querySelector('.modal-dialog');
            if(modal) {
                coyoTrackingUtils.getVideoInfo(responseUrl,function(filename){
                    sendTrackingEvent('Media', 'View', filename, null)
                });
            }
        }
    });
}
if(TRACKINGSETTINGS.SHARE) {
    coyoRequestTrackingConfig.push({
        urlPattern: /web\/shares\/(!multiple)/g,
        method: 'POST',
        saveRequestData: true,
        execute: function(responseUrl, response, requestData) {
            var itemID = requestData ? requestData.itemId : '';
            var item = coyoTrackingDBHelper.getObjectData(itemID);
            sendTrackingEvent(item.type, 'Share', item.name, item);
        }
    });
    coyoRequestTrackingConfig.push({
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
    });
}
if(TRACKINGSETTINGS.CREATE_ARTICLES) coyoRequestTrackingConfig.push({
    urlPattern: /web\/.*\/(wiki|blog)\/articles/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        var parent = coyoTrackingDBHelper.getObjectData(response.senderId);
        var label = coyoTrackingUtils.typeNameOverrides(parent.type) + ' >> ' + parent.name;
        sendTrackingEvent(response.typeName, 'Create Article', label);
    }
});
if(TRACKINGSETTINGS.CREATE_EVENTS) coyoRequestTrackingConfig.push({
    urlPattern: /web\/events/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        sendTrackingEvent(response.event.typeName, 'Create Event', coyoTrackingDBHelper.buildTrackingTitle(response.event));
    }
});
if(TRACKINGSETTINGS.CREATE_PAGES) coyoRequestTrackingConfig.push({
    urlPattern: /web\/pages/g,
    method: 'POST',
    execute: function(responseUrl, response) {
        sendTrackingEvent(response.typeName, 'Create Page', coyoTrackingDBHelper.buildTrackingTitle(response));
    }
});

function sendTrackingEvent(targetType, action, title, checkUserItem, hasSearchResults) {
    if (coyoTrackingUtils.excludeUser(checkUserItem)) return;

    // check for platform specific type name overrides
    var pageConfig   = coyoTrackingUtils.getPageConfig();
    var pageType     = pageConfig.contentGroup[1] || null;
    var pageTitle    = pageConfig.contentGroup[2] || null;
    var pageTitle    = pageConfig.contentGroup[2] || null;
    var appType      = pageConfig.contentGroup[3] || null;
    var appTitle     = pageConfig.contentGroup[4] || null;

    //handle 'create' for timeline (do not track title)
    if(targetType === 'timeline-item' && action === 'Create Timeline') title = '';
    targetType = coyoTrackingUtils.typeNameOverrides(targetType);
    action = coyoTrackingUtils.typeNameOverrides(action);
    title = coyoTrackingUtils.cleanUnicodeIcons(title).text;
    coyoTrackingUtils.cleanupCustomDimensions();

    if(pageType && pageType.toLowerCase() === 'filelibrary' && TRACKINGSETTINGS.DOCUMENTTITLE_AS_CONTENT) {
        pageTitle       = null;
    }

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
        _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE_EVENT, (hasSearchResults ? coyoTrackingUtils.typeNameOverrides('searchresults') : coyoTrackingUtils.typeNameOverrides('no-searchresults'))]);
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
                    }, MATOMOSETTINGS.DELAY_FOR_STATECHANGE || 2);
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
        // coyoTrackingUtils._initialStateChangeFired = true;
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
    if(coyoTrackingUtils._initialStateChangeFired) {
        if(ENV !== 'prod') console.debug('already fired. aborting');
        coyoTrackingUtils._initialStateChangeFired = false;
        return;
    }
    if (typeof coyoTrackingUtils != "object") {
        console.log("Coyo tracking utils not defined.");
        return;
    }
    var pageConfig   = coyoTrackingUtils.getPageConfig();
    if(ENV !== 'prod') console.log(pageConfig);
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
    if(TRACKINGSETTINGS.MEDIA_DOWNLOAD) initDownloadListener();

    if(pageType && pageType.toLowerCase() === 'filelibrary' && TRACKINGSETTINGS.DOCUMENTTITLE_AS_CONTENT) {
        contentTitle    = pageTitle;
        pageTitle       = null;
    }
    coyoTrackingUtils.cleanupCustomDimensions();
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
        if (appType && appType.toLowerCase() !== 'show') {
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
    _paq.push(['setReferrerUrl', coyoTrackingUtils._currentUrl]);
    coyoTrackingUtils._currentUrl = window.location.href;
    _paq.push(['setCustomUrl', coyoTrackingUtils._currentUrl]);
    _paq.push(['setDocumentTitle', pageId]);
    _paq.push(['setGenerationTimeMs', 0]);

    if(pageType === 'search') {
        if(typeof searchResults !== 'undefined') {
            if(searchResults > 0) { 
                _paq.push(['setDocumentTitle', pageId + '.suchergebnis']);
                _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE, coyoTrackingUtils.typeNameOverrides('searchresults')]);
              } else {
                _paq.push(['setDocumentTitle', pageId + '.kein-suchergebnis']);
                _paq.push(['setCustomDimension', CUSTOMDIMENSION_PAGETITLE, coyoTrackingUtils.typeNameOverrides('no-searchresults')]);
            }
        } else {
            // if(ENV === 'dev'){console.log('pageview abort search',searchResults);}
            return
        }
    }

    if (MATOMOSETTINGS.CONTENT_NODE && MATOMOSETTINGS.CONTENT_NODE.length) {
        var content = document.querySelector(MATOMOSETTINGS.CONTENT_NODE);
        if(content) {
            if (MATOMOSETTINGS.CONTENT_SCAN_FOR_MEDIA)
            _paq.push(['MediaAnalytics::scanForMedia', content]);
            if (MATOMOSETTINGS.CONTENT_SCAN_FOR_FORMS)
                _paq.push(['FormAnalytics::scanForForms', content]);
            if (MATOMOSETTINGS.CONTENT_TRACKING_MODE === 'node')
                _paq.push(['trackContentImpressionsWithinNode', content]);
            else if (MATOMOSETTINGS.CONTENTTRACKING_MODE === 'delay')
                _paq.push(['trackVisibleContentImpressions', true, MATOMOSETTINGS.CONTENT_REFRESHDELAY || 750]);
        }
    }
    if (MATOMOSETTINGS.MIDDLERIGHT_MOUSECLICK) {
        _paq.push(["enableLinkTracking", true]);
    } else {
        _paq.push(["enableLinkTracking"]);
    }
    if(ENV !== 'prod'){console.debug('pageview sending',pageConfig );}
     _paq.push(['trackPageView']);
    coyoTrackingUtils.cleanupCustomDimensions();
    // if(ENV === 'dev'){console.log('pageview done');}
}

// page view tracking
window.document.addEventListener('stateChangeSuccess', debounce(function() {
    if(ENV !== 'prod'){console.debug('stateChangeSuccess event');}
    // wait until content is ready
    coyoTrackingUtils.onContentReady(function() {
        trackPageView();
    });
}, 1000), false);

// heartbeat hack: ping on change, just ping immediately, do not wait for pagecall
window.document.addEventListener('stateChangeSuccess', function() {
    _paq.push(['ping']);
});

// request event tracking
var openPrototypeTracking = XMLHttpRequest.prototype.open;
var sendPrototypeTracking = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.open = function() {
    var method = arguments[0];
    var reqURL = arguments[1];
    var that = this;
    coyoTrackingUtils._openRequests++;
    if(ENV !== 'prod') console.debug(coyoTrackingUtils._openRequests);
    // special case for getting request data from send() method
    coyoRequestTrackingConfig.forEach(function(item) {
        if (method == item.method && reqURL && reqURL.match(item.urlPattern) && item.saveRequestData) {
            that.saveRequestData = true;
        }
    });

    //quicksearch handling: do not track every response on typing, wait some time and track the last (possible complete) term 
    if(reqURL.match(/web\/quick-entity-search/g)){
        coyoTrackingUtils._pendingSearch++;
    }

    this.addEventListener('load', function(e) {
        coyoTrackingUtils._openRequests--;
        if(ENV !== 'prod') console.debug(coyoTrackingUtils._openRequests);
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
if(TRACKINGSETTINGS.USE_TAGMANAGER){
    coyoTrackingUtils.onContentReady(function(){
        if(ENV !== 'prod') console.debug('initial?',coyoTrackingUtils._initialStateChangeFired);
        if(!coyoTrackingUtils._initialStateChangeFired) {
            if(ENV !== 'prod'){console.debug('initial page call');}
            trackPageView();
            coyoTrackingUtils._initialStateChangeFired = true;
        }
    });
}