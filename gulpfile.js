var gulp = require('gulp'),
    watch = require('gulp-watch'),g
    prefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourcemaps = require('gulp-sourcemaps'),
    rigger = require('gulp-rigger'),
    cssmin = require('gulp-minify-css'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    rimraf = require('rimraf'),
    browserSync = require("browser-sync"),
    reload = browserSync.reload,
    minifyHTML = require('gulp-minify-html'),
    cache = require('gulp-cache'),
    concat = require('gulp-concat'),
    flatten = require('gulp-flatten');

var path = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/',
        fonts: 'build/fonts/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/blocks/**/*.js',
        style: 'src/blocks/**/*.scss',
        img: 'src/blocks/**/*.{jpg,png,svg,gif}',
        fonts: 'src/fonts/**/*.*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/blocks/**/*.js',
        style: 'src/blocks/**/*.scss',
        img: 'src/blocks/**/*.*',
        fonts: 'src/fonts/**/*.*'
    },
    clean: './build'
};

var config = {
    server: {
        baseDir: "./build"
    },
    tunnel: true,
    host: 'localhost',
    port: 3030,
    logPrefix: "nexis"
};

gulp.task('html:build', function () {
    gulp.src(path.src.html)
        .pipe(rigger())
        .pipe(minifyHTML({
            quotes: true
        }))
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream: true}));
});
gulp.task('js:build', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(concat('main.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.js))
        .pipe(reload({stream: true}));
});
gulp.task('style:build', function () {
    gulp.src(path.src.style)
        .pipe(sourcemaps.init())
        .pipe(concat('style.css'))
        .pipe(sass(
            {
                outputStyle: 'nested',
                precision: 10,
                includePaths: ['.'],
                onError: console.error.bind(console, 'Sass error:')
            }))
        .pipe(prefixer())
        .pipe(cssmin())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.build.css))
        .pipe(reload({stream: true}));
});
gulp.task('image:build', function () {
    gulp.src(path.src.img)
        // .pipe(cache(imagemin([
        //     imagemin.svgo(),
        //     imagemin.optipng({optimizationLevel: 3}),
        //     pngquant({quality: '65-70', speed: 5})
        // ], {
        //     verbose: true
        // })))
         .pipe(flatten())
        .pipe(gulp.dest(path.build.img));
});
gulp.task('fonts:build', function() {
    gulp.src(path.src.fonts)
        .pipe(gulp.dest(path.build.fonts))
});
gulp.task('build', [
    'html:build',
    'js:build',
    'style:build',
    'fonts:build',
    'image:build'
]);

gulp.task('watch', function(){
    watch([path.watch.html], function(event, cb) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function(event, cb) {
        gulp.start('style:build');
    });
    watch([path.watch.js], function(event, cb) {
        gulp.start('js:build');
    });
    watch([path.watch.img], function(event, cb) {
        gulp.start('image:build');
    });
    watch([path.watch.fonts], function(event, cb) {
        gulp.start('fonts:build');
    });
});
gulp.task('webserver', function () {
    browserSync(config);
});
gulp.task('clean', function (cb) {
    rimraf(path.clean, cb);
});
gulp.task('default', ['build', 'webserver', 'watch']);