<template>
  <view class="ruler_wrapper">
    <view class="ruler">
      <view class="ruler_bg-layer" :style="{ backgroundColor: bgColor }"></view>
      <scroll-view
        class="ruler-container" scroll-x="true" :scroll-left="`${rulerScrollLeft}px`" :scroll-with-animation="true" @scroll="onScroll"
      >
        <view class="ruler-inner">
          <view class="ruler_graduations-wrap" :style="rulerStyles">
            <view class="ruler_graduations" :style="rulerGraduationStyles"></view>
          </view>
          <view class="ruler_graduations-labels" :style="rulerStyles">
            <view class="ruler_graduations-label" v-for="(label, i) in rulerLabels" :key="i" :style="{ color: labelColor }">{{i % 2 ? '' : label}}</view>
          </view>
        </view>
      </scroll-view>
      <image class="ruler-pointer" :style="rulerPointerStyles" mode="widthFix" src="@/assets/images/icons/pointer.svg" />
    </view>
  </view>
</template>

<script>
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import { px2rpx } from '@/utils';

export default {
  props: {
    min: { type: Number, default: 0 },
    max: { type: Number, default: 10 },
    step: { type: Number, default: 1 },
    value: { type: [Number, String], default: '' },
    unit: { type: String, default: '' },
    bgColor: { type: String, default: '#FAF7F6' },
    lineColor: { type: String, default: '#CCC' },
    labelColor: { type: String, default: '#000' },
  },
  data() {
    return {
      // 刻度尺容器宽度
      rulerViewWidth: 0,
      // 刻度尺最大滚动距离
      rulerMaxScrollLeft: 0,
      //
      rulerScrollLeft: 0
    }
  },
  computed: {
    /**
     * 刻度尺的原始范围
     */
    rulerRange() { return Math.ceil((this.max - this.min) / this.step); },
    /**
     * 计算额外增加刻度数量: 750=额外的宽度(rpx), 20=每个刻度宽度(像素)
     */
    rulerExtraSize() {
      return Math.ceil(750 / px2rpx(20));
    },
    /**
     * 刻度尺两侧追加的额外刻度数量
     */
    rulerPadSize() {
      return Math.ceil(this.rulerExtraSize / 2);
    },
    /**
     * 刻度尺文本
     */
    rulerLabels() {
      const start = this.min - this.rulerPadSize * this.step, end = this.max + this.rulerPadSize * this.step;
      let labels = [];
      for (let i = start; i <= end; i+=this.step) labels.push(i);
      return labels;
    },
    /**
     * 刻度尺样式
     */
    rulerStyles() {
      return {
        // 额外增加的刻度, 是因为指针固定不动, 滑动不到刻度尺的左右两侧.
        width: `${(this.rulerRange + this.rulerPadSize * 2) * 20}PX`
      }
    },
    /**
     * 刻度尺的刻度样式
     */
    rulerGraduationStyles() {
      if (this.lineColor) {
        return {
          backgroundImage: `repeating-linear-gradient(90deg, ${this.lineColor} 0 1PX, transparent 0 20PX), repeating-linear-gradient(90deg, ${this.lineColor} 0 1PX, transparent 0 40PX);`,
          borderColor: this.lineColor
        };
      }
      return {};
    },
    /**
     * 刻度尺指针样式
     */
    rulerPointerStyles() {
      return {
        // 额外刻度 x 20 + 20(内边距)
        left: `${this.rulerPadSize * 20 + 20}PX`
      }
    }
  },
  created() {},
  mounted() {
    eventCenter.once(getCurrentInstance().router.onReady, () => {
      this.initComponent();
    });
  },
  onLoad() {},
  methods: {
    // 初始化: 指针初始定位 & 获取刻度尺容器宽度(可视宽度)
    initComponent() {
      if (!isNaN(this.value) && this.value >= this.min && this.value <= this.max) {
        const moveStep = (this.value - this.min) / this.step;
        this.rulerScrollLeft = moveStep * 20;
      }
      //
      this.$selectorQuery = Taro.createSelectorQuery();
      this.$selectorQuery.select('.ruler-container').boundingClientRect(rect => {
        if (rect) this.rulerViewWidth = rect.width;
      }).exec();
    },
    // 刻度尺滚动事件处理
    onScroll(evt) {
      // 定位滚动时不处理滚动事件
      if (this.scrolling) return;
      if (this.scrollEndTimer) clearTimeout(this.scrollEndTimer);
      const { scrollLeft, scrollWidth } = evt.detail;
      // 获取最大滚动宽度
      if (!this.rulerMaxScrollLeft) this.rulerMaxScrollLeft = scrollWidth - this.rulerViewWidth;
      // 是否滚动到底
      const isScroll2Edge = this.rulerMaxScrollLeft - scrollLeft <= 4;
      // 实时更新刻度值
      this.setGraduation(scrollLeft);
      // 滚动停止校准刻度值
      this.scrollEndTimer = setTimeout(() => {
        this.scrollToGraduation(scrollLeft, isScroll2Edge);
      }, 200);
    },
    // 更新刻度值
    setGraduation(scrollLeft) {
      const baseGraduation = Math.floor(scrollLeft / 20);
      this.$emit('input', this.min + baseGraduation * this.step);
    },
    // 校准刻度值
    scrollToGraduation(scrollLeft, isScroll2Edge) {
      this.scrolling = true; // 滚动定位处理的标记
      const baseGraduation = Math.floor(scrollLeft / 20); // 刻度取整
      const moreGraduation = (isScroll2Edge || scrollLeft % 20 < 10) ? 0 : 1; // 刻度值四舍五入处理
      let moveGraduation = baseGraduation + moreGraduation;
      // 防止越界
      if (moveGraduation > this.rulerRange) moveGraduation = this.rulerRange;
      const rulerMoveValue = moveGraduation * this.step;
      const rulerScrollLeft = moveGraduation * 20;
      // 防止数据不变化造成滚动定位失败
      this.rulerScrollLeft = (this.rulerScrollLeft === rulerScrollLeft) ? rulerScrollLeft + 0.000000001 : rulerScrollLeft;
      this.$emit('input', parseInt(this.min) + rulerMoveValue);
      setTimeout(() => {
        this.scrolling = false;
      }, 100);
    }
  }
}
</script>

