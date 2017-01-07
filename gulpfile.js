'use strict';
const gulp = require('gulp');
const server = require('gulp-server-livereload');
const inject = require('gulp-inject');
const wiredep = require('wiredep').stream;
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const concat = require('gulp-concat');
const clean = require('gulp-clean-dest');
const cleanCSS = require('gulp-clean-css');
const htmlmin = require('gulp-htmlmin');

//webserver listening directories
gulp.task('webserver', function() {
    gulp.src('app/')
        .pipe(server({
            livereload: true,
            open: true,
            port: 3000,
            defaultFile: 'index.html'
        }));
});


//SASS
gulp.task('sass', function() {
    return gulp.src('app/styles/sass/**/*.scss').pipe(sass({
        noCache: true
    })).pipe(gulp.dest('app/styles/css'));
});

//Injecting dependencies of the bower with wiredep 
gulp.task('injection-bower', function() {
    gulp.src('app/index.html').pipe(wiredep({})).pipe(gulp.dest('app/'));
});

//inject the scripts js and the css
gulp.task('injection-dev', function() {
    const target = gulp.src('app/index.html');
    const sources = gulp.src(['app/styles/**/*.css', 'app/scripts/**/*.js'], { read: false });

    target.pipe(inject(sources, { relative: true })).pipe(gulp.dest('./app'));
});

//watch all
gulp.task('watch', function() {
    gulp.watch('bower.json', ['injection-bower']);
    gulp.watch('app/styles/sass/**/*.scss', ['sass']);
    gulp.watch(['app/styles/**/*.css', 'app/scripts/**/*.js'], ['injection-dev']);
})

//process of buid
gulp.task('uglifyJs', function () {
    gulp.src(['app/scripts/**/*.js'])
        .pipe(uglify())
        .pipe(concat('script.min.js'))
        .pipe(clean('build/js'))
        .pipe(gulp.dest('build/js'));
})

gulp.task('perform-css', function () {
    gulp.src(['app/styles/**/*.css'])
        .pipe(cleanCSS())
        .pipe(concat('styles.min.css'))
        .pipe(gulp.dest('build/css'));
})

gulp.task('perform-html', function () {
    gulp.src('app/**/**/*.html')
        .pipe(htmlmin({
            collapseWhitespace:true,
            removeComments: true
        }))
        .pipe(gulp.dest('build/'))
})

gulp.task('build', function () {
    gulp.watch(['app/styles/**/*.css', 'app/scripts/**/*.js'], ['perform-css','uglifyJs']);
    gulp.watch(['app/**/**/*.html'],['perform-html']);
})

gulp.task('default', ['webserver', 'sass', 'injection-bower', 'injection-dev', 'watch','build']);