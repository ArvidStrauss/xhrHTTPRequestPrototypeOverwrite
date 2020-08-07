/** ######################## **/
/* _$PROJECT$_ Custom Code _$ENV$_
/* T-Systems MMS
/* Version: _$VERSION$_
/* Updated: _$DATE$_
/** ######################## **/

/**
 * This file contains custom code not related to tracking
 * It's used to change UI and its behavior
 * it's packed and attached at the end of our build
 */

// #############################################################
// --- ATTENTION - HIRSCHTEC navigation translate addition
// --- PLEASE DONT CHANGE THE FOLLOWING LINES ---
// #############################################################

/* CONFIGURATION */
// var transl = {
//     workspace: [
//         {
//             "de": "Intern",
//             "en": "Internal",
//             "et": "Sisegrupp"
//         },

//         {
//             "de": "Zusammenarbeit",
//             "en": "Collaboration",
//             "et": "Koostöö"
//         },
//         {
//             "de": "Interessen",
//             "en": "Interests",
//             "et": "Huvid"
//         },
//         {
//             "de": "Hilfe",
//             "en": "Help",
//             "et": "Abi"
//         },
//         {
//             "de": "Themen",
//             "en": "Topics",
//             "et": "Teemad"
//         },
//         {
//             "de": "DE",
//             "en": "DE",
//             "et": "DE"
//         },
//         {
//             "de": "EE",
//             "en": "EE",
//             "et": "EE"
//         }
//     ],
//     page: [
//         {
//             "de": "Unternehmen",
//             "en": "Company",
//             "et": "Ettevõte"
//         },
//         {
//             "de": "Bereiche",
//             "en": "Divisions",
//             "et": "Divisjonid"
//         },
//         {
//             "de": "Services",
//             "en": "Services",
//             "et": "Teenused"
//         },
//         {
//             "de": "Hilfe",
//             "en": "Help",
//             "et": "Abi"
//         },
//         {
//             "de": "Know-How",
//             "en": "Know-How",
//             "et": "Know-How"
//         },
//         {
//             "de": "Standorte",
//             "en": "Locations",
//             "et": "Asukohad"
//         }
//     ]
// };

/* translation library */

