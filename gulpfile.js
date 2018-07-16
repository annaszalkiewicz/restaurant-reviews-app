var gulp = require('gulp');
var browserSync = require('browser-sync').create();
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');
const concat = require('gulp-concat');

gulp.task('serve', () =>  {
	browserSync.init({
		server: {
			baseDir: './'
		},
	});
	gulp.watch('css/*.css').on('change', browserSync.reload);
	gulp.watch('*.html').on('change', browserSync.reload);
	gulp.watch('js/*.js').on('change', browserSync.reload);
});

gulp.task('babel', () =>
	gulp.src('js/*.js')
		.pipe(sourcemaps.init())
		.pipe(babel({
			presets: ['env']
		}))
		// .pipe(concat('app.js'))
		// .pipe(sourcemaps.write('.'))
		.pipe(gulp.dest('dist/js'))
);
gulp.task('sw', () =>
	gulp.src('sw.js')
		.pipe(babel({
			presets: ['env']
		}))
		.pipe(gulp.dest('dist'))
);

gulp.task('default', ['serve', 'babel', 'sw']);