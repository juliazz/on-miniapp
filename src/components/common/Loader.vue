<template>
  <view class="loader-wrapper" v-if="loading">
    <view class="loaderIcon-wrapper">
      <image class="loaderIcon" mode='widthFix' src='@/assets/images/icons/loader.svg' />
    </view>
    <view class="loader-text" v-if="config.title">{{ config.title }}</view>
  </view>
</template>

<script>
export default {
  name: 'Loader',
  props: {
    /**
     * `Loader` 配置项
     * - title - 提示文案
     */
    config: {
      type: Object,
      default: () => ({
        title: ''
      })
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading;
    }
  },
  data() {
    return {};
  },
  methods: {
    //
  }
}
</script>

<style lang="scss">
  @keyframes Spinner-rotate {
    to { transform: rotate(360deg); }
  }
  .loader-wrapper {
    width: 100vw; height: 100vh; background: rgba(255,255,255,0.3);
    display: flex; justify-content: center; align-items: center;
    position: fixed; left: 0; top: 0; z-index: 999;
    .loaderIcon-wrapper {
      width: 96rpx; height: 96rpx;
      .loaderIcon {
        width: 100%; height: auto;
        animation: Spinner-rotate 1.5s linear infinite;
      }
    }
    .loader-text { font-size: 20rpx; }
  }
</style>
