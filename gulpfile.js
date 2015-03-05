// gulp
var gulp = require('gulp');

// plugins
var fs = require('fs'),
    path = require('path'),
    merge = require('merge-stream'),
    minifyCSS = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    closureCompiler = require('gulp-closure-compiler'),
    htmlreplace = require('gulp-html-replace'),
    less = require('gulp-less'),
    del = require('del');

// tasks
gulp.task('clean', function (cb) {
    del(['dist/**'], cb);
});

function getFolders(dir) {
    return fs.readdirSync(dir)
        .filter(function (file) {
            return fs.statSync(path.join(dir, file)).isDirectory();
        });
}

// Loops through the css directory and create one minified css for each folder
gulp.task('minifyCss', ['clean', 'less'], function () {
    var scriptsPath = 'public/css';
    var folders = getFolders(scriptsPath);

    var tasks = folders.map(function (folder) {
        var opts = {comments: true, spare: true};
        return gulp.src(path.join(scriptsPath, folder, '/*.css'))
            .pipe(minifyCSS(opts))
            .pipe(concat(folder  + '.min.css'))
            .pipe(gulp.dest('dist/css/'));
    });

    return merge(tasks);
});

// Loop through the js directory and create one minified js for each folder
gulp.task('minifyJs', ['clean'], function () {
    var scriptsPath = 'public/js';
    var folders = getFolders(scriptsPath);

    var tasks = folders.map(function (folder) {
        var minFile = folder + '.min.js';
        return gulp.src(path.join(scriptsPath, folder, '/*.js'))
            .pipe(closureCompiler({
                compilerPath: 'bower_components/closure-compiler/compiler.jar',
                fileName: minFile
            }))
            .pipe(gulp.dest('dist/js/'))
            .on('end', function () {
                del(minFile);
            });
    });

    return merge(tasks);
});

// Loop through the views directory and create production views for each file
gulp.task('processHtml', ['clean'], function () {
    return gulp.src('views/*.ejs')
        .pipe(htmlreplace({
            'css': {
                src: null,
                tpl: '<link rel="stylesheet" type="text/css" href="css/%f.min.css" />'
            },
            'js': {
                src: null,
                tpl: '<script type="text/javascript" src="js/%f.min.js"></script>'
            },
            'commonjs': 'js/common.min.js'
        }))
        .pipe(gulp.dest('dist/views/'));
});

gulp.task('less', function () {
    return gulp.src(['less/site.less'])
        .pipe(less({
            paths: [ "bower_components/bootstrap/less" ]
        }))
        .pipe(gulp.dest('public/css/index'));
});

// build task
gulp.task('build', ['minifyCss', 'minifyJs', 'processHtml']);
gulp.task('default', ['less']);