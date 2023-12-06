<template>
  <view class="short_form_story_banner-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" :dataCmsId="config.id">
    <view class="short_form_story_banner-container"  >
      <image class="background_image_mobile" :src="fixCMSPath(config.content.background_image_mobile, 1125)" mode="widthFix" lazy-load="false" @load="onLoaded({ type: 'image', src: fixCMSPath(config.content.background_image_mobile, 1125) }, $event)"/>
      <view class="info_box">
        <view class="headline">
          {{ config.content.headline }}
        </view>
        <view class="subheadline">
          {{ config.content.subheadline }}
        </view>
        <view class="btn_wrapper"  >
          <view
          :class="['btn_box', fadeFlag ? 'animated fadeOutLeft' : 'animated fadeInLeft']"
          >
            <image class="button_image" :webp="true" :src="fixCMSPath(config.content.button_image, 108)" mode="widthFix" />
            <view class="button_text"  >
              {{ config.content.button_text }}
            </view>
            <image class="button_icon" src="@/assets/images/icons/open.svg" mode="aspectFit" @tap="showSwiperBox" />
          </view>
          <view
            :class="['btn_box btn_box_2', !fadeFlag ? 'animated fadeOutRight' : 'animated fadeInRight']"
          >
            <view class="btn_bg">
              <image class="button_icon" src="@/assets/images/icons/close_white_bg_black.svg" mode="aspectFit" @tap="showSwiperBox" />
            </view>
            <view class="button_text"  >
              {{ config.content.button_text }}
            </view>
          </view>
        </view>
      </view>
      <view
      :class="['short_form_story_banner_swiper_box', !fadeFlag ? 'animated fadeOutRight' : 'animated fadeInRight']"
      >
        <swiper class="card_swiper" :circular="false" @change="onSwiperChange">
          <swiper-item class="card_swiper-item" v-for="(item, index) in config.content.cards" :key="index">
            <view class="card_item" :style="cardStyles(item)" @tap.stop="actionHandler(item.link ? { type: 'link', data: item.link } : null)">
              <image class="card_image" :webp="true" :src="fixCMSPath(item.background_image, 834)" mode="widthFix" />
              <view class="card_text_box" :style="textStyles(item)">
                {{item.item_text}}
              </view>
            </view>
          </swiper-item>
        </swiper>
      </view>
    </view>
  </view>
</template>

<script>
  import Taro from '@tarojs/taro';
  import {
    fixCMSPath,
    fixCMSNumber
  } from '@/utils';
  import mixins from "@/utils/mixins";

  export default {
    name: "ShortFormStoryBanner",
    mixins: [mixins],
    components: {

    },
    props: {
      identifier: {
        type: String,
        required: true
      },
      config: {
        type: Object,
        required: true
      }
    },
    computed: {
      /**
       * 外观样式
       */
      appearanceStyles() {
        let styles = {};
        const {
          padding_top,
          padding_right,
          padding_bottom,
          padding_left
        } = this.config;
        padding_top && !isNaN(padding_top) && (styles.paddingTop = `${fixCMSNumber(padding_top)}rpx`);
        padding_right && !isNaN(padding_right) && (styles.paddingRight = `${fixCMSNumber(padding_right)}rpx`);
        padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${fixCMSNumber(padding_bottom)}rpx`);
        padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${fixCMSNumber(padding_left)}rpx`);
        return styles;
      },
    },
    data() {
      return {
        fadeFlag:false
      };
    },
    mounted() {
      this.initComponent();
    },
    methods: {
      fixCMSPath,
      showSwiperBox() {
        this.fadeFlag = !this.fadeFlag
      },
      onSwiperChange(){

      },
      // 卡片样式
      cardStyles(item){
        console.log(item)
        let styles = {};
        item.height && !item.background_image && (styles.height = fixCMSNumber(item.height)+'rpx')
        item.background_color && (styles.backgroundColor = item.background_color)
        return styles
      },
      textStyles(item){
        let styles = {};
        item.font_size && (styles.fontSize = fixCMSNumber(item.font_size)+'rpx')
        item.font_color && (styles.color = item.font_color)
        if(item.text_align  == "top"){
          styles.position = 'absolute'
          styles.top = '0'
        }else{
          styles.position = 'absolute'
          styles.bottom = '0'
        }
        return styles
      },
      /**
       * 初始化组件位置及事件
       */
      initComponent() {
        this.$emit('ready', { name: 'ShortFormStoryBanner', images: this.config?.content?.items?.length + 1});
      },
    }
  }
