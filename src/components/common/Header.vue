<template>
  <view :class="['header-wrapper', transitionStyle ? '' :'no_transition']" :style="headerWrapperStyles">
    <view class="header-inner" :style="headerInnerStyles">
      <view :class="['header-l', enableBorder? 'header-l--border' : '']" :style="headerSideStyles">
        <!-- Logo - 排他 -->
        <block v-if="config.enableLogo4L">
          <view class="header-trigger header-trigger--logo">
            <image class="logo-image" mode="widthFix" src="@/assets/images/icons/logo-white.svg" v-if="!config.style || config.style === 'white'" />
            <image class="logo-image" mode="widthFix" src="@/assets/images/icons/logo-black.svg" v-else />
          </view>
        </block>
        <block v-else>
          <!-- 返回按钮 -->
          <view class="header-trigger" @tap="onBack" v-if="enableBacker">
            <image mode="widthFix" src="@/assets/images/icons/arrow_line-left--white.svg" v-if="!config.style || config.style === 'white'" />
            <image mode="widthFix" src="@/assets/images/icons/arrow_line-left--black.svg" v-else />
          </view>
          <!-- 首页 -->
          <view class="header-trigger" @tap="onBack2Home" v-if="enableBack2Home">
            <image mode="widthFix" src="@/assets/images/icons/home-white.svg" v-if="!config.style || config.style === 'white'" />
            <image mode="widthFix" src="@/assets/images/icons/home.svg" v-else />
          </view>
          <!-- 搜索 -->
          <view class="header-trigger" @tap="onSearch" v-if="enableSearch">
            <image mode="widthFix" src="@/assets/images/icons/search-white.svg" v-if="!config.style || config.style === 'white'" />
            <image mode="widthFix" src="@/assets/images/icons/search.svg" v-else />
          </view>
          <!-- 扫码 -->
          <view class="header-trigger" @tap="onScan" v-if="enableScaner">
            <image mode="widthFix" src="@/assets/images/icons/scan-white.svg" v-if="!config.style || config.style === 'white'" />
            <image mode="widthFix" src="@/assets/images/icons/scan.svg" v-else />
          </view>
        </block>
      </view>
      <view class="header-m flex_abs_center" :style="headerTextStyles">
        <block v-if="config.enableLogo4M">
          <image class="logo-image" mode="widthFix" src="@/assets/images/icons/logo-white.svg" v-if="!config.style || config.style === 'white'" />
          <image class="logo-image" mode="widthFix" src="@/assets/images/icons/logo-black.svg" v-else />
        </block>
        <block v-else>
          <view v-if="config.style === 'black'">
            {{ config.title }}
          </view>
        </block>
      </view>
      <view class="header-r" :style="headerSideStyles"></view>
    </view>
  </view>
</template>

<script>
import store from '@/store/index';
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import * as utils from '@/utils';
const { px2rpx, getStorageSync, ajax ,RES_SUCCESS_CODE, isTabbarPage, isEmpty } = utils;
import types from '@/store/types';

