<template>
  <view class="hot_word-wrapper" :style="appearanceStyles" :id="`_${identifier}_${config.id}`">
    <view class="hot_word-container">
      <!-- <view class="hot_word-header">{{config.content.name}}</view> -->
      <scroll-view class="hot_word-items" :scroll-x="true" :show-scrollbar="false">
        <view class="hot_word-lines">
          <view class="hot_word-row">
            <view
              :class="['hot_word-item', item.image ? '' : 'no-image']"
              v-for="(item, index) in config.content.items" :key="`2_${index}`"
              @tap.stop="actionHandler(item.link ? { type: 'link', data: item.link } : null)"
            >
              <view class="item_image-visual" v-if="item.image">
                <image mode="widthFix" :webp="true" :src="fixCMSPath(item.image, 90)" />
              </view>
              <view class="item_text">{{item.text}}</view>
            </view>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import { fixCMSPath, fixCMSNumber } from '@/utils';
import mixins from "@/utils/mixins";

export default {
  name: 'HotWord',
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
    }
  },
  methods: {
    fixCMSPath
  }
}
</script>

<style lang="scss">
  .hot_word-wrapper {
    text-align: left;
    .hot_word-container {
      .hot_word-header { padding-left: 32rpx; font-size: 52rpx; font-weight: 500; line-height: 1; }
      .hot_word-items {
        overflow-x: auto;
        .hot_word-lines {
          width: 1125rpx; white-space: pre-wrap; margin-left: 32rpx;
        }
        .hot_word-row {
          display: inline-block; margin-bottom: -24rpx;
          .hot_word-item {
            height: 96rpx; padding-left: 8rpx; padding-right: 48rpx; margin: 0 16rpx 32rpx 0; background: #F0ECEB; border-radius: 48rpx;
            display: inline-flex; justify-content: space-between; align-items: center;
            .item_image-visual {
              width: 80rpx; height: 80rpx; background: #FFFFFF; border-radius: 50%; overflow: hidden;
              image { width: 100%; height: auto; vertical-align: middle; }
            }
            .item_text { font-size: 28rpx; font-weight: 500; line-height: 1; }
            .item_image-visual + .item_text { margin-left: 24rpx; }
            &.no-image { padding-left: 48rpx; }
          }
          & + .hot_word-row { margin: 32rpx 0 0; }
        }
      }
    }
  }
</style>
