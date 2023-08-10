const fs = require('fs');
const path = require('path');
const { readFileSync, writeFileSync } = fs;
//
const APPSettings = {
  store: {
    appid: 'wxa54813b8f36c27de',
    templateIds : {
      PDP_CART: ['5e25y3q_YybtmdA5YcZBOIgGQtsO7xohqGzQQISMzJY', 'CDWTXMBm8abEreyUM_fqZVS6ICIOsR_5WydSeZL8Iyk'],
      // PDP_NOTICE: ['02KH3k_dCokV1Ix8ep5jnQKQgLrUfxlfNLQ_YCvZFHQ'],
      // PDP_NOTICE: ['02KH3k_dCokV1Ix8ep5jnY7BDFTlMe8-iwuF8p87Ahg'],
      PDP_NOTICE: ['02KH3k_dCokV1Ix8ep5jnWP-DU-xeVreq-X-2UzSt6k'],
      CHECKOUT_NOTICE: ['mHHoyS9g-1PKbjmf-dd_D79eDDwPLbS_EFBZax5OW2s']
    }
  },
  stage: {
    appid: 'wx2431275480358c4b',
    templateIds : {
      PDP_CART: ['VVZOq90aYRJeh59AYrXGGy7e6ZtGsPv6LXlYLXt4QV0', 'E8EZMmr_A7OnHHlRh-aNhDKhehY0iVGfNdquoMec33s'],
      PDP_NOTICE: ['KiF6ln5S7Ouy0L7Hj6G7b5iVHn_uM6qJt-6fdzbw44Q'],
      CHECKOUT_NOTICE: ['VBJIcx6aZTWL5l8MDgQ3BbZZ-IKRRDDZ_wF-A4nSiYk']
    }
  }
}

const APP_NAME = process.env.APP_NAME;
const APP_CONFIG = APPSettings[APP_NAME];
if (APP_CONFIG) {
  const fileOptions = { encoding: 'utf-8' };
  const projectConfigPath = path.join(__dirname, '../project.config.json');
  const templateIdsConfigPath = path.join(__dirname, './templateIds.json');
  const projectConfigContent = readFileSync(projectConfigPath, fileOptions);
  if (!projectConfigContent) return console.warn('项目配置文件内容为空'), false;
  let projectConfig = JSON.parse(projectConfigContent);
  projectConfig.appid = APP_CONFIG.appid;
  writeFileSync(projectConfigPath, JSON.stringify(projectConfig, null, 2), fileOptions);
  //
  const templateIdsConfigContent = readFileSync(templateIdsConfigPath, fileOptions);
  if (!templateIdsConfigContent) return console.warn('消息模板ID配置文件内容为空'), false;
  let templateIdsConfig = JSON.parse(templateIdsConfigContent);
  templateIdsConfig = APP_CONFIG.templateIds;
  writeFileSync(templateIdsConfigPath, JSON.stringify(templateIdsConfig, null, 2), fileOptions);
  //
  console.log('配置初始化完成……');
} else {
  console.warn('找不到指定`APP_NAME`的配置或`APP_NAME`错误');
}