export default {
  name: 'Header',
  props: {
    /**
     * Header 配置
     * - title           - 标题文本
     * - backgroundColor - `Header` 背景色, 默认`白色`.
     * - style           - `Header` 风格, 可选 `white` 和 `black`, 非白即黑.
     * - forceShowBacker - 强制启用 `返回` 按钮.
     * - forceShowHome   - 强制启用 `首页` 按钮.
     * - forceFloat      - 强制 `Header` 浮动.
     * - enableSearch    - 启用 `搜索` 按钮.
     * - enableScaner    - 启用 `扫一扫` 按钮.
     * - enableLogo4L    - 启用左侧 `Logo` 显示, 排他逻辑.
     * - enableLogo4M    - 启用中间 `Logo` 显示, 无视 `title` 属性设置.
     * - beforeBack      - 返回前的判断条件. 参数值可为 `Function` 类型和 `Boolean` 类型以及空值(null, undefined, ''), 其他不做处理.
     *                     当为 `Function` 类型时需返回 `resolve(boolean)` 的 `Promise` 实例或返回 `Boolean` 类型, 其他返回值不做处理;
     *                     当为 `Boolean` 类型时, true = 允许返回, false = 不做处理.
     */
    config: {
      type: Object,
      default: () => ({
        title: '昂跑',
        backgroundColor: '#FFF',
        style: 'white',
        forceFloat: false,
        forceShowBacker: false,
        forceShowHome: false,
        enableSearch: false,
        enableScaner: false,
        enableLogo4L: false,
        enableLogo4M: false,
        beforeBack: null
      })
    },
    transitionStyle:{type: Boolean, default: true}
  },
  data() {
    return {};
  },
  computed: {
    /**
     * 小程序`胶囊按钮`尺寸及位置
     */
    wxMenuButtonRect() {
      return Taro.getMenuButtonBoundingClientRect();
    },
    /**
     * `Header` 外观尺寸及背景色
     */
    headerWrapperStyles() {
      let styles = {};
      const { top } = this.wxMenuButtonRect;
      const { backgroundColor } = this.config || {};
      styles.paddingTop = `${px2rpx(top)}rpx`;
      // styles.paddingBottom = `14rpx`;
      styles.paddingBottom = `7PX`;
      backgroundColor && (styles.backgroundColor = backgroundColor);
      const visible = this.$store.state.visible4HTS;
      styles.opacity = visible ? '1' : '0';
      return styles;
    },
    /**
     * `Header` 内容区域尺寸
     */
    headerInnerStyles() {
      let styles = {};
      const { height } = this.wxMenuButtonRect;
      styles.height = `${px2rpx(height)}rpx`;
      styles.padding = `0 14rpx`;
      return styles;
    },
    /**
     * `Header` 两侧区域尺寸
     */
    headerSideStyles() {
      let styles = {};
      const { width, height } = this.wxMenuButtonRect;
      styles.width = `${px2rpx(width)}rpx`;
      styles.height = `${px2rpx(height)}rpx`;
      return styles;
    },
    /**
     * `Header` 中间区域尺寸
     */
    headerTextStyles() {
      let styles = {};
      const { width } = this.wxMenuButtonRect;
      styles.width = `${750 - px2rpx(width + 7) * 2}rpx`;
      //
      const { style } = this.config;
      if (style === 'white') styles.color = 'white';
      //
      return styles;
    },
    /**
     * 是否为首页
     */
    isHomePage() {
      return Taro.getCurrentInstance().page.route === 'pages/index/index';
    },
    /**
     * 是否为 Tabbar 页面
     */
    isTabbarPage() {
      return [
        'pages/index/index',
        'pages/category/index',
        'pages/club/index',
        'pages/cart/index',
        'pages/ucenter/index',
      ].includes(Taro.getCurrentInstance().page.route);
    },
    /**
     * 是否启用返回按钮
     */
    enableBacker() {
      const allPages = Taro.getCurrentPages();
      const { forceShowBacker } = this.config || {};
      return forceShowBacker || allPages.length > 1;
    },
    /**
     * 是否启用返回首页按钮
     */
    enableBack2Home() {
      const { forceShowHome, enableLogo4L } = this.config || {};
      const allPages = Taro.getCurrentPages();
      if (this.isHomePage || this.isTabbarPage || enableLogo4L) return false;
      return forceShowHome || allPages.length === 1;
    },
    /**
     * 是否启用搜索按钮
     */
    enableSearch() {
      const { enableSearch, enableScaner, enableLogo4L } = this.config || {};
      if (enableSearch && !enableLogo4L) {
        let btnCount = 0;
        this.enableBacker && btnCount++;
        this.enableBack2Home && btnCount++;
        enableScaner && btnCount++;
        return btnCount < 2;
      } else {
        return false;
      }
    },
    /**
     * 是否启用扫码按钮
     */
    enableScaner() {
      const { enableSearch, enableScaner, enableLogo4L } = this.config || {};
      if (enableScaner && !enableLogo4L) {
        let btnCount = 0;
        this.enableBacker && btnCount++;
        this.enableBack2Home && btnCount++;
        enableSearch && btnCount++;
        return btnCount < 2;
      } else {
        return false;
      }
    },
    /**
     * `Header` 组件的高度
     */
    headerHeight() {
      const { bottom } = this.wxMenuButtonRect;
      return { px: bottom + 7, rpx: px2rpx(bottom + 7) };
    },
    /**
     * 是否启用边框样式
     */
    enableBorder() {
      const { enableSearch, enableScaner, enableLogo4L } = this.config || {};
      if (this.isHomePage || enableLogo4L) return false;
      let btnCount = 0;
      this.enableBacker && btnCount++;
      this.enableBack2Home && btnCount++;
      enableSearch && btnCount++;
      enableScaner && btnCount++;
      return btnCount > 1;
    }
  },
  created(){
    !this.$store && (this.$store = store)
  },
  mounted() {
    // 'ready' 事件派发
    eventCenter.once(getCurrentInstance().router.onReady, () => {
      this.$store.commit('setHeaderHeight', this.headerHeight);
      this.$emit('ready', { height: this.headerHeight });
    });
  },
  beforeDestroy() {
    // this.$store.commit('setHeaderHeight', { px: 0, rpx: 0 });
  },
  methods: {
    /**
     * 返回上一页
     */
    onBack() {
      if (typeof this.config.beforeBack == 'function') {
        const ret = this.config.beforeBack();
        if (ret instanceof Promise) { // ret.constructor === Promise
          ret.then(res => {
            res && this.doBack();
          });
        } else if (ret === true) {
          doBack();
        }
      } else if (isEmpty(this.config.beforeBack) || this.config.beforeBack === true) {
        this.doBack();
      }
    },
    /**
     * 返回上一页
     */
    doBack() {
      let page = Taro.getCurrentPages()
      let currentPage = page[page.length-1]
      if (this.$store.state.prevPage && currentPage.route === 'pages/cart/index'){
        Taro.navigateTo({url:this.$store.state.prevPage})
        this.$store.state.prevPage = ''
      }else{
        Taro.navigateBack();
      }
    },
    /**
     * 返回首页
     */
    onBack2Home() {
      Taro.reLaunch({ url: '/pages/index/index'});
    },
    /**
     * 搜索
     */
    onSearch() {
      Taro.navigateTo({
        url:'/subpages/search/index'
      })
    },
    /**
     * 判断是否为 Tabbar 上的页面(防止影响其他功能不对utils中的同名函数修改)
     */
    isTabbarRoute(link) {
      return /\/?pages\/(index|category|club|cart|ucenter)\/index(\?.*)?/i.test(link);
    },
    /**
     * 打开 `扫一扫` 功能
     */
    onScan() {
      Taro.scanCode({
        needResult: 1,
        // scanType: ["qrCode","barCode"],
        success: res => {
          console.info('onScan::', res);
          if (res.errMsg == 'scanCode:ok') {
            if (res.path) {
              let path = res.path; //微信开发者工具 在开发者工具里出现乱码需要decodeURIComponent转义,真机不需要,可以直接使用
              path = res.path.split('?');
              let pageUrl = path[0], pageParam = path[1];
              if (pageParam === 'scene=' && path[2]) {
                pageParam += encodeURIComponent(path[2]);
              }
              //在这里把参数存起来就可以了
              if (this.isTabbarRoute(pageUrl)) {
                Taro.reLaunch({
                  url: `/${pageUrl}?${pageParam}`
                })
              } else {
                Taro.redirectTo({
                  url: `/${pageUrl}?${pageParam}`
                })
              }
              return;
            }
            return new Promise(async (resolve, reject) => {
              ajax({
                url: types.PRODUCT_SCAN,
                data: {
                  sku:res.result, //'7630040542722'
                },
                // showLoading:false
              }).then(res => {
                resolve(res)
                console.log(res)
                if(res.code == RES_SUCCESS_CODE){
                  Taro.navigateTo({
                    url: `/subpages/pdp/index?style_slug=${res.data.style_slug}&product_slug=${res.data.product_slug}`
                  });
                }else{
                  Taro.showToast({ title: res.message, icon: 'none' });
                }
              }).catch(err => {
                console.log(err)
                reject(err)
              });
            });
          }else{
            Taro.showToast({ title: '未搜索到匹配产品', icon: 'none' });
          }
        },
        fail: err => {
          console.info('onScan::', err);
        }
      })
    }
  }
}
</script>

