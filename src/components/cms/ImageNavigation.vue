<template>
  <view class="image_navigation-wrapper" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" v-if="sorted">
    <scroll-view :scroll-x="true" :show-scrollbar="false" class="image_navigation-container" :style="containerStyles" @scroll="onScroll">
      <view :class="['image_navigation-box',`image_navigation${config.id}`]" hover-class="none" hover-stop-propagation="false">
        <view v-for="(item, index) in config.content.items" :key="index" class="image_nav-item" :style="itemStyles"
          @tap.stop="jumpToLink(item)">
          <image class="nav_item-image" mode="widthFix" :webp="true" :src="fixCMSPath(item.image, imageWidth)"
            @load="onLoaded({ type: 'image', src: fixCMSPath(item.image, imageWidth) }, $event)"
            @error="onLoadedError({ type: 'image', src: fixCMSPath(item.image, imageWidth) }, $event)" />
          <view :class="['nav_item-title', config.content.show_skin ? 'show_skin' : '']" :style="toStylesForTitle(item)">
            {{ item.title }}</view>
        </view>
      </view>
    </scroll-view>
    <view class="scroll-box" v-if="config.content.show_slider_bar && config.content.items.length>1">
      <view :class="['scrollbar', config.content.slider_bar_style == 'white' ? 'theme-white' : 'theme-black']">
        <view class="scrollbar-inner" :style="{ width: `${scrollPresent*100 + '%'}`, transform:`translateX(${scrollLeft})` }"></view>
      </view>
    </view>
    <!-- 弹窗 - 登录方式引导 -->
    <LoginGuideVue :options="loginGuideOptions" @hide="onHideGuideClose" @success="onLoginSuccess" @confirm="onGuestConfirm" />
  </view>
</template>

<script>
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import types from '@/store/types';
import { fixCMSPath, fixCMSNumber, objectArraySort } from '@/utils';
import mixins from "@/utils/mixins";
import LoginGuideVue from '@/components/common/LoginGuide.vue';

