/** ######################## **/
/* EVM-PIA Custom Backgrounds _$ENV$_
/* T-Systems MMS
/* Version: 0.2.0
/* Updated: 2021-11-17
/** ######################## **/

window.customBackgrounds = {};
function initCustomBackgrounds() {
    function doInit() {
        if (!document.querySelector('body .custom-background')) {
            window.customBackgrounds.urls = {
                'q4deumsy1d5.mms-at-work.de': [
                    '/web/public-link/b06c92a1-0e4c-4b33-b024-79d8baa62185/download'
                ],
                'pia-test.evm.de': [
                    '/web/public-link/7624d97c-8cec-42d4-ba71-7df3cd6e97d3/download',
                    '/web/public-link/031ee76a-47e2-4172-a8be-b868711d810c/download',
                    '/web/public-link/b13e56d8-6a08-4e81-87f5-8b25afb0c4f4/download',
                    '/web/public-link/32568ab0-52de-4ac2-978a-bcbb6550651d/download',
                    '/web/public-link/9e336254-7055-45f6-9351-2f78d3e46542/download',
                    '/web/public-link/ee073725-edf0-45d6-8af4-3cee627b9c4c/download'
                ],
                'pia.evm.de': [
                    '/web/public-link/61658d8c-5b26-4095-8e30-62f2e05bc4ee/download'
                ],
                'evm-test.coyocloud.com': [
                    '/web/public-link/09914af5-644d-4cbe-b837-97be7f07197d/download'
                ],
                'evm.coyocloud.com': [
                    '/web/public-link/63add8d5-aa1c-4125-8d27-be3ac3fbe9bd/download'
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

        // Enable this to active the custom background switcher at navbar for TEST environment, also enable function switchCustomBackground()
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

// Enable this to active the custom background switcher at navbar for TEST environment
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
