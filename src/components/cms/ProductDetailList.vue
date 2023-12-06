<template>
  <view class="product_detail_list-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" :dataCmsId="config.id">
    <view class="product_detail_list-container" :style="containerStyles">
      <image class="product_detail_list_img" :webp="true" :src="fixCMSPath(config.content.background_image_mobile, 1029)" mode="widthFix" lazy-load="false" @load="onLoaded({ type: 'image', src: fixCMSPath(item.background_image, 1029) }, $event)"/>
      <view class="product_detail_list_text_box" hover-class="none" hover-stop-propagation="false">
        <view class="product_detail_list_text" v-for="(item, index) in config.content.items" :key="index">
          {{item}}
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { fixCMSPath, fixCMSNumber } from '@/utils';
import mixins from "@/utils/mixins";
export default {
  name: "productDetailList",
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
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    fixCMSPath,
    initComponent() {
      this.$emit('ready', { name: 'ProductDetailList', images: 1});
    },
  }
}
</script>

<style lang="scss">
.product_detail_list-container{
  position: relative;
  .product_detail_list_img{
    width:100%;
  }
  .product_detail_list_text_box{
    margin: -268rpx auto 0;
    width:686rpx;
    box-sizing: border-box;
    padding: 32rpx 48rpx;
    background-color: #000;
    position: relative;
    z-index: 1;
    .product_detail_list_text{
      padding:32rpx 0;
      position: relative;
      font-family: 'On Diatype Standard';
      font-style: normal;
      font-weight: 400;
      font-size: 40rpx;
      line-height: 150%;
      color: #FAF7F6;
      &:last-child{
        &::after{
          display: none;
        }
      }
      &::after{
        display: block;
        content: '';
        width:100%;
        height: 4rpx;
        background-image: linear-gradient(to right, #767676 0%, #767676 20%, transparent 0% );
        background-size: 20rpx 4rpx;
        background-repeat: repeat-x;
        position: absolute;
        bottom: 0;
        left:0;
      }
    }
  }
}
</style>

