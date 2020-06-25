/** ######################## **/
/* _$PROJECT$_ Custom Code _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

var ignore = 'data-piwikignore';
var ignoreSelector = ':not(['+ignore+']';

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
            sendTrackingEvent(category, 'Klick', coyoTrackingUtils.typeNameOverrides(name), null, hasResults);
        });
        item.setAttribute("data-clickevent", "true");
    },

    // the attribute data-title is set by listening to the stream HEAD request in tracking.js
    // if there is no such attribute, this failed because it was not possible to parse a title or match the response with an element
    addVideoTracking: function() {
        document.querySelectorAll('video'+ignoreSelector).forEach(function(item) {
            // if a default uploaded video is embedded in a post, there is no information about the title
            // look into objectDB, otherwise send a HEAD request to the source, parse the title from the header, add the data-title attribute to that video
            // then track it with its title on first play
            item.setAttribute(ignore, "true");
            if(!item.getAttribute('data-title')) {
                coyoTrackingUtils.getVideoInfo(item.src,function(filename){
                    item.setAttribute('data-title',filename);
                });
            }
            item.addEventListener('play', function(e){
                var viewed = item.getAttribute('data-viewed');
                //only track initial video starts
                if(!viewed) {
                    setTimeout(function(){
                        var title = item.getAttribute('data-title');
                        var modal = document.querySelector('.modal-dialog');
                        if(title && !modal) sendTrackingEvent('Media', 'Ansicht', title, null);
                        item.setAttribute('data-viewed', "true");
                    },500);
                }
            });
            item.setAttribute(ignore, "true");
        });
    },

    addClickBindings: function(){
        // Header Navigation
        document.querySelectorAll(SELECTORS.HEAD_NAVIGATION+ignoreSelector).forEach(function(item) {
            // skip mobile menu button
            if(item.getAttribute('ng-click') === '$ctrl.openMenu()') return true
            item.addEventListener('click', function(e){
                var name='Navigation';
                name = item.className === 'nav-item-brand' ? 'Startseite' :item.querySelector('.nav-item-label').textContent.trim();
                sendTrackingEvent('Header', 'Klick', coyoTrackingUtils.typeNameOverrides(name), null);
            });
            item.setAttribute(ignore, "true");
        });
        // Header Subnavigation
        document.querySelectorAll(SELECTORS.HEAD_SUBNAVIGATION+ignoreSelector).forEach(function(item) {
            item.addEventListener('click', function(e){
                var name='Navigation';
                name = item.textContent.trim();
                sendTrackingEvent('Navi-Top', 'Klick', coyoTrackingUtils.typeNameOverrides(name), null);
            });
            item.setAttribute(ignore, "true");
        });
        // Mobile Sidebar Navigation
        document.querySelectorAll(SELECTORS.NAV_SIDEBAR+ignoreSelector).forEach(function(item) {
            item.addEventListener('click', function(e){
                if(coyoTrackingUtils.excludeUrl(window.location.href)) return;
                var name='Navigation';
                name = item.textContent.trim();
                sendTrackingEvent('Navi-Mobile', 'Klick', coyoTrackingUtils.typeNameOverrides(name), null);
            });
            item.setAttribute(ignore, "true");
        });
        document.querySelectorAll(SELECTORS.SIDEBAR_SUBSCRIPTIONS+ignoreSelector).forEach(function(item) {
            item.addEventListener('click', function(){
                var type = /\/pages\//gi.exec(item.href) ? 'Widget-Meine-Seiten' : 'Widget-Meine-Arbeitsraeume';
                var name = item.querySelector('.senderName').textContent.trim();
                sendTrackingEvent(type, 'Klick', coyoTrackingUtils.typeNameOverrides(name), null);
            });
            item.setAttribute(ignore, "true");
        });
        document.querySelectorAll(SELECTORS.SIDEBAR_BOOKMARKS+ignoreSelector).forEach(function(item) {
            item.addEventListener('click', function(){
                var name = item.textContent.trim();
                sendTrackingEvent('Widget-Lesezeichen', 'Klick', coyoTrackingUtils.typeNameOverrides(name), null);
            });
            item.setAttribute(ignore, "true");
        });
        document.querySelectorAll(SELECTORS.SEARCHFILTER_TYPE+ignoreSelector).forEach(function(item) {
            coyoClickTracking.filterClickTracking('Suche-Typ',item);
            item.setAttribute(ignore, "true");
        });
        document.querySelectorAll(SELECTORS.SEARCHFILTER_MODIFIED+ignoreSelector).forEach(function(item) {
            coyoClickTracking.filterClickTracking('Suche-Geaendert',item);
            item.setAttribute(ignore, "true");
        });
        document.querySelectorAll(SELECTORS.SEARCHFILTER_LOCATION+ignoreSelector).forEach(function(item) {
            coyoClickTracking.filterClickTracking('Suche-Ort',item);
            item.setAttribute(ignore, "true");
        });
        document.querySelectorAll(SELECTORS.SEARCHFILTER_AUTHOR+ignoreSelector).forEach(function(item) {
            coyoClickTracking.filterClickTracking('Suche-Autor',item);
            item.setAttribute(ignore, "true");
        });
    }
}

// page view tracking
window.document.addEventListener('stateChangeSuccess', debounce(function() {
    setTimeout(function() {
        coyoClickTracking.addClickBindings();
        coyoClickTracking.addVideoTracking();
    }, extanaSettings.delayForStateChange || 2);
}, 1000), false);
coyoClickTracking.addClickBindings();
coyoClickTracking.addVideoTracking();