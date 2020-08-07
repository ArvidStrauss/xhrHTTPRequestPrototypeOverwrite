var gulp = require('gulp');
var uglify = require('gulp-uglify');
var beautify = require('gulp-html-beautify');
var gap = require('gulp-append-prepend');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var zip = require('gulp-zip');

module.exports = function(projectData,builds) {
    builds = builds || [{
        env: 'dev',
        htmlFile: 'tracking_config_dev.html',
    }, {
        env: 'test',
        htmlFile: 'tracking_config_test.html',
    }, {
        env: 'prod',
        htmlFile: 'tracking_config_prod.html',
    }];
    // some sanity checking...
    if(!projectData || !projectData.projectName || !projectData.projectVersion || !projectData.projectDate) {
        throw(new Error('missing or malformed parameter \'projectData\''));
    }
    if(!Array.isArray(builds) || builds.length === 0 || !builds[0] || !builds[0].env || builds[0].env.length === 0 || !builds[0].htmlFile || builds[0].env.htmlFile === 0) {
        throw(new Error('malformed parameter \'builds\''));
    }
    gulp.task('clean-temp', function() {
        return gulp.src('temp', { read: false }).pipe(clean());
    });

    gulp.task('min-js', function() {
        return gulp.src(['../common/click_tracking.js', '../common/tracking.js', '../common/tracking_utils.js', '../common/tracking_db.js', 'src/overrides.js'])
            .pipe(uglify())
            .pipe(rename({ suffix: '.min' }))
            .pipe(gulp.dest('temp'));
    });

    gulp.task('zip-files', function() {
        return gulp.src(['build/*.*', '!build/*DEV.*', 'release_notes/*' + projectData.projectVersion + '.pdf'])
            .pipe(zip(projectData.projectName+'-Tracking-Code_' + projectData.projectVersion + '.zip'))
            .pipe(gulp.dest('delivery'));
    });

    gulp.task('build-local', function() {
        return gulp.src('src/localtracking.js')
            .pipe(gap.appendText('/* ###### Tracking Helper DB ###### */'))
            .pipe(gap.appendFile('../common/tracking_db.js'))
            .pipe(gap.appendText(' '))
            .pipe(gap.appendText('/* ###### Tracking Utils ###### */'))
            .pipe(gap.appendFile('../common/tracking_utils.js'))
            .pipe(gap.appendText(' '))
            .pipe(gap.appendText('/* ###### Click Tracking Code ###### */'))
            .pipe(gap.appendFile('../common/click_tracking.js'))
            .pipe(gap.appendText(' '))
            .pipe(gap.appendText('/* ###### Custom Overrides ###### */'))
            .pipe(gap.appendFile('src/overrides.js'))
            .pipe(gap.appendText(' '))
            .pipe(gap.appendText('/* ###### Tracking Code ###### */'))
            .pipe(gap.appendFile('../common/tracking.js'))
            .pipe(gap.appendText(' '))
            .pipe(gap.appendText('/* ###### Custom Code ###### */'))
            .pipe(gap.appendFile('src/custom_code.js'))
            .pipe(gap.appendText(' '))
            .pipe(replace('_$PROJECT$_', projectData.projectName))
            .pipe(replace('_$VERSION$_', projectData.projectVersion))
            .pipe(replace('_$DATE$_', projectData.projectDate))
            .pipe(replace('_$ENV$_', 'LOCAL'))
            .pipe(gulp.dest('local'));
    });

    // define all build tasks for each environment
    var tasks = [];
    builds.forEach(function(buildItem) {

        tasks.push('build-all-' + buildItem.env);
        tasks.push('build-all-min-' + buildItem.env);
        tasks.push('build-local');

        gulp.task('build-all-' + buildItem.env, function() {
            return gulp.src('src/' + buildItem.htmlFile)
                .pipe(replace('</script>', ''))
                .pipe(gap.appendFile('../common/tracking_db.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendFile('../common/tracking_utils.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendFile('../common/click_tracking.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendFile('src/overrides.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendFile('../common/tracking.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendFile('src/custom_code.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendText('</script>'))
                .pipe(replace('_$PROJECT$_', projectData.projectName))
                .pipe(replace('_$VERSION$_', projectData.projectVersion))
                .pipe(replace('_$DATE$_', projectData.projectDate))
                .pipe(replace('_$ENV$_', buildItem.env.toUpperCase()))
                .pipe(rename(projectData.projectName+'-Tracking-' + buildItem.env.toUpperCase() + '.html'))
                // causes problems with legacy custom code
                //.pipe(beautify())
                .pipe(gulp.dest('build'));
        });

        gulp.task('build-all-min-' + buildItem.env, function() {
            return gulp.src('src/' + buildItem.htmlFile)
                .pipe(replace('</script>', ''))
                .pipe(gap.appendText('/* ###### Tracking Helper DB ###### */'))
                .pipe(gap.appendFile('temp/tracking_db.min.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendText('/* ###### Tracking Utils ###### */'))
                .pipe(gap.appendFile('temp/tracking_utils.min.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendText('/* ###### Click Tracking Code ###### */'))
                .pipe(gap.appendFile('temp/click_tracking.min.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendText('/* ###### Custom Overrides ###### */'))
                .pipe(gap.appendFile('temp/overrides.min.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendText('/* ###### Tracking Code ###### */'))
                .pipe(gap.appendFile('temp/tracking.min.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendText('/* ###### Custom Code ###### */'))
                .pipe(gap.appendFile('src/custom_code.js'))
                .pipe(gap.appendText(' '))
                .pipe(gap.appendText('</script>'))
                .pipe(replace('_$PROJECT$_', projectData.projectName))
                .pipe(replace('_$VERSION$_', projectData.projectVersion))
                .pipe(replace('_$DATE$_', projectData.projectDate))
                .pipe(replace('_$ENV$_', buildItem.env.toUpperCase()))
                .pipe(rename(projectData.projectName+'-Tracking-' + buildItem.env.toUpperCase() + '.min.html'))
                .pipe(gulp.dest('build'));
        });
    });
    
    return {gulp: gulp, tasks: tasks}
};