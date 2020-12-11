var gap = require('gulp-append-prepend');
var minifyCSS = require('gulp-minify-css');
var rename = require('gulp-rename');

// projectdata is required (of course!)
var projectData = {
    projectName: 'EVM-PIA',
    projectVersion: '1.1.1',
    projectDate: '2020-12-11'
}
// override builds as array of {env,htmlFile} if needed, default is dev/test/prod setup (see common/gulpfile)
// var builds = [
//     {
//         env: 'prod',
//         htmlFile: 'tracking_code_prod.html',
//     }
// ];

var commonGulp = require('../common/gulpfile')(projectData, typeof builds !== 'undefined' ? builds : null);
// shortcut to use the returned gulp instance from common/gulpfile, including all the setup
var gulp = commonGulp.gulp;

// you can add additional project specific gulp tasks:
// gulp.task('my-shiny-task', function() { ...
// and add them to the default build via: commonGulp.tasks.push('my-shiny-task')

gulp.task('build-css', function() {
    return gulp.src('src/custom_style.css')
        .pipe(minifyCSS())
        .pipe(gap.prependText('/* Updated: ' + projectData.projectDate + ' */'))
        .pipe(gap.prependText('/* Version: ' + projectData.projectVersion + ' */'))
        .pipe(gap.prependText('/* T-Systems MMS - ' + projectData.projectName + ' Custom Style */'))
        .pipe(rename('Custom-Style.css'))
        .pipe(gulp.dest('build'));
});

commonGulp.tasks.push('build-css');

gulp.task('build', gulp.parallel(commonGulp.tasks));
gulp.task('local', function() { gulp.watch(['src/*.js', '../common/*.js'], gulp.series('build-local')) });
gulp.task('default', gulp.series('min-js', 'build', 'clean-temp'));