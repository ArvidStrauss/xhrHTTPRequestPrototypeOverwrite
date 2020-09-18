/** ######################## **/
/* _$PROJECT$_ Tracking Utils _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

var coyoTrackingUtils = {
    OVERRIDES: {
        TYPE: {},
        PAGEID: {}
    },
    FILEEXTENSIONS: ['7z','aac','apk','arc','arj','asf','asx','avi','azw3','bin','csv','deb','dmg','doc','docx',
    'epub','exe','flv','gif','gz','gzip','hqx','ibooks','jar','jpg','jpeg','js','mobi','mp2','mp3','mp4','mpg',
    'mpeg','mov','movie','msi','msp','odb','odf','odg','ods','odt','ogg','ogv','pdf','phps','png','ppt','pptx',
    'qt','qtm','ra','ram','rar','rpm','sea','sit','tar','tbz','tbz2','bz','bz2','tgz','torrent','txt','wav','wma',
    'wmv','wpd','xls','xlsx','xml','z','zip'],
    _openRequests: 0,
    _currentUrl: location.href,
    _initialStateChangeFired: false,
    _pendingSearch: 0,
    _lastFileId: '',
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
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETYPE_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETITLE_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTYPE_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTITLE_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_CONTENTTITLE_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETYPE_EVENT_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_PAGETITLE_EVENT_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTYPE_EVENT_VISIT]);
        // _paq.push(['deleteCustomDimension', CUSTOMDIMENSION_APPTITLE_EVENT_VISIT]);
    },
    excludeUrl: function(url,pathArray) {
        var paths = pathArray || EXCLUDED_PATHS;
        return paths && paths.some(function(path) {
            var regex = new RegExp(path.replace('/','\\/')+'(?=$|\\/|\\?)','gi')
            return url && url.match(regex);
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
        typeName = coyoTrackingUtils.OVERRIDES.TYPE[typeName.toLowerCase().trim()] || typeName;
        if(typeName && typeName.length) typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        if(escape) typeName = encodeURIComponent(coyoTrackingUtils.shortenString(typeName,200));
        typeName = coyoTrackingUtils.cleanUnicodeIcons(typeName).text;
        return typeName;
    },
    typeNameOverridesPageId: function(typeName) {
        return coyoTrackingUtils.OVERRIDES.PAGEID[typeName] || typeName;
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
    parseQueryString: function(str) {
        var query = (str || '?').substr(1);
        var map = {};
        query.replace(/([^&=]+)=?([^&]*)(?:&+|$)/g, function(match, key, value) {
            (map[key] = map[key] || []).push(value);
        });
        return map;
    },
    getElementAngularController: function(selector) {
        var object = document.querySelector(selector);
        var angularData = angular.element(object).data() || {};
        var controllerKey = Object.keys(angularData)[0];
        return angularData[controllerKey];
    },
    /* Pass in the objects to merge as arguments.
   For a deep extend, set the first argument to `true`.*/
    extend: function () {
        // Variables
        var extended = {};
        var deep = false;
        var i = 0;
        var length = arguments.length;
        // Check if a deep merge
        if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
            deep = arguments[0];
            i++;
        }
        // Merge the object into the extended object
        var merge = function (obj) {
            for ( var prop in obj ) {
                if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                    // If deep merge and property is an object, merge properties
                    if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                        extended[prop] = extend( true, extended[prop], obj[prop] );
                    } else {
                        extended[prop] = obj[prop];
                    }
                }
            }
        };
        // Loop through each object and conduct a merge
        for ( ; i < length; i++ ) {
            var obj = arguments[i];
            merge(obj);
        }
        return extended;
    },
    /* handleAppTypeExceptions
    * we check the class for an appname (because the url is unreliabe)
    * to fix things like blog-list-view to "blog", we cut this class at the first '-', but there are exceptions from that rule which are handled here
    */
    handleAppTypeExceptions: function(classMatch) {
        var split = classMatch.split('-');
        if(split.length > 1 && split[1].length > 0){
            switch(split[0]) {
                case 'members': 
                    return (['list','invited','requested'].indexOf(split[1]) !== -1) ? split[0]+'-'+split[1] : split[0];
                case 'file': 
                    return (['library'].indexOf(split[1]) !== -1) ? split[0]+'-'+split[1] : split[0];
                case 'blog': 
                    return (['article'].indexOf(split[1]) !== -1) ? split[0]+'-'+split[1] : split[0];
                case 'wiki': 
                    return (['article'].indexOf(split[1]) !== -1) ? split[0]+'-'+split[1] : split[0];
                case 'chat': 
                    return (['message'].indexOf(split[1]) !== -1) ? split[0]+'-'+split[1] : split[0];
                case 'timeline': 
                    return (['item'].indexOf(split[1]) !== -1) ? split[0]+'-'+split[1] : split[0];
                default:
                    return split[0]
            }
        }
        return split[0];
    },
    getPageConfig: function (override) {
        var contentGroup = [CONTENTBASE];
        var trackingTitle = '';
        override = override || {};

        var analyzePage = function (contentGroup, override) {
            var splitUrl = window.location.href.split('/');
            var pageElem = document.querySelector('section.page div.panel.panel-default div.panel-foreground div.titles-container div.title-description-wrapper div.title');
            var page = pageElem && pageElem.textContent.trim() || (splitUrl[4] ? decodeURIComponent(splitUrl[4]) : null);
            var navElem = document.querySelector('section.page .content-sidebar .panel-navigation ul.nav.nav-default li.filter-entry.active a');
            var navigation = navElem && navElem.textContent.trim() || coyoTrackingDBHelper.getObjectData(splitUrl[7]).name;
            var bodyClass = document.querySelector('body').getAttribute('class');
            var classMatch = /state-main-page-show-apps-([\w\-]*)/g.exec(bodyClass) || /state-main-page-show-([\w\-]*)/g.exec(bodyClass) || /state-main-page-([\w\-]*)/g.exec(bodyClass);
            if(ENV !== 'prod') console.log('analyzePage',bodyClass,classMatch);
            if(classMatch && classMatch[1]) {
                // see comments on function for more info
                var app = coyoTrackingUtils.handleAppTypeExceptions(classMatch[1]);
            } else if (splitUrl[6]) {
               // handle anything that is not an app by prepending the type like members_invited
               var app = splitUrl[5] && splitUrl[5] !== 'apps' ? decodeURIComponent(splitUrl[5] +'-'+ splitUrl[6]) : decodeURIComponent(splitUrl[6]);
            }
            // check for platform specific type name overrides
            contentGroup[1] = 'pages';
            if (page) contentGroup[2] = override[2] ? override[2] : page;
            if (app && 'create' !== app.toLowerCase()) contentGroup[3] = override[3] ? override[3] : app;
            if (navigation) contentGroup[4] = override[4] ? override[4] : navigation;
        };

        var analyzeWorkspace = function (contentGroup, override) {
            var splitUrl = window.location.href.split('/');
            var workspaceElem = document.querySelector('section.workspace div.panel.panel-default div.panel-foreground div.titles-container div.title');
            var workspace = workspaceElem && workspaceElem.textContent.trim() || (splitUrl[4] ? decodeURIComponent(splitUrl[4]) : null);
            var navElem = document.querySelector('section.workspace .content-sidebar .panel-navigation ul.nav.nav-default li.filter-entry.active a');
            var navigation = navElem && navElem.textContent.trim() || coyoTrackingDBHelper.getObjectData(splitUrl[7]).name;
            var bodyClass = document.querySelector('body').getAttribute('class');
            var classMatch = /state-main-workspace-show-apps-([\w\-]*)/g.exec(bodyClass) || /state-main-workspace-show-([\w\-]*)/g.exec(bodyClass) || /state-main-workspace-([\w\-]*)/g.exec(bodyClass);
            if(ENV !== 'prod') console.log('analyzeWorkspace',bodyClass,classMatch);
            if(classMatch && classMatch[1]) {
                // see comments on function for more info
                var app = coyoTrackingUtils.handleAppTypeExceptions(classMatch[1]);
            } else if (splitUrl[6]) {
               // handle anything that is not an app by prepending the type like members_invited
               var app = splitUrl[5] && splitUrl[5] !== 'apps' ? decodeURIComponent(splitUrl[5] +'-'+ splitUrl[6]) : decodeURIComponent(splitUrl[6]);
            }
            // check for platform specific type name overrides
            contentGroup[1] = 'workspaces';
            if (workspace) contentGroup[2] = override[2] ? override[2] : workspace;
            if (app && 'create' !== app.toLowerCase()) contentGroup[3] = override[3] ? override[3] : app;
            if (navigation) contentGroup[4] = override[4] ? override[4] : navigation;
        };

        var analyzeEvent = function (contentGroup, override) {
            var splitUrl = window.location.href.split('/');
            var eventElem = document.querySelector('section.event div.panel.panel-default div.titles-container div.title');
            var event = eventElem && eventElem.textContent.trim() || (splitUrl[4] ? decodeURIComponent(splitUrl[4]) : null);
            var bodyClass = document.querySelector('body').getAttribute('class');
            var classMatch = /state-main-event-show-([\w\-]*)/g.exec(bodyClass) || /state-main-event-([\w\-]*)/g.exec(bodyClass);
            if(ENV !== 'prod') console.log('analyzeEvent',bodyClass,classMatch);
            if(classMatch && classMatch[1]) {
                // see comments on function for more info
                var app = coyoTrackingUtils.handleAppTypeExceptions(classMatch[1]);
            } else if (splitUrl[6]) {
               // handle anything that is not an app by prepending the type like members_invited
               var app = splitUrl[5] && splitUrl[5] !== 'apps' ? decodeURIComponent(splitUrl[5] +'-'+ splitUrl[6]) : decodeURIComponent(splitUrl[6]);
            }
            // check for platform specific type name overrides
            contentGroup[1] = 'events';
            if (event) contentGroup[2] = override[2] ? override[2] : event;
            if (app && 'create' !== app.toLowerCase()) contentGroup[3] = override[3] ? override[3] : app;
        };

        var analyzeContentTitle = function (contentGroup, override) {
            // check if the user is creating or editing sth
            var bodyClass = document.querySelector('body').getAttribute('class');
            var classMatch = /state-main-(page|workspace|event)-show-apps-([\w\-]*)/g.exec(bodyClass) ||
                /state-main-(page|workspace|event)-show-([\w\-]*)/g.exec(bodyClass) ||
                /state-main-(page|workspace|event)-([\w\-]*)/g.exec(bodyClass);
            var func = classMatch ? /-(create|edit)$/g.exec(classMatch[2]) : null;
            func = func ? func[1] : null;

            // cloning and stuff is needed to remove the status text from title string (open, closed, etc.)
            var threadTitle = document.querySelector('.thread-view .thread-title') && [].reduce.call(document.querySelector('.thread-view .thread-title').childNodes, function(a, b) { return a + (b.nodeType === 3 ? b.textContent : ''); }, '').trim();
            // since is possible that there are multiple article titles on a page, we have to priorize them with the following statement
            var articleTitleElem = document.querySelector('.article-view .panel-title-main') || document.querySelector('.article-view .panel-title') || document.querySelector('.article-view .article-title');
            var articleTitle = articleTitleElem && articleTitleElem.textContent.trim();
            try {
                // this can cause errors for MEDIA UPLOAD event, when uploading files while editing/creating articles
                // but as we dont need the contenttitle for events, we just ignore them
                // console.log('func:',func,' / articleTitleElem: ',articleTitleElem, ' / title: ',articleTitle,' / form: ',document.querySelector('form input[id*="title"]'));
                if (func && !articleTitle) {
                    // the following line seems to be the cause, but I was unable to reproduce it
                    // articleTitle = document.querySelector('form input[id*="title"]').value.trim();
                    var articleFormElem = document.querySelector('form input[id*="title"]');
                    if(articleFormElem) articleTitle = articleFormElem.value.trim();
                }

                var title = articleTitle || threadTitle;
                if (title) {
                    contentGroup[contentGroup.length] = override[contentGroup.length] ? override[contentGroup.length] : title;
                    // trackingTitle = title + ':' + (contentGroup[2] || '');
                }
                // add 'create' or 'edit' behind the content or app title
                if (func) {
                    contentGroup[contentGroup.length] = override[contentGroup.length] ? override[contentGroup.length] : func;
                }
            } catch (e) {
                console.warn(e);
            }
        }

        var analyzeFile = function (contentGroup, override) {
            var splitUrl = window.location.href.split('/');
            contentGroup[1] = 'filelibrary';
            if (splitUrl[5]) {
                var fileObj = coyoTrackingDBHelper.getObjectData(splitUrl[5]);
                // check for platform specific type name overrides
                contentGroup[2] = override[2] ? override[2] : fileObj.name;
            }
        };

        // find the first navigation level
        var navItem = document.querySelector('nav.navbar-main ul.nav li.nav-item.active a');
        if (!navItem) {
            navItem = document.querySelector('div.sub-navigation nav.navbar ul.nav li.nav-item.active a.nav-item');
        }
        if (navItem && navItem.getAttribute('href')) {
            var menuEntry = (/\/([^?\/]*)/g).exec(navItem.getAttribute('href'));
            if (menuEntry && menuEntry.length > 1) {
                contentGroup[1] = override[1] ? override[1] : menuEntry[1];
            }
        } else if (document.querySelector('div.content section.profile')) {
            contentGroup[1] = override[1] ? override[1] : 'profile';
        } else {
            // get the current position generically from body class
            var classMatch = (/state-main-([\w-]*)/g).exec(document.querySelector('body').getAttribute('class'));
            if (classMatch && classMatch.length > 1) {
                var pageType = classMatch[1].split('-')[0];
                if(['page','workspace','event'].indexOf(pageType) !== -1) pageType += 's';
                contentGroup[1] = override[1] ? override[1] : pageType;
            } else if ((/state-admin/g).exec(document.querySelector('body').getAttribute('class'))) {
                contentGroup[1] = override[1] ? override[1] : 'admin';
            }
        }

        var contentGroupTwo = {
            'home': function () {
                var homepage = navItem && (/\/[^\/]*\/([^?\/]*)/g).exec(navItem.getAttribute('href'));
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
                var name = (a = document.querySelector('section.profile div.panel.panel-default div.titles-container div.title')) !== null ? a.textContent : null;
                var view = (a = document.querySelector('section.profile div.panel.panel-default div.profile-nav ul.nav li.nav-item.active')) !== null ? a.getAttribute('href') : null;
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

        //remove anchor tag from pageType
        if(contentGroup[1] && contentGroup[1].indexOf('#') !== -1){
            contentGroup[1] = contentGroup[1].substr(0,contentGroup[1].indexOf('#'));
        }

        if (contentGroupTwo[contentGroup[1]]) {
            contentGroupTwo[contentGroup[1]]();
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
    getVideoInfo: function (url,callback) {
        var docMatch = (/documents\/([0-9a-fA-F-]*)/g).exec(url);
        var objData = coyoTrackingDBHelper.getObjectData(docMatch[1]);
        // console.debug('getVideoInfo: objData lookup: ', objData);
        if(objData && objData.name && objData.name.length) {
        } else {
            // console.debug('getVideoInfo: send HEAD Request');
            var http = new XMLHttpRequest();
            http.open('HEAD', url);
            http.onreadystatechange = function() {
                // console.debug('getVideoInfo: got HEAD StateChange', this);
                if (this.readyState == this.DONE) {
                    var respHeader = coyoTrackingUtils.getResponseHeaders(this);
                    var contentDisposition = respHeader['content-disposition'] || respHeader['Content-Disposition'];
                    // console.debug('getVideoInfo: DATA ', respHeader, contentDisposition);
                    var filename = contentDisposition && contentDisposition.match(/filename=\".*"/g)[0].replace('filename="','');
                    filename = filename.substr(0, filename.length-1);
                    // console.debug('getVideoInfo: Header: ', respHeader);
                    // console.debug('getVideoInfo: filename', filename);
                    if(filename) callback(filename);
                }
            };
            http.send();
        }
    }, 
    onContentReady: function(callback) {
        var check = setInterval(function(){
            if(ENV !== 'prod') console.debug('checking...',body.className)
            if(document.body.className.match(/state(\-\w+)+-\w+/,'gi')){
                clearInterval(check);
                callback();
            }
        },500);
        //fallback: clear after 30s
        setTimeout(function(){clearInterval(check);},30000);
    },
    // onContentReady: function(callback) {
    //     // idea: increment _openRequests for outgoing xhr requests, decrement for each finished request
    //     // check periodically if there are no open requests (_openRequests = 0), 
    //     // if the check is true at least 2 times in a row (because sometimes loaded components execute more following requests),
    //     // execute our tracking
    //     var that = this;
    //     that.counter = 0;
    //     that.initialVal = coyoTrackingUtils._openRequests;
    //     that.executed = false;
    //     var check = setInterval(function(){
    //         if(ENV !== 'prod') console.debug('checking...',coyoTrackingUtils._openRequests)
    //         if(coyoTrackingUtils._openRequests === that.initialVal){
    //             that.counter++;
    //             if(ENV !== 'prod') console.debug('finished? ',that.counter);
    //             if(that.counter >= 1) {
    //                 clearInterval(check);
    //                 that.executed = true;
    //                 callback();
    //             }
    //         } else {
    //             that.counter = Math.max(0,that.counter-1);
    //         }
    //     },500);
    //     // fallback: clear after 5s (usually statechange event + 5s)
    //     setTimeout(function(){
    //         if(!that.executed) {
    //             clearInterval(check);
    //             callback();
    //         }
    //     },5000);
    // },
    cleanUnicodeIcons: function(text) {
        var matched = false;
        var cleantext = text.replace(/[^\u0000-~\u0080-þĀ-žƀ-Ɏ֊־؋৲-৳૱௹฿៛᠆Ḁ-Ỿ\u2000-\u206e₠-₵∀-⋾Ⱡ-\u2c7e⸗⸚〜〰゠꜠-ꟾ﷼︱-︲﹘﹣﹩＄－￠-￡￥-￦]/g, function (match, offset) {
            matched = true;
            return '';
        });
        return { matched: matched, text: cleantext };
    }
};