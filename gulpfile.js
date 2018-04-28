const fs = require('fs');
const gulp = require('gulp');

const tinypng = require('gulp-tinypng-unlimited');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const minimist = require('minimist');

const minifycss = require('gulp-minify-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

var argv = minimist(process.argv.slice(2));
var cwd = argv.cwd;

if (cwd === true || cwd === undefined) {
    cwd = process.env.INIT_CWD;
}

var tinyPngOptions = {cachePath: 'compress_cache', filterRule: /\.(png|jpg)$/i};

function checkConfigOption(config) {
    if (config === true) {
        console.log('请输入配置文件名');
        process.exit();
    }
}

if (argv.run === 'compress') {
    checkConfigOption(argv.config);
    var configImagesJson = null;
    var configImages = argv.config || 'compress_images.json';
    try {
        var configImagesPath = cwd + '/' + configImages;
        configImagesJson = JSON.parse(fs.readFileSync(configImagesPath));
    }
    catch (e) {
        console.log('默认配置文件未找到');
        process.exit();
    }
    gulp.task('default', ['compress']);
}
else if (argv.run === 'atlas') {
    checkConfigOption(argv.config);
    var configSprites = argv.config || 'atlas_sprites.json';
    try {
        var configSpritesPath = cwd + '/' + configSprites;
        var configSpritesJson = JSON.parse(fs.readFileSync(configSpritesPath));
    }
    catch (e) {
        console.log('默认配置文件未找到');
        process.exit();
    }

    gulp.task('default', ['atlas']);
}
else if (argv.run === 'minify_css') {
    checkConfigOption(argv.config);
    var configCss = argv.config || 'minify_css.json';
    try {
        var configCssPath = cwd + '/' + configCss;
        var configCssJson = JSON.parse(fs.readFileSync(configCssPath));
    }
    catch (e) {
        console.log('默认配置文件未找到');
        process.exit();
    }

    gulp.task('default', ['minify_css']);
}
else if (argv.run === 'minify_js') {
    checkConfigOption(argv.config);
    var configJs = argv.config || 'minify_js.json';
    try {
        var configJsPath = cwd + '/' + configJs;
        var configJsJson = JSON.parse(fs.readFileSync(configJsPath));
    }
    catch (e) {
        console.log('默认配置文件未找到');
        process.exit();
    }

    gulp.task('default', ['minify_js']);
}
else {
    console.log('请输入正确的指令');
    process.exit();
}

//压缩图片
gulp.task('compress', function () {
    for (var imageNeedCompress in configImagesJson) {
        if (imageNeedCompress == 'key') {
            continue;
        }
        gulp.src(configImagesJson[imageNeedCompress].input)
            .pipe(tinypng(tinyPngOptions))
            .pipe(gulp.dest(configImagesJson[imageNeedCompress].output));
    }
});

//生成精灵图
gulp.task('atlas', function () {
    for (var imagesNeedSprite in configSpritesJson) {
        if (imagesNeedSprite == 'key') {
            continue;
        }

        var image_path_prefix = '';

        if (configSpritesJson[imagesNeedSprite].image_path_prefix !== undefined) {
            image_path_prefix = configSpritesJson[imagesNeedSprite].image_path_prefix;
        }

        //精灵图生成命令
        var spriteData = gulp.src(configSpritesJson[imagesNeedSprite].input).pipe(spritesmith({
            imgName: configSpritesJson[imagesNeedSprite].image_name,
            cssName: configSpritesJson[imagesNeedSprite].css_name,
            imgPath: image_path_prefix + configSpritesJson[imagesNeedSprite].image_name,
            //设置css前缀
            cssVarMap: function (sprite) {
                var pathArr = sprite.source_image.split('/');

                sprite.name = pathArr[pathArr.length - 2] + '_' + sprite.name;
            },
            //css定制模板
            cssTemplate: __dirname + '/css_template/sprite'
        }));

        var imageStream = spriteData.img.pipe(buffer());
        imageStream.pipe(gulp.dest(configSpritesJson[imagesNeedSprite].output_image));

        if (configSpritesJson[imagesNeedSprite].copy !== undefined) {
            imageStream.pipe(gulp.dest(configSpritesJson[imagesNeedSprite].copy));
        }

        //生成对应的css
        spriteData.css.pipe(gulp.dest(configSpritesJson[imagesNeedSprite].output_css));
    }
});

//css处理
gulp.task('minify_css', function () {
    for (var cssNeedMinify in configCssJson) {
        if (configCssJson[cssNeedMinify].concat === undefined) {
            gulp.src(configCssJson[cssNeedMinify].input)
                .pipe(minifycss())
                .pipe(rename({suffix: '.min'}))
                .pipe(gulp.dest(configCssJson[cssNeedMinify].output));
        }
        else {
            gulp.src(configCssJson[cssNeedMinify].input)
                .pipe(concat(configCssJson[cssNeedMinify].concat))
                .pipe(minifycss())
                .pipe(gulp.dest(configCssJson[cssNeedMinify].output));
        }
    }
});

//js处理
gulp.task('minify_js', function () {
    for (var jsNeedMinify in configJsJson) {
        if (configJsJson[jsNeedMinify].concat === undefined) {
            gulp.src(configJsJson[jsNeedMinify].input)
                .pipe(rename({suffix: '.min'}))
                .pipe(uglify())
                .pipe(gulp.dest(configJsJson[jsNeedMinify].output))
        }
        else {
            gulp.src(configJsJson[jsNeedMinify].input)
                .pipe(concat(configJsJson[jsNeedMinify].concat))
                .pipe(uglify())
                .pipe(gulp.dest(configJsJson[jsNeedMinify].output))
        }
    }
});
