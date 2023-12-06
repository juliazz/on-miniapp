<template>
  <view :class="['accordion-wrapper']" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" :dataCmsId="config.id"
  v-if="config && config.content && config.content.items">
    <view class="accordion-container">
      <view class="accordion-inner">
        <view :class="['accordion_item', index === activeIndex ? 'active' : '']" v-for="(item, index) in config.content.items" :key="index">
          <view class="accordion_item-header" @tap="toggle(item, index)">
            <view class="accordion_item-title">{{ item.title }}</view>
            <image class="accordion_item-icon" mode="widthFix" src="@/assets/images/icons/pop_close_icon.svg" />
          </view>
          <view class="accordion_item-content">
            <view class="accordion_item-html">
              <rich-text class="accordion_item-html--inner" :nodes="item.content"></rich-text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import { fixCMSNumber } from '@/utils/';
export default {
  name: 'Accordion',
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
  data() {
    return {
      activeIndex: -1
    };
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
    toggle(item, index) {
      this.activeIndex = this.activeIndex == index ? -1 : index;
    }
  }
}
</script>

<style lang="scss">
  .accordion-wrapper {
    width: 100%; padding: 0 32rpx; margin: 0;
    .accordion-container {
      .accordion-inner {
        .accordion_item {
          border-bottom: 2rpx solid #000;
          .accordion_item-header {
            padding: 32rpx 0;
            padding-right: 32rpx;
            display: flex; justify-content: space-between; align-items: center;
            .accordion_item-title { font-size: 40rpx; color: #000; font-weight: 500; line-height: 1; }
            .accordion_item-icon {
              width: 48rpx; height: 48rpx; transition: all 0.1s linear;transform: rotate(45deg);
              font-size: 32rpx; color: #999; line-height: 1; text-align: center;
            }
          }
          .accordion_item-content {
            height: 0; max-height: 0; visibility: hidden; transition: max-height 0.1s linear;
            .accordion_item-html {
              padding:32rpx 0 80rpx;
              .accordion_item-html--inner { text-align: left; }
            }
          }
          //
          &.active {
            .accordion_item-header {
              .accordion_item-icon { transform: rotate(0deg); }
            }
            .accordion_item-content { height: auto; max-height: 100vh; visibility: visible; }
          }
        }
      }
      .rich_text_container{
        .rich_text_title{
          font-weight: 600;
          // padding-right: 32rpx;
        }
      //       padding: 8px 16px 40px;
      //       font-style: normal;
      //       font-weight: 400;
      //       font-size: 16px;
      //       line-height: 150%;
      //       color: #000000;
      //   }
      //   .rich_text_title{
      //       font-style: normal;
      //       font-weight: 500;
      //       font-size: 16px;
      //       color:#000;
      //   }
      //   .rich_text_p{
      //       padding:0;
      //       color:#000;
      //       margin-top: 8px;
      //   }
        .rich_text_li{
            color:#000;
            list-style:circle;
            margin-top: 16rpx;
            position: relative;
            margin-left: -20rpx;
        }
        .rich_text_li::before{
            // display: block;
            // content: '';
            // width:7px;
            // height: 7px;
            // border: 1px solid #000000;
            // position: absolute;
            // top:16px;
            // left:-37px;
            /* left:-30px; */
            // transform: rotate(45deg);
            }
        }
    }
  }
</style>
