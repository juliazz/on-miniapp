<template>
  <view class="high_light_card-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" v-if="config && config.content" :dataCmsId="config.id">
    <view class="high_light_card-container">
      <block v-for="(item, index) in config.content.items" :key="index">
        <view class="high_light_card-box">
          <view :class="['high_light_card-info' ,'color_'+item.style]" hover-class="none" hover-stop-propagation="false">
            <view>
              <text class="high_light_card-title">{{item.headline}}</text>
            </view>
            <view>
              <text class="high_light_card-sub-title">{{item.sub_headline}}</text>
            </view>
            <image v-if="item.style == 1|| item.style == 3" class="icon_open" src="@/assets/images/icons/open_white.svg" mode="aspectFit" lazy-load="false"  :data-item="item" @tap.stop="showPop"/>
            <image v-else class="icon_open" src="@/assets/images/icons/open_black.svg" mode="aspectFit" lazy-load="false" :data-item="item" @tap.stop="showPop"/>
          </view>
          <image class="high_light_card-image" :webp="true" :src="fixCMSPath(item.background_image, 1029)" mode="widthFix" lazy-load="false" @load="onLoaded({ type: 'image', src: fixCMSPath(item.background_image, 1029) }, $event)"/>
          <view class="quick_facts_info" v-show="item.popFlag">
            <view class="text_box" hover-class="none" hover-stop-propagation="false">
              {{item.active_text}}
            </view>
            <image class="pop_close" src="@/assets/images/icons/close_white.svg" mode="widthFix" lazy-load="false" :data-item="item" @tap.stop="closePop"/>
          </view>
        </view>
      </block>
    </view>
  </view>
</template>

<script>
import { fixCMSPath, fixCMSNumber } from '@/utils';
import mixins from "@/utils/mixins";

export default {
  name: "HighlightCard",
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
  created(){
    this._props.config.content.items.forEach(v=>{
      this.$set(v,'popFlag',false)
    })
  },
  data() {
    return {
    }
  },
  mounted() {
    this.initComponent();
  },
  methods: {
    fixCMSPath,
    /**
     * 按钮样式
     */
    showPop(e){
      let _item = e.currentTarget.dataset.item
      _item.popFlag = true
    },
    closePop(e){
      let _item = e.currentTarget.dataset.item
      _item.popFlag = false
    },
    /**
     * 初始化组件位置及事件
     */
    initComponent() {
      this.$emit('ready', { name: 'HighlightCard', images: this.config?.content?.items?.length});
    },
  }
}
</script>

<style lang="scss">
  .high_light_card-container {
    box-sizing: border-box; width: 100vw; padding: 0 32rpx;
    .high_light_card-box {
      box-sizing: border-box; width: 100%; border-radius: 8px; overflow: hidden; position: relative;
      .high_light_card-image { display: block; width:100%; }
      .high_light_card-info {
        box-sizing: border-box; width: 100%; padding: 160rpx 48rpx 176rpx; position: absolute; bottom: 0; left: 0;
        // 0 = 黑字 + 白渐变
        &.color_0 { color:#000; background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.6) 53.13%, rgba(255, 255, 255, 0.8) 100%); }
        // 1 = 白字 + 黑渐变
        &.color_1 { color:#FFF; background: linear-gradient(180deg, rgba(118, 118, 118, 0) 0%, rgba(0, 0, 0, 0.45) 53.13%, rgba(0, 0, 0, 0.65) 100%); }
        // 2 = 黑字 + 无渐变
        &.color_2 { color:#000; background: transparent; }
        // 3 = 白字 + 无渐变
        &.color_3 { color:#FFF; background: transparent; }
        .icon_open { width: 96rpx; height: 96rpx; position: absolute; bottom: 48rpx; right: 48rpx; }
      }
      .high_light_card-title { font-family: 'On Diatype Standard'; font-size: 52rpx; font-weight: 500; letter-spacing: -0.01em; line-height: 120%; }
      .high_light_card-sub-title { font-family: 'On Diatype Standard'; font-size: 40rpx; font-weight: 500; line-height: 130%; margin-top: 16rpx; }
      .quick_facts_info {
        box-sizing: border-box; width: 100%; height: 100%; padding: 64rpx 48rpx 168rpx; background-color: #000;
        font-family: 'On Diatype Standard'; font-size: 40rpx; color: #FFF; line-height: 150%;
        position: absolute; top: 0; left: 0; z-index: 2;
        .text_box { width: 100%; height: 100%; overflow-y: scroll; }
        .pop_close { width: 96rpx; height: 96rpx; position: absolute; bottom: 48rpx; right: 48rpx; }
      }
      //
      & + .high_light_card-box { margin-top: 32rpx; }
    }
  }
</style>

