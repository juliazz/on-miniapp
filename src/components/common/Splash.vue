<template>
  <view class="splash-wrapper" :catch-move="true" v-if="visible && config">
    <view class="splash-container flex_abs_center">
      <!-- @tap="actionHandler(config.link ? { type: 'link', data: config.link } : null)" -->
      <video
        v-if="isVideo" class="splash-media"
        :id="`splash${config.id}`"
        :src="fixCMSPath(config.component.video)" :poster="fixCMSPath(config.component.image, 1125)"
        :autoplay="isAutoPlay" :loop="true" :muted="muted" object-fit="cover"
        :controls="false" :showCenterPlayBtn="false" :show-progress="false" :show-mute-btn="false" :show-fullscreen-btn="false"
        :enable-progress-gesture="false" :enable-play-gesture="false"
        @play="hidePlayBtn()"
        @ended="showPlayBtn()"
      ></video>
      <image
        v-else-if="config.component_type == 'SingleImage'" class="splash-media"
        mode="widthFix" :webp="true" :src="fixCMSPath(config.component.image, 1125)"
      />
      <template v-if="isVideo">
        <!-- 静音按钮 -->
        <view class="video-mute" :style="{ top: `${headerHeight + 32}rpx` }" @tap.stop="toggleMuted">
          <image class="video-mute--icon" mode="widthFix" src="@/assets/images/icons/muted.svg" v-if="muted" />
          <image class="video-mute--icon" mode="widthFix" src="@/assets/images/icons/volume.svg" v-else />
        </view>
        <!-- 播放按钮 -->
        <view class="icon-play-box" hover-class="none" hover-stop-propagation="false"  @tap.stop="playVideo" v-show="!isAutoPlay&&playBtnFlag">
          <image class="icon-paly" mode="widthFix" src="@/assets/images/icons/play.svg"/>
        </view>
      </template>
      <!-- 倒计时 + 跳过 -->
      <button class="countdown btn" @tap="hide">{{countdown}}s | 跳过</button>
    </view>
  </view>
</template>

<script>
import SingleImage from '@/components/cms/SingleImage.vue';
import SingleVideo from '@/components/cms/SingleVideo.vue';
import mixins from "@/utils/mixins";
import * as utils from '@/utils';
import { CMP_SPLASH_VISITED } from '@/store/types';
const { fixCMSPath, getStorageSync, setStorageSync, initWorker } = utils;
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';

export default {
  components: { SingleImage, SingleVideo },
  name: 'Splash',
  mixins: [mixins],
  computed: {
    /**
     * 配置参数
     */
    config() {
      return this.$store.state.splash;
    },
    /**
     * 是否是视频
     */
    isVideo() {
      return this.config.component_type == 'SingleVideo';
    },
    /**
     * 是否自动播放
     */
    isAutoPlay() {
      return this.config?.component?.auto_play == 1;
    },
    /**
     * 自定义 `Header` 高度
     */
    headerHeight() {
      return this.$store.state.headerHeight.rpx;
    }
  },
  data() {
    return {
      visible: true,
      countdown: 0,
      muted: true
    };
  },
  destroyed(){
    this.doDestory();
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    fixCMSPath,
    /**
     * 初始化
     */
    initComponent() {
      this.videoContext = Taro.createVideoContext(`splash${this.config.id}`)
      //
      const visited = getStorageSync(CMP_SPLASH_VISITED);
      if (visited === true) return false;
      if (this.config?.life) {
        this.show();
        // this.doCountdown();
        this.$worker = initWorker('workers/countdown.js', time => {
          this.countdown = time;
          if (this.countdown <= 0) this.hide();
        });
        this.$worker?.postMessage(this.config?.life);
      }
    },
    /**
     * 倒计时
     */
    doCountdown() {
      this.countdown = this.config.life;
      this.$countdownTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) this.hide();
      }, 1000);
    },
    /**
     * 销毁
     */
    doDestory() {
      this.$countdownTimer && clearInterval(this.$countdownTimer);
      this.$worker?.terminate();
    },
    /**
     * 隐藏
     */
    hide() {
      setStorageSync(CMP_SPLASH_VISITED, true);
      this.visible = false;
      Taro.showTabBar()
      this.$emit('end');
      this.doDestory();
      // this.$store.commit('setVisible4HTS', true);
    },
    /**
     * 显示
     */
    show() {
      setStorageSync(CMP_SPLASH_VISITED, true);
      this.visible = true;
      setTimeout(()=>{
        Taro.hideTabBar()
      },200)
      this.$emit('splashStart');
      // this.$store.commit('setVisible4HTS', false);
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
      this.playBtnFlag = true
    }
  }
}
</script>

<style lang="scss">
  .splash-wrapper {
    width: 100%; height: 100%; padding: 0; margin: 0; background: #FFF;
    position: fixed; top: 0; left: 0; bottom: 0; right: 0; z-index: 99;
    .splash-container {
      width: 100%; height: 100%;
      .splash-media {
        width: 100%; height: 100%;
      }
      .countdown {
        position: fixed; right: 32rpx; bottom: 96rpx; z-index: inherit;
        display: inline-block; width: auto; height: 48rpx; padding: 0 16rpx; background-color: rgba(0, 0, 0, 0.5); border: none; border-radius: 200rpx;
        font-size: 24rpx; color: #FFF; font-weight: 400; line-height: 48rpx;
      }
      .video-mute {
        width: 64px; height: 64rpx; padding: 8rpx; border-radius: 50%; position: absolute; top: 180rpx; right: 32rpx;
        // box-shadow: 0 0 16rpx rgba(0, 0, 0, 0.1);
        will-change: transform;
        .video-mute--icon { width: 48rpx; height: auto; }
      }
      .icon-play-box{
        width:96rpx;
        height:96rpx;
        position: absolute;
        top:50%;
        left:50%;
        transform: translate(-50%,-50%);
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #fff;
        border-radius: 50%;
        .icon-paly{
          width: 48rpx;
        }
      }
    }
  }
</style>
