轻应用：#在线云频道#
===

- 复制于：[#微信话题墙#](https://github.com/fritx/wxtopic)
- 在线演示：<http://channel.fritx.me>
- 相关博文：[跟我一起来升级#在线云频道#（1）](http://fritx.github.io/blog/?2015/05/channel-dev-together-01/)

<img width="200" src="pic/截图 2015-05-03 20.02.19.png">
&nbsp;&nbsp;
<img width="200" src="pic/截图 2015-05-03 20.02.38.png">
&nbsp;&nbsp;
<img width="200" src="pic/截图 2015-05-03 20.02.48.png">

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

1. 安装nodejs
2. 从npm安装gulp, bower
3. 下载项目，或直接从git克隆
4. 进入目录，安装npm, bower依赖
5. 复制一份config，按需修改
6. 执行gulp构建
7. 运行实例

```
$ npm install -g gulp
$ npm install -g bower
$ git clone git@github.com:fritx/channel.git
$ cd channel
$ npm install
$ bower install
$ cp -r config-default config
$ gulp build
$ node .
```
