var gulp = require('gulp');
// main module
var uglify = require('gulp-uglify');
// module to compass JavaScript files
var minifyCSS = require('gulp-minify-css');
// module to compass CSS files
var imagemin = require('gulp-imagemin');
// module to compass images
var sass = require('gulp-ruby-sass');
// module to compile SASS files
var watchPath = require('gulp-watch-path');
// module to optimize efficiency of watcher
var gutil = require('gulp-util');
// module to lighten keywords
var combiner = require('stream-combiner2');
// module to catch errors in compassing
var sourcemaps = require('gulp-sourcemaps');
// module to help debuging JavaScript & CSS files

gulp.task('script', function(){
	gulp.src('src/js/*.js')
		.pipe(uglify())
		.pipe(gulp.dest('js'));
});

gulp.task('style', function(){
	gulp.src('src/css/*.css')
		.pipe(minifyCSS())
		.pipe(gulp.dest('css'));
});

gulp.task('image', function(){
	gulp.src('src/images/*.*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/images'));
});

gulp.task('sass', function(){
	return sass('src/sass/')
		.on('error', function(err){
			console.error('Error!', err.message)
		})
		.pipe(gulp.dest('dist/css'));
});

gulp.task('watchjs', function(){
	gulp.watch('src/js/**/*.js', function(event){
		var paths = watchPath(event, 'src/', '');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
		gutil.log(paths.distPath);

		combiner.obj([gulp.src(paths.srcPath)
			,sourcemaps.init()
			,uglify()
			,sourcemaps.write('./')
			,gulp.dest(paths.distDir)]).on('error', function(err){
				var colors = gutil.colors;
				console.log('\n');
				gutil.log(colors.red('Error!'));
				gutil.log('fileName: ' + colors.red(err.fileName));
				gutil.log('lineNumber: ' + colors.red(err.lineNumber));
				gutil.log('message: ' + err.message);
				gutil.log('plugin: ' + colors.yellow(err.plugin));
			});
	});
});

gulp.task('watchcss', function(){
	gulp.watch('src/css/**/*.css', function(event){
		var paths = watchPath(event, 'src/', '');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
		gutil.log(paths.distPath);

		combiner.obj([gulp.src(paths.srcPath)
		,sourcemaps.init()
		,minifyCSS()
		,sourcemaps.write('./')
		,gulp.dest(paths.distDir)]).on('error', function(err){
			var colors = gutil.colors;
			console.log('\n');
			gutil.log(colors.red('Error!'));
			gutil.log('fileName: ' + colors.red(err.fileName));
			gutil.log('lineNumber: ' + colors.red(err.lineNumber));
			gutil.log('message: ' + err.message);
			gutil.log('plugin: ' + colors.yellow(err.plugin));
		});
	});
});

gulp.task('watchimage', function(){
	gulp.watch('src/images/**/*.*', function(event){
		var paths = watchPath(event, 'src/', '');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
		gutil.log(paths.distPath);

		combiner.obj([gulp.src(paths.srcPath)
			,imagemin()
			,gulp.dest(paths.distDir)]).on('error', function(err){
				var colors = gutil.colors;
				console.log('\n');
				gutil.log(colors.red('Error!'));
				gutil.log('message: ' + err.message);
			});
	});
});

gulp.task('watchsass', function(){
	gulp.watch('src/sass/**/*', function(event){
		var paths = watchPath(event, 'src/sass/', 'css/');
		gutil.log(gutil.colors.green(event.type) + ' ' + paths.srcPath)
		gutil.log(paths.distPath);

		return sass(paths.srcPath)
			.on('error', function(err){
				var colors = gutil.colors;
				console.log('\n');
				gutil.log(colors.red('Error!'));
				gutil.log('message: ' + err.message);
			})
			.pipe(sourcemaps.init())
			.pipe(minifyCSS())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest(paths.distDir));
	});
});



gulp.task('auto', ['watchjs', 'watchcss', 'watchimage', 'watchsass']);
gulp.task('default', ['script', 'style', 'image', 'sass', 'auto']);