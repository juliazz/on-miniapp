<template>
  <view class="media_slider-wrapper cms_com" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" :dataCmsId="config.id" >
    <view class="media_slider-container" :catch-move="isCatchMove" @touchstart="onTouchStart" @touchend="onTouchEnd">
      <image class="swiper-bg" v-if="config.content.background_image" mode="widthFix" :src="fixCMSPath(config.content.background_image, 1125)">
      </image>
      <swiper class="slider_inner" :style="innerStyles" :autoplay="isAutoPlay"
         :circular="true"
        :interval="swiperInterval" @change="onSwiperChange">
        <swiper-item :class="['slider_item', config.content.background_image? 'transpartBG':'']"  v-for="(item, index) in config.content.items" :key="index">
          <SingleImage v-if="item.component_type == 'SingleImage'" :identifier="identifier" :config="{
            id: `${config.id}^${item.id || index}`,
            component_type: item.component_type,
            content: item
          }" :embedded="true" :isActive="activeIndex == index" />
          <SingleVideo v-else-if="item.component_type == 'SingleVideo'" :identifier="identifier" :config="{
            id: `${config.id}^${item.id || index}`,
            component_type: item.component_type,
            content: {
              ...item,
            }
          }" :embedded="true" :isActive="activeIndex == index"
          :isFullScreen='!!config.content.is_following_text_button'
           :autoPlayVideo="config.content.auto_play_video"
           :componentIndex="componentIndex"
          />
          <view v-else-if="item.component_type == 'SingleSliderText'"  class="SingleSliderText">
            <view class="title-content">
              <view class="single_silder-title" :style="titleStyles">{{ item.title }}</view>
              <view class="single_silder-title sub" :style="titleStyles">{{ item.sub_title }}
                <text class="arrow icon-font icon-Vector"></text>
              </view>
            </view>
            <view class="single_silder-subtitle" :style="titleStyles">{{ item.content }}</view>
          </view>
        </swiper-item>
      </swiper>
      <!-- 下滑按钮 -->
      <!-- <view class="icon-more-box flex_hsb_vc" hover-class="none" hover-stop-propagation="false"  v-if="config.content.is_following_text_button"   >
        <view class="more-line" v-for="(item,index) in [1,2,3,4]" :key="index" @tap="tapToNext">
          <view class="line-box flex_hsb_vc">
            <view>下划造浪</view>
            <view class="icon-font icon-Union" ></view>
          </view>
        </view>
      </view> -->
      <view v-if="config.content.items.length>1" :class="['scrollbar', config.content.slider_bar_style == 'white' ? 'theme-white' : 'theme-black']"
        :style="scrollbarStyles">
        <view class="scrollbar-inner" :style="scrollbarInnerStyles"></view>
      </view>
    
    </view>
  </view>
</template>

<script>
  import { fixCMSPath, fixCMSNumber } from '@/utils';
import Taro from '@tarojs/taro';
import mixins from "@/utils/mixins";

