<template>
  <view class="key_feature-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" v-if="config && config.content" :dataCmsId="config.id" >
    <view class="key_feature-container" :style="containerStyles">
      <view class="key_feature-media">
        <video
          v-if="config.content.video_mobile" class="key_feature-video"
          :src="fixCMSPath(config.content.video_mobile)" muted="true" show-mute-btn="true"
          @load="onLoaded({ type: 'video', src: fixCMSPath(config.content.video_mobile) }, $event)"
          @error="onLoadedError({ type: 'video', src: fixCMSPath(config.content.video_mobile) }, $event)"
        />
        <image
          v-else-if="config.content.image_mobile"
          class="key_feature-image" :webp="true"
          :src="fixCMSPath(config.content.image_mobile, 1125)" mode="widthFix" lazy-load="false"
          @load="onLoaded({ type: 'image', src: fixCMSPath(config.content.image_mobile, 1125) }, $event)"
          @error="onLoadedError({ type: 'image', src: fixCMSPath(config.content.image_mobile, 1125) }, $event)"
        />
      </view>
      <view class="key_feature-items" v-if="Array.isArray(availableItems) && availableItems.length">
        <block v-for="(item, index) in availableItems" :key="index">
          <view class="key_feature-item" v-if="item.description">{{ item.description }}</view>
        </block>
      </view>
    </view>
  </view>
</template>

<script>
import { fixCMSPath, fixCMSNumber } from '@/utils';
import mixins from "@/utils/mixins";
export default {
  name: "KeyFeature",
  mixins: [mixins],
  props: {
    identifier: { type: String, required: true },
    config: { type: Object, required: true }
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
     * 容器样式
     */
    containerStyles() {
      let styles = {};
      return styles;
    },
    /**
     * 可用的项
     */
    availableItems() {
      return this.config?.content?.items?.filter(o => !!o.description);
    }
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    fixCMSPath,
    initComponent() {
      let images = this.config.content.image_mobile ? 1 : 0, videos = this.config.content.video_mobile ? 1 : 0;
      this.$emit('ready', { name: 'KeyFeature', images, videos });
    },
  }
}
</script>

<style lang="scss">
.key_feature-container {
  position: relative;
  .key_feature-media {
    .key_feature-image { display: block; width: 100%; }
    .key_feature-video { display: block; width: 100%; }
  }
  .key_feature-items {
    box-sizing: border-box; width: 686rpx; padding: 64rpx 48rpx; margin: -272rpx auto 0; background-color: #000; position: relative; z-index: 1;
    .key_feature-item {
      padding: 28rpx 0 32rpx 0; font-family: 'On Diatype Standard'; font-size: 40rpx; color: #FAF7F6; line-height: 150%; position: relative;
      &:last-child {
        &::after { display: none; }
      }
      &::after {
        content: ''; display: block; width: 100%; height: 4rpx; position: absolute; bottom: 0; left:0;
        background-image: linear-gradient(to right, #767676 0%, #767676 20%, transparent 0%);
        background-size: 20rpx 4rpx; background-repeat: repeat-x;
      }
    }
  }
}
</style>

