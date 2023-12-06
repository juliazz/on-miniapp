<template>
  <view :class="['base_item-wrapper', isFeaturedCard ? 'featuredCard' : '']" v-if="source && source.colors">
    <view class="base_item-inner" @tap="onViewInfo" >
      <view class="base_item-image--wrap" :style="innerImageStyles">
        <block v-if="imageSrc">
          <image class="base_item-image" mode="widthFix" :webp="true" :src="fixCMSPath(imageSrc, 456)"
            :lazy-load="enableLazyLoad" :show-menu-by-longpress="true"
            @load="onLoaded({ type: 'image', src: fixCMSPath(imageSrc, 456) }, $event)"
            @error="onLoadedError({ type: 'image', src: fixCMSPath(imageSrc, 456) }, $event)" />
        </block>
      </view>
      <view class="base_item-intro">
        <view class="base_item-en_name ff_ods text-one_line">{{ source.style_display_name }}</view>
        <view class="base_item-skus" v-if="source.colors.gender_cn || source.colors.color_name_cn">{{
          source.colors.gender_cn
        }} {{ source.colors.color_name_cn }}</view>
        <view class="base_item-cn_name text-tow_line">{{ source.style_short_description_cn }}</view>
        <view class="base_item-price flex_hfs_vfe">
          <text class="sale_price ff_ods">¥ {{ numFormat(source.colors.price) }}</text>
          <text class="original_price ff_ods"
            v-if="source.colors.original_price && source.colors.original_price != source.colors.price">¥ {{
              numFormat(source.colors.original_price) }}</text>
        </view>
      </view>
      <block v-if="Array.isArray(source.colors.tags) && source.colors.tags.length">
        <view class="base_item-tag" :style="{ color: tagColor, backgroundColor: tagBgColor }"
          v-if="source.colors.tags[0]">{{ source.colors.tags[0] }}</view>
      </block>
      <view class="collect-wrapper flex_abs_center" :style="{ backgroundColor: 'transparent' }" v-if="enableFavorite">
        <image class="base_item-collect" mode="widthFix" src="@/assets/images/icons/heart-fill@2x.png"
          @tap.stop="onToggleFavorite" v-if="isCollected" />
        <image class="base_item-collect" mode="widthFix" src="@/assets/images/icons/heart-empty@2x.png"
          @tap.stop="onToggleFavorite" v-else />
      </view>
    </view>
  </view>
</template>

<script>
import Taro,{eventCenter,getCurrentInstance, nextTick} from '@tarojs/taro';
import { isImagePath, fixCMSPath, fixColorThumbnail, numFormat} from '@/utils';
import mixins from "@/utils/mixins";

