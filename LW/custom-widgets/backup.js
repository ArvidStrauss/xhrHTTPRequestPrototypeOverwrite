!function(n){var a={};function r(e){if(a[e])return a[e].exports;var t=a[e]={i:e,l:!1,exports:{}};return n[e].call(t.exports,t,t.exports,r),t.l=!0,t.exports}r.m=n,r.c=a,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(t,e){if(1&e&&(t=r(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var a in t)r.d(n,a,function(e){return t[e]}.bind(null,a));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="",r(r.s=0)}([function(e,t){var v=[{de:"Intern",en:"Internal",et:"Sisegrupp"},{de:"Zusammenarbeit",en:"Collaboration",et:"Koostöö"},{de:"Interessen",en:"Interests",et:"Huvid"},{de:"Hilfe",en:"Help",et:"Abi"},{de:"Themen",en:"Topics",et:"Teemad"},{de:"DE",en:"DE",et:"DE"},{de:"EE",en:"EE",et:"EE"}],y=[{de:"Unternehmen",en:"Company",et:"Ettevõte"},{de:"Bereiche",en:"Divisions",et:"Divisjonid"},{de:"Services",en:"Services",et:"Teenused"},{de:"Hilfe",en:"Help",et:"Abi"},{de:"Know-How",en:"Know-How",et:"Know-How"},{de:"Standorte",en:"Locations",et:"Asukohad"}];setInterval(function(){var e,t=angular.element(document.body).injector().get("$translate").use(),n=angular.element('coyo-filter[title-key="MODULE.WORKSPACES.FILTER.CATEGORY"]'),a=angular.element("body.state-main-workspace-create"),r=angular.element("body.state-main-workspace-show-settings"),l=angular.element('coyo-filter[title-key="MODULE.PAGES.FILTER.CATEGORY"]'),o=angular.element("body.state-main-page-create"),i=angular.element("body.state-main-page-show-settings");if((0<n.length||0<a.length||0<r.length)&&(e=v),(0<l.length||0<o.length||0<i.length)&&(e=y),0<l.length||0<n.length)for(var u=0;u<e.length;u++)if(null!=angular.element('li[text="'+e[u].de+'"]')&&""!=e[u][t]){angular.element('li[text="'+e[u].de+'"] a > span:nth-child(2)').text(e[u][t]);var g,s=angular.element(".page-card-footer div[ng-repeat=\"category in ::page.categories | orderBy:'name'\"]"),m=angular.element('.label-container.hidden-xs div[ng-repeat="category in ::workspace.categories | limitTo:2"]');if(0<s.length&&(g=s),0<m.length&&(g=m),null!=g)for(var d=0;d<g.length;d++)g[d].textContent===e[u].de&&(g[d].innerText=e[u][t])}if(0<angular.element('button[form-ctrl="pageForm1"]').length||0<angular.element('button[form-ctrl="pageForm"]').length||0<angular.element('button[form-ctrl="workspaceForm1"]').length||0<angular.element('button[form-ctrl="workspaceForm"]').length){for(var c=angular.element('span[ng-bind-html="::option.displayName | highlight: $select.search"]'),p=0;p<c.length;p++)for(var f=0;f<e.length;f++)e[f].de===c[p].innerText&&(c[p].innerText=e[f][t]);angular.element("span.ui-select-match-item");if(0<angular.element("span.ui-select-match-item").length)for(var h=0;h<angular.element('span[ng-bind="$item.displayName"]').length;h++)for(var b=0;b<e.length;b++)e[b].de===angular.element('span[ng-bind="$item.displayName"]')[h].textContent&&(angular.element('span[ng-bind="$item.displayName"]')[h].innerText=e[b][t])}},500);var n={de:"Seite beantragen",en:"Ask for a page",et:"Loo leht"},a={de:"Gruppe löschen",en:"Delete group",et:"Kustuta grupp"};setInterval(function(){if(1===angular.element(".lwPageRequestButton").length&&void 0===angular.element(".lwPageRequestButton").attr("translated")){var e=angular.element(document.body).injector().get("$translate");"string"==typeof n[e.use()]&&(angular.element(".lwPageRequestButton").html('<i class="zmdi zmdi-plus-circle"></i> '+n[e.use()]),angular.element(".lwPageRequestButton").attr("translated","1"))}},70),setInterval(function(){if(1===angular.element(".lwGroupRequestButton").length&&void 0===angular.element(".lwGroupRequestButton").attr("translated")){var e=angular.element(document.body).injector().get("$translate");"string"==typeof a[e.use()]&&(angular.element(".lwGroupRequestButton").html('<i class="zmdi zmdi-minus-circle"></i> '+a[e.use()]),angular.element(".lwGroupRequestButton").attr("translated","1"))}},70)}]);