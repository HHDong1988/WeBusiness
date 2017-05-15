var gulp = require('gulp');
var uglify = require('gulp-uglify');
var ngAnnotate = require('gulp-ng-annotate');

gulp.task('minify', function () {
  return gulp.src('/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('/lib/_app'));
});