export default {
  name: 'BaseItem',
  mixins: [mixins],
  props: {
    /**
     * 商品数据
     */
    source: { type: Object, required: true },
    /**
     * 是否启用收藏管理的功能
     */
    enableFavorite: { type: Boolean, default: true },
    /**
     * `Tag` 字色
     */
    tagColor: { type: String, default: '#000' },
    /**
     * `Tag` 背景色
     */
    tagBgColor: { type: String, default: '#FBF7F6' },
    /**
     * `收藏` Icon 背景色
     */
    iconBgColor: { type: String, default: '#FBF7F6' },
    /**
     * 是否启用 `LazyLoad`
     */
    enableLazyLoad: { type: Boolean, default: true },
    /**
     * 是否是特色产品卡片
     * - 卡片: 圆角 & 阴影
     * - 图片: 渐变背景
     */
    isFeaturedCard: { type: Boolean, default: false },
  },
  computed: {
    /**
     * 图片的容器样式
     */
    innerImageStyles() {
      let styles = {};
      const type = this.source.style_product_type; // `shoes`, `apparel`, `accessories`
      if (type !== 'shoes') { //
        styles.padding = `0 0 100%`;
      }
      return styles;
    },
   
    /**
     * 图片地址
     */
    imageSrc() {
      return fixColorThumbnail(this.source?.colors);
    },
    /**
     * 收藏状态
     */
    isCollected() {
      return this.$store.state.favPids.includes(this.source.spu);
    }
  },
  data() {
    return {
      _observer:{}
    };
  },
  pageLifetimes: {
    show() {
      this.reload();
    }
  },
  created() {
    // if (this._observer) {
    //   this._observer.disconnect();
    // }
    // setTimeout(() => {
    //   const  page = Taro.getCurrentInstance().page
    //   this._observer = Taro.createIntersectionObserver(page, { thresholds: [0], observeAll: true })
    //   this._observer.relativeToViewport({bottom:0}).observe('.base_item-inner', res => {
    //     if (res.intersectionRatio > 0) {
    //       const {boundingClientRect,intersectionRatio} =res
    //       console.log('进入视图222','boundingClientRect',boundingClientRect,'intersectionRatio',intersectionRatio);
    //       const { style_slug, name } = this.source;
    //       //  有数埋点 商品曝光
    //     this.$store.state.globalData.SR.track('expose_sku_component',
    //       {
    //         "sku": {
    //           "sku_id": style_slug, // 若商品无sku_id时，可传spu_id信息
    //           "sku_name": name // 若商品无sku_name时，可传spu_name信息
    //         },
    //         "spu": {
    //           "spu_id": style_slug, // 若商品无spu_id时，可传sku_id信息
    //           "spu_name": name // 若商品无spu_name时，可传sku_name信息
    //         }
    //       })
    //     }
    //   });
    // },2000)
  },
  destroyed() {
    if (this._observer) {
      this._observer.disconnect();
    }
  },
  methods: {
    fixCMSPath,
    fixColorThumbnail,
    numFormat,
    // 进入PDP
    onViewInfo() {
      const { style_slug, product_slug } = this.source.colors;
      const { name,style_display_name } = this.source;
      console.log('this.source-----',this.source)
      if (style_slug && product_slug) {
        Taro.navigateTo({
          url: `/subpages/pdp/index?style_slug=${style_slug}&product_slug=${product_slug}`
        });
        this.$store.state.globalData.SR.track('trigger_sku_component',
          {
            "sku": {
              "sku_id": style_slug, // 若商品无sku_id时，可传spu_id信息
              "sku_name": name ||style_display_name// 若商品无sku_name时，可传spu_name信息
            },
            "spu": {
              "spu_id": style_slug, // 若商品无spu_id时，可传sku_id信息
              "spu_name": name ||style_display_name// 若商品无spu_name时，可传sku_name信息
            }
          })
      } else {
        console.warn('@onViewInfo::', this.source);
      }
    },
    // 切换收藏状态
    onToggleFavorite() {
      const spu = this.source?.spu;
      if (spu) {
        this.$store.dispatch('ToggleFavorite', {
          args: { spu },
          callback: () => {
            this.$emit('favoriteChange');
          }
        });
      } else {
        console.warn('@BaseItem.onToggleFavorite::', this.source);
      }
    }
  }
}
</script>

<style lang="scss">
.base_item-wrapper {
  width: 100%;

  .base_item-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    .base_item-image--wrap {
      width: 100%;
      height: 0;
      overflow: hidden;
      padding: 64rpx 32rpx calc(100% - 64rpx);

      .base_item-image {
        width: 100%;
        height: 100%;
      }
    }

    .base_item-intro {
      width: 100%;
      padding: 0 32rpx 32rpx;

      .base_item-en_name {
        width: 100%;
        font-size: 28rpx;
        color: #000;
        font-weight: 700;
        line-height: 150%;
        margin-top: 24rpx;
      }

      .base_item-skus {
        width: 100%;
        font-size: 24px;
        color: #797771;
        font-weight: 400;
        line-height: 150%;
        margin-top: 8rpx;
      }

      .base_item-cn_name {
        width: 100%;
        font-size: 28rpx;
        color: #000;
        line-height: 150%;
        margin-top: 8rpx;
        height: 84rpx;
      }

      .base_item-price {
        width: 100%;
        padding: 4rpx 0;
        margin-top: 16rpx;

        .sale_price {
          font-size: 28rpx;
          color: #000;
          letter-spacing: 0.04em;
          line-height: 1;
        }

        .original_price {
          font-size: 28rpx;
          color: #B2B2B2;
          line-height: 1;
          text-decoration-line: line-through;
          margin-left: 24rpx;
        }
      }
    }

    .base_item-tag {
      height: 48rpx;
      padding: 16rpx 20rpx;
      background: #FBF7F6;
      border-radius: 40rpx;
      font-size: 20rpx;
      color: #000;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      line-height: 1;
      position: absolute;
      top: 16rpx;
      left: 16rpx;
    }

    .collect-wrapper {
      width: 48rpx;
      height: 48rpx;
      border-radius: 50%;
      position: absolute;
      top: 16rpx;
      right: 16rpx;
    }

    .base_item-collect {
      width: 32rpx;
      height: auto;
    }
  }

  // 特色产品卡片
  &.featuredCard {
    background-color: #FFF;
    overflow: hidden;
    border-radius: 16rpx;
    box-shadow: 0px 0px 2rpx rgba(0, 0, 0, 0.05), 0px 8rpx 16rpx rgba(0, 0, 0, 0.1);

    .base_item-inner {
      .base_item-image--wrap {
        border-radius: 16rpx 0;
        background: linear-gradient(180deg, #F0ECEB 0%, #FFFFFF 100%);
      }
    }
  }
}
</style>