</script>

<style lang="scss">
  .short_form_story_banner-wrapper {
    .short_form_story_banner-container{
      width: 100%;
      position: relative;
      // height: 1280rpx;
      // overflow: hidden;
      filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.05)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1));
      .background_image_mobile{
        width:100%;
      }
      .info_box{
        width: 100%;
        // height:644rpx;
        background: linear-gradient(180deg, rgba(118, 118, 118, 0) 0%, rgba(0, 0, 0, 0.45) 53.13%, rgba(0, 0, 0, 0.65) 100%);
        padding:160rpx 48rpx 64rpx 48rpx;
        box-sizing: border-box;
        position: absolute;
        left:0;
        bottom:0;
        .headline{
          font-family: 'On Diatype Standard';
          font-style: normal;
          font-weight: 500;
          font-size: 66rpx;
          line-height: 120%;
          color: #FFFFFF;
        }
        .subheadline{
          font-family: 'On Diatype Standard';
          font-style: normal;
          font-weight: 400;
          font-size: 40rpx;
          line-height: 150%;
          color: #FFFFFF;
          margin-top: 16rpx;
        }
        .btn_wrapper{
          width:568rpx;
          height:96rpx;
          margin-top: 48rpx;
          position: relative;
        }
        .btn_box{
          position: absolute;
          left:0;
          top:0;
          width:568rpx;
          height:96rpx;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          padding: 12rpx 24rpx 12rpx 12rpx;
          background: #DAD8D2;
          box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.05), 0px 8px 16px rgba(0, 0, 0, 0.1);
          border-radius: 48rpx;
          // margin-top: 48rpx;
          &.btn_box_2{
            background: transparent;
            .btn_bg{
              width:96rpx;
              height:96rpx;
              border-radius: 50%;
              background: #000;
              display: flex;
              align-items: center;
              justify-content: center;
              .button_icon{
                width:48rpx;
                height:48rpx;
              }
            }
            .button_text{
              color: #FFFFFF;
            }
          }
          .button_image{
            width:72rpx;
            height: 72rpx;
            border-radius: 50%;
          }
          .button_text{
            flex:1;
            padding:0 24rpx;
            font-family: 'On Diatype Standard';
            font-style: normal;
            font-weight: 500;
            font-size: 32rpx;
            line-height: 125%;
            color: #000000;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .button_icon{
            width:48rpx;
            height:48rpx;
          }

        }
      }
      .short_form_story_banner_swiper_box{
        width:100%;
        height:960rpx;
        position: absolute;
        top:64rpx;
        left:0;
        .card_swiper{
          width:100%;
          height:100%;
          .card_swiper-item{
            width:100%;
            // height:100%;
            padding: 0 32rpx;
            box-sizing: border-box;
            .card_item{
              width:100%;
              // height:100%;
              // padding:64rpx 48rpx;
              filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.05)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1));
              border-radius: 16rpx;
              overflow: hidden;
              position: relative;
              .card_image{
                width:100%;
                border-radius: 16rpx;
                display: block;
              }
              .card_text_box{
                width:100%;
                padding:64rpx 48rpx;
                box-sizing: border-box;
                font-family: 'On Diatype Standard';
                font-style: normal;
                font-weight: 500;
                line-height: 120%;
                display: flex;
                align-items: flex-end;
              }
            }
          }
        }
      }
    }
  }
</style>