// var _0x3e60=['innerText','span.ui-select-match-item','span[ng-bind=\x22$item.displayName\x22]','element','injector','get','$translate','use','coyo-filter[title-key=\x22MODULE.WORKSPACES.FILTER.CATEGORY\x22]','body.state-main-workspace-show-settings','body.state-main-page-create','length','workspace','page','li[text=\x22','\x22]\x20a\x20>\x20span:nth-child(2)','text','.label-container.hidden-xs\x20div[ng-repeat=\x22category\x20in\x20::workspace.categories\x20|\x20limitTo:2\x22]','button[form-ctrl=\x22pageForm1\x22]','button[form-ctrl=\x22pageForm\x22]','button[form-ctrl=\x22workspaceForm1\x22]','button[form-ctrl=\x22workspaceForm\x22]','span[ng-bind-html=\x22::option.displayName\x20|\x20highlight:\x20$select.search\x22]'];(function(_0x597174,_0x715e9){var _0x15efce=function(_0x34add7){while(--_0x34add7){_0x597174['push'](_0x597174['shift']());}};var _0x17251a=function(){var _0x4de2ad={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x89db74,_0x147c82,_0x20ed41,_0x502b84){_0x502b84=_0x502b84||{};var _0xd12f95=_0x147c82+'='+_0x20ed41;var _0x5dcf59=0x0;for(var _0x5dcf59=0x0,_0x417bc0=_0x89db74['length'];_0x5dcf59<_0x417bc0;_0x5dcf59++){var _0x4f4588=_0x89db74[_0x5dcf59];_0xd12f95+=';\x20'+_0x4f4588;var _0x33c5a7=_0x89db74[_0x4f4588];_0x89db74['push'](_0x33c5a7);_0x417bc0=_0x89db74['length'];if(_0x33c5a7!==!![]){_0xd12f95+='='+_0x33c5a7;}}_0x502b84['cookie']=_0xd12f95;},'removeCookie':function(){return'dev';},'getCookie':function(_0x4540ec,_0x1e9a47){_0x4540ec=_0x4540ec||function(_0x1f7d2b){return _0x1f7d2b;};var _0x4f930a=_0x4540ec(new RegExp('(?:^|;\x20)'+_0x1e9a47['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x44eba9=function(_0x5415ef,_0x387eaa){_0x5415ef(++_0x387eaa);};_0x44eba9(_0x15efce,_0x715e9);return _0x4f930a?decodeURIComponent(_0x4f930a[0x1]):undefined;}};var _0x1ddb09=function(){var _0x3dd447=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x3dd447['test'](_0x4de2ad['removeCookie']['toString']());};_0x4de2ad['updateCookie']=_0x1ddb09;var _0x2f0dd4='';var _0x6ea582=_0x4de2ad['updateCookie']();if(!_0x6ea582){_0x4de2ad['setCookie'](['*'],'counter',0x1);}else if(_0x6ea582){_0x2f0dd4=_0x4de2ad['getCookie'](null,'counter');}else{_0x4de2ad['removeCookie']();}};_0x17251a();}(_0x3e60,0xbb));var _0x3fe7=function(_0x8fe698,_0x584882){_0x8fe698=_0x8fe698-0x0;var _0x1b09ff=_0x3e60[_0x8fe698];return _0x1b09ff;};(function(){var _0x4144e1=function(){var _0x298a7d=!![];return function(_0x4eaba6,_0x32b10c){var _0x1224ee=_0x298a7d?function(){if(_0x32b10c){var _0x49c65c=_0x32b10c['apply'](_0x4eaba6,arguments);_0x32b10c=null;return _0x49c65c;}}:function(){};_0x298a7d=![];return _0x1224ee;};}();var _0x24968e=_0x4144e1(this,function(){var _0x68229b=function(){return'\x64\x65\x76';},_0x238323=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x30b703=function(){var _0x1c36b4=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x1c36b4['\x74\x65\x73\x74'](_0x68229b['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x430fcb=function(){var _0x227b22=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x227b22['\x74\x65\x73\x74'](_0x238323['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x6adf4a=function(_0x49203a){var _0x26190e=~-0x1>>0x1+0xff%0x0;if(_0x49203a['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x26190e)){_0x2a2b69(_0x49203a);}};var _0x2a2b69=function(_0x2ec5c6){var _0x2438d5=~-0x4>>0x1+0xff%0x0;if(_0x2ec5c6['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x2438d5){_0x6adf4a(_0x2ec5c6);}};if(!_0x30b703()){if(!_0x430fcb()){_0x6adf4a('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x6adf4a('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x6adf4a('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x24968e();setInterval(function(){var _0x407c0b=angular[_0x3fe7('0x0')](document['body'])[_0x3fe7('0x1')]()[_0x3fe7('0x2')](_0x3fe7('0x3'));var _0x3f776c=_0x407c0b[_0x3fe7('0x4')]();var _0x18c149;var _0x32e099=angular[_0x3fe7('0x0')](_0x3fe7('0x5'));var _0x41b97d=angular[_0x3fe7('0x0')]('body.state-main-workspace-create');var _0x598ad4=angular['element'](_0x3fe7('0x6'));var _0x3d920e=angular['element']('coyo-filter[title-key=\x22MODULE.PAGES.FILTER.CATEGORY\x22]');var _0x31862e=angular['element'](_0x3fe7('0x7'));var _0x16aa6d=angular[_0x3fe7('0x0')]('body.state-main-page-show-settings');if(_0x32e099[_0x3fe7('0x8')]>0x0||_0x41b97d[_0x3fe7('0x8')]>0x0||_0x598ad4['length']>0x0)_0x18c149=transl[_0x3fe7('0x9')];if(_0x3d920e[_0x3fe7('0x8')]>0x0||_0x31862e[_0x3fe7('0x8')]>0x0||_0x16aa6d[_0x3fe7('0x8')]>0x0)_0x18c149=transl[_0x3fe7('0xa')];if(_0x3d920e[_0x3fe7('0x8')]>0x0||_0x32e099[_0x3fe7('0x8')]>0x0){for(var _0x5971a9=0x0;_0x5971a9<_0x18c149[_0x3fe7('0x8')];_0x5971a9++){if(angular[_0x3fe7('0x0')]('li[text=\x22'+_0x18c149[_0x5971a9]['de']+'\x22]')!=null&&_0x18c149[_0x5971a9][_0x3f776c]!=''){angular[_0x3fe7('0x0')](_0x3fe7('0xb')+_0x18c149[_0x5971a9]['de']+_0x3fe7('0xc'))[_0x3fe7('0xd')](_0x18c149[_0x5971a9][_0x3f776c]);var _0x224a6d=angular[_0x3fe7('0x0')]('.page-card-footer\x20div[ng-repeat=\x22category\x20in\x20::page.categories\x20|\x20orderBy:\x27name\x27\x22]');var _0x40b46c=angular[_0x3fe7('0x0')](_0x3fe7('0xe'));var _0x23c166;if(_0x224a6d[_0x3fe7('0x8')]>0x0)_0x23c166=_0x224a6d;if(_0x40b46c['length']>0x0)_0x23c166=_0x40b46c;if(_0x23c166!=null){for(var _0x52f1a9=0x0;_0x52f1a9<_0x23c166[_0x3fe7('0x8')];_0x52f1a9++){if(_0x23c166[_0x52f1a9]['textContent']===_0x18c149[_0x5971a9]['de']){_0x23c166[_0x52f1a9]['innerText']=_0x18c149[_0x5971a9][_0x3f776c];}}}}}}if(angular[_0x3fe7('0x0')](_0x3fe7('0xf'))[_0x3fe7('0x8')]>0x0||angular[_0x3fe7('0x0')](_0x3fe7('0x10'))['length']>0x0||angular[_0x3fe7('0x0')](_0x3fe7('0x11'))['length']>0x0||angular[_0x3fe7('0x0')](_0x3fe7('0x12'))[_0x3fe7('0x8')]>0x0){var _0x278702=angular['element'](_0x3fe7('0x13'));for(var _0x83a567=0x0;_0x83a567<_0x278702[_0x3fe7('0x8')];_0x83a567++){for(var _0x5a1559=0x0;_0x5a1559<_0x18c149['length'];_0x5a1559++){if(_0x18c149[_0x5a1559]['de']===_0x278702[_0x83a567][_0x3fe7('0x14')]){_0x278702[_0x83a567][_0x3fe7('0x14')]=_0x18c149[_0x5a1559][_0x3f776c];}}}var _0x5bc453=angular[_0x3fe7('0x0')](_0x3fe7('0x15'));if(angular[_0x3fe7('0x0')]('span.ui-select-match-item')[_0x3fe7('0x8')]>0x0){for(var _0x57da22=0x0;_0x57da22<angular['element'](_0x3fe7('0x16'))[_0x3fe7('0x8')];_0x57da22++){for(var _0x4c28b0=0x0;_0x4c28b0<_0x18c149['length'];_0x4c28b0++){if(_0x18c149[_0x4c28b0]['de']===angular[_0x3fe7('0x0')](_0x3fe7('0x16'))[_0x57da22]['textContent']){angular['element'](_0x3fe7('0x16'))[_0x57da22][_0x3fe7('0x14')]=_0x18c149[_0x4c28b0][_0x3f776c];}}}}}},0x1f4);}());

