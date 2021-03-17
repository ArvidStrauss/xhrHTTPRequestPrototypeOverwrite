/** ######################## **/
/* EVM-PIA Custom Backgrounds TEST
/* T-Systems MMS
/* Version: 0.1.0
/* Updated: 2021-03-16
/** ######################## **/

window.customBackgrounds = {};
function initCustomBackgrounds() {
    function doInit() {
        if (!document.querySelector('body .custom-background')) {
            window.customBackgrounds.urls = {
                'q4deumsy1d5.mms-at-work.de': [
                    '/web/public-link/daccbf3b-1a53-4e43-be8f-7f6311780ada/download',
                    '/web/public-link/a5ee6fc0-a01b-4c49-84d9-b5de0e244077/download',
                    '/web/public-link/1d92f3f1-9f35-44f7-9063-e5bc07a46f3f/download',
                    '/web/public-link/727b8a9c-fd56-44a5-accd-235ae304258b/download',
                    '/web/public-link/4a10d8a6-8e8d-44e4-87f9-11573c639561/download',
                    '/web/public-link/f77b014f-2888-494f-989b-e264ca116579/download'
                ],
                'pia-test.evm.de': [
                    '/web/public-link/e2572f80-dcbc-4a18-9487-fabf15304fd1/download',
                    '/web/public-link/bd9cb2d8-9d7f-4521-bac0-b41da8933b79/download',
                    '/web/public-link/0eeafa6e-adcf-4c04-b925-4515d0aa0098/download',
                    '/web/public-link/2943d5ca-2c92-402d-b962-4367670f1db1/download',
                    '/web/public-link/0b6ae4d8-8614-4c5d-b6b5-b2e4e7250c08/download',
                    '/web/public-link/e04478d4-5747-410e-920a-dba67493b189/download'
                ],
                'pia.evm.de': ['']
            }[window.location.hostname];

            var styles =
                'body img.custom-background {' +
                'min-height: 100%;' +
                'min-width: 1200px;' +
                'width: 100vw;' +
                'height: auto;' +
                'position: fixed;' +
                'top: 0;' +
                'left: 0;' +
                'z-index: -99999999;' +
                'display: block;' +
                'visibility: visible;' +
                '}' +
                'body .body .container-main {' +
                'background: transparent;' +
                '}';
            var styleSheet = document.createElement('style');
            styleSheet.innerText = styles;
            angular.element(document.head).append(styleSheet);

            var img = document.createElement('img');
            img.src = window.customBackgrounds.urls[(localStorage.getItem('customBackgroundIndex') || 0)];
            window.customBackgrounds.img = img;
            angular.element(img).addClass('custom-background');
            angular.element(document.body).prepend(img);
        }

        if (!document.querySelector('.custom-nav-item')) {
            var listItem = document.createElement('li');
            angular.element(listItem).addClass('custom-nav-item nav-item nav-item-icon hidden-sm hidden-xs');
            listItem.innerHTML = '<a href="#" onclick="switchCustomBackground(); return false;"><i class="zmdi zmdi-hc-fw zmdi-swap" aria-hidden="true"></i><span class="sr-only">Hintergrundbild ändern</span></a>';
            var menu = document.querySelector('.main-navigation .navbar-wrapper ul.nav.nav-right');
            if (!menu) return false;
            menu.insertBefore(listItem, menu.querySelector('.nav-item-profile'));
        }
        return true;
    }

    if (!window.customBackgrounds.interval) {
        window.customBackgrounds.interval = setInterval(function() {
            if (doInit()) {
                clearInterval(window.customBackgrounds.interval);
                window.customBackgrounds.interval = 0;
            }
        }, 50);
        setTimeout(function() {
            clearInterval(window.customBackgrounds.interval);
            window.customBackgrounds.interval = 0;
        }, 5000);
    }
};
function switchCustomBackground() {
    var index = Number.parseInt(localStorage.getItem('customBackgroundIndex')) || 0;
    index = index < (window.customBackgrounds.urls.length - 1) ? index + 1 : 0;
    localStorage.setItem('customBackgroundIndex', index);
    window.customBackgrounds.img.src = window.customBackgrounds.urls[index];
};
initCustomBackgrounds();
window.document.addEventListener('stateChangeSuccess', debounce(function() {
    initCustomBackgrounds();
}, 250), false);