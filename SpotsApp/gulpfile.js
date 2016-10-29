/// <binding BeforeBuild='default' />
var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var polyfill = require('es6-promise').polyfill();   //polyfill for autoprefixer
var plugins = require('gulp-load-plugins')({
    pattern: '*'
});


//Browser Sync
gulp.task("browserSync", function () {
    plugins.browserSync.init({
        // Remember to set up in IIS
        proxy: "spotsApp.local/www/index.html"
    });
});


// TARGETS
var src = {
    bundled: "www/bundled",
    styles: [
        "resources/*.scss",
        "resources/base/*.scss",
        "resources/modules/*.scss"
    ],
    scripts: [
        "resources/angular-app/**/*.js",
        "resources/base/**/*.js",
        "resources/modules/**/*.js"
    ],
    thirdparty: "resources/3rd-party/**/*.js",
    views: "www/**/*.html"
};


// Script bundles
var scriptBundles = [
    { scripts: ["resources/3rd-party/plugins/**/*.js"], output: "plugins.js" },
    { scripts: ["resources/angular-app/*.js"], output: "angular-app.js" },
    { scripts: ["resources/angular-app/services/*.js"], output: "services.js" },
    { scripts: ["resources/modules/**/*.js"], output: "modules.js" },
    { scripts: ["resources/base/**/*.js"], output: "base.js" }
];


// Script Tasks
function bundleJs() {
    scriptBundles.forEach(function (item) {
        gulp.src(item.scripts)
            .pipe(concat(item.output))
            .pipe(gulp.dest(src.bundled));
    });
}
function minifyJs() {
    scriptBundles.forEach(function (item) {
        gulp.src(item.scripts)
            .pipe(concat(item.output))
            .pipe(rename({ suffix: ".min" }))
            .pipe(plugins.uglify())
            .pipe(gulp.dest(src.bundled));
    });
}

gulp.task("bundleJs", bundleJs);
gulp.task("minifyJs", minifyJs);

//Browser Sync



gulp.task("default", ["development", "bundleJs", "minifyJs"]);

gulp.task("development", ["bundleJs"], function() {
    gulp.src(src.styles)
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(gulp.dest(src.bundled))
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(plugins.browserSync.stream()) //Init browser sync to push changes to browser
        .pipe(plugins.notify({ title: "Development", message: "All files processed", onLast: true }));
});

gulp.task("production", ["development", "bundleJs", "minifyJs"], function () {
    gulp.src(src.styles)
        .pipe(sass())
        .on("error", sass.logError)
        .pipe(minifyCss({
            keepSpecialComments: 0
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest(src.bundled))
        .pipe(plugins.notify({ title: "Production", message: "All files processed", onLast: true }));
});


// WATCH
gulp.task("watch", ["browserSync"], function () {
    gulp.watch([
        src.styles,
        src.scripts
    ], ["development"]);
    gulp.watch(src.bundled);
    gulp.watch(src.views, plugins.browserSync.reload);
    gulp.watch(src.scripts, plugins.browserSync.reload);
});