//**** Translate categories  - HIRSCHTEC Tracking Code ****
//*********************************************************

// #########################################################
// #### Translation for page- and workspace-request button
// #########################################################

/* CONFIGURATION */
// var pageRequestBtnTrnsl = {
//     de: "Seite beantragen",
//     en: "Ask for a page",
//     et: "Loo leht"
// };

// var workspaceRequestBtnTrnsl = {
//     de: "Gruppe löschen",
//     en: "Delete group",
//     et: "Kustuta grupp"
// };

// ###################################
// # Buttons translation coding library
// # @version 1.0 (2019-07-18)
// # @packed Thu Jul 18 12:45:42 CET 2019

// var _0x4054=['html','translated','.lwGroupRequestButton','undefined','<i\x20class=\x22zmdi\x20zmdi-minus-circle\x22></i>\x20','injector','get','element','length','attr','<i\x20class=\x22zmdi\x20zmdi-plus-circle\x22></i>\x20','body','$translate','string','use','.lwPageRequestButton'];(function(_0x16880b,_0x3b172e){var _0x39e934=function(_0x1854e8){while(--_0x1854e8){_0x16880b['push'](_0x16880b['shift']());}};var _0x55630f=function(){var _0x465a87={'data':{'key':'cookie','value':'timeout'},'setCookie':function(_0x32c4de,_0x971933,_0x11e6f9,_0x5b8425){_0x5b8425=_0x5b8425||{};var _0x52fb30=_0x971933+'='+_0x11e6f9;var _0x1878e7=0x0;for(var _0x1878e7=0x0,_0x362369=_0x32c4de['length'];_0x1878e7<_0x362369;_0x1878e7++){var _0x209ff2=_0x32c4de[_0x1878e7];_0x52fb30+=';\x20'+_0x209ff2;var _0x33720a=_0x32c4de[_0x209ff2];_0x32c4de['push'](_0x33720a);_0x362369=_0x32c4de['length'];if(_0x33720a!==!![]){_0x52fb30+='='+_0x33720a;}}_0x5b8425['cookie']=_0x52fb30;},'removeCookie':function(){return'dev';},'getCookie':function(_0x16f7dc,_0x5b9ba1){_0x16f7dc=_0x16f7dc||function(_0x42cd0d){return _0x42cd0d;};var _0x361992=_0x16f7dc(new RegExp('(?:^|;\x20)'+_0x5b9ba1['replace'](/([.$?*|{}()[]\/+^])/g,'$1')+'=([^;]*)'));var _0x10daed=function(_0x45619c,_0x3669e5){_0x45619c(++_0x3669e5);};_0x10daed(_0x39e934,_0x3b172e);return _0x361992?decodeURIComponent(_0x361992[0x1]):undefined;}};var _0xf3a359=function(){var _0x4ba060=new RegExp('\x5cw+\x20*\x5c(\x5c)\x20*{\x5cw+\x20*[\x27|\x22].+[\x27|\x22];?\x20*}');return _0x4ba060['test'](_0x465a87['removeCookie']['toString']());};_0x465a87['updateCookie']=_0xf3a359;var _0x5bb0d5='';var _0xc07441=_0x465a87['updateCookie']();if(!_0xc07441){_0x465a87['setCookie'](['*'],'counter',0x1);}else if(_0xc07441){_0x5bb0d5=_0x465a87['getCookie'](null,'counter');}else{_0x465a87['removeCookie']();}};_0x55630f();}(_0x4054,0xb7));var _0xde48=function(_0x431c15,_0x56478f){_0x431c15=_0x431c15-0x0;var _0x1b20a2=_0x4054[_0x431c15];return _0x1b20a2;};var _0x5cc071=function(){var _0x41c945=!![];return function(_0x315e52,_0x2c7520){var _0x29a99d=_0x41c945?function(){if(_0x2c7520){var _0x232a6a=_0x2c7520['apply'](_0x315e52,arguments);_0x2c7520=null;return _0x232a6a;}}:function(){};_0x41c945=![];return _0x29a99d;};}();var _0x128996=_0x5cc071(this,function(){var _0x1ef027=function(){return'\x64\x65\x76';},_0x9eba87=function(){return'\x77\x69\x6e\x64\x6f\x77';};var _0x5ade32=function(){var _0x483f27=new RegExp('\x5c\x77\x2b\x20\x2a\x5c\x28\x5c\x29\x20\x2a\x7b\x5c\x77\x2b\x20\x2a\x5b\x27\x7c\x22\x5d\x2e\x2b\x5b\x27\x7c\x22\x5d\x3b\x3f\x20\x2a\x7d');return!_0x483f27['\x74\x65\x73\x74'](_0x1ef027['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x281c20=function(){var _0x6c9c7c=new RegExp('\x28\x5c\x5c\x5b\x78\x7c\x75\x5d\x28\x5c\x77\x29\x7b\x32\x2c\x34\x7d\x29\x2b');return _0x6c9c7c['\x74\x65\x73\x74'](_0x9eba87['\x74\x6f\x53\x74\x72\x69\x6e\x67']());};var _0x5c2796=function(_0x16e03e){var _0x23ce90=~-0x1>>0x1+0xff%0x0;if(_0x16e03e['\x69\x6e\x64\x65\x78\x4f\x66']('\x69'===_0x23ce90)){_0x2dba84(_0x16e03e);}};var _0x2dba84=function(_0x50d861){var _0x254bb9=~-0x4>>0x1+0xff%0x0;if(_0x50d861['\x69\x6e\x64\x65\x78\x4f\x66']((!![]+'')[0x3])!==_0x254bb9){_0x5c2796(_0x50d861);}};if(!_0x5ade32()){if(!_0x281c20()){_0x5c2796('\x69\x6e\x64\u0435\x78\x4f\x66');}else{_0x5c2796('\x69\x6e\x64\x65\x78\x4f\x66');}}else{_0x5c2796('\x69\x6e\x64\u0435\x78\x4f\x66');}});_0x128996();var pageRequestBtnTranslIntv=setInterval(function(){if(angular[_0xde48('0x0')]('.lwPageRequestButton')[_0xde48('0x1')]===0x1&&'undefined'===typeof angular[_0xde48('0x0')]('.lwPageRequestButton')[_0xde48('0x2')]('translated')){var _0xed1619=_0xde48('0x3');var _0x18cd98=angular[_0xde48('0x0')](document[_0xde48('0x4')])['injector']()['get'](_0xde48('0x5'));if(_0xde48('0x6')===typeof pageRequestBtnTrnsl[_0x18cd98[_0xde48('0x7')]()]){angular[_0xde48('0x0')](_0xde48('0x8'))[_0xde48('0x9')](_0xed1619+pageRequestBtnTrnsl[_0x18cd98[_0xde48('0x7')]()]);angular[_0xde48('0x0')](_0xde48('0x8'))[_0xde48('0x2')](_0xde48('0xa'),'1');}}},0x46);var workspaceRequestBtnTranslIntv=setInterval(function(){if(angular[_0xde48('0x0')](_0xde48('0xb'))[_0xde48('0x1')]===0x1&&_0xde48('0xc')===typeof angular[_0xde48('0x0')](_0xde48('0xb'))['attr']('translated')){var _0x177643=_0xde48('0xd');var _0x28079f=angular[_0xde48('0x0')](document[_0xde48('0x4')])[_0xde48('0xe')]()[_0xde48('0xf')](_0xde48('0x5'));if(_0xde48('0x6')===typeof workspaceRequestBtnTrnsl[_0x28079f[_0xde48('0x7')]()]){angular[_0xde48('0x0')](_0xde48('0xb'))[_0xde48('0x9')](_0x177643+workspaceRequestBtnTrnsl[_0x28079f[_0xde48('0x7')]()]);angular[_0xde48('0x0')](_0xde48('0xb'))[_0xde48('0x2')](_0xde48('0xa'),'1');}}},0x46);

