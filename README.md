# 轻应用：在线云频道

复制于 [微信话题墙](https://github.com/fritx/wxtopic)

Demo: <http://channel.fritx.me>

<img width="300" src="pic/截图 2015-02-05 00.07.48.png">
&nbsp;&nbsp;
<img width="300" src="pic/截图 2015-02-04 23.58.16.png">

## 项目亮点

1. 微信轻应用
2. 无ui框架依赖，无数据库依赖，json轻存储
3. 可作轻量级原型参考，极速开发
4. 包含微信jssdk开发，微信认证接口
5. 支持图片/音频文件上传

## 技术采用

1. 前端主要基于jqeury2, lodash, 微信jssdk
2. 后端主要基于express4, lowdb, request
3. 后端配合前端使用handlebars模板渲染页面

## 搭建指南

1. 安装nodejs，安装mongodb并运行
2. 从npm安装gulp, bower
3. 下载项目，或直接从git克隆
4. 进入目录，安装npm, bower依赖
5. 执行gulp构建
6. 运行实例

```
$ npm install -g gulp
$ npm install -g bower
$ git clone git@github.com:fritx/channel.git
$ cd channel
$ npm install
$ bower install
$ gulp build
$ node .
```
