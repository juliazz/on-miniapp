<template>
  <view class="announcement-wrapper cms_com" :style="appearanceStyles" v-if="visible && config.content" :name="111">
    <view class="follow-notice">
      <view class="follow_tip fllow_tip_notice">
        <view :class="['line-fram', canFrame ? 'can-frame' : '']" :style="animateSpeed()">
          <view class="txt txt_one" :style="titleStyles">{{ config.content.title }}</view>
          <view class="txt txt_two" :style="titleStyles" v-if="canFrame">{{ config.content.title }}</view>
        </view>
      </view>
    </view>
    <!-- <image class="announcement-closer" mode="widthFix" src="@/assets/images/icons/close.svg" @tap.stop="toggle" /> -->
  </view>
</template>

<script>
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import { fixCMSNumber } from '@/utils';

export default {
  name: 'Announcement',
  props: {
    /**
     * 唯一 ID
     */
    identifier: { type: String, required: true },
    /**
     * 组件的配置
     */
    config: { type: Object, required: true }
  },
  data() {
    return {
      visible: true,
      canFrame: false,
      speed:0
    };
  },
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      const { padding_top = 0, padding_right = 0, padding_bottom = 0, padding_left = 0 } = this.config;
      padding_top && !isNaN(padding_top) && (styles.paddingTop = `${fixCMSNumber(padding_top)}rpx`);
      padding_right && !isNaN(padding_right) && (styles.paddingRight = `${fixCMSNumber(padding_right)}rpx`);
      padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${fixCMSNumber(padding_bottom)}rpx`);
      padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${fixCMSNumber(padding_left)}rpx`);
      this.config.content && (styles.backgroundColor = this.config.content['background-color'])
      return styles;
    },
    titleStyles(){
      let styles = {};
      this.config.content && (styles.color = this.config.content['font-color'])
      return styles;
    }
  },
  mounted() {
    eventCenter.once(getCurrentInstance().router.onReady, () => {
      Taro.nextTick(() => {
        this.initComponent();
      })
    });

  },
  methods: {
    initComponent(){
      const query = Taro.createSelectorQuery();
      query.selectAll('.fllow_tip_notice,.txt_one').boundingClientRect((res) => {
        if(res[1]&&res[1].width > res[0].width) {
          this.canFrame = true,
          this.speed = res[1].width / res[0].width * 10
        }
      }).exec()
    },
    animateSpeed(){
      let styles = {};
      styles.animationDuration = `${this.speed}s`
      return styles;
    },
    toggle(){
      this.visible = false
    }

  }
}
</script>

<style lang="scss">
.announcement-wrapper {
  padding: 32rpx;
  background: #000;
  position: relative;

  .follow_tip {
    // text-align: center;
    width: calc(100% - 80rpx);
    overflow: hidden;

    .line-fram {
      color: #fff;
      font-size: 24rpx;
      display: inline-block;
      white-space: nowrap;

      .txt {
        font-size: 24rpx;
        line-height: 42rpx;
        color: #fff;
        display: inline-block;
        white-space: nowrap;
      }

      &.can-frame {
        animation: move 20s infinite linear;

        .txt {
          padding-right: 100rpx;
        }

      }
    }
  }

  @keyframes move {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-50%);
    }
  }
  .announcement-closer {
    width: 40rpx;
    height: auto;
    position: absolute;
    top: 50%;
    right: 32rpx;
    transform: translateY(-50%);
  }
}
</style>
