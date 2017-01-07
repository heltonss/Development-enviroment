'use strict';
const gulp = require('gulp');
const server = require('gulp-server-livereload');
const inject = require('gulp-inject');
const wiredep = require('wiredep').stream;
const sass = require('gulp-sass');

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

    return target.pipe(inject(sources, { relative: true })).pipe(gulp.dest('./app'));
});

//watch all
gulp.task('watch', function() {
    gulp.watch('bower.json', ['injection-bower']);
    gulp.watch('app/styles/sass/**/*.scss', ['sass']);
    gulp.watch(['app/styles/**/*.css', 'app/scripts/**/*.js'], ['injection-dev']);
})

gulp.task('default', ['webserver', 'sass', 'injection-bower', 'injection-dev', 'watch']);