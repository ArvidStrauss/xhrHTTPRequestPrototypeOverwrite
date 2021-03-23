/** ######################## **/
/* EVM-PIA Custom Backgrounds _$ENV$_
/* T-Systems MMS
/* Version: 0.1.0
/* Updated: 2021-03-23
/** ######################## **/

window.customBackgrounds = {};
function initCustomBackgrounds() {
    function doInit() {
        if (!document.querySelector('body .custom-background')) {
            window.customBackgrounds.urls = {
                'q4deumsy1d5.mms-at-work.de': [
                    '/web/public-link/b1626e47-9c31-4417-8590-ce57796303c9/download'
                ],
                'pia-test.evm.de': [
                    '/web/public-link/7ffa2187-fea2-4ceb-b7e9-382f05d1233f/download'
                ],
                'pia.evm.de': [
                    '/web/public-link/966435e0-2dcb-4b2c-8bd5-6b2f35daea41/download'
                ]
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
            var index = Number.parseInt(localStorage.getItem('customBackgroundIndex')) || 0;
            index = index < window.customBackgrounds.urls.length ? index : 0;
            img.src = window.customBackgrounds.urls[index];
            window.customBackgrounds.img = img;
            angular.element(img).addClass('custom-background');
            angular.element(document.body).prepend(img);
        }

        // if (!document.querySelector('.custom-nav-item')) {
        //     var listItem = document.createElement('li');
        //     angular.element(listItem).addClass('custom-nav-item nav-item nav-item-icon hidden-sm hidden-xs');
        //     listItem.innerHTML = '<a href="#" onclick="switchCustomBackground(); return false;"><i class="zmdi zmdi-hc-fw zmdi-swap" aria-hidden="true"></i><span class="sr-only">Hintergrundbild ändern</span></a>';
        //     var menu = document.querySelector('.main-navigation .navbar-wrapper ul.nav.nav-right');
        //     if (!menu) return false;
        //     menu.insertBefore(listItem, menu.querySelector('.nav-item-profile'));
        // }
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
// function switchCustomBackground() {
//     var index = Number.parseInt(localStorage.getItem('customBackgroundIndex')) || 0;
//     index = index < (window.customBackgrounds.urls.length - 1) ? index + 1 : 0;
//     localStorage.setItem('customBackgroundIndex', index);
//     window.customBackgrounds.img.src = window.customBackgrounds.urls[index];
// };
initCustomBackgrounds();
window.document.addEventListener('stateChangeSuccess', debounce(function() {
    initCustomBackgrounds();
}, 250), false);