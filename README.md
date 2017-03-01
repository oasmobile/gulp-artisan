# Gulp for oasis

# 第一步
安装node 建议使用稳定版本  
https://nodejs.org  
安装gulp  
sudo npm install --global gulp-cli

# 第二步
通过composer安装gulp-oasis  
composer --global require "gulp-oasis"

命令介绍  
主命令 gulp-oasis  
参数 --run compress 图片压缩  
参数 --run atlas 生成精灵图  
参数 --config xxxx.json 指定读取的配置文件 参数可选 默认配置文件 compress的为compress_images.json atlas的为atlas_sprites.json  
参数 --cwd 指定要读取配置的项目目录


## 配置文件范例compress_images.json
<pre>
{
    "images1": {
        "input" : "images1/*",
        "output": "dist/images1"
    },
    "images2": {
        "input" : "images2/*",
        "output": "dist/images2"
    }
}
</pre>
## 配置文件范例atlas_sprites.json
<pre>
{
    "buttons1": {
        "input"     : "buttons1/*",
        "output"    : "dist/buttons1",
        "image_name": "atlas_buttons1.png",
        "css_name"  : "atlas_buttons1.css"
    },
    "buttons2": {
        "input"     : "buttons2/*",
        "output"    : "dist/buttons2",
        "image_name": "atlas_buttons2.png",
        "css_name"  : "atlas_buttons2.css"
    }
}
</pre>
