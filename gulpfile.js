// 在gulpfile中先载入gulp包
var gulp = require('gulp');
// 使用$引用以gulp开头的模块
var $ = require('gulp-load-plugins')();

var open = require('open');

// 定义一个对象保存路径
var path = {
    srcPath: 'src/',
    devPath: 'build/',
    prdPath: 'dist/'
};

// 拷贝框架文件
gulp.task('lib', function () {
    gulp.src('bower_components/**/*.js')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath + 'third'))
        .pipe(gulp.dest(path.prdPath + 'third'))
        .pipe($.connect.reload());
});

// 拷贝 压缩html文件
gulp.task('html', function () {
    gulp.src(path.srcPath + '**/*.html')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath))
        .pipe($.htmlmin({
            collapseWhitespace: true,
            removeComments: true
        }))
        .pipe(gulp.dest(path.prdPath))
        .pipe($.connect.reload());
});

// 拷贝json文件
gulp.task('json', function () {
    gulp.src(path.srcPath + 'data/**/*.json')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath + 'data'))
        .pipe(gulp.dest(path.prdPath + 'data'))
        .pipe($.connect.reload());
});

// 编译 压缩less文件
gulp.task('less', function () {
    gulp.src(path.srcPath + 'style/index.less')
        .pipe($.plumber())
        .pipe($.less())
        .pipe(gulp.dest(path.devPath + 'css'))
        .pipe($.cssmin())
        .pipe(gulp.dest(path.prdPath + 'css'))
        .pipe($.connect.reload());
})

// 合并 压缩混淆js文件
gulp.task('js', function () {
    gulp.src(path.srcPath + 'script/**/*.js')
        .pipe($.plumber())
        .pipe($.concat('index.js'))
        .pipe(gulp.dest(path.devPath + 'js'))
        .pipe($.uglify())
        .pipe(gulp.dest(path.prdPath + 'js'))
        .pipe($.connect.reload());
});

// 压缩image文件
gulp.task('image', function () {
    gulp.src(path.srcPath + 'image/**/*')
        .pipe($.plumber())
        .pipe(gulp.dest(path.devPath + 'image'))
        .pipe($.imagemin())
        .pipe(gulp.dest(path.prdPath + 'image'))
        .pipe($.connect.reload());
})

gulp.task('build', ['lib', 'html', 'json', 'less', 'js', 'image']);

gulp.task('clean', function () {
    gulp.src([path.devPath, path.prdPath])
        .pipe($.clean());
});

gulp.task('serve', ['build'], function () {
    $.connect.server({
        root: [path.devPath],
        livereload: true,
        port: 1235
    });
    open('http://localhost:1235');
    gulp.watch('bower_components/**/*', ['lib']);
    gulp.watch(path.srcPath + '**/*.html', ['html']);
    gulp.watch(path.srcPath + 'data/**/*.json', ['json']);
    gulp.watch(path.srcPath + 'style/**/*.less', ['less']);
    gulp.watch(path.srcPath + 'script/**/*.js', ['js']);
    gulp.watch(path.srcPath + 'image/**/*', ['image']);
});