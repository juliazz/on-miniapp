<template>
  <view :class="['dialog-wrapper', `dialog-${position}`]" v-if="visible">
    <view class="dialog-container" :style="containerStyles">

      <!-- 关闭按钮 -->
      <image v-if="popCloseIcon" class="pop-close" src="@/assets/images/icons/pop_close_icon.svg" mode="aspectFit"
        @tap.stop="handleClosePop">
      </image>

      <!-- 标题 -->
      <view class="pop-header" v-if="title != ''">
        <text class="pop-title">{{ title }}</text>
        <text v-if="subTitle != ''" class="sub-title">{{ subTitle }}</text>
      </view>

      <!-- 描述 -->
      <view class="pop-desc" v-if="popDesc != ''">
        {{ popDesc }}
      </view>

      <!-- 自定义插槽 -->
      <slot></slot>

      <!-- 底部按钮 -->
      <view class="pop-btn" v-if="$listeners.onConfirm">
        <view class="confirm_btn" @tap.stop="handleConfirm">{{ confirmText }}</view>
      </view>

    </view>
    <view class="mask" :catch-move="true" @tap.stop="onClickMask"></view>
  </view>
</template>

<script>
export default {
  name: 'Dialog',
  components: {},
  props: {
    visible: { 
      type: Boolean,
       default: false
      },
    position: { type: String, default: 'center', validator: v => ['center', 'bottom'].includes(v) },
    /** 遮罩层能否关闭 */
    maskClosable: { type: Boolean, default: true },
    /** 标题 */
    title: { type: String, default: '' },
    /** 标题描述 */
    subTitle: { type: String, default: '' },
    /** 内容描述 */
    popDesc: { type: String, default: '' },
    /** 是否需要关闭按钮 */
    popCloseIcon: { type: Boolean, default: true },
    /** center弹框宽度 */
    popWidth: { type: Number, default: 622 },
    /** 弹框背景色 */
    popBackground: { type: String, default: '#fff' },
    /** confirm按钮文案 */
    confirmText: { type: String, default: '确定' },
  },
  // // 孙组件中
  // inject: ['popPar'],
  created() {
  },
  data() {
    return {};
  },
  computed: {
    containerStyles() {
      let _styles = {
        background: this.popBackground,
      };
      if (this.position === 'center') {
        _styles.width = `${this.popWidth}rpx`
      }
      return _styles;
    }
  },
  methods: {
    /**
     * 点击遮罩层
     */
    onClickMask() {
      if (this.maskClosable) this.$emit('close');
    },
    /**
     * 点击关闭按钮
     */
    handleClosePop() {
      this.$emit('close');
    },
    /**
     * 点击conform
     */
    handleConfirm() {
      this.$emit('onConfirm');
    }
  }
}

</script>

<!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss'>
.dialog-wrapper {
  .mask {
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pop-close {
    width: 48rpx;
    height: 48rpx;
    position: absolute;
    top: 32rpx;
    right: 32rpx;
  }

  .dialog-container {
    animation: 0.5s opacity_transtion ease;
    animation-fill-mode: forwards;
    animation-iteration-count: 1;
  }

  .pop-btn {
    display: flex;
    margin-top: 64px;
    justify-content: center;

    .confirm_btn {
      width: 400px;
      height: 96px;
      background-color: #000;
      border-radius: 80px;
      font-size: 28px;
      color: white;
      line-height: 96px;
      text-align: center;
    }
  }

  &.dialog-center {
    .dialog-container {
      position: fixed;
      top: 50%;
      left: 50%;
      z-index: 100;
      transform: translate(-50%, -50%);
      width: 622rpx;
      padding: 80rpx 48rpx;
      background: #FFF;
      border-radius: 24rpx;
      text-align: center;

      .pop-header {
        margin-bottom: 32rpx;
        text-align: center;

        .pop-title {
          font-style: normal;
          font-weight: 500;
          font-size: 40rpx;
          line-height: 120%;
          text-align: center;
          letter-spacing: -0.01em;
          color: #000000;
        }

      }

      .pop-desc {
        width: 336px;
        font-size: 28px;
        color: #333;
        line-height: 42px;
        text-align: center;
        margin: 0 auto;
      }
    }
  }

  &.dialog-bottom {
    .dialog-container {
      width: 100vw;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      padding: 48rpx 32rpx 0;
      padding-bottom: calc(78px + constant(safe-area-inset-bottom));
      padding-bottom: calc(78px + env(safe-area-inset-bottom));
      border-radius: 8rpx 8rpx 0px 0px;
      background-color: #fff;

      .pop-header {
        display: flex;
        align-items: center;

        .pop-title {
          font-style: normal;
          font-weight: 500;
          font-size: 28rpx;
          color: #000000;
        }

        .sub-title {
          padding-left: 18px;
          font-size: 24px;
          color: #999;
        }
      }

    }
  }

  @keyframes opacity_transtion {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }
}
</style>
