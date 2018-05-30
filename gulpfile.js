require('chromedriver');

const fs = require('fs');
const gulp = require('gulp');

const spritesmith = require('gulp.spritesmith');
const buffer = require('vinyl-buffer');
const minimist = require('minimist');

const minifycss = require('gulp-minify-css');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');

const imagemin = require('gulp-imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');

const webdriver = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const dateTime = require('date-time');

let argv = minimist(process.argv.slice(2));
let cwd = argv.cwd;

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
    let configImages = argv.config || 'compress_images.json';
    try {
        let configImagesPath = cwd + '/' + configImages;
        var configImagesJson = JSON.parse(fs.readFileSync(configImagesPath));
    }
    catch (e) {
        console.log('默认配置文件未找到或格式错误');
        process.exit();
    }
    gulp.task('default', ['compress']);
}
else if (argv.run === 'atlas') {
    checkConfigOption(argv.config);
    let configSprites = argv.config || 'atlas_sprites.json';
    try {
        let configSpritesPath = cwd + '/' + configSprites;
        var configSpritesJson = JSON.parse(fs.readFileSync(configSpritesPath));
    }
    catch (e) {
        console.log('默认配置文件未找到或格式错误');
        process.exit();
    }

    gulp.task('default', ['atlas']);
}
else if (argv.run === 'minify_css') {
    checkConfigOption(argv.config);
    let configCss = argv.config || 'minify_css.json';
    try {
        let configCssPath = cwd + '/' + configCss;
        var configCssJson = JSON.parse(fs.readFileSync(configCssPath));
    }
    catch (e) {
        console.log('默认配置文件未找到或格式错误');
        process.exit();
    }

    gulp.task('default', ['minify_css']);
}
else if (argv.run === 'minify_js') {
    checkConfigOption(argv.config);
    let configJs = argv.config || 'minify_js.json';
    try {
        let configJsPath = cwd + '/' + configJs;
        var configJsJson = JSON.parse(fs.readFileSync(configJsPath));
    }
    catch (e) {
        console.log('默认配置文件未找到或格式错误');
        process.exit();
    }

    gulp.task('default', ['minify_js']);
}
else if (argv.run === 'console') {
    checkConfigOption(argv.config);
    let configJs = argv.config || 'console.json';
    try {
        let configConsolePath = cwd + '/' + configJs;
        var configConsoleJson = JSON.parse(fs.readFileSync(configConsolePath));
    }
    catch (e) {
        console.log('默认配置文件未找到或格式错误');
        process.exit();
    }

    gulp.task('default', ['console']);
}
else {
    console.log('请输入正确的指令');
    process.exit();
}

//压缩图片
gulp.task('compress', function () {
    for (let imageNeedCompress in configImagesJson) {
        if (configImagesJson[imageNeedCompress].enabled === undefined) {
            configImagesJson[imageNeedCompress].enabled = true;
        }

        if (configImagesJson[imageNeedCompress].enabled) {
            configImagesJson[imageNeedCompress].gifsicle = configImagesJson[imageNeedCompress].gifsicle || {};
            configImagesJson[imageNeedCompress].mozjpeg = configImagesJson[imageNeedCompress].mozjpeg || {};
            configImagesJson[imageNeedCompress].pngquant = configImagesJson[imageNeedCompress].pngquant || {};
            configImagesJson[imageNeedCompress].svgo = configImagesJson[imageNeedCompress].svgo || {};

            gulp.src(configImagesJson[imageNeedCompress].input)
                .pipe(imagemin([
                        imagemin.gifsicle(configImagesJson[imageNeedCompress].gifsicle),
                        imageminMozjpeg(configImagesJson[imageNeedCompress].mozjpeg),
                        imageminPngquant(configImagesJson[imageNeedCompress].pngquant),
                        imagemin.svgo(configImagesJson[imageNeedCompress].svgo)],
                    {verbose: true}))
                .pipe(gulp.dest(configImagesJson[imageNeedCompress].output));
        }
        else {
            gulp.src(configImagesJson[imageNeedCompress].input)
                .pipe(gulp.dest(configImagesJson[imageNeedCompress].output));
        }
    }
});

//生成精灵图
gulp.task('atlas', function () {
    for (let imagesNeedSprite in configSpritesJson) {
        let image_path_prefix = configSpritesJson[imagesNeedSprite].image_path_prefix || '';

        //精灵图生成命令
        let spriteData = gulp.src(configSpritesJson[imagesNeedSprite].input).pipe(spritesmith({
            imgName: configSpritesJson[imagesNeedSprite].image_name,
            cssName: configSpritesJson[imagesNeedSprite].css_name,
            imgPath: image_path_prefix + configSpritesJson[imagesNeedSprite].image_name,
            //设置css前缀
            cssVarMap: function (sprite) {
                let pathArr = sprite.source_image.split('/');

                sprite.name = pathArr[pathArr.length - 2] + '_' + sprite.name;
            },
            //css定制模板
            cssTemplate: __dirname + '/css_template/sprite'
        }));

        let imageStream = spriteData.img.pipe(buffer());
        imageStream.pipe(gulp.dest(configSpritesJson[imagesNeedSprite].output_image));

        //生成对应的css
        spriteData.css.pipe(gulp.dest(configSpritesJson[imagesNeedSprite].output_css));
    }
});

//css处理
gulp.task('minify_css', function () {
    for (let cssNeedMinify in configCssJson) {
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
    for (let jsNeedMinify in configJsJson) {
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

//console处理
gulp.task('console', function () {
    let driver = null;
    let builder = new webdriver.Builder();
    let prefs = new webdriver.logging.Preferences();

    let options = new chrome.Options();
    prefs.setLevel(webdriver.logging.Type.BROWSER, webdriver.logging.Level.ALL);
    options.setLoggingPrefs(prefs);
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');

    driver = builder
        .forBrowser(webdriver.Browser.CHROME)
        .setChromeOptions(options)
        .build();

    for (let websiteNeedConsole in configConsoleJson) {
        for (let index = 0; index < configConsoleJson[websiteNeedConsole].length; index++) {
            driver
                .get(configConsoleJson[websiteNeedConsole][index])
                .then(() => driver.manage().logs().get(webdriver.logging.Type.BROWSER))
                .then((logs) => {
                    for (let entry in logs) {
                        if (logs[entry].level.name_ == 'SEVERE') {
                            console.log('[' + dateTime() + '] '
                                + websiteNeedConsole
                                + '[' + configConsoleJson[websiteNeedConsole][index]
                                + '].ERROR'
                                + ': ' + logs[entry].message
                            );
                        }
                    }
                })
                .then(() => driver.quit());
        }
    }
});
