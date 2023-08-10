import Vue from 'vue';
import Taro from '@tarojs/taro';
import store from './store';
import types from './store/types';
import Monitor from '@/utils/monitor.js';
import { doSilentLogin, runCallback, loadCMSConfig, getLoginText, getOnToken, ajax } from '@/utils';
import FormDataHandler from '@/utils/from-Handler.js';
import './app.scss'

const isWXMP = Taro.getEnv() === 'WEAPP';
const isProd = Taro.getAccountInfoSync().miniProgram.appId === 'wxa54813b8f36c27de';
if (isWXMP && isProd) require('@/utils/mtj-wx-sdk');

// Vue.config.productionTip = false
const App = {
  store,
  onLaunch(options) {
    console.log('@onLaunch::-----》', options);
    const { query, scene } = options
    // 全局缓存 登录状态
    store.commit('setAPPLaunchOption', {
      query,
      scene
    });
    // 有些页面可能存在必须先完成的处理, 以下方式二选一即可: initTasks & onReady | runCallback & addCallback('onReady', fn)
    // 方式一: 优先执行的处理
    // initTasks([
    //   this.initAPP()
    // ]);
    // 方式二: 优先执行的处理
    // Promise.all([
    //   this.initAPP()
    // ]).then(res => {
    //   runCallback('onReady');
    // });
    //
    this.initAPP();
    this.loadRecmd();
    this.initMonitor(options)
  },
  onHide() {
    this.loadCloseAppStatus()
  },
  render(h) {
    // this.$slots.default 是将要会渲染的页面
    return h('block', this.$slots.default)
  },
  methods: {
    initAPP() {
      return new Promise(async (resolve, reject) => {
        let loginPromise = doSilentLogin().catch(err => reject(err));
        // 全局缓存 登录状态
        store.commit('setLoginPromise', loginPromise);
        await loginPromise
        await this.loadConfig().catch(err => {
          console.warn('@initAPP.loadConfig::', err);
        });
        const loginToken = Taro.getStorageSync('lw_loginStatus');
        this.loadCheckOpenApp()
        Taro.onAppShow(() => {
          this.loadCheckOpenApp()
        })
        loginToken && store.dispatch(types.USER_COLLECTION_PIDS);
        resolve({ code: 200 });
        this.loadFormConfig()
        getLoginText()
      });
    },
    /**
     * 加载项目配置 - 推荐配置
     * @returns
     */
    loadRecmd() {
      return new Promise((resolve, reject) => {
        loadCMSConfig('recmd').then(res => {
          if (Array.isArray(res) && res.length) {
            store.commit('setRecommend', res);
            resolve(res);
          } else {
            reject(res);
          }
        }).catch(err => {
          // console.warn('@loadRecmd::', err);
          reject(err);
        });
      });
    },

    /**
     * 加载项目配置 - 开屏组件
     * @returns
     */
    loadConfig() {
      return new Promise((resolve, reject) => {
        loadCMSConfig('splash').then(res => {
          if (res && (res.enable || res.enable === undefined) && ['SingleImage', 'SingleVideo'].includes(res.component_type)) {
            if (typeof res?.page_type === 'string') {
              try {
                res.page_type = JSON.parse(res.page_type);
              } catch (err) {
                console.warn('@loadConfig.ParseError::', err);
              }
            }
            store.commit('setSplash', res);
            resolve(res);
          } else {
            reject(res);
          }
        }).catch(err => {
          console.warn('@loadConfig::', err);
          reject(err);
        });
      });
    },
    /**
     * 加载-初始化监控
     * 
     * 
     */
    initMonitor(options) {
      Monitor.hookApp(options)
    },
    /**
     * 加载-检查打开应用状态
     */
    loadCheckOpenApp() {
      this.$store.dispatch("checkOpenAppStatus")
    },
    /**
     * 加载-关闭应用状态
     */
    loadCloseAppStatus() {
      this.$store.dispatch("updateHideAppTime")
    },
    /**
     * 加载字体
     */
    loadFonts() {
      Taro.loadFontFace({ global: true, family: 'On Diatype Standard', source: 'https://oss.on-running.cn/common/font/OnDiatypeStd-Regular.otf' });
    },
    /**
     *  加载表单数据
     */
    loadFormConfig() {
      // 加载地区数据
      // FormDataHandler.loadRegionsConfig()
      // 加载鞋码数据
      // FormDataHandler.getShoneSize()
      // 加载赛区数据
      // FormDataHandler.getTeamRegions()
    }
  }
}

export default App
