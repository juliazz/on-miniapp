<template>
  <view
    ref="pager"
    :class="[
      'pager-wrapper',
      enableHeader ? 'pager-has_header' : '',
      enableTabbar ? 'pager-has_tabbar' : '',

    ]"
    :style="pagerStyles"
  >
    <block v-if="enableHeader">
      <Header
        :config="headerOptions"
        :transitionStyle="transitionStyle"
        @ready="onHeaderReady"
      />
    </block>
    <slot ></slot>
    <block v-if="enableTabbar">
      <Tabbar :config="tabbarOptions" @ready="onTabbarReady" />
    </block>
    <block v-if="enableSidebar">
      <Sidebar :config="sidebarOptions" :showContact="showContact" />
    </block>
    <block v-if="enableLoader">
      <Loader :config="loaderOptions" />
    </block>
    <block v-if="enableSplash">
      <Splash @end="onSplashEnd"  @splashStart="onSplashStart"/>
    </block>
    <Logout :isShow="$store.state.isLogoutPopShow"/>

    <!-- 腾讯隐私协议弹框 -->
    <privacy-popup @agree="onAgree"></privacy-popup>
  </view>
</template>

<script>
import Header from "./Header.vue";
import Tabbar from "./Tabbar.vue";
import Sidebar from "./Sidebar.vue";
import Loader from "./Loader.vue";
import Splash from "@/components/common/Splash.vue";
import Logout from "@/components/common/logoutPop.vue";
import Taro ,{ eventCenter, getCurrentInstance }from "@tarojs/taro";
import Monitor from '@/utils/monitor.js';
import * as ssTrack from '@/utils/ssTrack.js';
import types, { CMP_SPLASH_VISITED } from "@/store/types";
import * as utils from "@/utils";
const { getStorageSync} = utils;

