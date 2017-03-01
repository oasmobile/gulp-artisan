const gulp = require('gulp');
const image = require('gulp-image');
const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const minimist = require('minimist');
const fs = require('fs');

var argv = minimist(process.argv.slice(2));
var cwd = argv.cwd;

if (cwd === true || cwd === undefined) {
    cwd = process.env.INIT_CWD;
}

function checkConfigOption(config) {
    if (config === true) {
        console.log('请输入配置文件名');
        process.exit();
    }
}

if (argv.run === 'compress') {
    checkConfigOption(argv.config);
    var configImages = argv.config || 'compress_images.json';
    try {
        var configImagesPath = cwd + '/' + configImages;
        var configImagesJson = JSON.parse(fs.readFileSync(configImagesPath));
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
else {
    console.log('请输入正确的指令');
    process.exit();
}

//压缩图片
gulp.task('compress', function () {
    for (var imageNeedCompress in configImagesJson) {
        gulp.src(configImagesJson[imageNeedCompress].input)
            .pipe(image())
            .pipe(gulp.dest(configImagesJson[imageNeedCompress].output));
    }
});

//生成精灵图
gulp.task('atlas', function () {
    for (var imagesNeedSprite in configSpritesJson) {
        //精灵图生成命令
        var dist = configSpritesJson[imagesNeedSprite].output;

        var spriteData = gulp.src(configSpritesJson[imagesNeedSprite].input).pipe(spritesmith({
            imgName: configSpritesJson[imagesNeedSprite].image_name,
            cssName: configSpritesJson[imagesNeedSprite].css_name,
            //设置css前缀
            cssVarMap: function (sprite) {
                sprite.name = imagesNeedSprite + '_' + sprite.name;
            },
            //css定制模板
            cssTemplate: __dirname + '/css_template/sprite'
        }));

        //精灵图再次优化
        var imgStream = spriteData.img
            .pipe(buffer())
            .pipe(image())
            .pipe(gulp.dest(dist));

        //生成对应的css
        var cssStream = spriteData.css
            .pipe(gulp.dest(dist));
    }
});
