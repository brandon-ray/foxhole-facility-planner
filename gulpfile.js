const gulp = require('gulp');
const minifyCSS = require('gulp-csso');
const concat = require('gulp-concat');
const sourcemaps = require('gulp-sourcemaps');
const inject = require('gulp-inject');
const clean = require('gulp-clean');
const babel = require('gulp-babel');
const minify = require('gulp-minify');
const htmlmin = require('gulp-htmlmin');
const rename = require('gulp-rename');
const exec = require('child_process').exec;
const version = Date.now();

console.info('Build Version:', version);
gulp.task('clean', function () {
    return gulp.src('distNew/', {
        read: false,
        allowEmpty: true
    }).pipe(clean());
});

gulp.task('cleanDist', function () {
    return gulp.src('dist/', {
        read: false,
        allowEmpty: true
    }).pipe(clean());
});

gulp.task('copyDistNew', function () {
    return gulp.src(['distNew/**/*'])
        .pipe(gulp.dest('dist/'));
});

gulp.task('css', function(){
    return gulp.src(['public/vendor/*.css', 'public/*.css', 'public/menu/**/*.css', 'public/games/**/*.css'])
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(gulp.dest('distNew/css'))
});

gulp.task('vendor', function(){
    return gulp.src(['public/vendor/vue.min.js', 'public/vendor/*.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('distNew/js'))
        .pipe(minify({
            ext:{
                src: '.js',
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('distNew/js'))
});

gulp.task('js', function(){
    return gulp.src(['public/board.js', 'public/*.js', 'public/games/**/*.js', 'public/menu/services/**/*.js', 'public/menu/components/**/*.js', 'public/menu/states/**/*.js', 'public/menu/app.js'])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        .pipe(babel({
            //compact: true,
            presets: [
                ['@babel/env',
                {
                    targets: {
                        esmodules: true
                    }
                }]
            ]
        }))
        .pipe(minify({
            ext:{
                src: '.js',
                min: '.min.js'
            }
        }))
        .pipe(sourcemaps.write('maps'))
        .pipe(gulp.dest('distNew/js'))
});

gulp.task('copy', function () {
    return gulp.src(['public/index.html', 'public/favicon.ico', 'public/favicon_white.ico', 'public/robots.txt'])
        .pipe(gulp.dest('distNew/'));
});

gulp.task('index', gulp.series('css', 'js', 'vendor', 'copy', function () {
    let target = gulp.src('distNew/index.html');
    let sources = gulp.src(['distNew/js/vendor.min.js', 'distNew/js/app.min.js', 'distNew/css/styles.css'], {read: false});

    return target.pipe(inject(sources, {
        relative: true,
        addRootSlash: false,
        ignorePath: 'distNew/',
        transform: function (filepath) {
            arguments[0] = filepath + '?v=' + version;
            return inject.transform.apply(inject.transform, arguments);
        }
    })).pipe(gulp.dest('distNew/'));
}));

gulp.task('html', gulp.series('index', function () {
    return gulp.src(['distNew/index.html'])
        .pipe(htmlmin({collapseWhitespace: true, }))
        .pipe(gulp.dest('distNew/'));
}));

gulp.task('assets', function() {
    return gulp.src(['public/assets/**/*'])
        .pipe(gulp.dest('distNew/assets'));
});

gulp.task('games', function() {
    return gulp.src(['public/games/**/assets/**/*'])
        .pipe(gulp.dest('distNew/games'));
});

gulp.task('build', gulp.series('clean', 'css', 'vendor', 'js', 'assets', 'games', 'copy', 'index', 'html', 'cleanDist', 'copyDistNew', 'clean'));

gulp.task('default', gulp.series('build'));