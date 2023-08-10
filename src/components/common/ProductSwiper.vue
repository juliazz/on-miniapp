<template>
  <view class="product_swiper-wrapper" :style="appearanceStyles">
    <view class="product_swiper-header">{{ title }}</view>
    <view class="product_swiper-inner" v-if="Array.isArray(list) && list.length">
      <swiper class="swiper-cls" :circular="true" @change="onSwiperChange" :current="activeIndex">
        <block v-for="(frame, frameIndex) in list" :key="frameIndex">
          <swiper-item class="swiper_item-cls">
            <view class="swiper_item-inner">
              <block v-for="(item, index) in frame" :key="index">
                <view class="swiper_item-tile" :style="itemStyles">
                  <BaseItem :source="item" :tagColor="tagColor" :tagBgColor="tagBgColor" :iconBgColor="iconBgColor"  :enableFavorite="enableFavorite" />
                </view>
              </block>
            </view>
          </swiper-item>
        </block>
      </swiper>
      <view class="swiper-scrollbar" v-if="list.length>1">
        <view class="scrollbar">
          <view class="scrollbar-inner" :style="scrollbarInnerStyles"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import BaseItem from '@/components/common/BaseItem.vue';
import { arrayTranslater } from '@/utils';

export default {
  name: 'ProductSwiper',
  components: { BaseItem },
  props: {
    items: { type: Array, required: true },
    options: {
      type: Object,
      default: () => ({
        title: '最近浏览',
        bgColor: '',
        itemBgColor: '',
        tagColor: '#FBF7F6',
        tagBgColor: 'white',
        iconBgColor: 'white',
        enableFavorite: true
      })
    }
  },
  data() {
    return {
      activeIndex: 0
    };
  },
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      const { bgColor } = this.options;
      let styles = {};
      bgColor && (styles.backgroundColor = bgColor);
      return styles;
    },
    /**
     * `产品卡片`背景颜色
     */
    itemStyles() {
      const { itemBgColor } = this.options;
      let styles = {};
      itemBgColor && (styles.backgroundColor = itemBgColor);
      return styles;
    },
    /**
     * `标题`
     */
    title() {
      const { title } = this.options;
      return title || "为你推荐";
    },
    /**
     * `产品卡片`的 `Tag` 文本颜色
     */
    tagColor() {
      const { tagColor } = this.options;
      return tagColor || "white";
    },
    /**
     * `产品卡片`的 `Tag` 背景颜色
     */
    tagBgColor() {
      const { tagBgColor } = this.options;
      return tagBgColor || "white";
    },
    /**
     * `产品卡片`的 `Icon` 背景颜色
     */
    iconBgColor() {
      const { iconBgColor } = this.options;
      return iconBgColor || "white";
    },
    /**
     * 是否启用`产品卡片`的`收藏`功能
     */
    enableFavorite() {
      const { enableFavorite } = this.options;
      return typeof enableFavorite === 'boolean' ? enableFavorite : true;
    },
    /**
     * 轮播数据
     */
    list() {
      if (Array.isArray(this.items) && this.items.length) {
        return arrayTranslater(this.items, 2);
      } else {
        return [];
      }
    },
    /**
     * 轮播项数量
     */
    size() {
      return this.list.length;
    },
    /**
     * 轮播项的平均宽度
     */
    itemAvgWidth() {
      return `${100 / this.size}`;
    },
    /**
     * 滚动条滑块样式
     */
    scrollbarInnerStyles() {
      let styles = {};
      styles.width = `${this.itemAvgWidth}%`;
      styles.left = `${this.activeIndex * this.itemAvgWidth}%`;
      return styles;
    }
  },
  methods: {
    onSwiperChange(evt) {
      this.activeIndex = evt.detail.current;
    }
  }
}
</script>

<style lang="scss">
  .product_swiper-wrapper {
    .product_swiper-header {
      padding: 32rpx 32rpx; font-size: 28rpx; color: #000; line-height: 150%;font-weight: 400;
    }
    .product_swiper-inner {
      .swiper-cls {
        width: 100%; height: 654rpx;
        .swiper_item-cls {
          width: 100%; height: 100%;
          .swiper_item-inner {
            width: 100%; height: 100%; display: flex; justify-content: space-between; align-items: stretch;
            .swiper_item-tile {
              width: 368rpx; background: #FAF7F6;
            }
          }
        }
      }
      .swiper-scrollbar {
        padding: 32rpx 0;
        .scrollbar {
          width: 400rpx; height: 1Px; margin: 0 auto 0; background: #CCC; position: relative;
          .scrollbar-inner {
            width: 40rpx; height: 2Px; background-color: #000; transition: all 0.1s linear;
            position: absolute; bottom: 0; left: 0;
          }
        }
      }
    }
  }
</style>
