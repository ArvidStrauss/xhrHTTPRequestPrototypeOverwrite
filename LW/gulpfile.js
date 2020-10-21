// projectdata is required (of course!)
var projectData = {
    projectName: 'LW-Leoworld',
    projectVersion: '1.0.2',
    projectDate: '2020-10-07'
}
// override builds as array of {env,htmlFile} if needed, default is dev/test/prod setup (see common/gulpfile)
// var builds = [
//     {
//         env: 'prod',
//         htmlFile: 'tracking_code_prod.html',
//     }
// ];

var commonGulp = require('../common/gulpfile')(projectData,typeof builds !== 'undefined' ? builds : null);
// shortcut to use the returned gulp instance from common/gulpfile, including all the setup
var gulp = commonGulp.gulp;

// you can add additional project specific gulp tasks:
// gulp.task('my-shiny-task', function() { ...
// and add them to the default build via: commonGulp.tasks.push('my-shiny-task')

gulp.task('build', gulp.parallel(commonGulp.tasks));
gulp.task('local', function(){gulp.watch(['src/*.js','../common/*.js'], gulp.series('build-local'))});
gulp.task('default', gulp.series('min-js', 'build', gulp.parallel('clean-temp', 'zip-files')));