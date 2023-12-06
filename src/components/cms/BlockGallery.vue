<template>
  <view class="block_gallery-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" v-if="config && config.content" :dataCmsId="config.id" >
    <view class="block_gallery-container">
      <block v-for="(item, index) in list" :key="index">
        <view class="block_gallery-tile" :style="toGalleryTileStyles(item)">
          <video
            v-if="item.video" class="block_gallery-video"
            :src="fixCMSPath(item.video)" muted="true" show-mute-btn="true"
            @load="onLoaded({ type: 'video', src: fixCMSPath(item.video) }, $event)"
            @error="onLoadedError({ type: 'video', src: fixCMSPath(item.video) }, $event)"
          />
          <image
            v-else-if="item.image"
            class="block_gallery-image" :webp="true"
            :src="fixCMSPath(item.image, 1125)" mode="widthFix" lazy-load="false"
            @load="onLoaded({ type: 'image', src: fixCMSPath(item.image, 1125) }, $event)"
            @error="onLoadedError({ type: 'image', src: fixCMSPath(item.image, 1125) }, $event)"
          />
          <view class="block_gallery-text" v-if="item.description">{{ item.description }}</view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { fixCMSPath, fixCMSNumber, objectArraySort } from '@/utils';
import mixins from "@/utils/mixins";

export default {
  name: "BlockGallery",
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
     * 数据源
     */
    list() {
      const availableItems = this.config.content.items&&this.config.content.items.filter(o => ['all', 'mobile'].includes(o.device));
      return objectArraySort(availableItems, 'sort');
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    fixCMSPath,
    /**
     * Gallery Item Styles
     */
    toGalleryTileStyles(item) {
      let styles = {};
      styles.width = '100%';
      // styles.width = `${item.width}%`;
      return styles;
    },
    /**
     * 初始化组件位置及事件
     */
    initComponent() {
      let images = 0, videos = 0;
      this.config.content.items&&this.config.content.items.forEach(o => {
        if (o.image && !o.video) {
          images++;
        } else if (o.video && !o.image) {
          videos++;
        }
      });
      this.$emit('ready', { images, videos, name: 'BlockGallery' });
    },
  },
}
</script>

<style lang="scss">
.block_gallery-wrapper {
  .block_gallery-container {
    box-sizing: border-box; width: 100%;
    .block_gallery-tile {
      .block_gallery-image { display: block; width: 100%; }
      .block_gallery-video { display: block; width: 100%; }
      & + .block_gallery-tile { margin-top: 32rpx; }
    }
    .block_gallery-text { padding: 32rpx; font-family: 'On DiatypeSemi Mono'; font-size: 32rpx; color: #000; line-height: 150%; }
  }
}
</style>
