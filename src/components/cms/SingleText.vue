<template>
  <view class="single_text-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" :dataCmsId="config.id">
    <view class="single_text-container" :style="containerStyles">
      <text
        class="single_text-inner" :style="contentStyles"
        @tap="actionHandler(config.content.link ? { type: 'link', data: config.content.link } : null)"
      >{{config.content.title}}</text>
    </view>
  </view>
</template>

<script>
import mixins from "@/utils/mixins";
import { fixCMSNumber } from '@/utils';

export default {
  name: 'SingleText',
  mixins: [mixins],
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
      padding_top && !isNaN(padding_top) && (styles.paddingTop = `${padding_top}px`);
      padding_right && !isNaN(padding_right) && (styles.paddingRight = `${padding_right}px`);
      padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${padding_bottom}px`);
      padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${padding_left}px`);
      background_color && (styles.backgroundColor = background_color);
      return styles;
    },
    /**
     * 容器样式
     */
    containerStyles() {
      let styles = {};
      const { text_align } = this.config.content;
      ['left', 'center', 'right'].includes(text_align) && (styles.textAlign = text_align);
      return styles;
    },
    /**
     * 内容样式
     */
    contentStyles() {
      let styles = {};
      const { font_size, font_color, font_style, font_weight, line_height, background_color } = this.config.content;
      font_size && !isNaN(font_size) && (styles.fontSize = `${fixCMSNumber(font_size)}rpx`);
      font_color && (styles.color = font_color);
      font_style && (styles.fontStyle = font_style);
      line_height && (styles.lineHeight = line_height);
      font_weight && (styles.fontWeight = font_weight);
      return styles;
    }
  }
}
</script>

<style lang="scss">
  .single_text-wrapper {
    .single_text-container {
      padding: 0 32rpx;
      .single_text-inner { line-height: 1; }
    }
  }
</style>