export default {
  name: 'MediaSlider',
  mixins: [mixins],
  components: {
    SingleImage: () => import("./SingleImage.vue"),
    SingleVideo: () => import("./SingleVideo.vue"),
  },
  props: {
    /**
     * 唯一 ID
     */
    identifier: { type: String, required: true },
    /**
     * 组件的配置
     */
    config: { type: Object, required: true },
    /**
     * 完整的 CMS 配置
     */
    original: { type: Array, default: () => ([]) },
    /**
     * 组件出现的位置索引
     */
    componentIndex: { type: Number, required: true }
  },
  data() {
    return {
      isPageShow:true,
      activeIndex: 0,
      clientRect: null,
      slideInfo: null
    };
  },
  computed: {
    /**
     * 轮播项数量
     */
    size() {
      return this.config.content.items.length;
    },
    /**
     * 轮播项的平均宽度
     */
    itemAvgWidth() {
      return `${100 / this.size}`;
    },
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      const { padding_top, padding_right, padding_bottom, padding_left } = this.config;
      padding_top && !isNaN(padding_top) && (styles.paddingTop = `${padding_top}px`);
      padding_right && !isNaN(padding_right) && (styles.paddingRight = `${padding_right}px`);
      padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${padding_bottom}px`);
      padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${padding_left}px`);
      return styles;
    },
    /**
     * 内容样式
     */
    innerStyles() {
      let styles = {};
      const { height } = this.config.content;
      if (height && !isNaN(height)) {
        styles.height = `${height * 2}rpx`;
      } else {
        const tabbarHeight = this.$store.state?.tabbarHeight?.px || 0;
        styles.height = `calc(100vh - ${tabbarHeight}px)`;
        styles.color = '#234567';
      }
      return styles;
    },
    /**
     * 滚动条样式
     */
    scrollbarStyles() {
      const { slider_bar_bottom_space } = this.config.content;
      let styles = {};
      slider_bar_bottom_space && !isNaN(slider_bar_bottom_space) && (styles.bottom = `${slider_bar_bottom_space}px`);
      return styles;
    },
    /**
     * 滚动条滑块样式
     */
    scrollbarInnerStyles() {
      let styles = {};
      styles.width = `${this.itemAvgWidth}%`;
      styles.left = `${this.activeIndex * this.itemAvgWidth}%`;
      return styles;
    },
    /**
     * 自动播放状态
     */
    isAutoPlay() {
      const { auto_switch_speed, auto_play_video, items } = this.config.content;
      return auto_switch_speed > 0 && auto_play_video != 1;
    },
    /**
     * 轮播速度
     */
    swiperInterval() {
      if (this.config.content.auto_switch_speed) {
        return this.config.content.auto_switch_speed * 1000;
      }
      return 5000;
    },
    /**
     * 是否支持滑屏锁定功能
     */
    enableScrollScreen() {
      return this.original?.[0]?.id === this.config?.id;
    },
    /**
     * 是否阻止页面滚动
     */
    isCatchMove() {
      return this.enableScrollScreen && this.clientRect?.top >= -10;
    },
    /**
     * 主标题样式
     */
    titleStyles() {
      let styles = {};
      const { font_color, title_bottom_space } = this.slideInfo||{};
      font_color && (styles.color = font_color);
      title_bottom_space && !isNaN(title_bottom_space) && (styles.bottom = `${fixCMSNumber(title_bottom_space)}rpx`);
      return styles;
    },
    /**
     * 副标题样式
     */
    subtitleStyles() {
      let styles = {};
      const { font_color, sub_title_bottom_space } = this.slideInfo||{};
      font_color && (styles.color = font_color);
      sub_title_bottom_space && !isNaN(sub_title_bottom_space) && (styles.bottom = `${fixCMSNumber(sub_title_bottom_space)}rpx`);
      return styles;
    },
    /**
     * 按钮组样式
     */
    btnGroupStyles() {
      let styles = {};
      const { button_bottom_space } = this.slideInfo||{};
      button_bottom_space && !isNaN(button_bottom_space) && (styles.bottom = `${fixCMSNumber(button_bottom_space)}rpx`);
      return styles;
    }
  },
  mounted() {
    this.initComponent();
  },
  onShow(){
    this.isPageShow=true
  },
  onHide () {
    this.isPageShow=false
  },
  methods: {
    fixCMSPath,
    /**
     * 轮播
     */
    onSwiperChange(evt) {
      this.activeIndex = evt.detail.current;
      //
      if (this.config.content.is_following_text_button) {
        this.slideInfo = this.config.content.items[this.activeIndex];
      }
    },
    /**
     * 初始化组件位置及事件
     */
    initComponent() {
      //
      let images = 0, videos = 0;
      this.config.content.items.forEach(o => {
        if (o.component_type === "SingleImage") {
          images++;
        } else if (o.component_type === 'SingleVideo') {
          videos++;
        }
      });
      this.$emit('ready', { name: 'MediaSlider', images, videos });
      //
      if (this.enableScrollScreen) {
        this.doPosition();
        // Taro.eventCenter.on('scroll', () => {
        //   this.doPosition();
        // });
      }
    },
    /**
     * 获取组件位置信息
     */
    doPosition() {
      Taro.nextTick(() => {
        Taro.createSelectorQuery().select(`#_${this.identifier}_${this.config.id}`).boundingClientRect().exec(rect => {
          this.clientRect = rect[0];
        });
      });
    },
    /**
     * `TouchStart` 事件
     */
    onTouchStart(evt) {
      if (this.isCatchMove) {
        this._ts = evt.changedTouches[0];
      }
    },
    /**
     * `TouchEnd` 事件
     */
    onTouchEnd(evt) {
      if (this.isCatchMove) {
        const { clientX, clientY } = evt.changedTouches[0];
        const moveX = clientX - this._ts.clientX;
        const moveY = clientY - this._ts.clientY;
        //
        if (Math.abs(moveY) > Math.abs(moveX) && moveY < 0) {
          this.doScrollPage();
        }
      }
    },
    tapToNext(){
      if (this.isCatchMove) {
        this.doScrollPage()
      }
    },
    /**
     * 页面滚动
     */
    doScrollPage() {
      const { px } = this.$store.state.headerHeight;
      console.log('clientRect ======> ',this.clientRect)
      Taro.pageScrollTo({
        scrollTop: this.clientRect?.height - px,
        duration: 500
      });
    },
    /**
     * 按钮样式
     */
    toStylesForBtn(itemConfig) {
      let styles = {};
      const { color, background_color, border_color } = itemConfig;
      color && (styles.color = color);
      styles.backgroundColor = background_color || 'transparent';
      border_color && (styles.borderColor = border_color);
      return styles;
    },
    /**
     * 热区样式
     */
    toStylesForHotArea(itemConfig) {
      let styles = {};
      const { width, height, position_x, position_y } = itemConfig;
      width && !isNaN(width) && (styles.width = `${fixCMSNumber(width)}rpx`);
      height && !isNaN(height) && (styles.height = `${fixCMSNumber(height)}rpx`);
      position_x && !isNaN(position_x) && (styles.left = `${fixCMSNumber(position_x)}rpx`);
      position_y && !isNaN(position_y) && (styles.top = `${fixCMSNumber(position_y)}rpx`);
      return styles;
    }
  }
}
</script>

