# 电商小程序

本仓库的代码仅包含小程序中电商部分。
项目基于 [Taro(v3.4.8) 多端框架](https://github.com/NervJS/taro) 搭建，技术栈主要包含： Vue + Vuex + SCSS，开发语言使用JavaScript。

---

## 环境切换
 stage 
 appid wx2431275480358c4b
 OnRunning Frontend API 域名
 https://stage-crm.on-running.cn


 生产 
 appid wxa54813b8f36c27de
 OnRunning Frontend API 域名
 https://crm.on-running.cn
 

 dev（弃用) 
 appid wxc6b14c1a961676cf
 切环境时 检查域名 appid

## 如何开发


- 开发环境：确保本地安装了 *Node.js* 且版本是 `v14.16.0` 或以上。
- 拉取源码：从 [仓库](https://github.com/onrunning/taro-china-channel.git) 将代码克隆到本地工作目录中。
- 安装依赖：在项目根目录运行 `npm i` 命令安装。
- 运行项目：在项目根目录运行 `npm run dev:weapp` 命令运行（编译出微信小程序源码）。
- 上传项目：在项目根目录运行 `npm run build-prod` 命令运行（编译出微信小程序压缩源码）。
---

## 项目进度

> 项目进度详细可在 [此处](https://onrunning.atlassian.net/wiki/spaces/COC/pages/1893138856) 追踪。
## 表单验证 
https://gitcode.net/mirrors/yiminghe/async-validator?utm_source=csdn_github_accelerator
---
## 文件结构
├── client                                  小程序端目录
│   ├── config                              配置目录
│   │   ├── dev.js                          开发时配置
│   │   ├── index.js                        默认配置
│   │   └── prod.js                         打包时配置
│   ├── dist                                编译结果目录
│   ├── package.json
│   ├── src                                 源码目录
│   │   ├── app.scss                        项目总通用样式
│   │   ├── app.js                          项目入口文件
│   │   ├── components                      组件文件目录
│   │   │   └── login                       login 组件目录
│   │   │       └── index.weapp.js          login 组件逻辑
│       └── pages                           页面文件目录
│       │   └── index                       index 页面目录
│       │       ├── index.scss              index 页面逻辑
│       │       └── index.js                index 页面样式
|       │ 
|       │
│       │      
│       └── subpages                       业务分包
│       │   └── index                       index 页面目录
│       │       ├── index.scss              index 页面逻辑
│       │       └── index.js                index 页面样式
│       │      
│       └── onRunClubPackage               活动分包
│          └── index                       index 页面目录
│              ├── index.scss              index 页面逻辑
│              └── index.js                index 页面样式
│
│
|
├── cloud                                   服务端目录
│   └── functions                           云函数目录
│       └── login                           login 云函数
│           ├── index.js                    login 函数逻辑
│           └── package.json
└── project.config.json                     小程序项目配置
