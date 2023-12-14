<template>
  <view
    :id="`_${identifier}_${config.id}`"
    :class="['single_video-wrapper cms_com', isEmbedded ? 'is-embedded' : '', 'cny-lp-video-container']"
    :style="appearanceStyles"
    :data-cms-id="config.id"
  >
    <view
      class="single_video-container"
      :style="videoStyle"
    >
      <video
        :id="`video_${config.id}`"
        class="single_video-inner"
        :style="videoStyle"
        :catch-move="true"
        :src="fixCMSPath(config.content.video)"
        :poster="fixCMSPath(config.content.image)"
        :autoplay="isAutoPlay"
        :showCenterPlayBtn="false"
        :loop="isAutoPlay"
        :muted="muted"
        :object-fit="isEmbedded ? 'cover' : 'contain'"
        :controls="false"
        :show-progress="false"
        :show-mute-btn="false"
        :show-fullscreen-btn="false"
        :enable-progress-gesture="false"
        :enable-play-gesture="false"
        @load="onLoaded({ type: 'video', src: fixCMSPath(config.content.video) }, $event)"
        @error="onLoadedError({ type: 'video', src: fixCMSPath(config.content.video) }, $event)"
        @play="hidePlayBtn()"
        @ended="showPlayBtn()"
        @tap.stop="togglePlayBtn()"
      />
      <!-- 静音按钮 -->
      <view
        v-if="config.content.show_voice_button"
        class="video-mete"
        :style="{ top: `${headerHeight + 40}rpx` }"
        @tap.stop="toggleMuted"
      >
        <image
          v-if="muted"
          class="video-mute--icon"
          mode="widthFix"
          src="@/assets/images/icons/muted.svg"
        />
        <image
          v-else
          class="video-mute--icon"
          mode="widthFix"
          src="@/assets/images/icons/volume.svg"
        />
      </view>
      <!-- 播放按钮 -->
      <view
        v-show="playBtnFlag"
        class="icon-play-box"
        hover-class="none"
        hover-stop-propagation="false"
        @tap.stop="playVideo"
      >
        <image
          class="icon-paly"
          mode="widthFix"
          src="@/assets/images/icons/play.svg"
        />
      </view>
      <view :class="['single_video-ctas--wrapper', isActive ? 'show' : '']">
        <!-- 主标题 -->
        <view
          v-if="config.content.title"
          class="single_video-title"
          :style="titleStyles"
        >
          {{ config.content.title }}
        </view>
        <!-- 副标题 -->
        <view
          v-if="config.content.sub_title"
          class="single_video-sub_title"
          :style="subtitleStyles"
        >
          {{ config.content.sub_title }}
        </view>
        <!-- 按钮 -->
        <view
          v-if="Array.isArray(config.content.buttons) && config.content.buttons.length"
          class="btn_group"
          :style="btnGroupStyles"
        >
          <button
            v-for="(btn, idx) in config.content.buttons"
            :key="idx"
            class="btn"
            :style="toStylesForBtn(btn)"
            @tap.stop="doJumpToLink(btn)"
          >
            {{ btn.text }}
          </button>
        </view>
      </view>
      <!-- 下滑按钮 -->
      <!-- <view class="icon-play-box" hover-class="none" hover-stop-propagation="false"  @tap.stop="toNextScreen" >
        <text>下滑造浪</text>
        <image class="icon-paly" mode="widthFix" src="@/assets/images/icons/play.svg"/>
      </view>-->
    </view>
    <!-- 弹窗 - 登录方式引导 -->
    <LoginGuideVue
      :options="loginGuideOptions"
      @hide="onHideGuideClose"
      @success="onLoginSuccess"
      @confirm="onGuestConfirm"
    />
    <view>
      <view
        v-if="showShadow"
        class="cny-shadow cny-shadow-video-c"
        @tap="subscribe"
      />
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import types from "@/store/types";
import { fixCMSPath, fixCMSNumber, isTabbarPage } from '@/utils';
import mixins from "@/utils/mixins";
import deviceUtil from "@/utils/device-util";
import LoginGuideVue from "@/components/common/LoginGuide.vue";
import touchHandler from "@/utils/touchHandler";
import {
  getCnyInfo,
  cnyRecordSubcribe
} from "../utils";
export default {
  name: 'SingleVideo',
  components: { LoginGuideVue },
  mixins: [mixins],
  props: {
    /**
     * 唯一 ID
     */
    identifier: { type: String, required: true },
    /**
     * 组件配置
     */
    config: { type: Object, required: true },
    /**
     * 是否嵌入在其他容器类组件中
     */
    embedded: { type: Boolean, default: false },
    autoPlayVideo: { type:Number, default: null },
    isFullScreen: { type:Boolean, default: false },
    /**
     * 是否为激活项 - 内嵌在Swiper中时有效
     */
    isActive: { type: Boolean, default: true },
    /**
     * 组件出现的位置索引
     */
    componentIndex: { type: Number, default: -1 }
  },
  data() {
    return {
      /**
       * 游客提示弹窗 - 用户是否已确认保持游客身份继续访问
       */
      isConfirmGuest: Taro.getStorageSync(types.DIALOG_GUEST_CONFIRM_UCENTER),
      windowHeight: deviceUtil.getWindowHeightPX(),
      /**
       * LoginGuide 配置选项
       */
      loginGuideOptions: {
        visible: false,
        hideAsGuest: false,
        enableGuest: false,
        btnText4Guest: "使用游客身份浏览",
        afterHandler: "",
      },
      touchHandler:{},
      muted: true,
      playBtnFlag: false,
      activityInfo: null,
      isSubcribe: false,
      showShadow: true
    };
  },
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      const { padding_top, padding_right, padding_bottom, padding_left } = this.config;
      padding_top && !isNaN(padding_top) && (styles.paddingTop = `${fixCMSNumber(padding_top)}rpx`);
      padding_right && !isNaN(padding_right) && (styles.paddingRight = `${fixCMSNumber(padding_right)}rpx`);
      padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${fixCMSNumber(padding_bottom)}rpx`);
      padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${fixCMSNumber(padding_left)}rpx`);
      return styles;
    },
    /**
     * 自定义 `Header` 高度
     * 组件出现在顶部要加上header高度
     */
    headerHeight() {
      return (this.componentIndex === 0 && this.$store.state.headerForceFloat) ? this.$store.state.headerHeight.rpx : 0;
    },
    /**
     * 自定义 `Header` 高度
     */
    screenHeight() {
      const { windowHeight } = this
      return windowHeight - this.$store.state.headerHeight.px;
    },

    /**
     * 按钮组样式
     */
    btnGroupStyles() {
      let styles = {};
      const { button_bottom_space } = this.config.content;
      button_bottom_space && !isNaN(button_bottom_space) && (styles.bottom = `${fixCMSNumber(button_bottom_space)}rpx`);
      return styles;
    },
    /**
     * 自动播放状态
     */
    isAutoPlay() {
      if(this.autoPlayVideo === 0 || this.autoPlayVideo === 1) {
        return !!this.autoPlayVideo
      }else{
        return !!this.config.content.auto_play;
      }
    },
    /**
     * 是否内嵌在其他组件中
     */
    isEmbedded() {
      return !!this.embedded;
    },
    videoStyle(){
      const { windowWidth } = wx.getSystemInfoSync();
      let styles = {};
      const { height, width} = this.config.content;
      if(this.isFullScreen){
        styles.height='100%'
      }else{
        height && width && (styles.height = Math.floor(height/width*windowWidth)+'px')
      }
      return styles;
    },
    /**
     * 主标题样式
     */
    titleStyles() {
      let styles = {};
      const { font_color, title_bottom_space } = this.config.content;
      font_color && (styles.color = font_color);
      title_bottom_space && !isNaN(title_bottom_space) && (styles.bottom = `${fixCMSNumber(title_bottom_space)}rpx`);
      return styles;
    },
    /**
     * 副标题样式
     */
    subtitleStyles() {
      let styles = {};
      const { font_color, sub_title_bottom_space } = this.config.content;
      font_color && (styles.color = font_color);
      sub_title_bottom_space && !isNaN(sub_title_bottom_space) && (styles.bottom = `${fixCMSNumber(sub_title_bottom_space)}rpx`);
      return styles;
    }
  },
  watch: {
    isActive: {
      immediate: true,
      handler() {
        this.toggleVideoStatus();
      }
    }
  },
  mounted() {
    this.initComponent();
    this.touchHandler =Object.assign({}, new touchHandler())// 挂载touchHandler 对象及方法
    if(this.config && this.config.content && this.config.content.name === 'wxmp-roger-01'){
      this.getCnyInfo()
    }else{
      this.showShadow = false
    }
  },
  methods: {
    async getCnyInfo(){
      const res = await getCnyInfo()
      if(res.code === 200){
        this.activityInfo = res.data?.activity_info
        this.isSubcribe = res.data.has_subscribe
      }
    },
    subscribe(){
      console.log('subscribe------------')
      if(!this.activityInfo){
        return
      }
      if(this.activityInfo && this.activityInfo.status > 0){
        Taro.navigateTo({ url: '/campaignPage/pages/campaignCNY24/index' });
          return
      }
     if(this.isSubcribe){
      return Taro.showToast({ title: "您已订阅，无需重复订阅", icon: 'none'});
     }
      const templateIds = this.$store.state.templateId[process.env.NODE_ENV].templateIds.CNY2024
      const templateId= templateIds && templateIds.activityStart
      Taro.requestSubscribeMessage({
        tmplIds: [templateId],
        success: async (sres) => {
          console.log('sres---------', sres)
          if(sres[templateId] === 'accept'){
            cnyRecordSubcribe({type: 6})
            this.isSubcribe = true
            Taro.showToast({ title: "订阅成功", icon: 'none'});
          }
        },
        complete(sres){
          if(sres.errMsg.includes('requestSubscribeMessage:fail')){
            Taro.showToast({ title: "订阅失败", icon: 'none'});
          }
        }
      })
    },
    fixCMSPath,
    initComponent() {
      this.videoContext = Taro.createVideoContext(`video_${this.config.id}`)
      if (!this.embedded) {
        this.$emit('ready', { name: 'SingleVideo', videos: 1 });
      }
    },
    /**
     * 按钮样式
     */
    toStylesForBtn(itemConfig) {
      let styles = {};
      const { color, background_color, border_color } = itemConfig;
      color && (styles.color = color);
      styles.backgroundColor = background_color || "transparent";
      border_color && (styles.border =`2rpx solid ${border_color}`);
      return styles;
    },
    /**
     * 切换静音状态
     */
    toggleMuted() { this.muted = !this.muted; },
    // 播放视频
    playVideo(){
      this.videoContext.play()
      this.playBtnFlag = false
    },
    hidePlayBtn(){
      this.playBtnFlag = false
    },
    showPlayBtn(){
      this.playBtnFlag = this.isAutoPlay? false:true
    },
    togglePlayBtn(){
      if(this.playBtnFlag){
        this.videoContext.play()
        this.playBtnFlag = false
      }else{
        this.playBtnFlag = true
        this.videoContext.pause()
      }
    },
    doJumpToLink(btn) {
      if (!btn?.link) return console.warn('@SingleVideo.doJumpToLink::', btn), false;
      let _token = Taro.getStorageSync("lw_loginStatus")
      if (btn.need_auth && !_token) {
        this.loginGuideOptions.afterHandler = btn.link;
        this.onShowLoginGuide(true);
      } else {
        this.handleLink(btn.link);
      }
    },
    toNextScreen(){
      this.$emit('toNextScreen')
      // Taro.pageScrollTo({
      //   scrollTop: this.screenHeight,
      //   duration: 300
      // })
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
      Taro.setStorageSync("lw_loginStatus", 1);
    },
    /**
     * `LoginGuide` 确认继续使用`游客身份`
     */
    onGuestConfirm() {
      this.onHideGuideClose();
    },
    handleLink(link) {
      if (link.includes("http")) {
        Taro.navigateTo({
          url: `/pages/web-view/index?src=${encodeURIComponent(link)}`,
        });
      } else if(isTabbarPage(link)){
        Taro.switchTab({ url: link });
      } else {
        Taro.navigateTo({ url: link });
      }
    },
    /**
     * 根据轮播当前项, 切换视频播放状态
     */
    toggleVideoStatus() {
      if (this.isEmbedded && this.videoContext) {
        if (this.isActive) {
          this.videoContext.play();
          this.playBtnFlag = false;
        } else {
          this.videoContext.pause();
          this.playBtnFlag = true;
        }
      }
    },

  }
}
</script>