<style lang="scss">
.media_slider-wrapper {
  width: 100%;
  padding: 0;
  margin: 0;

  .media_slider-container {
    width: 100%;
    position: relative;
    .swiper-bg{
      position: absolute;
      width: 100vw;
    }
    .slider_inner {
      width: 100%;
      height: 100%;

      .slider_item {
        width: 100%;
        height: 100%;
        background: whitesmoke;
        display: flex;
        justify-content: center;
        align-items: center;
        .slider_item{
          height: 100%;
          width: 100%;
        }
        &.transpartBG{
          background: transparent;
          color: #FFF;
          .SingleSliderText{
            z-index: 99;
            bottom: 200rpx;
            text-align: left;
            position: absolute;
            width: 100vw;
            padding:0 44rpx;
            .title-content{
              height: 224rpx;
              .icon-font{
                position: absolute;
                right: 30rpx;
                font-size: 40rpx;
              }
            }
            .title-content{
              margin-bottom: 48rpx;
            }
            .single_silder-title{
              font-weight: 500;
              font-size: 80rpx;
              line-height: 112rpx;
              position: relative;
              letter-spacing: 2rpx;
            }
            .single_silder-subtitle{
              font-weight: 500;
              font-size: 24rpx;
              line-height: 34rpx;
              height: 240rpx;
              margin-top: 48rpx;
              letter-spacing: 2rpx;
            }
          }
        }
      }
    }
    .icon-more-box{
      position: absolute;
      bottom:200rpx;
      left: 50%;
      z-index: 8;
      padding-right: 74rpx;
      width: 100%;
      transform: translate(-50%);
      flex-direction: column;
      align-items: flex-end;
      .more-line{
        .line-box{
          background: #FC6E00;
          flex-wrap: nowrap;
          margin-bottom: 24rpx;
          font-family: 'Source Han Sans CN';
          font-style: normal;
          font-weight: 500;
          padding:0 2rpx;
          align-items: flex-end;
        }
        .icon-font{
          font-size: 36rpx;
        }

      }
    }
    .scrollbar {
      width: 400rpx;
      height: 1Px;
      background-color: #CCC;
      position: absolute;
      left: 50%;
      bottom: 100rpx;
      transform: translateX(-50%);
      &-inner {
        width: 40rpx;
        height: 2Px;
        background-color: #000;
        transition: all 0.1s linear;
        position: absolute;
        bottom: 0;
        left: 0;
      }
      //
      &.theme-white {
        background-color: rgba(255, 255, 255, 0.6);
        .scrollbar-inner {
          background-color: #FFF;
        }
      }
    }
    .title-container {
      width: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      opacity: 0;
      &.show {
        opacity: 1;
        transition: all 1s ease 0.2s;
      }
      // &.hide{
      //   opacity: 0;
      // }
      .single_image-ttile {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 204rpx;
        font-size: 64rpx;
        line-height: 1;
        text-align: center;
      }

      .single_image-sub_ttile {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 144rpx;
        font-size: 36rpx;
        line-height: 1;
        text-align: center;
      }

      .single_image-hotarea {
        width: 0;
        height: 0;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
      }

      .single_image-btns {
        width: 100%;
        position: absolute;
        left: 0;
        bottom: 24rpx;
        z-index: 2;
      }
    }
  }
}
</style>
