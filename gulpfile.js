// Load plugins
var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var jshint = require('gulp-jshint');
var stripdebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var concat = require('gulp-concat');
var notify = require('gulp-notify');
var cleancss = require('gulp-clean-css');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');
var base64 = require('gulp-base64');
var browsersync = require('browser-sync');
var sourcemaps = require('gulp-sourcemaps');

// error function for plumber
var onError = function (err) {
  gutil.beep();
  console.log(err);
  this.emit('end');
};

// Browser definitions for autoprefixer
var AUTOPREFIXER_BROWSERS = [
  'last 3 versions',
  'ie >= 8',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

//build datestamp for cache busting
var getStamp = function() {
  var myDate = new Date();

  var myYear = myDate.getFullYear().toString();
  var myMonth = ('0' + (myDate.getMonth() + 1)).slice(-2);
  var myDay = ('0' + myDate.getDate()).slice(-2);
  var mySeconds = myDate.getSeconds().toString();

  var myFullDate = myYear + myMonth + myDay + mySeconds;

  return myFullDate;
};

// BrowserSync proxy
gulp.task('browser-sync', function() {
  browsersync.init({
     server: {
         baseDir: './'
     }
 });
});

// BrowserSync reload all Browsers
gulp.task('browsersync-reload', function () {
    browsersync.reload();
});

// // Optimize Images task
// gulp.task('images', function() {
//   return gulp.src('images/**/*.{gif,jpg,png}')
//     .pipe(imagemin({
//         progressive: true,
//         interlaced: true,
//         svgoPlugins: [ {removeViewBox:false}, {removeUselessStrokeAndFill:false} ]
//     }))
//     .pipe(gulp.dest('dist/img/'))
// });

// CSS task
gulp.task('css', function() {
  return gulp.src('css/*.css')
    .pipe(concat('build.min.css'))
    .pipe(cleancss())
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('dist/css/'))
    .pipe(browsersync.reload({ stream:true }))
    .pipe(notify({ message: 'Styles task complete' }));
});

// Lint JS task
// gulp.task('jslint', function() {
//   return gulp.src('js/*.js')
//     .pipe(jshint())
//     .pipe(jshint.reporter('default'))
//     .pipe(jshint.reporter('fail'))
//     .pipe(notify({ message: 'Lint task complete' }));
// });

//Concatenate and Minify JS task
gulp.task('scripts', function() {
  return gulp.src(['js/jquery.js','js/*.js'])
    .pipe(concat())
    .pipe(gulp.dest('dist/js'))
    .pipe(rename('build.min.js'))
    .pipe(stripdebug())
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Cache busting task
gulp.task('cachebust', function() {
  return gulp.src('*.html')
    .pipe(replace(/build.min.css\?([0-9]*)/g, 'build.min.css?' + getStamp()))
    .pipe(replace(/build.min.js\?([0-9]*)/g, 'build.min.js?' + getStamp()))
    .pipe(gulp.dest('dist/js'))
    .pipe(notify({ message: 'CSS/JS Cachebust task complete' }));
});

// Watch task
gulp.task('watch', ['browser-sync'], function () {
  gulp.watch('css/**/*', ['css']);
  gulp.watch('js/**/*', ['scripts', 'browsersync-reload']);
  gulp.watch('*.html', ['browsersync-reload']);
});

//tasks
gulp.task('default', ['css', 'scripts']);
