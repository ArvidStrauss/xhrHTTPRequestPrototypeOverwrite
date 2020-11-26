/** ######################## **/
/* EVM-PIA X-Mas Theme Code TEST
/* T-Systems MMS
/* Version: 0.1.0
/* Updated: 2020-11-26
/** ######################## **/

function initXmasTheme() {
    if (!document.querySelector('body .x-mas-background')) {
        var url = window.location.hostname.indexOf('pia-test.evm') >= 0 ? '/web/public-link/c13b6c18-61bf-4c75-91a2-08b28940922d/download' : '/web/public-link/348d0402-545e-4827-b96e-86036f3ea14b/download';
        var img = document.createElement('img');
        img.src = url;
        angular.element(img).addClass('x-mas-background');
        angular.element(img).css({ 'display':'none', 'visibility':'hidden' });
        angular.element(document.body).prepend(img);
    }
}
initXmasTheme();
window.document.addEventListener('stateChangeSuccess', function() {
    initXmasTheme();
});