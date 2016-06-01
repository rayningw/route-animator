var browserify = require("browserify");
var gulp = require("gulp");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var streamify = require("gulp-streamify");
var uglify = require("gulp-uglify");

var bundler = browserify({
  entries: "./scripts/main.js",
  debug: true
}).transform(babelify, {presets: ["react"]});

gulp.task("prod-build", function() {
  console.log("Building for production");
  return bundleWith(bundler, { uglify: true });
});

gulp.task("dev-build", function() {
  console.log("Building for development");
  return bundleWith(bundler, { uglify: false });
});

// Watch for changes in source then run build task
gulp.task("watch", function() {
  console.log("Watching for changes");
  gulp.watch(["./scripts/**/*.js"], ["dev-build"]);
});

gulp.task("default", ["dev-build", "watch"]);

// Bundles files with the provided bundler
function bundleWith(bundler, opts) {
  opts = opts || {};
  console.log("Bundling with options:", opts);
  var b = bundler.bundle()
    .pipe(source("main.js"));
  if (opts.uglify) {
    b = b.pipe(streamify(uglify()));
  }
  return b.pipe(gulp.dest("./public/scripts"));
}
