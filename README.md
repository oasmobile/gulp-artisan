# Gulp for oasis

# 第一步
安装node 建议使用稳定版本  
https://nodejs.org  
安装gulp  
sudo npm install --global gulp

# 第二步
通过composer安装gulp-oasis  
composer global require "oasis/gulp-oasis"  
请确定你已将 ~/.composer/vendor/bin 路径加到PATH 只有这样系统才能找到gulp-oasis的执行文件  
~/.bash_profile  
export PATH="$PATH:~/.composer/vendor/bin"

# 命令介绍  
主命令 gulp-oasis  
参数 --run compress 图片压缩  
参数 --run atlas 生成精灵图  
参数 --config xxxx.json 指定读取的配置文件  
参数 --cwd 指定要读取配置的项目目录 不指定默认当前目录

### 如果不指定--config xxxx.json 你需要建立默认配置文件
#### compress默认配置文件范例compress_images.json
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
#### atlas默认配置文件范例atlas_sprites.json
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
