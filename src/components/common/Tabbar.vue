<template>
  <view class="tabbar-wrapper" :style="tabbarStyles">
    <view class="tabbar-inner flex_hsa_vc">
      <view
        v-for="(item, index) in config.list" :key="index"
        :class="['tabbar_item', activeIndex == index ? 'active' : '']"
        @tap="onClickItem(item, index)"
      >
        <view class="tabbar_item-icon--wrap">
          <image class="tabbar_item-icon" mode="widthFix" :src="item.selectedIconPath" v-if="activeIndex == index" />
          <image class="tabbar_item-icon" mode="widthFix" :src="item.iconPath" v-else />
        </view>
        <text class="tabbar_item-text" :style="{ color: config.selectedColor }" v-if="activeIndex == index">{{ item.text }}</text>
        <text class="tabbar_item-text " :style="{ color: config.color }" v-else>{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import HomeIcon from '@/assets/images/icons/tabbar/home.svg';
import HomeActiveIcon from '@/assets/images/icons/tabbar/home-active.svg';
import CategoryIcon from '@/assets/images/icons/tabbar/category.svg';
import CategoryActiveIcon from '@/assets/images/icons/tabbar/category-active.svg';
import ClubIcon from '@/assets/images/icons/tabbar/club.svg';
import ClubActiveIcon from '@/assets/images/icons/tabbar/club-active.svg';
import CartIcon from '@/assets/images/icons/tabbar/cart.svg';
import CartActiveIcon from '@/assets/images/icons/tabbar/cart-active.svg';
import UCenterIcon from '@/assets/images/icons/tabbar/ucenter.svg';
import UCenterActiveIcon from '@/assets/images/icons/tabbar/ucenter-active.svg';

export default {
  name: 'Tabbar',
  props: {
    /**
     * `Tabbar` 配置
     * - list                      - `Tabbar` 导航项列表
     * - list[i].pagePath          - 页面路径
     * - list[i].text              - 按钮文字
     * - list[i].iconPath          - 默认时的图片路径
     * - list[i].selectedIconPath  - 激活时的图片路径
     * - color                     - `Tabbar` 导航项默认时的文字颜色
     * - selectedColor             - `Tabbar` 导航项激活时的文字颜色
     * - backgroundColor           - `Tabbar` 背景色
     * - borderStyle               - `Tabbar` 上边框的颜色
     */
    config: {
      type: Object,
      default: () => ({
        list: [
          { text: '主页', pagePath: '/pages/index/index', iconPath: HomeIcon, selectedIconPath: HomeActiveIcon },
          { text: '分类', pagePath: '/pages/category/index', iconPath: CategoryIcon, selectedIconPath: CategoryActiveIcon },
          { text: '社区', pagePath: '/pages/club/index', iconPath: ClubIcon, selectedIconPath: ClubActiveIcon },
          { text: '购物', pagePath: '/pages/cart/index', iconPath: CartIcon, selectedIconPath: CartActiveIcon },
          { text: '我的', pagePath: '/pages/ucenter/index', iconPath: UCenterIcon, selectedIconPath: UCenterActiveIcon },
        ],
        color: '#555',
        selectedColor: '#FFC83A',
        backgroundColor: '#FFF',
        borderStyle: 'black'
      })
    }
  },
  data() {
    return {
      activeIndex: null
    };
  },
  computed: {
    /**
     * `Tabbar` 外观
     */
    tabbarStyles() {
      let styles = {};
      const { borderStyle, backgroundColor } = this.config;
      // styles.borderTop = `2rpx solid ${borderStyle}`;
      styles.backgroundColor = backgroundColor;
      //
      const visible = this.$store.state.visible4HTS;
      styles.opacity = visible ? '1' : '0';
      //
      return styles;
    },
    /**
     * `Tabbar` 高度
     */
    tabbarHeight() {
      return { px: 88, rpx: 176 };
    }
  },
  mounted() {
    // 'ready' 事件派发
    eventCenter.once(getCurrentInstance().router.onReady, () => {
      this.$store.commit('setTabbarHeight', this.tabbarHeight);
      this.$emit('ready', { height: this.tabbarHeight });
      //
      this.setActiveItem();
    });
  },
  beforeDestroy() {
    this.$store.commit('setTabbarHeight', { px: 0, rpx: 0 });
  },
  methods: {
    /**
     * 设置激活项下标
     */
    setActiveItem() {
      const currentPath = getCurrentInstance().router.path;
      let idx = this.config.list.findIndex(o => o.pagePath == currentPath);
      this.activeIndex = idx; // Math.max(0, idx);
    },
    /**
     * 点击处理
     */
    onClickItem(item, index) {
      Taro.reLaunch({ url: item.pagePath });
    }
  }
}
</script>

<style lang="scss">
  .tabbar-wrapper {
    width: 100%; height: 176rpx; box-shadow: 0rpx -2rpx 16px rgba(0, 0, 0, 0.05); position: fixed; bottom: 0; left: 0; z-index: 9; transition: all 0.1s ease-in;
    .tabbar-inner {
      .tabbar_item {
        flex: 1; padding: 46rpx 16rpx 54rpx; display: flex; flex-direction: column; justify-content: flex-start; align-items: center;
        .tabbar_item-icon--wrap { width: 48rpx; height: 48rpx; }
        .tabbar_item-icon { width: 48rpx; height: auto; }
        .tabbar_item-text { font-size: 20rpx; line-height: 1; margin-top: 8rpx; }
      }
    }
  }
</style>
