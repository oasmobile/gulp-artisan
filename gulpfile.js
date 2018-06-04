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
else if (argv.run === 'network') {
    checkConfigOption(argv.config);
    let configJs = argv.config || 'network.json';
    try {
        let configNetworkPath = cwd + '/' + configJs;
        var configNetworkJson = JSON.parse(fs.readFileSync(configNetworkPath));
    }
    catch (e) {
        console.log('默认配置文件未找到或格式错误');
        process.exit();
    }

    gulp.task('default', ['network']);
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
    return sprite();
});

async function sprite() {
    for (let imagesNeedSprite in configSpritesJson) {
        let image_path_prefix = configSpritesJson[imagesNeedSprite].image_path_prefix || '';

        //精灵图生成命令
        let spriteData = await gulp.src(configSpritesJson[imagesNeedSprite].input).pipe(spritesmith({
            imgName: configSpritesJson[imagesNeedSprite].image_name,
            cssName: configSpritesJson[imagesNeedSprite].css_name,
            imgPath: image_path_prefix + configSpritesJson[imagesNeedSprite].image_name,
            //设置css前缀
            cssVarMap: function (sprite) {
                sprite.name = imagesNeedSprite + '_' + sprite.name;
            },
            //css定制模板
            cssTemplate: __dirname + '/css_template/sprite'
        }));

        let imageStream = await spriteData.img.pipe(buffer());
        await imageStream.pipe(gulp.dest(configSpritesJson[imagesNeedSprite].output_image));

        //生成对应的css
        await spriteData.css.pipe(gulp.dest(configSpritesJson[imagesNeedSprite].output_css));
    }
}

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
    let builder = new webdriver.Builder();
    let prefs = new webdriver.logging.Preferences();

    let options = new chrome.Options();
    prefs.setLevel(webdriver.logging.Type.BROWSER, webdriver.logging.Level.ALL);
    options.setLoggingPrefs(prefs);
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');

    let driver = builder
        .forBrowser(webdriver.Browser.CHROME)
        .setChromeOptions(options)
        .build();

    return driverConsole(driver);
});

//network处理
gulp.task('network', function () {
    let builder = new webdriver.Builder();
    let prefs = new webdriver.logging.Preferences();

    let options = new chrome.Options();
    prefs.setLevel(webdriver.logging.Type.PERFORMANCE, webdriver.logging.Level.ALL);
    options.setLoggingPrefs(prefs);
    options.addArguments('--headless');
    options.addArguments('--disable-gpu');

    let driver = builder
        .forBrowser(webdriver.Browser.CHROME)
        .setChromeOptions(options)
        .build();

    return driverNetwork(driver);
});

async function driverConsole(driver) {
    for (let websiteNeedConsole in configConsoleJson) {
        for (let index = 0; index < configConsoleJson[websiteNeedConsole].length; index++) {
            let url = configConsoleJson[websiteNeedConsole][index];
            await driver
                .get(url)
                .then(() => driver.manage().logs().get(webdriver.logging.Type.BROWSER))
                .then((logs) => {
                    for (let entry in logs) {
                        console.log('[' + dateTime() + '] '
                            + websiteNeedConsole
                            + '[' + url
                            + '].' + logs[entry].level.name_
                            + ': ' + logs[entry].message
                        );
                    }
                });
        }
    }

    await driver.quit();
}

async function driverNetwork(driver) {
    for (let websiteNeedNetwork in configNetworkJson) {
        for (let index = 0; index < configNetworkJson[websiteNeedNetwork].length; index++) {
            let url = configNetworkJson[websiteNeedNetwork][index];

            await driver
                .get(url)
                .then(() => driver.manage().logs().get(webdriver.logging.Type.PERFORMANCE))
                .then((logs) => {
                    let requestArr = {};
                    for (let entry in logs) {
                        let message = JSON.parse(logs[entry].message).message;
                        if (message.params.requestId !== undefined) {
                            if (requestArr[message.params.requestId] === undefined) {
                                requestArr[message.params.requestId] = [];
                            }
                            requestArr[message.params.requestId].push(message);
                        }
                        else {
                            if (requestArr[message.params.frameId] === undefined) {
                                requestArr[message.params.frameId] = [];
                            }
                            requestArr[message.params.frameId].push(message);
                        }
                    }

                    for (let key in requestArr) {
                        let url = '';
                        let status = '';
                        let type = '';
                        let size = '0B';
                        let startTimestamp = 0;
                        let endTimestamp = 0;

                        for (let i = 0; i < requestArr[key].length; i++) {
                            if (requestArr[key][i].method == 'Network.requestWillBeSent') {
                                startTimestamp = requestArr[key][i].params.timestamp;
                            }
                            if (requestArr[key][i].method == 'Network.responseReceived') {
                                url = requestArr[key][i].params.response.url;
                                status = requestArr[key][i].params.response.status;
                                type = requestArr[key][i].params.type.toLowerCase();
                            }
                            if (requestArr[key][i].method == 'Network.responseReceived') {
                                url = requestArr[key][i].params.response.url;
                                status = requestArr[key][i].params.response.status;
                                type = requestArr[key][i].params.type.toLowerCase();
                            }
                            if (requestArr[key][i].method == 'Network.loadingFinished') {
                                endTimestamp = requestArr[key][i].params.timestamp;
                                size = convertSize(requestArr[key][i].params.encodedDataLength);
                            }
                        }

                        if (url != '') {
                            console.log(endTimestamp - startTimestamp);
                            let time = convertTime(endTimestamp - startTimestamp);
                            console.log(url + '|' + status + '|' + type + '|' + size + '|' + time);
                        }
                    }
                });
        }
    }

    await driver.quit();
}


function convertSize(limit) {
    let size = "";
    if (limit < 1024) {
        size = limit.toFixed(1) + "B";
    } else if (limit < 1024 * 1024) {
        size = (limit / 1024).toFixed(1) + "KB";
    } else if (limit < 1024 * 1024 * 1024) {
        size = (limit / (1024 * 1024)).toFixed(1) + "MB";
    } else {
        size = (limit / (1024 * 1024 * 1024)).toFixed(1) + "GB";
    }

    let len = size.indexOf("\.");
    let dec = size.substr(len + 1, 1);
    if (dec == "0") {
        return size.substring(0, len) + size.substr(len + 2, 2);
    }
    return size;
}

function convertTime(time) {
    let tempTime = time.toFixed(2) + 's';

    if (time < 1) {
        return tempTime = (time * 1000).toFixed(0) + 'ms';
    }

    let len = tempTime.indexOf("\.");
    let dec = tempTime.substr(len + 1, 2);
    if (dec == "00") {
        return tempTime.substring(0, len) + 's';
    }

    return tempTime;
}
