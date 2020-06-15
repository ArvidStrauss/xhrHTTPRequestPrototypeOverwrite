/** ######################## **/
/* _$PROJECT$_ Tracking Utils _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

var coyoTrackingUtils = {
    createHashCode: function(input) {
        var hash = 0, i, chr;
        if (!input || input.length === 0) return hash;
        for (i = 0; i < input.length; i++) {
            chr = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        return hash;
    },
    getUserIdHash: function() {
        return ''+coyoTrackingUtils.createHashCode(localStorage.getItem('ngStorage-userId'));
    },
    cleanupCustomDimensions: function() {
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETYPE]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETITLE]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTYPE]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTITLE]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_CONTENTTITLE]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETYPE_EVENT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETITLE_EVENT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTYPE_EVENT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTITLE_EVENT]);
        //VISIT TEST
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETYPE_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETITLE_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTYPE_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTITLE_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_CONTENTTITLE_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETYPE_EVENT_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETITLE_EVENT_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTYPE_EVENT_VISIT]);
        _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTITLE_EVENT_VISIT]);
    },
    excludeUrl: function(url,pathArray) {
        var paths = pathArray || EXCLUDED_PATHS;
        return paths && paths.some(function(path) {
            return url && url.indexOf(location.host + path) >= 0;
        });
    },
    excludeUser: function(item) {
        var user = '';
        if (!item || !item.type) return false;

        switch (item.type) {
            case 'timeline-item': user = item.author; break;
            case 'user': user = item.name; break;
            default: return false;
        }

        return EXCLUDE_TIMELINETRACKINGUSERS && EXCLUDE_TIMELINETRACKINGUSERS.some(function(item) {
            return item == user;
        });
    },
    excludeFromTracking: function(pathArray) {
        // check container of a file within the preview modal
        var fileOriginElem = document.querySelector('coyo-library-file-details .coyo-file-details dt[translate="FILE_DETAILS.FILE_ORIGIN"]');
        if (fileOriginElem) {
            try {
                var linkElem = fileOriginElem.nextElementSibling.getElementsByTagName('a')[0];
                var url = linkElem ? linkElem.href : null;
                if (coyoTrackingUtils.excludeUrl(url,pathArray)) {
                    return true;
                }
            } catch (e) { }
        }
        return coyoTrackingUtils.excludeUrl(location.href,pathArray) || coyoTrackingUtils.preventTracking;
    },
    typeNameOverrides: function(typeName,escape) {
        escape = (typeof escape === 'boolean' && escape) ? true : false;
        var overrides = {
            'pages': 'Seiten',
            'page': 'Seite',
            'home': 'Startseite',
            'workspaces': 'Arbeitsräume',
            'arbeitsraeume': 'Arbeitsräume',
            'workspace': 'Arbeitsraum',
            'blog-article': 'Blog-Artikel',
            'wiki-article': 'Wiki-Artikel',
            'chat-message': 'Chat',
            'create': 'Erstellen',
            'timeline-item': 'Timeline-Item',
            'comment': 'Kommentieren',
            'share': 'Teilen',
            'subscribe': 'Abonnieren',
            'unsubscribe': 'Deabonnieren',
            'search': 'Suche',
            'timeline': 'Timeline',
            'filelibrary': 'Dokumente',
            'file-library': 'Dokumente',
            'content': 'Content',
            'article': 'Artikel',
            // 'timeline': 'Verlauf',
            'list': 'Liste',
            'invited': 'Einladungen',
            'imprint': 'Impressum',
            // 'events': 'termine',
            'colleagues': 'Kollegen',
            'activity': 'Aktivitaeten',
            'quicksearch': 'Schnellsuche',
            // 'blog-list-view': 'Blog',
            // 'wiki-list-view': 'Wiki'
        };
        typeName = overrides[typeName.toLowerCase().trim()] || typeName;
        if(typeName && typeName.length) typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        if(escape) typeName = encodeURIComponent(coyoTrackingUtils.shortenString(typeName,200));
        return typeName;
    },
    typeNameOverridesPageId: function(typeName) {
        var overrides = {
            'pages': 'seiten',
            'page': 'seite',
            'home': 'startseite',
            'workspaces': 'ar',
            'arbeitsraeume': 'ar',
            'workspace': 'ar',
            'search': 'suche',
            'filelibrary': 'dokumente'
        };
        return overrides[typeName] || typeName;
    },
    translateText: function(text) {
        return text && text.toLowerCase()
            .replace(/[\/\ \.]/g, '-')
            .replace(/\u00dc/g, 'Ue')
            .replace(/\u00fc/g, 'ue')
            .replace(/\u00c4/g, 'Ae')
            .replace(/\u00e4/g, 'ae')
            .replace(/\u00e4/g, 'ae')
            .replace(/\u00d6/g, 'Oe')
            .replace(/\u00f6/g, 'oe')
            .replace(/\u00df/g, 'ss')
            .replace(/_/g, '-')
            .replace(/(?:\r\n|\r|\n)/g, '-')
            .replace(/&/g, ' und ')
            .replace(/@/g, ' -at- ')
            .replace(/[^a-zA-Z0-9 \-\\.\/]+/g, '') //remove . after text inside a title to avoid confusion with . as separator
            .replace(/\s+/g, '-')
            .replace(/[-]{2,}/g,'-')
            .replace(/^-*/g, '') //remove all trailing '-' so we dont get '-my-shiny-title-'
            .replace(/-*$/g, '') || '';
    },
    shortenString: function(input, maxlength) {
        maxlength = maxlength || 30;
        return input.length > maxlength ? input.substring(0, maxlength).trim() + '...' : input;
    },
    toAbsoluteUrl: (function() {
        // return a function and keep elem to prevent creation 
        // of <a>-element each time this function is called
        var elem;
        return function(url) {
            elem = elem || document.createElement('a');
            elem.href = url;
            return elem.href;
        };
    })(),
    parseQueryString: function(str) {
        var query = (str || '?').substr(1);
        var map = {};
        query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
            (map[key] = map[key] || []).push(value);
        });
        return map;
    },

    getPageConfig: function (override) {
        var contentGroup = [CONTENTBASE];
        var trackingTitle = '';
        override = override || {};

        var analyzePage = function (contentGroup, override) {
            var page = $('section.page div.panel.panel-default div.panel-foreground div.titles-container div.title-description-wrapper div.title').text().trim() || (location.href.split('/')[4] ? decodeURIComponent(location.href.split('/')[4]) : null);
            var navigation = $('section.page .content-sidebar .panel-navigation ul.nav.nav-default li.filter-entry.active a').text().trim() || coyoTrackingDBHelper.getObjectData(window.location.href.split('/')[7]).name;
            var bodyClass = $('body').attr('class');
            var classMatch = /state-main-page-show-apps-([\w\-]*)/g.exec(bodyClass) || /state-main-page-show-([\w\-]*)/g.exec(bodyClass) || /state-main-page-([\w\-]*)/g.exec(bodyClass);
            var app = window.location.href.split('/')[6] ? decodeURIComponent(window.location.href.split('/')[6]) : (classMatch ? classMatch[1] : '');
            // check for platform specific type name overrides
            contentGroup[1] = 'pages';
            if (page) contentGroup[2] = override[2] ? override[2] : page;
            if (app && 'create' !== app.toLowerCase()) contentGroup[3] = override[3] ? override[3] : app;
            if (navigation) contentGroup[4] = override[4] ? override[4] : navigation;
        };

        var analyzeWorkspace = function (contentGroup, override) {
            var workspace = $('section.workspace div.panel.panel-default div.panel-foreground div.titles-container div.title').text().trim() || (location.href.split('/')[4] ? decodeURIComponent(location.href.split('/')[4]) : null);
            var navigation = $('section.workspace .content-sidebar .panel-navigation ul.nav.nav-default li.filter-entry.active a').text().trim() || coyoTrackingDBHelper.getObjectData(window.location.href.split('/')[7]).name;
            var bodyClass = $('body').attr('class');
            var classMatch = /state-main-workspace-show-apps-([\w\-]*)/g.exec(bodyClass) || /state-main-workspace-show-([\w\-]*)/g.exec(bodyClass) || /state-main-workspace-([\w\-]*)/g.exec(bodyClass);
            var app =  window.location.href.split('/')[6] ? decodeURIComponent(window.location.href.split('/')[6]) : (classMatch ? classMatch[1] : '');
            // check for platform specific type name overrides
            contentGroup[1] = 'workspaces';
            if (workspace) contentGroup[2] = override[2] ? override[2] : workspace;
            if (app && 'create' !== app.toLowerCase()) contentGroup[3] = override[3] ? override[3] : app;
            if (navigation) contentGroup[4] = override[4] ? override[4] : navigation;
        };

        var analyzeEvent = function (contentGroup, override) {
            var event = $('section.event div.panel.panel-default div.titles-container div.title').text().trim() || (location.href.split('/')[4] ? decodeURIComponent(location.href.split('/')[4]) : null);
            var bodyClass = $('body').attr('class');
            var classMatch = /state-main-event-show-([\w\-]*)/g.exec(bodyClass) || /state-main-event-([\w\-]*)/g.exec(bodyClass);
            var app =  window.location.href.split('/')[6] ? decodeURIComponent(window.location.href.split('/')[6]) : (classMatch ? classMatch[1] : '');
            // check for platform specific type name overrides
            contentGroup[1] = 'events';
            if (event) contentGroup[2] = override[2] ? override[2] : event;
            if (app && 'create' !== app.toLowerCase()) contentGroup[3] = override[3] ? override[3] : app;
        };

        var analyzeContentTitle = function (contentGroup, override) {
            // check if the user is creating or editing sth
            var bodyClass = $('body').attr('class');
            var classMatch = /state-main-(page|workspace|event)-show-apps-([\w\-]*)/g.exec(bodyClass) ||
                /state-main-(page|workspace|event)-show-([\w\-]*)/g.exec(bodyClass) ||
                /state-main-(page|workspace|event)-([\w\-]*)/g.exec(bodyClass);
            var func = classMatch ? /-(create|edit)$/g.exec(classMatch[2]) : null;
            func = func ? func[1] : null;

            // cloning and stuff is needed to remove the status text from title string (open, closed, etc.)
            var threadTitle = $('.thread-view .thread-title').clone().children().remove().end().text().trim();
            // since is possible that there are multiple article titles on a page, we have to priorize them with the following statement
            var articleTitleElem = $($('.article-view .panel-title-main:first')[0] || $('.article-view .panel-title:first')[0] || $('.article-view .article-title:first')[0]);
            var articleTitle = articleTitleElem.text().trim();

            if (func && !articleTitle) {
                articleTitle = $('form input[id*="title"]').val().trim();
            }

            var title = articleTitle || threadTitle;
            if (title) {
                contentGroup[contentGroup.length] = override[contentGroup.length] ? override[contentGroup.length] : title;
                trackingTitle = title + ':' + (contentGroup[2] || '');
            }
            // add 'create' or 'edit' behind the content or app title
            if (func) {
                contentGroup[contentGroup.length] = override[contentGroup.length] ? override[contentGroup.length] : func;
            }
        }

        var analyzeFile = function (contentGroup, override) {
            var page = decodeURIComponent(location.href.split('/')[6]);
            // check for platform specific type name overrides
            contentGroup[1] = 'filelibrary';
            if (page) contentGroup[2] = override[2] ? override[2] : page;
        };

        // find the first navigation level
        var navItem = $('nav.navbar-main ul.nav li.nav-item.active a');
        if (!navItem.length) {
            navItem = $('div.sub-navigation nav.navbar ul.nav li.nav-item.active a.nav-item');
        }

        if (navItem.length && navItem.attr('href')) {
            var menuEntry = (/\/([^?\/]*)/g).exec(navItem.attr('href'));
            if (menuEntry && menuEntry.length > 1) {
                contentGroup[1] = override[1] ? override[1] : menuEntry[1];
            }
        } else if ($('div.content section.profile').length) {
            contentGroup[1] = override[1] ? override[1] : 'profile';
        } else {
            // get the current position generically from body class
            var classMatch = (/state-main-([\w-]*)/g).exec($('body:eq(0)').attr('class'));
            if (classMatch && classMatch.length > 1) {
                contentGroup[1] = override[1] ? override[1] : classMatch[1];
            } else if ((/state-admin/g).exec($('body:eq(0)').attr('class'))) {
                contentGroup[1] = override[1] ? override[1] : 'admin';
            }
        }

        var contentGroupTwo = {
            'home': function () {
                var homepage = (/\/[^\/]*\/([^?\/]*)/g).exec(navItem.attr('href'));
                if (homepage.length > 1) {
                    contentGroup[2] = override[2] ? override[2] : homepage[1];
                }
            },
            'pages': function () {
                analyzePage(contentGroup, override);
                analyzeContentTitle(contentGroup, override);
            },
            'workspaces': function () {
                analyzeWorkspace(contentGroup, override);
                analyzeContentTitle(contentGroup, override);
            },
            'events': function () {
                analyzeEvent(contentGroup, override);
            },
            'profile': function () {
                var name = $('section.profile div.panel.panel-default div.titles-container div.title').text();
                var view = $('section.profile div.panel.panel-default div.profile-nav ul.nav li.nav-item.active').attr('href');
                if (view && view.split('/').length > 3) {
                    contentGroup[3] = override[3] ? override[3] : view.split('/')[3];
                }
                contentGroup[2] = override[2] ? override[2] : name;
            },
            'timeline-item': function () {
                var itemMatch = /\/timeline\/item\/([0-9a-fA-F-]*)/g.exec(window.location.href);
                if (itemMatch) {
                    contentGroup[2] = override[2] ? override[2] : coyoTrackingDBHelper.getObjectData(itemMatch[1]).name;
                }
            },
            'fileLibrary': function () {
                analyzeFile(contentGroup, override);
            }
        };
        if (contentGroupTwo[contentGroup[1]]) {
            contentGroupTwo[contentGroup[1]]();
        }

        //remove anchor tag from pageType
        if(contentGroup[1] && contentGroup[1].indexOf('#') !== -1){
            contentGroup[1] = contentGroup[1].substr(0,contentGroup[1].indexOf('#'));
        }
        
        return {
            contentGroup: contentGroup,
            trackingTitle: trackingTitle
        };
    },
    pageIdToString: function (page) {
        var result = "";
        if (page) {
            for (i = 0; i < 100; i++) {
                if (page[i]) {
                    result += (i > 0 ? "." : "");
                    if (i > 4 && i === page.length-1) {
                        result += coyoTrackingUtils.shortenString(coyoTrackingUtils.typeNameOverridesPageId(coyoTrackingUtils.translateText(page[i])));
                    } else {
                        result += coyoTrackingUtils.typeNameOverridesPageId(coyoTrackingUtils.translateText(page[i]));
                    }
                } else {
                    break;
                }
            }
        }
        return result;
    },
    getResponseHeaders: function (respObj) {
        var headers = respObj.getAllResponseHeaders().split(/\r\n/);
        var headersFormatted = {};
        for(i=0;i<headers.length;i++){
            var item = headers[i].split(': ');
            var name = item[0];
            var value = item[1]
            headersFormatted[name] = value;
        }
        return headersFormatted;
    },
    getVideoInfo: function (url,callback){
        var docMatch = (/documents\/([0-9a-fA-F-]*)/g).exec(url);
        var objData = coyoTrackingDBHelper.getObjectData(docMatch[1]);
        if(objData && objData.name && objData.name.length){
            callback(objData.name);
        } else {
            var http = new XMLHttpRequest();
            http.open('HEAD', url);
            http.onreadystatechange = function() {
                if (this.readyState == this.DONE) {
                    var respHeader = coyoTrackingUtils.getResponseHeaders(this);
                    var filename = respHeader['content-disposition'].match(/filename=\".*(?=")/g)[0].replace('filename="','');
                    callback(filename);
                }
            };
            http.send();
        }
    }
};