export default {
  name: 'ImageNavigation',
  mixins: [mixins],
  components: { LoginGuideVue },
  props: {
    /**
     * 唯一 ID
     */
    identifier: { type: String, required: true },
    /**
     * 组件配置
     */
    config: { type: Object, required: true }
  },
  data() {
    return {
      sorted: false,
      scrollPresent:0,
      scrollLeft:0,
      loginToken: null,
      /**
       * 游客提示弹窗 - 用户是否已确认保持游客身份继续访问
       */
      isConfirmGuest: Taro.getStorageSync(types.DIALOG_GUEST_CONFIRM_UCENTER),
      /**
       * LoginGuide 配置选项
       */
      loginGuideOptions: {
        visible: false,
        hideAsGuest: false,
        enableGuest: false,
        btnText4Guest: '使用游客身份浏览',
        afterHandler: ''
      },
    }
  },
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      const { padding_top, padding_bottom, padding_left } = this.config;
      const { bg_color} = this.config.content;
      padding_top && !isNaN(padding_top) && (styles.paddingTop = `${fixCMSNumber(padding_top)}rpx`);
      padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${fixCMSNumber(padding_bottom)}rpx`);
      padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${fixCMSNumber(padding_left)}rpx`);
      bg_color  && (styles.backgroundColor = bg_color);
      return styles;
    },
    /**
     * 容器样式
     */
    containerStyles() {
      let styles = {};
      const { padding_right } = this.config;
      padding_right && !isNaN(padding_right) && (styles.paddingRight = `${fixCMSNumber(padding_right)}rpx`);
      return styles;
    },
    /**
     * 内容样式
     */
    itemStyles() {
      let styles = {};
      const { image_border_radius, padding_between_images, image_width, show_slider_bar, show_skin } = this.config.content;
      image_border_radius && !isNaN(image_border_radius) && (styles.borderRadius = `${fixCMSNumber(image_border_radius)}rpx`);
      padding_between_images && !isNaN(padding_between_images) && (styles.marginRight = `${fixCMSNumber(padding_between_images)}rpx`);
      image_width && !isNaN(image_width) && (styles.width = `${fixCMSNumber(image_width)}rpx`);
      return styles;
    },
    /**
     * 图片宽度, 配置宽度的三倍
     */
    imageWidth() {
      const { image_width } = this.config.content;
      return image_width ? fixCMSNumber(image_width, 3) : 480;
    }
  },
  async created() {
    await this.$store.state.loginPromise;
    this.initComponent();
  },
  methods: {
    fixCMSPath,
    /**
     * 初始化
     */
    initComponent() {
      objectArraySort(this.config.content.items, 'sort', 'asc');
      this.sorted = true;
      //
      this.$emit('ready', { name: 'ImageNavigation', images: this.config?.content?.items?.length });
      this.initScrollBarWidth()
    },
    toStylesForTitle(itemConfig) {
      let styles = {};
      if (!itemConfig) return styles;
      const { font_color } = itemConfig;
      font_color && (styles.color = font_color);
      return styles;
    },
    onScroll(e){
      this.scrollLeft = e.detail.scrollLeft/e.detail.scrollWidth * 400 + 'rpx'
    },
    initScrollBarWidth() {
      Taro.nextTick(() => {
        // Taro.createSelectorQuery().selectAll(`.image_navigation-container,.image_navigation${this.config.id}`).boundingClientRect((res) => {
        //   console.log(res)
        //   const fatherClientWeight = res[0].width; // 获取父高度
        //   const fatherScrollWeight = res[1].width; // 获取父可滚动高度
        //   const present = fatherClientWeight / fatherScrollWeight; // 计算滚动条应该占多高
        //   this.scrollPresent = present
        //   console.log(present)
        // }).exec()
        // let fatherClientWeight = 0
        // let fatherScrollWeight = 0
        const { windowWidth } = wx.getSystemInfoSync();
        this.$selectorQuery = Taro.createSelectorQuery();
        this.$selectorQuery.select(`.image_navigation${this.config.id}`).boundingClientRect(rect => {
          if (rect) this.scrollPresent = windowWidth/rect.width
        }).exec();
      })
    },
    /**
     * 登录弹窗 - 引导
     */
    onShowLoginGuide(enableGuest) {
      this.loginGuideOptions.enableGuest = !!enableGuest;
      this.loginGuideOptions.visible = true;
    },
    /**
     * `LoginGuide` 关闭
     */
    onHideGuideClose() {
      this.loginGuideOptions.visible = false;
    },
    /**
     * `LoginGuide` 登录成功
     */
    onLoginSuccess() {
      this.onHideGuideClose();
      this.loginToken = 1;
      Taro.setStorageSync('lw_loginStatus', 1);
    },
    /**
     * `LoginGuide` 确认继续使用`游客身份`
     */
    onGuestConfirm() {
      this.onHideGuideClose();
    },
    jumpToLink(item){
      if (!item || !item.link) return console.warn('@jumpToLink:: 无跳转链接配置', item), false;
      let _token = Taro.getStorageSync('lw_loginStatus')
      if(item.need_auth && !_token){
        this.loginGuideOptions.afterHandler = item.link;
        this.onShowLoginGuide(true);
      }else{
        this.handleLink(item.link)
      }
    },
    handleLink(link){
      if(link.includes('http')){
        Taro.navigateTo({ url: `/pages/web-view/index?src=${encodeURIComponent(link)}` });
      }else{
        Taro.navigateTo({ url: link });
      }
    }
  }
}
</script>

<style lang="scss">
.image_navigation-wrapper {
  text-align: left;
  .image_navigation-container {
    box-sizing: border-box;
    display: inline-block;
    vertical-align: middle;
    width: 100%;
    white-space: nowrap;
    .image_navigation-box{
      display: inline-block;
    }

    .image_nav-item {
      display: inline-block;
      width: 320rpx;
      border-radius: 8rpx;
      overflow: hidden;
      vertical-align: top;
      position: relative;

      .nav_item-image {
        width: 100%;
        height: auto;
        vertical-align: middle;
      }

      .nav_item-title {
        box-sizing: border-box;
        width: 100%;
        height: 128rpx;
        padding-top: 76rpx;
        position: absolute;
        left: 0;
        bottom: 0;
        font-size: 32rpx;
        color: #FFF;
        font-weight: 500;
        line-height: 1;
        text-align: center;

        &.show_skin {
          background: linear-gradient(180deg, rgba(0, 0, 0, 0.0001) 0%, #000000 100%);
        }
      }

      // & + .image_nav-item { margin-left: 16rpx; }
      &:first-child {
        margin-left: 32rpx !important;
      }

      &:last-child {
        margin-right: 32rpx !important;
      }
    }
  }

  .scroll-box{
    width:100%;
    height:80rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .scrollbar{
      width:400rpx;
      height: 1Px;
      background-color: #CCCCCC;
      .scrollbar-inner{
        width:100rpx;
        height: 2Px;
        background-color: #000;
        bottom: 0;
        left:0;
      }
      //
      &.theme-white {
        background-color: rgba(255, 255, 255, 0.6);

        .scrollbar-inner {
          background-color: #FFF;
        }
      }
    }
  }
}
</style>
