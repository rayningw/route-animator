var browserify = require("browserify");
var gulp = require("gulp");
var gutil = require("gulp-util");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var streamify = require("gulp-streamify");
var uglify = require("gulp-uglify");

var bundler = browserify({
  entries: "./scripts/main.js",
  debug: true
}).transform(babelify, {presets: ["react"]});

gulp.task("prod-build", function() {
  gutil.log("Building for production");
  return bundleWith(bundler, { uglify: true });
});

gulp.task("dev-build", function() {
  gutil.log("Building for development");
  return bundleWith(bundler, { uglify: false });
});

// Watch for changes in source then run build task
gulp.task("watch", function() {
  gutil.log("Watching for changes");
  gulp.watch(["./scripts/**/*.js"], ["dev-build"]);
});

gulp.task("default", ["dev-build", "watch"]);

// Logs error and emits end event to tell watch to keep going
// https://github.com/gulpjs/gulp/issues/259
function handleError(err) {
  gutil.log(err);
  this.emit("end");
}

// Bundles files with the provided bundler
function bundleWith(bundler, opts) {
  opts = opts || {};
  gutil.log("Bundling with options:", opts);
  var b = bundler.bundle()
    .on("error", handleError)
    .pipe(source("main.js"))
    .on("error", handleError);
  if (opts.uglify) {
    b = b.pipe(streamify(uglify()));
  }
  return b.pipe(gulp.dest("./public/scripts"))
    .on("error", handleError);
}
