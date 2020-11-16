/** ######################## **/
/* _$PROJECT$_ Tracking DB Helper _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

var coyoTrackingDBHelper = {
    objects: {},
    acceptedUrlPatterns: [
        // if this is empty, all requests are analyzed
        // { 'get': /\/blog\/articles/g },
        // { 'get': /\/wiki\/articles/g },
        // { 'get': /\/web\/pages/g },
        // { 'get': /\/web\/workspaces/g },
        // { 'get': /\/web\/timeline-items/g },
        // { 'get': /\/web\/comments/g },
        // { 'get': /\/web\/users/g },
        // { 'post': /\/web\/comments/g }
    ],

    isAcceptedURL: function(url, method) {
        if (!url || !method) return false;
        return (this.acceptedUrlPatterns.length == 0) || this.acceptedUrlPatterns.some(function(pattern) {
            return pattern[method.toLowerCase()] && url.match(pattern[method.toLowerCase()]);
        });
    },

    buildAuthorMessage: function(message, authorItem) {
        message = message || '';
        message = message.length > 30 ? message.substring(0, 30).trim() + ' ...' : message;
        return authorItem ? authorItem.slug + ' >> ' + message : message;
    },

    stripHTML: function(html) {
        if (!html) return '';
        var doc = new DOMParser().parseFromString(html, 'text/html');
        return doc.body.textContent || '';
    },

    buildTrackingTitle: function (item, parent) {
        if (!item) return '';
        var title = item.displayName || '';
        if (item.typeName == 'timeline-item') {
            var message = (item.data ? item.data.message : this.stripHTML(item.excerpt)) || '';
            title = this.buildAuthorMessage(message, item.author);
        } else if (item.typeName == 'comment') {
            var message = item.message || (item.data ? item.data.message : '');
            title = this.buildAuthorMessage(message, item.author);
        } else if (item.typeName == 'app') {
            title = item.name;
        } else if ('user' == item.typeName) {
            title = item.slug;
        }

        return title;
    },

    loadCurrentUser: function() {
        try {
            var cache = JSON.parse(sessionStorage['ngStorage-etagCache'] || '{}');
            key = Object.keys(cache).find(function(key) {
                return key.match(/\/web\/users\/me/g);
            });
            if (cache[key] && cache[key].data && cache[key].data) {
                this.setObjectData(cache[key].data);
            }
        } catch (e) { }
    },

    checkStorageForData: function(method, responseHeader) {
        if (!responseHeader) {
            return null;
        }
        try {
            var cache = coyoTrackingUtils.extend(JSON.parse(sessionStorage['ngStorage-etagBulkCache'] || null), JSON.parse(sessionStorage['coyo-etagBulkCache'] || null));
            var keys = Object.keys(cache);
            var itemID = (/"([0-9a-fA-F-]*)":/g).exec(responseHeader)[1];
            var etag = (/:"([0-9a-fA-F-]*)"/g).exec(responseHeader)[1];
            for (var i = 0; i < keys.length; i++) {
                var item = cache[keys[i]][itemID];
                if (this.isAcceptedURL(keys[i], method) && item && item.etag == etag) {
                    return item.data || item.body;
                }
            };
        } catch (e) { }
        return null;
    },

    processParent: function(item) {
        // process parents of shared content 
        if (item.typeName == 'timeline-item' && item.data) {
            // shared or native timeline-item
            if (item.itemType == 'post' && item.recipients && item.recipients.length == 1) {
                var target = item.recipients[0];
                return {
                    id: target.id,
                    type: target.typeName,
                    name: this.buildTrackingTitle(target)
                };
            }
            // shared content item
            for (var temp in item.data) {
                if (item.data[temp] && item.data[temp].sender) {
                    this.setObjectData(item.data[temp].sender);
                    var object = {
                        id: item.data[temp].id,
                        parent: {
                            id: item.data[temp].sender.id,
                            typeName: item.data[temp].sender.typeName,
                            name: this.buildTrackingTitle(item.data[temp].sender)
                        }
                    }
                    this.setObjectData(object);
                }
            }
        } else if (item.typeName == 'wiki-article' || item.typeName == 'blog-article') {
            var parent = this.objects[item.senderId];
            if (parent) {
                return {
                    id: item.senderId,
                    type: parent.type,
                    name: parent.name
                };
            }
        } else if (item.typeName == 'comment' && item.target) {
            var parent = this.objects[item.target.id];
            if (parent) {
                return {
                    id: item.target.id,
                    type: parent.type,
                    name: parent.name
                };
            }
        }
        return null;
    },

    setObjectData: function(item, nameOverride) {
        if (!item || !item.id) return;

        var recipient = item.recipients && item.recipients.length == 1 ? item.recipients[0] : null;
        var parent = this.processParent(item);

        // override old values if new ones are present
        var id = item.id;
        this.objects[id] = this.objects[id] || { name: '', type: '', target: { id: '', type: '' }, author: '', parent: { id: '', type: '', name: '' } };
        this.objects[id].type = item.typeName || this.objects[id].type;
        this.objects[id].target.id = recipient ? recipient.id : this.objects[id].target.id;
        this.objects[id].target.type = (recipient ? recipient.typeName : '') || this.objects[id].target.type;
        this.objects[id].author = (item.author ? item.author.slug : '') || this.objects[id].author;
        this.objects[id].parent.id = (parent ? parent.id : item.parent ? item.parent.id : '') || this.objects[id].parent.id;
        this.objects[id].parent.type = (parent ? parent.type : item.parent ? item.parent.typeName : '') || this.objects[id].parent.type;
        this.objects[id].parent.name = (parent ? parent.name : item.parent ? item.parent.name : '') || this.objects[id].parent.name;
        // this has to be last call because there may be dependencies to the objects parent when generating the name
        this.objects[id].name = nameOverride ? nameOverride : (this.buildTrackingTitle(item, this.objects[id].parent) || this.objects[id].name);
    },

    getObjectData: function(id) {
        return object = this.objects[id] || { name: '', type: '', target: { id: '', type: '' }, author: '', parent: { id: '', type: '', name: '' } };
    },

    populateContentData: function(content) {
        var that = this;
        if (!content || !Array.isArray(content)) return;
        content.forEach(function(item) {
            that.setObjectData(item);
        });
    },

    populateResponseData: function(response, responseURL, method) {
        if (typeof response == 'undefined' || !response || typeof response != 'object' || !this.isAcceptedURL(responseURL, method)) return;
        var that = this;
        if (response.topApps) {
            response.topApps.forEach(function(item) {
                that.setObjectData(item, item.slug);
            });
        }
        if (response.id) {
            this.setObjectData(response);
        }

        if (response.content) {
            this.populateContentData(response.content);
        } else {
            for (var item in response) {
                if (response[item] && response[item].content) {
                    this.populateContentData(response[item].content);
                }
            }
        }
    },
};

var openPrototypeDB = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function() {
    var method = arguments[0];
    var reqURL = arguments[1];
    this.addEventListener('load', function() {
        var resp = {};
        resp.responseType = this.responseType;
        resp.responseURL = this.responseURL || reqURL;
        try {
            resp.responseText = this.responseText;
            resp.responseHeader = this.getResponseHeader('x-bulk-etag');
        } catch (e) { }
        setTimeout(function() {
            var response;
            try {
                if ((resp.responseType == '' || resp.responseType == 'text' || resp.responseType == 'document' || resp.responseType == 'moz-chunked-text') && resp.responseText) {
                    response = eval("(" + resp.responseText + ")");
                }
            } catch (e) { }

            if (response && Object.keys(response).length === 0 && coyoTrackingDBHelper.isAcceptedURL(resp.responseURL, method)) {
                response = coyoTrackingDBHelper.checkStorageForData(method, resp.responseHeader);
            }

            coyoTrackingDBHelper.populateResponseData(response, resp.responseURL, method);
        });
    }, 2);
    openPrototypeDB.apply(this, arguments);
};