export default {
  name: "Pager",
  components: { Header, Tabbar, Sidebar, Loader, Splash, Logout},
  props: {
    /**
     * `Header` 配置项参数或启用
     */
    header: { type: [Boolean, Object] },
    /**
     * `Page` 配置项参数或启用
     */
    pageStyle: { type: [Boolean, Object] },
    /**
     * `Tabbar` 配置项参数或启用
     */
    tabbar: { type: [Boolean, Object] },
    /**
     * `Sidebar` 配置项参数
     */
    sidebar: { type: Array, default: () => [] },
    /**
     * `Loader` 配置项参数或启用
     */
    loader: { type: [Boolean, Object] },
    /**
     * 是否为 CMS 配置出来的页面
     * - 当前页面为 CMS 页面, 且含有自定义 'Header' | 'Tabbar' | 'Sidebar' 时, 先将其隐藏
     */
    isCMSPage: { type: Boolean, default: false },
    //是否显示联系客服
    showContact: { type: Boolean, default: true },
    transitionStyle: { type: Boolean, default: true },
  },
  data() {
    return {
      isReady: 0,
      headerHeight: 0,
      tabbarHeight: 0,
      getSplashReady:false
    };
  },
  computed: {
    /**
     * 是否启用自定义 `Header`
     */
     isEnableSplash() {

    },
    /**
     * 是否启用自定义 `Header`
     */
    enableHeader() {
      return this.header === true || Object.keys(this.header).length;
    },
    /**
     * 自定义 `Header` 配置项
     */
    headerOptions() {
      return this.header === true ? undefined : this.header;
    },
    /**
     * 是否启用自定义 `Tabbar`
     */
    enableTabbar() {
      return this.tabbar === true;
    },
    /**
     * 自定义 `Tabbar` 配置项
     */
    tabbarOptions() {
      return this.tabbar === true ? undefined : this.tabbar;
    },
    // 是否启用自定义 `Sidebar`
    enableSidebar() {
      return Array.isArray(this.sidebar) && this.sidebar.length > 0;
    },
    /**
     * 自定义 `Sidebar` 配置项
     */
    sidebarOptions() {
      return Array.isArray(this.sidebar) && this.sidebar.length > 0
        ? this.sidebar
        : [];
    },
    /**
     * 是否启用自定义 `Loader`
     */
    enableLoader() {
      return this.loader === true || Object.keys(this.loader).length;
    },
    /**
     * 自定义 `Loader` 配置项
     */
    loaderOptions() {
      return this.loader === true ? undefined : this.header;
    },
    /**
     * `Pager` 内间距处理
     */
    pagerStyles() {
      let styles = {};
      let isFloat = false;
      // headerOptions为真 && backgroundColor==transparent   或者 forceFloat为真  isFloat为真
      if (
        this.headerOptions &&
        (this.headerOptions.backgroundColor === "transparent" ||
          this.headerOptions.forceFloat)
      )
        isFloat = true;
      // forceFloat  //page容器页面内 padding 页面高度去除顶部
      if((this.enableHeader && this.headerHeight && !isFloat) ||
        !this.headerOptions.forceFloat) {
        styles.paddingTop = `${this.headerHeight}rpx`;
        this.$store.commit('setHeaderForceFloat', false);
      } else {
        this.$store.commit('setHeaderForceFloat', true);
      }
      this.enableTabbar &&
        this.tabbarHeight &&
        (styles.paddingBottom = `${this.tabbarHeight}rpx`);
      if (this.pageStyle) {
        styles.backgroundColor = this.pageStyle.backgroundColor;
      }

      // 防止重复派发事件
      if (!this.isReady) {
        if (
          this.enableHeader &&
          this.headerHeight &&
          this.enableTabbar &&
          this.tabbarHeight
        ) {
          this.$emit("ready", {
            headerHeight: this.headerHeight,
            tabbarHeight: this.tabbarHeight,
          });
          this.isReady = 1;
        } else if (
          this.enableHeader &&
          this.headerHeight &&
          !this.enableTabbar
        ) {
          this.$emit("ready", { headerHeight: this.headerHeight });
          this.isReady = 1;
        } else if (
          !this.enableHeader &&
          this.enableTabbar &&
          this.tabbarHeight
        ) {
          this.$emit("ready", { tabbarHeight: this.tabbarHeight });
          this.isReady = 1;
        }
      }
      return styles;
    },
    /**
     * 是否启用 `Splash` 组件
     */
    enableSplash() {
      // `Splash` 组件配置
      const { enable, page_type } = this.$store.state.splash || {};
      // 防止重复显示 `Splash` 组件
      const visited = getStorageSync(CMP_SPLASH_VISITED);
      // 没启用 || 页面类型不正确 || 已经展示过
      if (enable !== 1 || !page_type || visited){
         return false
      };
      //
      const allPages = Taro.getCurrentPages();
      // 非启动页(Tabbar上页面来回跳转History记录长度不变)
      if (allPages.length > 1){
        return false
      };
      const currentPath = Taro.getCurrentInstance().page.route;
      const { path } = Taro.getEnterOptionsSync();
      // 当前页非启动页
      if (currentPath !== path) {
        return false}
      ;
      // 页面 Key & Path 映射数组
      const keyArray = ["homepage", "plp", "pdp", "landingpage"];
      const urlArray = [
        "pages/index/index",
        "subpages/plp/index",
        "subpages/pdp/index",
        "pages/landing/index",
      ];
      const urlIndex = urlArray.findIndex((url) => url === currentPath);
      if (urlIndex === -1){
        return false
      };
      const pageKey = keyArray[urlIndex];
      if (!pageKey) {
        return false
      };
      //
      if (page_type?.includes(pageKey)){
        return true
      };
      return false;
    },
        /**
     * 产品树状数据
     */
     categoryTree() {
      return this.$store.state.categoryTree;
    },
  },
  mounted(options){
    Monitor.hookApp(options)
    eventCenter.on(getCurrentInstance().router.onShow, () => {//模拟页面onShow事件
      console.log('eventCenter.once  onShow page_view_start')
       this.onPageShow()
    })

  },
  beforeDestroy() {
    eventCenter.off(getCurrentInstance().router.onShow);
  },
  methods: {
    /**
     * `Header` 组件 `ready` 事件处理
     */
    onHeaderReady(res) {
      const { height } = res;
      this.headerHeight = height.rpx;
    },
    /**
     * `Tabbar` 组件 `ready` 事件处理
     */
    onTabbarReady(res) {
      const { height } = res;
      this.tabbarHeight = height.rpx;
    },
    onSplashStart(){
      setTimeout(()=>{
        this.getSplashReady=true
      },200)
    },
    //开屏动画结束
    onSplashEnd() {
      this.$emit("end");
    },
    // 隐私协议已同意
    onAgree() {
      this.$emit("onAgree");
    },
    //页面展示  用于埋点
    onPageShow(){
      ssTrack.handlePageOnShow(this.$store.state)
    },
  },
};
</script>

<style lang="scss">
.pager-wrapper {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  /* overflow: auto; */
  &.fullPage {
    flex: 1;
  }
  &.pager-has_tabbar {
    padding-bottom: 176rpx;
  }
  box-sizing: border-box;
  .fix-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
  }
}
</style>
