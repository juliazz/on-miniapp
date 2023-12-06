const path = require('path');
const fs = require('fs');
const { readFileSync } = fs;
let fileContent = readFileSync(path.join(__dirname, './templateIds.json'), { encoding: 'utf-8' });
if (fileContent) fileContent = JSON.parse(fileContent);

module.exports = {
  env: {
    NODE_ENV: '"production"',
  },
  defineConstants: {
    $appid: JSON.stringify('wxa54813b8f36c27de'),
    $srId: JSON.stringify('biabf3f6dd165c4d51'),
    $shushuId:JSON.stringify('debug-appid'),
    $shushuURL:JSON.stringify('https://thinkdata.on-running.cn'),
    /************************/
    /* 以下为 `生产` 环境配置 */
    /************************/
    // --------------------------- OnRunning Frontend API 域名 ----------------------------------------------
    $ON_API_HOST: JSON.stringify('https://crm.on-running.cn'),
    $ON_JOB_API_HOST: JSON.stringify('https://boards-api.greenhouse.io'),
    // SQUAD_RANCE 静态资源
    $OSS_RACE_STATIC: JSON.stringify(
      "https://cdn-squad-race.on-running.cn/static"
    ),
    // 上传静态资源
    $UP_ASSETS_HOST: JSON.stringify('https://wechat-mp-gateway.on-running.cn'),
    // ---------------------------LianWei Frontend API 域名-----------------------------------------------
    $API_HOST: JSON.stringify('https://prod-on-lumen-api.on-running.cn'),
    // // 测试静态资源
    $ASSETS_HOST: JSON.stringify('https://preprod-on-assets.on-running.cn'),
    // // OSS 根目录
    $OSS_HOST: JSON.stringify('https://on-running.oss-cn-shanghai.aliyuncs.com'),
    $OSS_CDN_HOST: JSON.stringify('https://oss.on-running.cn'),
    // // OSS 静态资源目录
    $OSS_HOST_STATIC: JSON.stringify('https://on-running.oss-cn-shanghai.aliyuncs.com/wechat_mp_static_stage'),
    $OSS_CDN_HOST_STATIC: JSON.stringify('https://oss.on-running.cn/wechat_mp_static_stage'),


    // ---------------------------juiceTec Frontend API 域名-----------------------------------------------
    // moduleClub 的环境变量
    $MODULE_CLUB_API_HOST: JSON.stringify("https://mini-api-service-club.on-running.cn"),
    $MODULE_CYCLON_API_HOST: JSON.stringify("https://mini-api-service-cyclon.on-running.cn"),
    $TEMPLATE_IDS: JSON.stringify(fileContent)

  },
  mini: {},
  h5: {
    /**
     * WebpackChain 插件配置
     * @docs https://github.com/neutrinojs/webpack-chain
     */
    // webpackChain (chain) {
    //   /**
    //    * 如果 h5 端编译后体积过大，可以使用 webpack-bundle-analyzer 插件对打包体积进行分析。
    //    * @docs https://github.com/webpack-contrib/webpack-bundle-analyzer
    //    */
    //   chain.plugin('analyzer')
    //     .use(require('webpack-bundle-analyzer').BundleAnalyzerPlugin, [])
    //   /**
    //    * 如果 h5 端首屏加载时间过长，可以使用 prerender-spa-plugin 插件预加载首页。
    //    * @docs https://github.com/chrisvfritz/prerender-spa-plugin
    //    */
    //   const path = require('path')
    //   const Prerender = require('prerender-spa-plugin')
    //   const staticDir = path.join(__dirname, '..', 'dist')
    //   chain
    //     .plugin('prerender')
    //     .use(new Prerender({
    //       staticDir,
    //       routes: [ '/pages/index/index' ],
    //       postProcess: (context) => ({ ...context, outputPath: path.join(staticDir, 'index.html') })
    //     }))
    // }
  },
};
