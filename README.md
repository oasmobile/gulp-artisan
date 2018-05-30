# Gulp for oasis

安装node 请使用最新稳定版本  
https://nodejs.org  
设置npm私有源  
npm set registry https://private-npm.oasgames.com  
安装gulp  
npm install --global gulp  
安装gulp-oasis  
npm install --global gulp-oasis

# 命令介绍  
主命令 gulp-oasis  
参数 --run compress 图片压缩  
参数 --run atlas 生成精灵图  
参数 --run minify_css CSS合并压缩  
参数 --run minify_js JS合并压缩混淆  
参数 --config xxxx.json 指定读取的配置文件  
参数 --cwd 指定要读取配置的项目目录 不指定默认当前目录

### 如果不指定--config xxxx.json 你需要建立默认配置文件
<pre>
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
</pre>
