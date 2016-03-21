var gulp       = require("gulp"),
    gutil =  require("gulp-util"),
    browserify = require("browserify"),
    watchify   = require("watchify"),
    gulpif     = require("gulp-if"),
    uglify     = require("gulp-uglify"),
    concat     = require("gulp-concat"),
    source     = require("vinyl-source-stream"),
    buffer     = require("vinyl-buffer"),
    babel      = require("babelify"),
    stylus     = require("gulp-stylus"),
    sourcemaps = require("gulp-sourcemaps"),
    minifyCSS  = require("gulp-minify-css"),
    rename     = require("gulp-rename"),
    removeLogs = require("gulp-removelogs"),
    plumber    = require("gulp-plumber"),
    hoganify   = require("hoganify"),
    karma      = require("karma"),
    exec       = require("child_process").exec,
    execSync   = require("child_process").execSync;

var appName = "handymap",

    staticDir = `${appName}/client/static`,
    stylesDir = `${appName}/client/styles`,

    jsDir = `${appName}/client/js`,
    jsAppFile = `${jsDir}/app.js`,

    serverTestsDir =  `${appName}/server/tests`,
    serverTestsFile =  `${serverTestsDir}/tests.py`;


var production = false;

gulp.task("set-production", () => {
  production = true;
});

gulp.task("styles", () => {
  return gulp.src([  `${stylesDir}/**/*.styl` ])
    .pipe(gulpif(!production, plumber()))
    .pipe(gulpif(!production, sourcemaps.init()))
    .pipe(stylus())
    .pipe(gulpif(production, minifyCSS()))
    .pipe(concat("app.css"))
    .pipe(gulpif(production, rename({ suffix: ".min" })))
    .pipe(gulpif(!production, sourcemaps.write("./")))
    .pipe(gulp.dest(`${staticDir}/css`));
});

function compileJS(sourceFilePath, sourceFileName, destinationDir, watch) {
  var bundler = watchify(
    browserify(sourceFilePath, { debug: true })
    .transform(babel, { presets: ["es2015"] })
    .transform(hoganify, { extensions: [".mustache"], live: true })
  );

  function rebundle() {
    bundler.bundle()
      .on("error", function(err) { console.error(err); this.emit("end"); })
      .pipe(source(sourceFileName))
      .pipe(buffer())
      .pipe(gulpif(!production, plumber()))
      .pipe(gulpif(production, removeLogs()))
      .pipe(gulpif(production, uglify()))
      .pipe(gulpif(!production, sourcemaps.init({ loadMaps: true })))
      .pipe(gulpif(!production, sourcemaps.write("./")))
      .pipe(gulp.dest(destinationDir));
  }

  if (watch) {
    bundler.on("update", function() {
      console.log("-> bundling...");
      rebundle();
      console.log("-> Bundled!");
    });
  }

  rebundle();
}

function watchJS(sourceFilePath, sourceFileName, destinationDir) {
  return compileJS(sourceFilePath, sourceFileName, destinationDir, true);
}

gulp.task("compileJS", () => compileJS(jsAppFile, "app.js", `${staticDir}/js`));
gulp.task("watchJS", () => watchJS(jsAppFile, "app.js",  `${staticDir}/js`));

// gulp.task("compileStyles", function() { return compileStyles(); });
// gulp.task("watchStyles", function() { return watchStyles(); });
//
gulp.task("testServer", () => {
  var log=gutil.log, colors=gutil.colors;
  log(colors.bgBlue.bold.white("======= BACKEND TESTING ========"));
  var testOut = execSync(`python ${serverTestsFile}`);
  console.log(testOut);
});

gulp.task("testClient", ["testServer"], (done) => {
  var log=gutil.log, colors=gutil.colors;
  log(colors.bgMagenta.bold.white("======= FRONTEND TESTING ======="));
  new karma.Server({
    configFile: `${__dirname}/karma.conf.js`,
    singleRun: true
  }, done).start();
});


gulp.task("test", ["testServer", "testClient"]);

gulp.task("flask", () => {
  return exec("python ./manage.py runserver", (err, stdout, stderr) => {
    console.log(stdout);
    console.log(stderr);
  });
});

gulp.task("dev", ["flask", "watchJS", "styles"], () => {
  gulp.watch(`${stylesDir}/**/*.styl`, ["styles"]);
  gulp.watch(`${appName}/frontend/templates/**/*.hg`, ["hogan"]);
});

gulp.task("prod", ["set-production", "compileJS", "styles"]);

gulp.task("default", ["dev"]);