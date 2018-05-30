# gulp artisan
## Install
```
//install node 
https://nodejs.org  
//install gulp  
npm install --global gulp  
//install gulp artisan
npm install --global gulp-artisan
```
## Command  
```
gulp-oasis  
--run compress //compress images
--run atlas //generate atlas
--run minify_css //minify css
--run minify_js //minify js
--config xxxx.json //specify json
--cwd //change directory
```
### Default configuration
```
compress默认配置文件范例compress_images.json
路径中**可以递归目录 !可以忽略文件
enable是否开启压缩 可以只拷贝不压缩
gifsicle配置参考https://www.npmjs.com/package/imagemin-gifsicle
mozjpeg配置参考https://www.npmjs.com/package/imagemin-mozjpeg
pngquant配置参考https://www.npmjs.com/package/imagemin-pngquant
svgo配置参考https://www.npmjs.com/package/imagemin-svgo
{
    "images1": {
        "input" : "images2/*",
        "output": "dist/images2"
    }
}
{
    "images1": {
        "input"   : "images2/*",
        "output"  : "dist/images2",
        "enabled" : false,
        "gifsicle": {
            "interlaced": true
        },
        "mozjpeg" : {
            "quality": 90
        },
        "pngquant": {
            "quality": "60-80"
        },
        "svgo"    : {
            "plugins": [
                {
                    "removeViewBox": false
                }
            ]
        }
    }
}
atlas默认配置文件范例atlas_sprites.json
image_path_prefix代表生成的css中图片路径的前缀
{
    "buttons1": {
        "input"       : "buttons1/*",
        "output_image": "src/image",
        "output_css"  : "src/css",
        "image_name"  : "atlas_buttons1.png",
        "css_name"    : "atlas_buttons1.css"
    },
    "buttons2": {
        "input"            : "buttons1/*",
        "output_image"     : "src/image",
        "output_css"       : "src/css",
        "image_name"       : "atlas_buttons1.png",
        "css_name"         : "atlas_buttons1.css"
        "image_path_prefix": "../buttons1/"
    }
}
minify_css默认配置文件范例minify_css.json
{
    "css1": {
        "input" : "css1/*",
        "output": "css1-minify"
    },
    "css2": {
        "input" : "css2/*",
        "output": "css2-minify",
        "concat": "css2.min.css"
    },
    "css3": {
        "input" : ["css3/a.css","css3/b.css"],
        "output": "css3-minify",
        "concat": "css3.min.css"
    }
}
minify_js默认配置文件范例minify_js.json
{
    "js1": {
        "input" : "js1/*",
        "output": "js1-minify"
    },
    "js2": {
        "input" : "js2/*",
        "output": "js2-minify",
        "concat": "js2.min.js"
    },
    "js3": {
        "input" : ["js3/a.js","js3/b.js"],
        "output": "js3-minify",
        "concat": "js3.min.js"
    }
}
```
## License

[MIT License](https://en.wikipedia.org/wiki/MIT_License)
