<template>
  <view class="quick_facts-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" v-if="config && config.content" :dataCmsId="config.id" >

    <view class="quick_facts-container">
      <block v-for="(item, index) in config.content.items" :key="index">
        <view class="quick_facts-box">
          <view class="quick_facts-title">{{item.title}}</view>
          <image class="icon_info" src="@/assets/images/icons/icon_info.svg" mode="widthFix" lazy-load="false" @tap.stop="showPop(item)"/>
          <view class="quick_facts-content" hover-class="none" hover-stop-propagation="false">
            {{item.content}}
            <view class="quick_facts-units" hover-class="none" hover-stop-propagation="false">
              {{item.measure_unit}}
            </view>
          </view>
          <image class="quick_facts-image" :webp="true" :src="fixCMSPath(item.image.image, 900)" mode="widthFix" lazy-load="false" @load="onLoaded({ type: 'image', src: fixCMSPath(item.image.image_link, 900) }, $event)"/>
          <view class="quick_facts_info" v-show="item.popFlag">
            <view class="text_box" hover-class="none" hover-stop-propagation="false">
              {{item.information}}
            </view>
            <image class="pop_close" src="@/assets/images/icons/pop_close_white.svg" mode="widthFix" lazy-load="false"  @tap.stop="closePop(item)"/>
          </view>
        </view>
      </block>
    </view>

    <!-- <view class="quick_facts_swiper-inner" v-if="config.content.type == 2">
      <swiper class="swiper-cls" :circular="true" @change="onSwiperChange" nextMargin="96rpx">
        <block v-for="(frame, frameIndex) in list" :key="frameIndex">
          <swiper-item class="swiper_item-cls">
            <view class="swiper_item-inner">
              <block v-for="(item, index) in frame" :key="index">
                <view class="swiper_item-tile" >
                  <view class="quick_facts-box">
                    <view class="quick_facts-title">{{item.title}}</view>
                    <image class="icon_info" src="@/assets/images/icons/icon_info.svg" mode="widthFix" lazy-load="false"
                    :data-item="item" :data-frameIndex="frameIndex" :data-index="index" @tap.stop="showPop(item)"/>
                    <view class="quick_facts-content" hover-class="none" hover-stop-propagation="false">
                      {{item.content}}
                      <view class="quick_facts-units" hover-class="none" hover-stop-propagation="false">
                        {{item.measure_unit}}
                      </view>
                    </view>
                    <image class="quick_facts-image" :webp="true" :src="fixCMSPath(item.image, 900)" mode="widthFix" lazy-load="false"/>
                    {{item.popFlag}}
                    <view class="quick_facts_info" v-if="item.popFlag">
                      <view class="text_box" hover-class="none" hover-stop-propagation="false">
                        {{item.information}}
                      </view>
                      <image class="pop_close" src="@/assets/images/icons/pop_close_white.svg" mode="widthFix" lazy-load="false" @tap.stop="closePop(item)"/>
                    </view>
                  </view>
                </view>
              </block>
            </view>
          </swiper-item>
        </block>
      </swiper>
      <view class="swiper-scrollbar">
        <view class="scrollbar">
          <view class="scrollbar-inner" :style="scrollbarInnerStyles"></view>
        </view>
      </view>
    </view> -->

  </view>
</template>

<script>
import { fixCMSPath, arrayTranslater, fixCMSNumber } from '@/utils';
import mixins from "@/utils/mixins";

export default {
  name: "QuickFacts",
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
  created(){
    this.config.content.items.forEach(v=>{
      this.$set(v,'popFlag',false)
    })
    let _items = this.config.content.items
    this.list = arrayTranslater(_items, 2)
  },
  mounted() {
    this.initComponent();
  },
  data() {
    return {
      activeIndex: 0,
      list: []
    }
  },
  methods: {
    fixCMSPath,
    /**
     * 按钮样式
     */
    showPop(item){
      item.popFlag = true
    },
    closePop(item){
      item.popFlag = false
    },
    onSwiperChange(evt) {
      this.activeIndex = evt.detail.current;
    },
    /**
     * 初始化组件位置及事件
     */
    initComponent() {
      this.$emit('ready', { name: 'QuickFact', images: this.config?.content?.items?.length});
    },
  }
}
</script>

<style lang="scss">
  .quick_facts-container {
    // height:690rpx;
    box-sizing: border-box; width: 100vw; padding: 0 32rpx; background-color: #FAF7F6; position: relative;
  }
  .quick_facts-box{
    // height:616rpx;
    box-sizing: border-box; width: 100%; padding: 18rpx 0 48rpx 0; border-bottom: 2rpx solid #000; position: relative; display: flex; flex-direction: column; align-items: center;
    .quick_facts-title { width: 100%; font-family: 'On DiatypeSemi Mono'; font-size: 40rpx; color: #000; line-height: 150%; text-align: left; }
    .icon_info { width: 48rpx; height: 48rpx; position: absolute; top: 18rpx; right: 0; }
    .quick_facts-content{
      font-family: 'On Diatype Standard'; font-size: 84px; color: #000; font-weight: 500; line-height: 120%; text-align: center;
      margin-top: 152rpx; display: flex; align-items: flex-end; justify-content: center;
      .quick_facts-units { font-family: 'On Diatype Standard'; font-size: 40rpx; color: #000; line-height: 150%; margin-left: 12rpx; }
    }
    .quick_facts-image { width: 600rpx; height: 192rpx; margin-top: 38rpx; }
    .quick_facts_info {
      position: absolute; top: 0; z-index: inherit;
      box-sizing: border-box; width: 100%; height: 100%; padding: 84rpx 64rpx; background-color: #000;
      font-family: 'On Diatype Standard'; font-size: 32rpx; color: #FFF; line-height: 150%;
      .text_box { width: 100%; height: 100%; overflow-y: scroll; }
      .pop_close { width: 48rpx; height: 48rpx; position: absolute; top: 24rpx; right: 24rpx; }
    }
  }
  .quick_facts_swiper-inner {
    background: #FAF7F6;
    .swiper-cls {
      width: 100%; height: 1480rpx;
      .swiper_item-cls {
        width: 100%; height: 1480rpx;
        .swiper_item-inner {
          box-sizing: border-box; width: 100%; height: 1480rpx; padding-right: 32rpx; display: flex; flex-direction: column;
          .swiper_item-tile {
            box-sizing: border-box; width: 626rpx; height: 740rpx; padding: 18rpx 32rpx 48rpx 32rpx; position: relative;
            &:last-child {
              .quick_facts-box { border-bottom: none; }
            }
            .quick_facts-box { box-sizing: border-box; height: 100%; margin-bottom: 0; }
          }
        }
      }
    }
    .swiper-scrollbar {
      height: 148rpx;
      .scrollbar {
        width: 400rpx; height: 1Px; margin: 32rpx auto 0; background: #CCC; position: relative;
        .scrollbar-inner {
          width: 40rpx; height: 2Px; background-color: #000; transition: all 0.1s linear;
          position: absolute; bottom: 0; left: 0;
        }
      }
    }
  }
</style>