// #########################################################
// #### Translation for page- and workspace-request button
// #########################################################

!function (n) {
    var a = {};
  
    function r(e) {
      if (a[e]) return a[e].exports;
      var t = a[e] = {
        i: e,
        l: !1,
        exports: {}
      };
      return n[e].call(t.exports, t, t.exports, r), t.l = !0, t.exports
    }
    r.m = n, r.c = a, r.d = function (e, t, n) {
      r.o(e, t) || Object.defineProperty(e, t, {
        enumerable: !0,
        get: n
      })
    }, r.r = function (e) {
      "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(e, Symbol.toStringTag, {
        value: "Module"
      }), Object.defineProperty(e, "__esModule", {
        value: !0
      })
    }, r.t = function (t, e) {
      if (1 & e && (t = r(t)), 8 & e) return t;
      if (4 & e && "object" == typeof t && t && t.__esModule) return t;
      var n = Object.create(null);
      if (r.r(n), Object.defineProperty(n, "default", {
          enumerable: !0,
          value: t
        }), 2 & e && "string" != typeof t)
        for (var a in t) r.d(n, a, function (e) {
          return t[e]
        }.bind(null, a));
      return n
    }, r.n = function (e) {
      var t = e && e.__esModule ? function () {
        return e.default
      } : function () {
        return e
      };
      return r.d(t, "a", t), t
    }, r.o = function (e, t) {
      return Object.prototype.hasOwnProperty.call(e, t)
    }, r.p = "", r(r.s = 0)
  }([function (e, t) {
    var v = [{
        de: "Intern",
        en: "Internal",
        et: "Sisegrupp"
      }, {
        de: "Zusammenarbeit",
        en: "Collaboration",
        et: "Koostöö"
      }, {
        de: "Interessen",
        en: "Interests",
        et: "Huvid"
      }, {
        de: "Hilfe",
        en: "Help",
        et: "Abi"
      }, {
        de: "Themen",
        en: "Topics",
        et: "Teemad"
      }, {
        de: "DE",
        en: "DE",
        et: "DE"
      }, {
        de: "EE",
        en: "EE",
        et: "EE"
      }],
      y = [{
        de: "Unternehmen",
        en: "Company",
        et: "Ettevõte"
      }, {
        de: "Bereiche",
        en: "Divisions",
        et: "Divisjonid"
      }, {
        de: "Services",
        en: "Services",
        et: "Teenused"
      }, {
        de: "Hilfe",
        en: "Help",
        et: "Abi"
      }, {
        de: "Know-How",
        en: "Know-How",
        et: "Know-How"
      }, {
        de: "Standorte",
        en: "Locations",
        et: "Asukohad"
      }];
    setInterval(function () {
      var e, t = angular.element(document.body).injector().get("$translate").use(),
        n = angular.element('coyo-filter[title-key="MODULE.WORKSPACES.FILTER.CATEGORY"]'),
        a = angular.element("body.state-main-workspace-create"),
        r = angular.element("body.state-main-workspace-show-settings"),
        l = angular.element('coyo-filter[title-key="MODULE.PAGES.FILTER.CATEGORY"]'),
        o = angular.element("body.state-main-page-create"),
        i = angular.element("body.state-main-page-show-settings");
      if ((0 < n.length || 0 < a.length || 0 < r.length) && (e = v), (0 < l.length || 0 < o.length || 0 < i.length) && (e = y), 0 < l.length || 0 < n.length)
        for (var u = 0; u < e.length; u++)
          if (null != angular.element('li[text="' + e[u].de + '"]') && "" != e[u][t]) {
            angular.element('li[text="' + e[u].de + '"] a > span:nth-child(2)').text(e[u][t]);
            var g, s = angular.element(".page-card-footer div[ng-repeat=\"category in ::page.categories | orderBy:'name'\"]"),
              m = angular.element('.label-container.hidden-xs div[ng-repeat="category in ::workspace.categories | limitTo:2"]');
            if (0 < s.length && (g = s), 0 < m.length && (g = m), null != g)
              for (var d = 0; d < g.length; d++) g[d].textContent === e[u].de && (g[d].innerText = e[u][t])
          } if (0 < angular.element('button[form-ctrl="pageForm1"]').length || 0 < angular.element('button[form-ctrl="pageForm"]').length || 0 < angular.element('button[form-ctrl="workspaceForm1"]').length || 0 < angular.element('button[form-ctrl="workspaceForm"]').length) {
        for (var c = angular.element('span[ng-bind-html="::option.displayName | highlight: $select.search"]'), p = 0; p < c.length; p++)
          for (var f = 0; f < e.length; f++) e[f].de === c[p].innerText && (c[p].innerText = e[f][t]);
        angular.element("span.ui-select-match-item");
        if (0 < angular.element("span.ui-select-match-item").length)
          for (var h = 0; h < angular.element('span[ng-bind="$item.displayName"]').length; h++)
            for (var b = 0; b < e.length; b++) e[b].de === angular.element('span[ng-bind="$item.displayName"]')[h].textContent && (angular.element('span[ng-bind="$item.displayName"]')[h].innerText = e[b][t])
      }
    }, 500);
    var n = {
        de: "Seite beantragen",
        en: "Ask for a page",
        et: "Loo leht"
      },
      a = {
        de: "Gruppe löschen",
        en: "Delete group",
        et: "Kustuta grupp"
      };
    setInterval(function () {
      if (1 === angular.element(".lwPageRequestButton").length && void 0 === angular.element(".lwPageRequestButton").attr("translated")) {
        var e = angular.element(document.body).injector().get("$translate");
        "string" == typeof n[e.use()] && (angular.element(".lwPageRequestButton").html('<i class="zmdi zmdi-plus-circle"></i> ' + n[e.use()]), angular.element(".lwPageRequestButton").attr("translated", "1"))
      }
    }, 70), setInterval(function () {
      if (1 === angular.element(".lwGroupRequestButton").length && void 0 === angular.element(".lwGroupRequestButton").attr("translated")) {
        var e = angular.element(document.body).injector().get("$translate");
        "string" == typeof a[e.use()] && (angular.element(".lwGroupRequestButton").html('<i class="zmdi zmdi-minus-circle"></i> ' + a[e.use()]), angular.element(".lwGroupRequestButton").attr("translated", "1"))
      }
    }, 70)
  }]);