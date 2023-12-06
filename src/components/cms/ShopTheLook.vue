<template>
  <view class="shop_the_look-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" v-if="config && config.content" :dataCmsId="config.id" >
    <view class="shop_the_look_box_type_1" v-if="config.content.style_type == 1">
      <view class="shop_the_look_box-top">
        <view class="eyebrow">{{ config.content.eyebrow }}</view>
        <view class="headline">{{ config.content.headline }}</view>
        <view class="subheadline">{{ config.content.subheadline }}</view>
        <!-- 按钮 -->
        <view v-if="config.content && Array.isArray(config.content.buttons) && config.content.buttons.length"
          class="btn-box" :style="btnGroupStyles">
          <button v-for="(btn, btnIdx) in config.content.buttons" :key="btnIdx" class="btn" :style="toStylesForBtn(btn)"
            @tap.stop="actionHandler({ type: 'link', data: btn.link })">
            {{ btn.text }}
          </button>
        </view>
      </view>
      <image class="background_image" :webp="true" :src="bgImage" mode="widthFix" @load="onLoaded({ type: 'image', src: bgImage }, $event)"/>
      <scroll-view class="product_cards-part" :scroll-x="true" v-if="list.length">
        <block v-for="(item, index) in list" :key="index">
          <view class="product_card">
            <BaseItem :source="item" :tagBgColor="config.content.tag_color || tagBgColor" :isFeaturedCard="true" />
          </view>
        </block>
      </scroll-view>
    </view>
    <view class="shop_the_look_box_type_2" v-if="config.content.style_type == 2">
      <image class="background_image" :webp="true" :src="bgImage" :mode="imageMode" @load="onImageLoaded"/>
      <view class="shop_the_look-info-box" hover-class="none" hover-stop-propagation="false">
        <view class="shop_the_look_box-top">
          <view class="eyebrow">{{ config.content.eyebrow }}</view>
          <view class="headline">{{ config.content.headline }}</view>
          <view class="subheadline">{{ config.content.subheadline }}</view>
          <!-- 按钮 -->
          <view v-if="config.content && Array.isArray(config.content.buttons) && config.content.buttons.length"
            class="btn-box" :style="btnGroupStyles">
            <button v-for="(btn, btnIdx) in config.content.buttons" :key="btnIdx" class="btn"
              :style="toStylesForBtn(btn)" @tap.stop="actionHandler({ type: 'link', data: btn.link })">
              {{ btn.text }}
            </button>
          </view>
        </view>
        <scroll-view class="product_cards-part" :scroll-x="true" v-if="list.length">
          <block v-for="(item, index) in list" :key="index">
            <view class="product_card" @tap="goPdp(item)">
              <view class="card_wrapper" hover-class="none" hover-stop-propagation="false">
                <image class="product_image" :webp="true" :src="fixCMSPath(fixColorThumbnail(item.colors), 168)" mode="aspectFit" />
                <view class="name_box" hover-class="none" hover-stop-propagation="false">
                  <view class="name" hover-class="none" hover-stop-propagation="false">
                    {{ item.style_display_name }}
                  </view>
                  <view class="price" hover-class="none" hover-stop-propagation="false">
                    ￥ {{ item.colors.price }}
                  </view>
                </view>
              </view>
            </view>
          </block>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import { fixCMSPath, fixCMSNumber, fixCMSPdtInfo, fixColorThumbnail } from '@/utils';
import ProductSwiperVue from '../common/ProductSwiper.vue';
import mixins from "@/utils/mixins";
import BaseItem from '@/components/common/BaseItem.vue';