<style lang="scss">
  .ruler_wrapper {
    width: 100%;
    .ruler {
      position: relative; overflow: hidden;
      .ruler_bg-layer { width: 100%; height: 48PX; background: #FAF7F6; border-radius: 4PX; position: absolute; top: 0; left: 0; }
      .ruler-container {
        width: 100%; position: relative;
        .ruler-inner {
          display: inline-block; padding: 0 20PX;
          .ruler_graduations-wrap {
            padding: 18PX 0 6PX;
            .ruler_graduations {
              height: 24PX; border-top: 1PX solid #CCC; background-repeat: no-repeat;
              background-image:
                repeating-linear-gradient(90deg, #CCC 0 1PX, transparent 0 20PX),
                repeating-linear-gradient(90deg, #CCC 0 1PX, transparent 0 40PX);
              background-size: 100% 6PX, 100% 12PX;
            }
          }
          .ruler_graduations-labels {
            padding: 0; margin-top: 8PX; display: flex; justify-content: flex-start; align-items: center;
            .ruler_graduations-label { width: 20PX; flex-shrink: 0; font-size: 10PX; color: #000; text-align: center; line-height: 1; transform: translateX(-50%); }
          }
        }
      }
      .ruler-pointer { width: 40rpx; height: auto; position: absolute; bottom: 34rpx; left: calc(50% + 16rpx); transform: translateX(-50%); pointer-events: none; }
    }
  }
</style>
