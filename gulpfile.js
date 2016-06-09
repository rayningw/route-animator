var browserify = require("browserify");
var gulp = require("gulp");
var gutil = require("gulp-util");
var source = require("vinyl-source-stream");
var babelify = require("babelify");
var streamify = require("gulp-streamify");
var uglify = require("gulp-uglify");

// Bundle vendors separately and treat them as external
// http://www.kellyjandrews.com/2015/04/01/modular-react-components-with-browserify.html
var vendors = [ "react", "react-dom" ];

var vendorsBundler = browserify({
  require: vendors,
  debug: true
});

gulp.task("bundle-vendors", function() {
  gutil.log("Bundling vendors");
  return bundleWith(vendorsBundler, "vendors.js", { uglify: false });
});

var appBundler = browserify({
  entries: "./scripts/main.js",
  debug: true
})
.transform(babelify, { presets: [ "react", "es2015" ] })
.external(vendors);

gulp.task("prod-build-app", function() {
  gutil.log("Building app for production");
  return bundleWith(appBundler, "main.js", { uglify: true });
});

gulp.task("dev-build-app", function() {
  gutil.log("Building app for development");
  return bundleWith(appBundler, "main.js", { uglify: false });
});

// Watch for changes in app source then run build task
gulp.task("watch-app", function() {
  gutil.log("Watching app for changes");
  gulp.watch(["./scripts/**/*.js"], ["dev-build-app"]);
});

gulp.task("default", [ "bundle-vendors", "dev-build-app", "watch-app" ]);

gulp.task("prod-build", [ "bundle-vendors", "prod-build-app" ]);

// Logs error and emits end event to tell watch to keep going
// https://github.com/gulpjs/gulp/issues/259
function handleError(err) {
  gutil.log(err);
  this.emit("end");
}

// Bundles files with the provided bundler
function bundleWith(bundler, output, opts) {
  opts = opts || {};
  gutil.log("Bundling with options:", opts);
  var b = bundler.bundle()
    .on("error", handleError)
    .pipe(source(output))
    .on("error", handleError);
  if (opts.uglify) {
    b = b.pipe(streamify(uglify()))
         .on("error", handleError);
  }
  return b.pipe(gulp.dest("./public/scripts"))
    .on("error", handleError);
}
