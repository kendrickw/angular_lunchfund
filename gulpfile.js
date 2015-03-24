// gulp
var gulp = require('gulp');

// plugins
var debug = require('gulp-debug'),
    minifyCSS = require('gulp-minify-css'),
    gulpif = require('gulp-if'),
    less = require('gulp-less'),
    useref = require('gulp-useref'),
    uglify = require('gulp-uglify'),
    manifest = require('gulp-manifest'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    templateCache = require('gulp-angular-templatecache'),
    del = require('del');

// Clean
gulp.task('clean', function (cb) {
    del(['dist/**'], cb);
});

// Create minified version of javascripts and css
gulp.task('gen-prod-files', ['clean'], function () {
    var assets = useref.assets();

    return gulp.src('dev/views/*.ejs')
        .pipe(assets)
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', minifyCSS()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest('dist/views'));
});

// Optimize images
gulp.task('image', ['clean'], function () {
    return gulp.src('dev/images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('dist/images'));
});

// Create template cache module
gulp.task('template', ['clean'], function () {
    return gulp.src('dev/**/*.html')
        .pipe(templateCache('index-templates.js', {
            module: 'templates',
            standalone: true
        }))
        .pipe(gulp.dest('dist/app'));
});

// Create Offline cache manifest
gulp.task('manifest', ['gen-prod-files', 'image', 'template'], function () {
    return gulp.src(['dist/*/**'])
        .pipe(manifest({
            hash: true,
            preferOnline: true,
            network: ['http://*', 'https://*', '*'],
            filename: 'cache.manifest',
            exclude: 'cache.manifest'
        }))
        .pipe(gulp.dest('dist'));
});

// Not used currently since we are no longer using bootstrap UI
gulp.task('less', function () {
    return gulp.src(['less/site.less'])
        .pipe(less({
            paths: [ "bower_components/bootstrap/less" ]
        }))
        .pipe(gulp.dest('dev/css/index'));
});

// build task
gulp.task('build', ['manifest']);