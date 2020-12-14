// -----------------------------------------------------------------------------
// Dependencies
// -----------------------------------------------------------------------------

const gulp = require('gulp');
const { parallel, series } = require('gulp');
const browserSync = require('browser-sync').create();
const nunjucksRender = require('gulp-nunjucks-render');
const del = require('del');
const siteOutput = './dist';

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

const inputTemplates = './src/pages/*.html';
const watchFiles = ['./src/**/*.*'];

// -----------------------------------------------------------------------------
// Templating
// -----------------------------------------------------------------------------

function nunjucks () {
    nunjucksRender.nunjucks.configure(['./src/templates/']);

    return gulp.src(inputTemplates)
        .pipe(nunjucksRender())
        .pipe(gulp.dest(siteOutput))
};

// -----------------------------------------------------------------------------
// Copy Images
// -----------------------------------------------------------------------------

function imageCopy () {
    return gulp.src('src/images/*')
        .pipe(gulp.dest('dist/images'))
};

// -----------------------------------------------------------------------------
// Watchers
// -----------------------------------------------------------------------------

function watch () {
    gulp.watch(watchFiles, gulp.series(nunjucks)).on('change', browserSync.reload);
};

// -----------------------------------------------------------------------------
// Static server
// -----------------------------------------------------------------------------

function browserSyncSetup () {
    browserSync.init({
        server: {
            baseDir: siteOutput
        },
        notify: false,
        port: 8080,
        injectChanges: true
    });
};

// -----------------------------------------------------------------------------
// Static server
// -----------------------------------------------------------------------------

function clean () {
    return del(siteOutput);
};

// -----------------------------------------------------------------------------
// Default task
// -----------------------------------------------------------------------------

exports.default = series(clean, imageCopy, nunjucks, parallel(watch, browserSyncSetup));
exports.build = series(clean, imageCopy, nunjucks);
