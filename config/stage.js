const path = require('path');
const fs = require('fs');
const { readFileSync } = fs;
let fileContent = readFileSync(path.join(__dirname, './templateIds.json'), { encoding: 'utf-8' });
if (fileContent) fileContent = JSON.parse(fileContent);

module.exports = {
  env: {
    NODE_ENV: '"stage"'
  },
  defineConstants: {
    $appid: JSON.stringify('wx926eadc0f6fb1fbb'),
    $srId: JSON.stringify('bid4d69c99b9b348b4'),
    // OnRunning Frontend API 域名
    $ON_API_HOST: JSON.stringify('https://stage-crm.on-running.cn'),
    // OnRunning Frontend JOB API 域名
    $ON_JOB_API_HOST: JSON.stringify('https://boards-api.greenhouse.io'),
    // LianWei Frontend API 域名
    $API_HOST: JSON.stringify('https://stage-marketing-api.on-running.cn'),
    // 测试静态资源
    $ASSETS_HOST: JSON.stringify('https://preprod-on-assets.on-running.cn'),
    // OSS 根目录
    $OSS_HOST: JSON.stringify('https://on-running.oss-cn-shanghai.aliyuncs.com'),
    $OSS_CDN_HOST: JSON.stringify('https://oss.on-running.cn'),
    // OSS 静态资源目录
    $OSS_HOST_STATIC: JSON.stringify('https://on-running.oss-cn-shanghai.aliyuncs.com/wechat_mp_static_stage'),
    $OSS_CDN_HOST_STATIC: JSON.stringify('https://oss.on-running.cn/wechat_mp_static_stage'),

    // moduleClub 的环境变量
    $MODULE_CLUB_API_HOST: JSON.stringify("https://dev-mini-api-service-club.on-running.cn"),
      // moduleCyclon 的环境变量
      $MODULE_CYCLON_API_HOST: JSON.stringify("https://dev-mini-api-service-cyclon.on-running.cn"),
    //
    $MODULE_CYCLON_API_HOST: JSON.stringify("https://dev-mini-api-service-cyclon.on-running.cn"),
    $TEMPLATE_IDS: JSON.stringify(fileContent),
    // SQUAD_RANCE 静态资源
    $OSS_RACE_STATIC: JSON.stringify('https://cdn-squad-race.on-running.cn/static'),

  },
  mini: {},
  runtimeCompiler:true,
  h5: {}
}
