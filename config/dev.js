const path = require('path');
const fs = require('fs');
const { readFileSync } = fs;
let fileContent = readFileSync(path.join(__dirname, './templateIds.json'), { encoding: 'utf-8' });
if (fileContent) fileContent = JSON.parse(fileContent);

module.exports = {
  env: {
    NODE_ENV: '"dev"'
  },
  defineConstants: {
    $appid: JSON.stringify('wx2431275480358c4b'),
    //-----tracking -------
    $srId: JSON.stringify('bid4d69c99b9b348b4'),
    $shushuId:JSON.stringify('debug-appid'), //shushuId 用于区分不同的小程序
    $shushuURL:JSON.stringify('https://thinkdata.on-running.cn'),
    //-----tracking -------
    // OnRunning Frontend API 域名
    $ON_API_HOST: JSON.stringify('https://stage-crm.on-running.cn'),
    $LOCAL_NEST:JSON.stringify('http://localhost:3001'),
    $ON_JOB_API_HOST: JSON.stringify('https://boards-api.greenhouse.io'),
    // LianWei Frontend API 域名
    $API_HOST: JSON.stringify('https://stage-marketing-api.on-running.cn'),
    // $API_HOST: JSON.stringify('https://dev-marketing-api.on-running.cn'),
    // 测试静态资源
    $ASSETS_HOST: JSON.stringify('https://preprod-on-assets.on-running.cn'),
    // 上传静态资源
    $UP_ASSETS_HOST: JSON.stringify('https://stage-wechat-mp-gateway.on-running.cn'),
    // OSS 根目录
    $OSS_HOST: JSON.stringify('https://on-running.oss-cn-shanghai.aliyuncs.com'),
    $OSS_CDN_HOST: JSON.stringify('https://oss.on-running.cn'),
    // OSS 静态资源目录
    $OSS_HOST_STATIC: JSON.stringify('https://on-running.oss-cn-shanghai.aliyuncs.com/wechat_mp_static_stage'),
    $OSS_CDN_HOST_STATIC: JSON.stringify('https://oss.on-running.cn/wechat_mp_static_stage'),
    // SQUAD_RANCE 静态资源
    $OSS_RACE_STATIC: JSON.stringify('https://cdn-squad-race.on-running.cn/static'),
    // moduleClub 的环境变量
    $MODULE_CLUB_API_HOST: JSON.stringify("https://dev-mini-api-service-club.on-running.cn"),
    $MODULE_CYCLON_API_HOST: JSON.stringify("https://dev-mini-api-service-cyclon.on-running.cn"),
    //
    $TEMPLATE_IDS: JSON.stringify(fileContent),
    
  },
  mini: {},
  runtimeCompiler:true,
  h5: {}
}
