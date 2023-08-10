<template>
  <view class="cms_layout-wrapper" :style="appearanceStyles" v-if="sorted">
    <template v-if="source && source.components && source.components.length">
      <component
        v-for="(node, index) in source.components" :key="index" :componentIndex="index"
        :is="node.component_type" :identifier="identifier" :config="node" :enableLazyLoad="enableLazyLoad" :original="source.components" :extras="extras" :isFullHeight="isFullHeight"
        @ready="onReady" @changePosition="onPositionChange"
      ></component>
    </template>
  </view>
</template>

<script>
import { guid, objectArraySort } from '@/utils';

export default {
  name: 'CMSLayout',
  props: {
    id: { type: String },
    source: { type: Object, required: true },
    isFullHeight: { type: Boolean, default: false },
    extras: { type: Object }
  },
  inject: {
    page:{default: {}}
  },
  components: {
    SingleText          : () => import('@/components/cms/SingleText.vue'),
    SingleImage         : () => import('@/components/cms/SingleImage.vue'),
    SingleVideo         : () => import('@/components/cms/SingleVideo.vue'),
    HotWord             : () => import('@/components/cms/HotWord.vue'),
    Occupation          : () => import('@/components/cms/Occupation.vue'),
    ProductSlider       : () => import('@/components/cms/ProductSlider.vue'),
    MediaSlider         : () => import('@/components/cms/MediaSlider.vue'),
    ImageNavigation     : () => import('@/components/cms/ImageNavigation.vue'),
    Announcement        : () => import('@/components/cms/Announcement.vue'),
    Accordion           : () => import('@/components/cms/Accordion.vue'),
    Elevator            : () => import('@/components/cms/Elevator.vue'),
    QuickFact           : () => import('@/components/cms/QuickFact.vue'),
    BlockGallery        : () => import('@/components/cms/BlockGallery.vue'),
    ShopTheLook         : () => import('@/components/cms/ShopTheLook.vue'),
    ProductDetailList   : () => import('@/components/cms/ProductDetailList.vue'),
    HighlightCard       : () => import('@/components/cms/HighlightCard.vue'),
    ShortFormStoryBanner: () => import('@/components/cms/ShortFormStoryBanner.vue'),
    Ticker              : () => import('@/components/cms/Ticker.vue'),
    KeyFeature          : () => import('@/components/cms/KeyFeature.vue'),
    TabSlider          : () => import('@/components/campaign/TabSlider.vue'),
  },
  data() {
    return {
      sorted: false,
      medias: []
    };
  },
  computed: {
    identifier() {
      return this.id|| guid();
    },
    /**
     * 外观样式
     * @see https://onrunning.atlassian.net/wiki/spaces/COC/pages/1881341965?focusedCommentId=1904050407
     */
    appearanceStyles() {
      let styles = {};
      const { background_color } = this.source;
      background_color && (styles.backgroundColor = background_color);
      // styles.marginTop = '-2rpx'
      // styles.marginBottom = '4rpx'
      return styles;
    },
    /**
     * 是否有 `Elevator` 组件
     */
    hasElevator() {
      return this.source?.components?.find(o => o.component_type === "Elevator") ? true : false;
    },

    /**
     * 是否启用 `LazyLoad`
     */
    enableLazyLoad() {
      return this.hasElevator ? false : true;
    },
    /**
     * 媒体组件数量
     */
    mediaComponentCount() {
      // 有媒体资源的组件名称数组
      const mediaComponentNames = ['SingleImage', 'SingleVideo', 'ImageNavigation', 'MediaSlider', 'ProductSlider'];
      let count = 0;
      this.source?.components?.forEach(o => {
        if (mediaComponentNames.includes(o.component_type)) count++;
      });
      return count;
    }
  },
  beforeDestroy() {
    this.$store.commit('setResources', { images: 0, videos: 0 });
  },
  methods: {
    initComponent() {
      objectArraySort(this.source.components, 'sort', 'asc');
      this.sorted = true;
    },
    onReady(res) {
      const { images = 0, videos = 0, name } = res;
      this.medias.push({ images, videos });
      // 媒体资源组数量等于媒体组件数量
      if (this.medias.length === this.mediaComponentCount) {
        let imageCount = 0, videoCount = 0;
        this.medias.forEach(o => {
          imageCount += o.images;
          videoCount += o.videos;
        });
        this.$emit('mediaReady',this.identifier);
        this.$store.commit('setResources', { images: imageCount, videos: videoCount });
      }
    },
    onPositionChange(fixed) {
      this.$emit('changePosition', fixed);
    }
  },
  watch: {
    source: {
      immediate: true,
      handler() {
        this.initComponent();
      }
    }
  }
}
</script>

<style>

</style>
