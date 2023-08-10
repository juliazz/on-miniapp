<template>
  <view class="elevator-wrapper" :style="appearanceStyles" :id="`_${identifier}_${config.id}`" v-if="sorted">
    <view :class="['elevator-container', fixedPosition ? 'fixed' : '']" :style="containerStyles" :id="`_${identifier}_${config.id}_container`">
      <scroll-view class="elevator-container--inner" :style="innerStyles" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="activedItemID" :scroll-with-animation="true">
        <view class="elevator-items" v-if="Array.isArray(config.content.items) && config.content.items.length">
          <view
            v-for="(item, index) in config.content.items" :key="index"
            :id="`_${identifier}_${item.id}-nav`"
            class="elevator-item"
            :style="toStylesForBtn(index)"
            @tap.stop="onScrollTo(item.id, index)"
          >{{item.elevator_name}}</view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import { objectArraySort, rpx2px, fixCMSNumber } from '@/utils';

export default {
  name: 'Elevator',
  props: {
    /**
     * 唯一 ID
     */
    identifier: { type: String, required: true },
    /**
     * 组件配置
     */
    config: { type: Object, required: true },
    /**
     * 额外配置
     * - headerHeight: 自定义 `Header` 的高度
     */
    extras: {
      type: Object,
      default: () => ({
        headerHeight: 0
      })
    }
  },
  data() {
    return {
      sorted: false,        // 数据排序状态
      fixedPosition: false, // 组件是否固定
      selfHeight: 0,        // 自身高度
      inited: false,        // 页面加载完才初始化, 以便保证定位准确
      targets: [],          // 目标组件的ID
      targetsRect: [],      // 目标组件的尺寸及边距位置
      activeIndex: -1       // 激活项的下标
    };
  },
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      this.selfHeight && !isNaN(this.selfHeight) && (styles.height = `${this.selfHeight}px`);
      return styles;
    },
    /**
     * 容器样式
     */
    containerStyles() {
      let styles = {};
      const { padding_top, padding_bottom, padding_left, content: { background_color } } = this.config;
      padding_top && !isNaN(padding_top) && (styles.paddingTop = `${fixCMSNumber(padding_top)}rpx`);
      padding_bottom && !isNaN(padding_bottom) && (styles.paddingBottom = `${fixCMSNumber(padding_bottom)}rpx`);
      padding_left && !isNaN(padding_left) && (styles.paddingLeft = `${fixCMSNumber(padding_left)}rpx`);
      styles.backgroundColor = background_color || "transparent";
      // 自定义 `Header` 时, 固定定位处理
      const { headerHeight } = this.extras || {};
      this.fixedPosition && headerHeight && !isNaN(headerHeight) && (styles.top = `${headerHeight}rpx`);
      //
      return styles;
    },
    /**
     * 内容样式
     */
    innerStyles() {
      let styles = {};
      const { padding_right } = this.config;
      padding_right && !isNaN(padding_right) && (styles.paddingRight = `${fixCMSNumber(padding_right)}rpx`);
      return styles;
    },
    /**
     * 激活项的 `ID`
     */
    activedItemID() {
      const activedItemInfo = this.config?.content?.items?.[this.activeIndex];
      if (activedItemInfo?.id) {
        return `_${this.identifier}_${activedItemInfo.id}-nav`;
      }
      return '';
    },
    /**
     *
     */
    cmsResources() {
      return this.$store.state.cmsResources;
    },
    /**
     * 按钮样式
     */
    toStylesForBtn() {
      return function(index) {
        let styles = {};
        const { content: { item_background_color, item_color, item_active_background_color, item_active_color } } = this.config;
        if(this.activeIndex === index) {
          styles.color = item_active_color || '#fff';
          styles.backgroundColor = item_active_background_color || "#000";
        } else {
          styles.color = item_color || '#000';
          styles.backgroundColor = item_background_color || "#FAF7F6";
        }
        return styles;
      }
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    /**
     * 初始化处理: 排序 + 事件绑定 + 高度计算 + 关联目标查找 + 页面高度检测
     */
    init() {
      //
      objectArraySort(this.config.content.items, 'sort', 'asc');
      this.sorted = true;
      //
      this.initEvents();
      this.initSelfHeight();
      if (!this.targets || !this.targets.length) this.findTargets();
    },
    /**
     * 获取组件自身高度, 设置到容器上, 以便悬浮时不塌陷
     */
    initSelfHeight() {
      const selector = `#_${this.identifier}_${this.config.id}_container`;
      Taro.nextTick(() => {
        Taro.createSelectorQuery().select(selector).boundingClientRect().exec(res => {
          if (res && res[0] && res[0].height) {
            this.selfHeight = res[0].height;
          } else {
            this.initSelfHeight();
          }
        });
      })
    },
    /**
     * 获取IDs
     */
    findTargets() {
      this.targets = this.config.content.items.map(o => `#_${this.identifier}_${o.id}`);
    },
    /**
     * 页面中网络资源加载结果检查
     */
    initPageStatusChecker() {
      const { images: { count: iCount, success: iSCount, failure: iFCount }, videos: { count: vCount, success: vSCount, failure: vFCount } } = this.cmsResources;
      //
      if (iCount <= iSCount + iFCount) {
        this.initPageScrollTop();
      }
    },
    /**
     * 获取页面滚动高度
     */
    initPageScrollTop() {
      const query = Taro.createSelectorQuery();
      query.selectViewport().scrollOffset();
      query.exec(res => {
        const { scrollTop } = res[0];
        this.initTargetsTop(scrollTop);
      });
    },
    /**
     * 获取相关组件到文档顶部的距离
     */
    initTargetsTop(st = 0) {
      if (!this.targets || !this.targets.length) return;
      const query = Taro.createSelectorQuery();
      query.selectAll(this.targets.join(',')).boundingClientRect();
      query.exec(res => {
        if (res && res[0] && res[0].length) {
          this.targetsRect = res[0].map(rect => {
            const { id, width, height, top, right, bottom, left } = rect;
            return { id, width, height, top: parseFloat(st) + top, right, bottom: bottom - parseFloat(st), left }
          });
          this.inited = true;
          this.initSelfPosition();
        }
      });
    },
    /**
     * 相交处理
     */
    initSelfPosition() {
      // 自定义 `Header` 处理
      const { headerHeight = 0 } = this.extras || { headerHeight: 0 };
      // 34 = 按钮的固定高度(没加上下内间距), 99999 = 页面很长时, 电梯组件不在窗口内, 造成不相交触发Fixed
      Taro.createIntersectionObserver().relativeToViewport({ top: -((this.selfHeight || 34) + rpx2px(headerHeight)), bottom: 99999 }).observe('.elevator-wrapper', res => {
        const fixedPosition = res.intersectionRatio === 0;
        if (this.fixedPosition != fixedPosition) this.$emit('changePosition', fixedPosition);
        this.fixedPosition = fixedPosition;
      });
    },
    /**
     * 全局事件处理: 页面滚动 & 组件显隐
     */
    initEvents() {
      // 页面中需要派发此事件
      Taro.eventCenter.on('scroll', args => {
        this.setActiveIndex(args.scrollTop);
      });
      // 布局有变动需重新获取组件高度
      Taro.eventCenter.on('layout', args => {
        this.initPageScrollTop();
      });
    },
    /**
     * 滚动至指定元素
     */
    onScrollTo(ref, idx) {
      // 未初始化 || 正在跳转
      if (!this.inited || this.scrollJumping) return false;
      // 自定义 `Header` 高度
      const { headerHeight = 0 } = this.extras || { headerHeight: 0 };
      // const target = this.targetsRect.find(o => o.id === `_${this.identifier}_${ref}`);
      // if (!target) return console.warn('@onScrollTo::目标不存在或未初始化完成', this.targets, this.targetsRect, ref, idx), false;
      //
      this.activeIndex = idx;
      this.scrollJumping = true;
      // 滚动高度处理
      Taro.pageScrollTo({
        // scrollTop: target.top - this.selfHeight - rpx2px(headerHeight),
        selector: `#_${this.identifier}_${ref}`,
        offsetTop: -(this.selfHeight + rpx2px(headerHeight)),
        duration: 200,
        complete: () => {
          // 延迟处理的原因: 滚动事件有`节流`处理, 因此存在延迟
          setTimeout(() => {
            this.scrollJumping = false;
          }, 1000 / 50);
        }
      });
    },
    /**
     * 根据滚动高度设置激活项
     */
    setActiveIndex(st) {
      if (this.scrollJumping) return false;
      this.initPageScrollTop();
      // 自定义 `Header` 高度
      const { headerHeight = 0 } = this.extras || { headerHeight: 0 };
      // 滚动高度
      const relativeScrollTop = st + this.selfHeight + rpx2px(headerHeight);
      const activedNavItem = this.targetsRect.find(o => relativeScrollTop >= o.top && relativeScrollTop <= o.top + o.height);
      if (activedNavItem) {
        this.activeIndex = this.config.content.items.findIndex(o => `_${this.identifier}_${o.id}` === activedNavItem.id);
      } else {
        this.activeIndex = -1;
      }
    }
  },
  watch: {
    cmsResources: {
      deep: true,
      handler(newValue, oldValue) {
        this.initPageStatusChecker();
      }
    }
  }
}
</script>

<style lang="scss">
  .elevator-wrapper {
    padding: 0; margin: 0; text-align: left;
    .elevator-container {
      box-sizing: border-box; width: 100%; padding: 32rpx 0; margin: 0; overflow: hidden; transition: all 0.1s linear;
      &.fixed { position: fixed; top: 0; left: 0; z-index: 99999; background-color: #FFF; }
      .elevator-container--inner {
        .elevator-items {
          display: inline-block; margin: 0 32rpx; white-space: nowrap;
          .elevator-item {
            display: inline-block; padding: 24rpx 48rpx; background: #FAF7F6; border-radius: 80rpx;
            font-size: 32rpx; color: #000; line-height: 1.5;
            & + .elevator-item { margin-left: 16rpx; }
            &.actived { color: #FFF; background-color: #000; }
          }
        }
      }
    }
  }
</style>