<style lang="scss">
  .single_video-wrapper {
    width: 100%;
    .single_video-container {
      position: relative;
      .single_video-inner { width: 100%; }
      .video-mete {
        width: 64px; height: 64rpx; padding: 8rpx;
        border-radius: 50%; position: absolute; right: 40rpx;
        will-change: transform;
        .video-mute--icon { width: 48rpx; height: auto; }
      }
      .icon-play-box{
        position: absolute;
        left: 50%;
        top: 50%;
        width: 200rpx;
        height: 100rpx;
        text-align: center;
        transform: translate(-50%,-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        .icon-paly{
          width: 48rpx;
        }
      }
      .single_video-ctas--wrapper {
        opacity: 0; transition: all 1s ease 0.3s;
        height: 0;
        .single_video-title { width: 100%; position: absolute; left: 0; bottom: 204rpx; font-size: 64rpx; line-height: 1; text-align: center; }
        .single_video-sub_title { width: 100%; position: absolute; left: 0; bottom: 144rpx; font-size: 36rpx; line-height: 1; text-align: center; }
        .btn_group {
          width: 100%; position: absolute; left: 0; bottom: 24rpx; z-index: 2;
          .btn:first-child:last-child { width: 272rpx; }
        }
        &.show { opacity: 1;height: auto; }
      }
    }

    &.is-embedded {
      height: 100%;
      .single_video-container {
        height: 100%;
        .single_video-inner { height: 100%; }
      }
    }
  }
  .cny-lp-video-container{
    position: relative;
    overflow: hidden;
    video{
      width: 750rpx;
      height: 420rpx;
    }
  }
  .cny-shadow-video-c{
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
