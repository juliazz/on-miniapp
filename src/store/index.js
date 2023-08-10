import Vue from "vue";
import Vuex from "vuex";
import Taro from '@tarojs/taro'
import {
  USER_COLLECTION_PIDS,
  USER_COLLECTION_CANCEL,
  USER_COLLECTION_ADD,
  UPDATE_CLOSE_APP,
  UPDATE_OPEN_APP,
  USER_CENTER,
} from "./types";
import {
  RES_SUCCESS_CODE,
  ajax,
  errorHandler,
  deepClone,
  isPromise,
  getOnToken,
  fixCMSPath,
  loadCMSConfig,
} from "@/utils";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    /**
     * `Header` & `Tabbar` & `Sidebar` 显示状态
     */
    visible4HTS: true,
    /**
     * `Header` 高度
     */
    headerHeight: {},
    /**
     * `Header` 是否浮动
     */
    headerForceFloat: false,
    /**
     * `Tabbar` 高度
     */
    tabbarHeight: {},
    /**
     * 当前用户收藏的商品ID列表
     */
    favPids: [],
    /**
     * 开屏组件配置数据
     */
    splash: null,
    /**
     * CMS 媒体资源信息
     * - images: Object - 图片资源信息
     * - - count: Number - 图片总数量
     * - - success: Number - 加载成功的数量
     * - - failure: Number - 加载失败的数量
     * - - items: Array<Object> - 图片信息数组
     * - - - src: String - 图片路径
     * - videos: Object - 视频资源信息
     * - - count: Number - 图片总数量
     * - - success: Number - 加载成功的数量
     * - - failure: Number - 加载失败的数量
     * - - items: Array<Object> - 图片信息数组
     * - - - src: String - 图片路径
     */
    cmsResources: {
      images: { count: 0, success: 0, failure: 0, items: [] },
      videos: { count: 0, success: 0, failure: 0, items: [] },
    },
    /**
     * 推荐数据
     */
    recommend: [],
    /**
     * 产品分类树状数据
     */
    categoryTree: [],
    /**
     * 门店数据缓存
     */
    stores: [],
    /**
     * 用户信息
     */
    userInfo: null,
    /**
     * 海报数据
     */
    posterPromise: {},
    reqHeader: {},
    // 通知广播
    announcement: {},
    indexAnnounceStatus: true,
    cartAnnounceStatus: true,
    checkoutAnnounceStatus: true,
    jobApply:{
      shareCardImg:fixCMSPath('http://job-resume.oss-cn-shanghai.aliyuncs.com/staic/jobShareCard.jpg'),
      shareCircleImg:fixCMSPath('http://job-resume.oss-cn-shanghai.aliyuncs.com/staic/jobShareCircle.jpg')
    },
    templateId: {
      production: {
        appid: "wxa54813b8f36c27de",
        ailiTrackID: "cd8p1ois10@740821ae7bb3e2a",
        templateIds: {
          PDP_CART: [
            "5e25y3q_YybtmdA5YcZBOIgGQtsO7xohqGzQQISMzJY",
            "CDWTXMBm8abEreyUM_fqZVS6ICIOsR_5WydSeZL8Iyk",
          ],
          PDP_NOTICE: ["02KH3k_dCokV1Ix8ep5jnWP-DU-xeVreq-X-2UzSt6k"],
          CHECKOUT_NOTICE: ["mHHoyS9g-1PKbjmf-dd_D79eDDwPLbS_EFBZax5OW2s"],
          SQUAD_RACE: [
            "FEXgEwKwUsZvWCzOSx1oad1vBCwRLFBU94rE3zZZNLI",
            "GJ4jwOmRZRaEwLfjVqdq5Cw9CLGILroX7ICBXcaUp3E",
          ],
        },
      },
      prod: {
        appid: "wxa54813b8f36c27de",
        ailiTrackID: "cd8p1ois10@740821ae7bb3e2a",
        templateIds: {
          PDP_CART: [
            "5e25y3q_YybtmdA5YcZBOIgGQtsO7xohqGzQQISMzJY",
            "CDWTXMBm8abEreyUM_fqZVS6ICIOsR_5WydSeZL8Iyk",
          ],
          PDP_NOTICE: ["02KH3k_dCokV1Ix8ep5jnWP-DU-xeVreq-X-2UzSt6k"],
          CHECKOUT_NOTICE: ["mHHoyS9g-1PKbjmf-dd_D79eDDwPLbS_EFBZax5OW2s"],
          SHOP_ORDER: [
            "FEXgEwKwUsZvWCzOSx1oad1vBCwRLFBU94rE3zZZNLI",
            "GJ4jwOmRZRaEwLfjVqdq5Cw9CLGILroX7ICBXcaUp3E",
          ],
        },
      },
      stage: {
        appid: "wx2431275480358c4b",
        ailiTrackID: "cd8p1ois10@1ab8ca6721d6f7f",
        templateIds: {
          PDP_CART: [
            "VVZOq90aYRJeh59AYrXGGy7e6ZtGsPv6LXlYLXt4QV0",
            "E8EZMmr_A7OnHHlRh-aNhDKhehY0iVGfNdquoMec33s",
          ],
          PDP_NOTICE: ["KiF6ln5S7Ouy0L7Hj6G7b5iVHn_uM6qJt-6fdzbw44Q"],
          CHECKOUT_NOTICE: ["VBJIcx6aZTWL5l8MDgQ3BbZZ-IKRRDDZ_wF-A4nSiYk"],
        },
      },
      development: {
        appid: "wx2431275480358c4b",
        templateIds: {
          PDP_CART: [
            "VVZOq90aYRJeh59AYrXGGy7e6ZtGsPv6LXlYLXt4QV0",
            "E8EZMmr_A7OnHHlRh-aNhDKhehY0iVGfNdquoMec33s",
          ],
          PDP_NOTICE: ["KiF6ln5S7Ouy0L7Hj6G7b5iVHn_uM6qJt-6fdzbw44Q"],
          CHECKOUT_NOTICE: ["VBJIcx6aZTWL5l8MDgQ3BbZZ-IKRRDDZ_wF-A4nSiYk"],
        },
      },
      dev: {
        appid: "wx2431275480358c4b",
        ailiTrackID: "cd8p1ois10@1ab8ca6721d6f7f",
        templateIds: {
          PDP_CART: [
            "VVZOq90aYRJeh59AYrXGGy7e6ZtGsPv6LXlYLXt4QV0",
            "E8EZMmr_A7OnHHlRh-aNhDKhehY0iVGfNdquoMec33s",
          ],
          PDP_NOTICE: ["KiF6ln5S7Ouy0L7Hj6G7b5iVHn_uM6qJt-6fdzbw44Q"],
          CHECKOUT_NOTICE: ["VBJIcx6aZTWL5l8MDgQ3BbZZ-IKRRDDZ_wF-A4nSiYk"],
          SQUAD_RACE: [
            "o_QfWwE_zPLCwpwL8GGLdBC_izBHCzTe_8q5MNI_-ko",
            "qLPxFy4vntoGC_kxt5azzcW8u6wpebk7q4Ee7bGqUIs",
          ],
          SHOP_ORDER: [
            "FEXgEwKwUsZvWCzOSx1oad1vBCwRLFBU94rE3zZZNLI",
            "GJ4jwOmRZRaEwLfjVqdq5Cw9CLGILroX7ICBXcaUp3E",
          ],
        },
      },
    },
    prevPage: "",
    loginText: {},
    iocnPosition: {
      x: 320,
      y: 400,
    },
    loading: false,
    // 登录超时弹窗是否全局页面显示
    isLogoutPopShow: false
  },
  getters: {
    innerPadding(state) {
      const { headerHeight, tabbarHeight } = state;
      return { headerHeight, tabbarHeight };
    },
  },
  mutations: {
    /**
     * 缓存Launch信息
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setAPPLaunchOption(state, payload) {
      if (payload) {
        state.APPLaunchOption = payload;
      } else {
        console.warn("@Store.Mutations.setAPPLaunchOption::", payload);
      }
    },
    /**
     * 缓存 'Header', 'Tabbar', 'Sidebar' 显示状态
     * @param {Object} state
     * @param {Boolean} visible
     */
    setVisible4HTS(state, visible) {
      state.visible4HTS = !!visible;
    },
    /**
     * 缓存 'reqHeader'
     * @param {Object} state
     * @param {Boolean} visible
     */
    setReqHeader(state, reqHeader) {
      state.reqHeader = reqHeader;
    },
    /**
     * 缓存 `Header` 高度
     * @param {Object} state
     * @param {Object} payload
     * @returns
     */
    setHeaderHeight(state, payload) {
      if (!payload || !Object.keys(payload).length) return;
      state.headerHeight = { ...payload };
    },
    /**
     * 缓存 `Header` 浮动状态
     */
    setHeaderForceFloat(state, value) {
      state.headerForceFloat = value;
    },
    /**
     * 缓存 `Tabbar` 高度
     * @param {Object} state
     * @param {Object} payload
     * @returns
     */
    setTabbarHeight(state, payload) {
      if (!payload || !Object.keys(payload).length) return;
      state.tabbarHeight = { ...payload };
    },
    /**
     * 缓存开屏组件配置数据
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setSplash(state, payload) {
      if (payload) {
        state.splash = payload;
      } else {
        console.warn("@Store.Mutations.setSplash::", payload);
      }
    },
    /**
     * 记录资源总数量
     * @param {Object} state
     * @param {Object} payload
     */
    setResources(state, payload) {
      const { images, videos } = payload;
      state.cmsResources.images.count = images;
      state.cmsResources.videos.count = videos;
    },
    /**
     * 记录资源加载结果
     * @param {Object} state
     * @param {Object} payload
     * @returns
     */
    addResource(state, payload) {
      const {
        type,
        info: { id, src, width, height, statusCode, statusText },
      } = payload;
      let resourceGroup = state.cmsResources[`${type}s`];
      if (!resourceGroup)
        return (
          console.warn("@Vuex.Mutations.addResource#Error::", payload), false
        );
      resourceGroup = deepClone(resourceGroup);
      resourceGroup.items.push({
        id,
        src,
        width,
        height,
        statusCode,
        statusText,
      });
      if (statusCode === 200) {
        resourceGroup.success += 1;
      } else {
        resourceGroup.failure += 1;
      }
      state.cmsResources[`${type}s`] = resourceGroup;
    },

    /**
     * 缓存推荐数据
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setRecommend(state, payload) {
      if (Array.isArray(payload) && payload.length) {
        state.recommend = payload;
      } else {
        console.warn("@Store.Mutations.setRecommend::", payload);
      }
    },
    // 缓存通知广播
    setAnnouncement(state, payload) {
      if (payload.message) {
        state.announcement = payload;
      } else {
        console.warn("@Store.Mutations.setAnnouncement::", payload);
      }
    },
    /**
     * 缓存产品分类树状数据
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setCategoryTree(state, payload) {
      if (Array.isArray(payload) && payload.length) {
        state.categoryTree = payload;
      } else {
        console.warn("@Store.Mutations.setCategoryTree::", payload);
      }
    },
    /**
     * 缓存当前用户已收藏的 `SPU` 标识符
     * @param {Object} state
     * @param {Array<String>} payload
     */
    [USER_COLLECTION_PIDS](state, payload) {
      const { favPids } = payload;
      state.favPids = favPids;
    },
    /**
     * 缓存门店数据
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setStores(state, payload) {
      if (Array.isArray(payload) && payload.length) {
        state.stores = payload;
      } else {
        console.warn("@Store.Mutations.setStores::", payload);
      }
    },
    /**
     * 缓存Race活动信息
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setRaceInfo(state, payload) {
      if (payload) {
        const { activityInfo } = payload;
        state.raceInfo = activityInfo;
      } else {
        console.warn("@Store.Mutations.setRaceInfo::", payload);
      }
    },
    /**
     * 缓存门店预约商品活动信息
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setShopOrderInfo(state, payload) {
      if (payload) {
        const { productColor, storeList, storeReservation } = payload;
        state.orderProductColor = productColor;
        state.orderStoreList = storeList;
        state.orderStoreReservation = storeReservation;
      } else {
        console.warn("@Store.Mutations.setShopOrderInfo::", payload);
      }
    },
    /**
     * 缓存登录状态
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setLoginPromise(state, payload) {
      if (payload && isPromise(payload)) {
        state.loginPromise = payload;
      } else {
        console.warn("@Store.Mutations.setLoginPromise::", payload);
      }
    },
    /**
     * 缓存获取过的图片信息数据
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setPosterPromise(state, payload) {
      if (payload) {
        const { upc, info } = payload;
        state.posterPromise[upc] = info;
      } else {
        console.warn("@Store.Mutations.setPosterPromise::", payload);
      }
    },
    /**
     * 缓存用户信息
     * @param {Object} state
     * @param {Array<Object>} payload
     */
    setUserInfo(state, payload) {
      if (payload) {
        state.userInfo = payload;
      } else {
        console.warn("@Store.Mutations.setUserInfo::", payload);
      }
    },
    /**
     * 更新 `Loading` 显示状态
     * @param {Object} state
     * @param {Boolean} visible
     */
    setLoadingVisible(state, visible) {
      state.loading = !!visible;
    },
    /**
     * 更新登录超时弹窗显示状态
     * @param {Object} state
     * @param {Boolean} isShow
     */
    setLogoutPopVisile(state, isShow = false) {
      state.isLogoutPopShow = isShow
    }
  },
  actions: {
    /**
     * 获取用户收藏列表
     * @param {Object} context Store实例
     * @param {Object} payload
     * @returns 无
     */
    [USER_COLLECTION_PIDS](context, payload = {}) {
      const { callback } = payload;
      ajax({ url: USER_COLLECTION_PIDS, method: "POST", showLoading: false })
        .then((res) => {
          const { code, data } = res;
          if (code === RES_SUCCESS_CODE) {
            context.commit(USER_COLLECTION_PIDS, { favPids: data.list });
          }
          typeof callback === "function" && callback(res);
        })
        .catch((err) => {
          errorHandler(err, true, "@Actions#USER_COLLECTION_PIDS::");
          typeof callback === "function" && callback(err);
        });
    },
    /**
     * 切换商品收藏状态
     * @param {Object} context Store实例
     * @param {Object} payload
     * @returns 无
     */
    ToggleFavorite(context, payload = {}) {
      const { args, callback } = payload;
      const { spu } = args || {};
      if (!spu) return;
      //
      const url = this.state.favPids.includes(spu)
        ? USER_COLLECTION_CANCEL
        : USER_COLLECTION_ADD;
      ajax({ url, method: "POST", data: { spu }, showLoading: false })
        .then((res) => {
          const { code, data } = res;
          if (code === RES_SUCCESS_CODE) context.dispatch(USER_COLLECTION_PIDS);
          typeof callback === "function" && callback(res);
        })
        .catch((err) => {
          errorHandler(err, true, "@Store.ToggleFavorite::");
          typeof callback === "function" && callback(err);
        });
    },
    /**
     * 检查打开应用状态是否超时
     * @param {Object} context Store实例
     * @param {Object} arg
     * @returns 无
     */
    async checkOpenAppStatus(context, arg) {
      await getOnToken().catch(err => console.warn('@doSilentLogin::', err));
      ajax({
        url: UPDATE_OPEN_APP, method: "POST", showLoading: false
      }).then((res) => {
        const { data ,code} = res;
        const IS_EXPIRED = 1; //未过期： 0 , 过期：1
        if(code === RES_SUCCESS_CODE){
          if(data && data.isExpired === IS_EXPIRED){
            context.commit("setLogoutPopVisile",true)
            Taro.removeStorageSync("userInfo");
            Taro.removeStorageSync("mobile");
            Taro.removeStorageSync("isUserMember");
            Taro.removeStorageSync("lw_loginStatus")
          }
        }
        typeof callback === "function" && callback(res);
      }).catch((err) => {
        errorHandler(err, true, "@checkOpenAppStatus::");
        typeof callback === "function" && callback(err);
      });
    },
    /**
     * 更新关闭小程序时间
     * @param {Object} context Store实例
     * @param {Object} arg
     * @returns 无
     */
    async updateHideAppTime(context, arg) {
      await getOnToken().catch(err => console.warn('@doSilentLogin::', err));
      ajax({
        url: UPDATE_CLOSE_APP, method: "POST", showLoading: false
      }).then((res) => {
        typeof callback === "function" && callback(res);
      }).catch((err) => {
        errorHandler(err, true, "@updateHideAppTime::");
        typeof callback === "function" && callback(err);
      });
    }
  },
});
