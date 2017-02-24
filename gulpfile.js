var gulp = require('gulp');
var util = require('gulp-util');
var fs = require('fs-extra');
var Q = require('q');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var watch = require('gulp-watch');

var rimraf = require('rimraf');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');
var minifyImg = require('gulp-imagemin');
var htmlmin = require('gulp-htmlmin');
var watchify = require('watchify');
var browserify = require('browserify');
var tsify = require('tsify');
var babelify = require('babelify');
var uglify = require('gulp-uglify');
var jshint = require('gulp-jshint');
var tslint = require('gulp-tslint');
var nodemon = require('gulp-nodemon');
var runSequence = require('run-sequence');

var config = {
  scss: {
      src: './client/scss/*.scss',
      out: './server/public/stylesheets',
  },
  img: {
      src: './game/assets/img/**/*',
      out: './server/public/img'
  },
  html: {
      src: './client/html/index.html',
      out: './server/public/html'
  },
  ts: {
      src: './client/js/main.ts',
      out: './server/public/javascripts'
  }
};

// clear out the public files on the server
gulp.task('clean', function() {
  var deferred = Q.defer();
  rimraf('./server/public/**/*', function(e) {
    if (e) util.log(util.colors.red(e.toString()));
    deferred.resolve();
  });
  return deferred.promise;
});

// compile scss into css
gulp.task('watch-scss', function() {
  return watch(config.scss.src, function() {
      return gulp.start('compile-scss');
  });
});

gulp.task('compile-scss', function() {
  var deferred = Q.defer();
  gulp.src(config.scss.src)
    .pipe(sass())
    .pipe(gulp.dest(config.scss.out))
    .on('end', function() {
      deferred.resolve();
    });
  return deferred.promise;
});

gulp.task('minify-scss', function() {
  var deferred = Q.defer();
  gulp.src(config.scss.src)
    .pipe(sass())
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest(config.scss.out))
    .on('end', function() {
      deferred.resolve();
    });
  return deferred.promise;
});

// move game images into the server
gulp.task('watch-img', function() {
  return watch(config.img.src, function() {
    return gulp.start('compile-img');
  });
});

gulp.task('compile-img', function() {
  var deferred = Q.defer();
  gulp.src(config.img.src)
    .pipe(gulp.dest(config.img.out))
    .on('end', function() {
      deferred.resolve();
    });
  return deferred.promise;
});

gulp.task('minify-img', function() {
  var deferred = Q.defer();
  gulp.src(config.img.src)
    .pipe(minifyImg())
    .pipe(gulp.dest(config.img.out))
    .on('end', function() {
      deferred.resolve();
    });
  return deferred.promise;
});

// move html files over to the server
gulp.task('watch-html', function() {
  return watch(config.html.src, function() {
    return gulp.start('compile-html');
  });
});

gulp.task('compile-html', function() {
  // make sure the html folder exists
  var dir = config.html.out;
  var deferred = Q.defer();
  fs.ensureDir(dir, function(e) {
    if (e) util.log(util.colors.red(e.toString()));
    gulp.src(config.html.src)
      .pipe(gulp.dest(config.html.out))
      .on('end', function() {
        deferred.resolve();
      });
  });
  return deferred.promise;
});

gulp.task('minify-html', function() {
  // make sure the html folder exists
  var dir = config.html.out;
  var deferred = Q.defer();
  fs.ensureDir(dir, function(e) {
    if (e) util.log(util.colors.red(e.toString()));
    gulp.src(config.html.src)
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest(config.html.out))
      .on('end', function() {
        deferred.resolve();
      });
  });
  return deferred.promise;
});

// compile typescript
gulp.task('watch-ts', function() {
  var task = ['watch-ts'];
  var count = 0;
  var cyan = util.colors.cyan;
  var magenta = util.colors.magenta;

  var bundle = function(bundler) {
    util.log(cyan(task), 'Starting bundling', magenta('#' + count));
    var startTime = new Date().getTime();

    return bundler
      .bundle()
      .on('error', function(e) {
        util.log(util.colors.red(e.toString()));
        this.emit('end');
      })
      .pipe(source('app.js'))
      .pipe(gulp.dest(config.ts.out))
      .on('end', function() {
        var time = new Date().getTime() - startTime;
        util.log(cyan(task), 'Finished bundling', magenta('#' + count++), 'after', magenta(time + 'ms'));
      });
  };

  var bundler = browserify(config.ts.src, {
    cache: {},
    packageCache: {},
    sourceMap: false
  })
  .plugin(watchify)
  .plugin(tsify)
  .transform(babelify.configure({
    compact: false,
    presets: ['es2015']
  }));

  bundler.on('update', function() {
    bundle(bundler);
  });

  return bundle(bundler);
});

gulp.task('compile-ts', function() {
  return browserify(config.ts.src, {
    cache: {},
    packageCache: {},
    sourceMap: false
  })
  .plugin(tsify)
  .transform(babelify.configure({
    compact: false,
    presets: ['es2015']
  }))
  .bundle()
  .pipe(source('app.js'))
  .pipe(gulp.dest(config.ts.out));
});

gulp.task('minify-ts', function() {
  return browserify(config.ts.src, {
    cache: {},
    packageCache: {},
    sourceMap: false
  })
  .plugin(tsify)
  .transform(babelify.configure({
    compact: false,
    presets: ['es2015']
  }))
  .bundle()
  .pipe(source('app.js'))
  .pipe(buffer())
  .pipe(uglify())
  .pipe(gulp.dest(config.ts.out));
});

gulp.task('move-js', function() {
  var dir = config.ts.out + '/libraries';
  var deferred = Q.defer();
  fs.ensureDir(dir, function(e) {
    if (e) util.log(util.colors.red(e.toString()));
    gulp.src([
      './client/js/libraries/*.js'
    ])
    .pipe(gulp.dest(dir))
    .on('end', function() {
      deferred.resolve();
    });
  });
return deferred.promise;
});

gulp.task('nodemon', function() {
  nodemon({
    srcipt: 'server/bin/www',
    tasks: [],
    ext: 'html js ts scss',
    env: { NODE_ENV: 'development' },
    ignore: [
      'server/public/**',
      'node_modules',
      'client/**'
    ]
  });
});

// javascript linter
gulp.task('lintjs', function() {
  return gulp.src([
    '*.js',
    '!./client/js/libraries/**/*.js',
    './client/js/**/*.js',
    './game/server/**/*.js',
    '!./server/public/javascripts/**/*.js',
    './server/**/*.js'
  ])
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// typescript linter
gulp.task('lintts', function() {
  return gulp.src([
    './client/js/**/*.ts'
  ])
    .pipe(tslint({
        formatter: 'verbose'
    }))
    .pipe(tslint.report({
      emitError: false,
      summarizeFailureOutput: true,
    }));
});

gulp.task('lint', function() {
  return runSequence(['lintjs', 'lintts']);
});

gulp.task('compile', function() {
  return runSequence('clean', ['compile-scss', 'compile-img', 'compile-html', 'compile-ts', 'move-js']);
});

gulp.task('watch', function() {
  return runSequence('clean', 'compile', ['watch-scss', 'watch-img', 'watch-html', 'watch-ts', 'nodemon', 'move-js']);
});

gulp.task('minify', function() {
  return runSequence('clean', ['minify-html', 'minify-img', 'minify-scss', 'minify-ts', 'move-js']);
});

gulp.task('default', function() {
  gulp.start('watch');
});
