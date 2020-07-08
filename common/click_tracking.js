/** ######################## **/
/* _$PROJECT$_ Click Tracking _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

var ignore = 'data-piwikignore';
var ignoreSelector = ':not(['+ignore+']';

if(TRACKINGSETTINGS.TRACKEXTERNALFILES) {
    var FILELINKSELECTOR = '';
    for(var i=0; i<coyoTrackingUtils.FILEEXTENSIONS.length;i++){
        FILELINKSELECTOR += 'a[href$=".' + coyoTrackingUtils.FILEEXTENSIONS[i] + '"]'+':not(['+ignore+'-extfile])';
        if(i !== coyoTrackingUtils.FILEEXTENSIONS.length-1) FILELINKSELECTOR += ', ';
    }
}

//click event tracking
var coyoClickTracking = {
    filterClickTracking: function(category, item) {
        item.addEventListener('click', function() {
            var name = "";
            item.querySelectorAll('span:not(.badge)').forEach(function(item){
                name+=item.textContent;
            });
            name = name.trim();
            var hasResults = item.querySelector('span.badge') !== null;
            sendTrackingEvent(category, coyoTrackingUtils.typeNameOverrides('Click'), coyoTrackingUtils.typeNameOverrides(name), null, hasResults);
        });
        item.setAttribute("data-clickevent", "true");
    },

    // the attribute data-title is set by listening to the stream HEAD request in tracking.js
    // if there is no such attribute, this failed because it was not possible to parse a title or match the response with an element
    addVideoTracking: function() {
        document.querySelectorAll('video'+ignoreSelector).forEach(function(item) {
            console.debug('found video:', item);
            // if a default uploaded video is embedded in a post, there is no information about the title
            // look into objectDB, otherwise send a HEAD request to the source, parse the title from the header, add the data-title attribute to that video
            // then track it with its title on first play
            item.setAttribute(ignore, "true");
            if(!item.getAttribute('data-title')) {
                console.debug('no title found, try to get it...');
                coyoTrackingUtils.getVideoInfo(item.src,function(filename){
                    item.setAttribute('data-title',filename);
                });
            }
            item.addEventListener('play', function(e){
                var viewed = item.getAttribute('data-viewed');
                //only track initial video starts
                console.debug('video play triggered, viewed: '+viewed);
                if(!viewed) {
                    setTimeout(function(){
                        var title = item.getAttribute('data-title');
                        var modal = document.querySelector('.modal-dialog');
                        console.debug('title: '+title+'\t/\tmodal: '+(modal.length > 0));
                        if(title && !modal) sendTrackingEvent('Media', coyoTrackingUtils.typeNameOverrides('View'), title, null);
                        item.setAttribute('data-viewed', "true");
                    },500);
                }
            });
            item.setAttribute(ignore, "true");
        });
    },

    addClickBindings: function(){
        // Header Navigation
        if(TRACKINGSETTINGS.NAV_MAIN) {
            document.querySelectorAll(SELECTORS.HEAD_NAVIGATION+ignoreSelector).forEach(function(item) {
                // skip mobile menu button
                if(item.getAttribute('ng-click') === '$ctrl.openMenu()') return true
                item.addEventListener('click', function(e){
                    var name='Navigation';
                    name = item.className === 'nav-item-brand' ? 'Home' :item.querySelector('.nav-item-label').textContent.trim();
                    sendTrackingEvent('Header', coyoTrackingUtils.typeNameOverrides('Click'), coyoTrackingUtils.typeNameOverrides(name), null);
                });
                item.setAttribute(ignore, "true");
            });
        }
        // Header Subnavigation
        if(TRACKINGSETTINGS.NAV_SUB) {
            document.querySelectorAll(SELECTORS.HEAD_SUBNAVIGATION+ignoreSelector).forEach(function(item) {
                item.addEventListener('click', function(e){
                    var name='Navigation';
                    name = item.textContent.trim();
                    sendTrackingEvent('Navi-Top', coyoTrackingUtils.typeNameOverrides('Click'), coyoTrackingUtils.typeNameOverrides(name), null);
                });
                item.setAttribute(ignore, "true");
            });
        }
        // Mobile Sidebar Navigation
        if(TRACKINGSETTINGS.NAV_MOBILE) {
            document.querySelectorAll(SELECTORS.NAV_SIDEBAR+ignoreSelector).forEach(function(item) {
                item.addEventListener('click', function(e){
                    if(coyoTrackingUtils.excludeUrl(window.location.href)) return;
                    var name='Navigation';
                    name = item.textContent.trim();
                    sendTrackingEvent('Navi-Mobile', coyoTrackingUtils.typeNameOverrides('Click'), coyoTrackingUtils.typeNameOverrides(name), null);
                });
                item.setAttribute(ignore, "true");
            });
        }
        if(TRACKINGSETTINGS.SIDEBAR_SUBSCRIPTIONS) {
            document.querySelectorAll(SELECTORS.SIDEBAR_SUBSCRIPTIONS+ignoreSelector).forEach(function(item) {
                item.addEventListener('click', function(){
                    var type = /\/pages\//gi.exec(item.href) ? 'widget-my-pages' : 'widget-my-workspaces';
                    var name = item.querySelector('span').textContent.trim();
                    sendTrackingEvent(type, coyoTrackingUtils.typeNameOverrides('Click'), coyoTrackingUtils.typeNameOverrides(name), null);
                });
                item.setAttribute(ignore, "true");
            });
        }
        if(TRACKINGSETTINGS.SIDEBAR_BOOKMARKS) {
            document.querySelectorAll(SELECTORS.SIDEBAR_BOOKMARKS+ignoreSelector).forEach(function(item) {
                item.addEventListener('click', function(e){
                    var name = item.textContent.trim();
                    sendTrackingEvent('widget-bookmarks', coyoTrackingUtils.typeNameOverrides('Click'), coyoTrackingUtils.typeNameOverrides(name), null);
                });
                item.setAttribute(ignore, "true");
            });
        }
        if(TRACKINGSETTINGS.SEARCHFILTER) {
            document.querySelectorAll(SELECTORS.SEARCHFILTER_TYPE+ignoreSelector).forEach(function(item) {
                coyoClickTracking.filterClickTracking(coyoTrackingUtils.typeNameOverrides('Search-Type'),item);
                item.setAttribute(ignore, "true");
            });
            document.querySelectorAll(SELECTORS.SEARCHFILTER_MODIFIED+ignoreSelector).forEach(function(item) {
                coyoClickTracking.filterClickTracking(coyoTrackingUtils.typeNameOverrides('Search-Modified'),item);
                item.setAttribute(ignore, "true");
            });
            document.querySelectorAll(SELECTORS.SEARCHFILTER_LOCATION+ignoreSelector).forEach(function(item) {
                coyoClickTracking.filterClickTracking(coyoTrackingUtils.typeNameOverrides('Search-Location'),item);
                item.setAttribute(ignore, "true");
            });
            document.querySelectorAll(SELECTORS.SEARCHFILTER_AUTHOR+ignoreSelector).forEach(function(item) {
                coyoClickTracking.filterClickTracking(coyoTrackingUtils.typeNameOverrides('Search-Author'),item);
                item.setAttribute(ignore, "true");
            });
        }
        if(TRACKINGSETTINGS.TRACKEXTERNALFILES) {
            document.querySelectorAll(FILELINKSELECTOR).forEach(function(item) {
                item.setAttribute(ignore+'-extfile', "true");
                item.addEventListener('click', function(e) {
                    var title = coyoTrackingUtils.shortenString(item.textContent,200)
                    sendTrackingEvent('Media', coyoTrackingUtils.typeNameOverrides('View'), title, null);
                });
            });
        }
    }
}

// page view tracking
window.document.addEventListener('stateChangeSuccess', debounce(function() {
    coyoTrackingUtils.onContentReady(function(){
        coyoClickTracking.addClickBindings();
        if(TRACKINGSETTINGS.VIDEOPLAY && TRACKINGSETTINGS.MEDIA_VIEW) coyoClickTracking.addVideoTracking();
    });
},1000));

coyoTrackingUtils.onContentReady(function(){
    coyoClickTracking.addClickBindings();
    coyoClickTracking.addVideoTracking();
});