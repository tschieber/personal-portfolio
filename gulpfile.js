//initialize all of our variables
var app, base, concat, directory, gulp, gutil, hostname, path, refresh, sass, uglify, imagemin, minifyCSS, del, browserSync, autoprefixer, gulpSequence, shell, sourceMaps;

var autoPrefixBrowserList = ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'];

//load all of our dependencies
//add more here if you want to include more libraries
gulp        = require('gulp');
gutil       = require('gulp-util');
concat      = require('gulp-concat');
uglify      = require('gulp-uglify');
jade        = require('gulp-jade');
sass        = require('gulp-sass');
sourceMaps  = require('gulp-sourcemaps');
minifyCSS   = require('gulp-minify-css');
browserSync = require('browser-sync');
autoprefixer = require('gulp-autoprefixer');
gulpSequence = require('gulp-sequence').use(gulp);
shell       = require('gulp-shell');

gulp.task('browserSync', function() {
    browserSync({
        server: {
            baseDir: "app/"
        },
        options: {
            reloadDelay: 250
        },
        notify: false
    });
});

//compiling our Javascripts
gulp.task('scripts-app', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/app/**/*.js'])
                //this is the filename of the compressed version of our JS
               .pipe(concat('app.js'))
               //catch errors
               .on('error', gutil.log)
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('app/scripts'))
               //notify browserSync to refresh
               .pipe(browserSync.reload({stream: true}));
});

gulp.task('scripts-plugin', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/plugin/**/*.js'])
                //this is the filename of the compressed version of our JS
               .pipe(concat('plugin.js'))
               //catch errors
               .on('error', gutil.log)
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('app/scripts'));
});

gulp.task('scripts-lib', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/lib/**/*.js'])
                //this is the filename of the compressed version of our JS
               .pipe(concat('lib.js'))
               //catch errors
               .on('error', gutil.log)
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('app/scripts'));
});

gulp.task('scripts', ['scripts-app', 'scripts-plugin', 'scripts-lib']);

//compiling our Javascripts for deployment
gulp.task('scripts-app-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/app/**/*.js'])
                //this is the filename of the compressed version of our JS
               .pipe(concat('app.js'))
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('dist/scripts'));
});

gulp.task('scripts-plugin-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/plugin/**/*.js'])
                //this is the filename of the compressed version of our JS
               .pipe(concat('plugin.js'))
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('dist/scripts'));
});

gulp.task('scripts-lib-deploy', function() {
    //this is where our dev JS scripts are
    return gulp.src(['app/scripts/lib/**/*.js'])
                //this is the filename of the compressed version of our JS
               .pipe(concat('lib.js'))
               //compress :D
               .pipe(uglify())
               //where we will store our finalized, compressed script
               .pipe(gulp.dest('dist/scripts'));
});

gulp.task('scripts-deploy', ['scripts-app-deploy', 'scripts-plugin-deploy', 'scripts-lib-deploy']);

//compiling our SCSS files
gulp.task('styles', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/scss/init.scss')
                //get sourceMaps ready
                .pipe(sourceMaps.init())
                //include SCSS and list every "include" folder
               .pipe(sass({
                      errLogToConsole: true,
                      includePaths: [
                          'app/styles/scss/'
                      ]
               }))
               .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
               }))
               //catch errors
               .on('error', gutil.log)
               //the final filename of our combined css file
               .pipe(concat('styles.css'))
                //get our sources via sourceMaps
                .pipe(sourceMaps.write())
               //where to save our final, compressed css file
               .pipe(gulp.dest('app/styles'))
               //notify browserSync to refresh
               .pipe(browserSync.reload({stream: true}));
});

//compiling our SCSS files for deployment
gulp.task('styles-deploy', function() {
    //the initializer / master SCSS file, which will just be a file that imports everything
    return gulp.src('app/styles/scss/init.scss')
                //include SCSS includes folder
               .pipe(sass({
                      includePaths: [
                          'app/styles/scss',
                      ]
               }))
               .pipe(autoprefixer({
                   browsers: autoPrefixBrowserList,
                   cascade:  true
               }))
               //the final filename of our combined css file
               .pipe(concat('styles.css'))
               .pipe(minifyCSS())
               //where to save our final, compressed css file
               .pipe(gulp.dest('dist/styles'));
});

//compiling our Jade
gulp.task('jade', function() {
    //this is where our Jade files are
    return gulp.src(['app/jade/page/*.jade'])
               //catch errors
               .on('error', gutil.log)
               //Jade options
               .pipe(jade({
                   pretty: true
               }))
               //where we will store our finalized, compiled Jade as HTML
               .pipe(gulp.dest('app/'));
});

//basically just keeping an eye on all HTML files
gulp.task('html', function() {
    //watch any and all HTML files and refresh when something changes
    return gulp.src('app/*.html')
        .pipe(browserSync.reload({stream: true}))
       //catch errors
       .on('error', gutil.log);
});

//migrating over all HTML files for deployment
gulp.task('html-deploy', function() {
    //grab everything, which should include htaccess, robots, etc
    gulp.src('app/*')
        .pipe(gulp.dest('dist'));

    //grab any hidden files too
    gulp.src('app/.*')
        .pipe(gulp.dest('dist'));

    gulp.src('app/fonts/**/*')
        .pipe(gulp.dest('dist/fonts'));
	
	gulp.src('app/assets/**/*')
        .pipe(gulp.dest('dist/assets'));

    //grab all of the styles
    gulp.src(['app/styles/*.css', '!app/styles/styles.css'])
        .pipe(gulp.dest('dist/styles'));
});

//cleans our dist directory in case things got deleted
gulp.task('clean', function() {
    return shell.task([
      'rm -rf dist'
    ]);
});

//create folders using shell
gulp.task('scaffold', function() {
  return shell.task([
      'mkdir dist',
	  'mkdir dist/assets',
      'mkdir dist/fonts',
      'mkdir dist/images',
      'mkdir dist/scripts',
      'mkdir dist/styles'
    ]
  );
});

//this is our master task when you run 'gulp' in CLI / Terminal
//this is the main watcher to use when in active development
//  this will:
//  startup the web server,
//  start up browserSync
//  compress all scripts and SCSS files
gulp.task('default', ['browserSync', 'scripts', 'styles'], function() {
    //a list of watchers, so it will watch all of the following files waiting for changes
    gulp.watch('app/scripts/**', ['scripts']);
    gulp.watch('app/styles/scss/**', ['styles']);
    gulp.watch('app/jade/**', ['jade']);
    gulp.watch('app/*.html', ['html']);
});

//this is our deployment task, it will set everything for deployment-ready files
gulp.task('deploy', gulpSequence('clean', 'scaffold', ['scripts-deploy', 'styles-deploy'], 'html-deploy'));