<style lang="scss">
  .header-wrapper {
    width: 100%; padding-top: 48rpx; background-color: white; position: fixed; top: 0; left: 0; z-index: 9; transition: all 0.3s ease-in;
    &.no_transition{
      transition: none;
    }
    .header-inner {
      width: 100%; height: 88rpx; display: flex;
      .header-l, .header-r { height: 100%; }
      .header-l {
        display: flex; justify-content: flex-start; align-items: center; padding-left: 28rpx;
        .header-trigger {
          width: 48rpx; height: 48rpx;
          image { width: 100%; height: auto; }
          & + .header-trigger { margin-left: 32rpx; }
          //
          &--logo { width: 80rpx; height: 80rpx; }
        }
        //
        &--border {
          padding: 0 24rpx; justify-content: space-between; position: relative;
          // background: rgba(255, 255, 255, 0.596637);
          border: 1rpx solid rgba(151, 151, 151, 0.201002); border-radius: 50rpx;
          .header-trigger {
            width: 44rpx; height: 44rpx;
            & + .header-trigger { margin: 0; }
          }
          &::after {
            content: ""; width: 1px; height: 36rpx; background: rgba(0, 0, 0, 0.198907);
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          }
        }
      }
      .header-m {
        height: 100%; font-size: 36rpx; color: #000; font-weight: 500; text-align: center; line-height: 1;
        .logo-image { width:80rpx; height: auto; margin-bottom: 6rpx;}
      }
    }
  }
</style>
