var browserify = require('browserify');
var gulp = require('gulp');
var source = require("vinyl-source-stream");
var babelify = require('babelify');
var streamify = require('gulp-streamify');
var uglify = require('gulp-uglify');

// Bundle once
gulp.task('build', function() {
    return bundleWith(getBundler(), { uglify: false });
});

// Returns an unwatched bundler
function getBundler() {
    return browserify({
        entries: './scripts/main.js'
    }).transform(babelify, {presets: ["react"]});
}

// Bundles files with the provided bundler
function bundleWith(bundler, opts) {
    opts = opts || {};
    console.log('Bundling...');
    var b = bundler.bundle()
        .pipe(source('main.js'));
    if (opts.uglify) {
        b = b.pipe(streamify(uglify()));
    }
    return b.pipe(gulp.dest('./public/scripts'));
}
