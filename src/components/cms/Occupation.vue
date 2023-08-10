<template>
  <view class="occupation-wrapper" :style="appearanceStyles" :id="`_${identifier}_${config.id}`">
    <view class="occupation-container" :style="containerStyles"></view>
  </view>
</template>

<script>
import { fixCMSNumber } from '@/utils';

export default {
  name: 'Occupation',
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
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      const { padding_top, padding_right, padding_bottom, padding_left } = this.config;
      const { background_color } = this.config.content;
      padding_top && !isNaN(padding_top) && (styles.paddingTop = `${fixCMSNumber(padding_top)}rpx`);
      padding_right && !isNaN(padding_right) && (styles.paddingRight = `${fixCMSNumber(padding_right)}rpx`);
      padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${fixCMSNumber(padding_bottom)}rpx`);
      padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${fixCMSNumber(padding_left)}rpx`);
      background_color && (styles.backgroundColor = background_color);
      return styles;
    },
    /**
     * 容器样式
     */
    containerStyles() {
      let styles = {};
      const { height } = this.config.content;
      height && !isNaN(height) && (styles.height = `${fixCMSNumber(height)}rpx`);
      return styles;
    }
  }
}
</script>

<style lang="scss">
  .occupation-wrapper {
    padding: 0; margin: 0;
    .occupation-container { padding: 0; margin: 0; }
  }
</style>