export default {
  name: "ShopTheLook",
  mixins: [mixins],
  components: { ProductSwiperVue, BaseItem },
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
     * 按钮组样式
     */
    btnGroupStyles() {
      let styles = {};
      const { button_bottom_space } = this.config.content;
      button_bottom_space && !isNaN(button_bottom_space) && (styles.bottom = `${fixCMSNumber(button_bottom_space)}rpx`);
      return styles;
    },
    /**
     *
     */
    bgImage() {
      const { background_image_mobile, background_image_pc } = this.config.content;
      return fixCMSPath(background_image_mobile || background_image_pc, 1125);
    },
    /**
     *
     */
    list(){
      return fixCMSPdtInfo(this.config.content.items) || [];
    }
  },
  data() {
    return {
      recmdOptions: {
        itemBgColor: '#fff',
        tagBgColor: '#FAF7F6',
      },
      tagBgColor: '#FAF7F6',
      imageMode: ''
    };
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    fixCMSPath,
    fixColorThumbnail,
    //按钮样式
    toStylesForBtn(itemConfig) {
      let styles = {};
      const { color, background_color, border_color } = itemConfig;
      color && (styles.color = color);
      styles.backgroundColor = background_color;
      border_color && (styles.borderColor = border_color);
      return styles;
    },
    onImageLoaded(evt) {
      const baseRatio = 375 / 400;
      const { width, height } = evt.detail;
      const newRatio = width / height;
      this.imageMode = newRatio > baseRatio ? 'aspectFill' : 'widthFix';
      this.onLoaded({ type: 'image', src: this.bgImage }, evt);
    },
    goPdp(item) {
      Taro.navigateTo({
        url: `/subpages/pdp/index?style_slug=${item.style_slug}&product_slug=${item.colors.product_slug}`
      });
    },
    /**
     * 初始化组件位置及事件
     */
    initComponent() {
      this.$emit('ready', { name: 'ShopTheLook', images: 1});
    },
  }
}
</script>

<style lang="scss">
.shop_the_look-wrapper {
  .shop_the_look_box_type_1 {
    .shop_the_look_box-top {
      padding: 32rpx 32rpx 64rpx 32rpx; font-family: 'On Diatype Standard'; color: #000; font-style: normal; font-weight: 400;
      .eyebrow { font-size: 40rpx; line-height: 150%; }
      .headline { font-weight: 500; font-size: 66rpx; line-height: 120%; margin-top: 8rpx; }
      .subheadline { font-size: 40rpx; line-height: 150%; margin-top: 24rpx; }
      .btn-box {
        width: 100%; margin-top: 48rpx; display: flex; align-items: center;
        .btn { margin-right: 16rpx; background-color: #000; color: #FFF; }
      }
    }
    .background_image { width: 100%; }
    .product_cards-part {
      box-sizing: border-box; width: 100vw; height: 920rpx; margin-top: -272rpx; white-space: nowrap; position: relative; z-index: 1;
      .product_card {
        box-sizing: border-box; display: inline-block; width: 586rpx; height: 920rpx; margin-right: 32rpx;
        &:first-child { margin-left: 32rpx; }
      }
    }
  }
  .shop_the_look_box_type_2{
    position: relative;
    .background_image { width: 100%; min-height: 800rpx; }
    .shop_the_look-info-box{
      width: 100%; position: absolute; left: 0; bottom: 0;
      .shop_the_look_box-top {
        padding: 32rpx 32rpx 64rpx 32rpx; font-family: 'On Diatype Standard'; color: #FFF; font-style: normal; font-weight: 400; text-align: center;
        .eyebrow { font-size: 40rpx; line-height: 150%; }
        .headline { font-weight: 500; font-size: 66rpx; line-height: 120%; margin-top: 8rpx; }
        .subheadline { font-size: 40rpx; line-height: 150%; margin-top: 24rpx; }
        .btn-box {
          width: 100%; display: flex; align-items: center; justify-content: center; margin-top: 48rpx;
          .btn { margin: 0 8rpx; background-color: #FFF; color: #000; }
        }
      }
      .product_cards-part{
        box-sizing: border-box; width: 100vw; height: 192rpx; margin-top: 32rpx; position: relative; z-index: 1; white-space: nowrap;
        .product_card {
          box-sizing: border-box; display: inline-block; width: 586rpx; height: 128rpx; margin-right: 32rpx; padding:8rpx;
          background: linear-gradient(180deg, #F0ECEB 0%, #FFFFFF 100%); border-radius: 8rpx;
          &:first-child { margin-left: 32rpx; }
          .card_wrapper{
            width: 100%; height: 100%; display: flex; align-items: center;
              .product_image { width: 112rpx; height: 112rpx; margin-right: 24rpx; }
              .name_box {
                .name {
                  width: 410rpx; overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
                  font-family: 'On Diatype Standard'; font-size: 32rpx; color: #000; font-style: normal; font-weight: 700; line-height: 150%;
                }
                .price { font-family: 'On DiatypeSemi Mono'; font-size: 28rpx; color: #000; font-style: normal; font-weight: 400; line-height: 130%; margin-top: 8rpx; }
              }
          }
        }
      }
    }
  }
}
</style>
