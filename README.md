# Gulp for oasis

安装node 建议使用稳定版本  
https://nodejs.org  
设置npm私有源  
npm set registry https://private-npm.oasgames.com  
安装gulp  
sudo npm install --global gulp  
安装gulp-oasis  
sudo npm install --global gulp-oasis

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
atlas默认配置文件范例atlas_sprites.json
copy代表再拷贝一张图片到指定目录
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
        "css_name"  : "atlas_buttons2.css",
        "copy"      : "../public/css"
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
