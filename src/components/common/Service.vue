<template>
  <view class="Service-wrapper">
    <button class="sidebar_item-trigger" open-type="contact" @contact="handleContact" >
      <image class="sidebar_item-icon" mode="widthFix" src="@/assets/images/icons/msg.svg" />
    </button>
  </view>
</template>

<script>
import Taro  from "@tarojs/taro";
import {
  isTabbarPage,
} from "@/utils";
export default {
  name: 'Loader',
  props: {
    /**
     * `Loader` 配置项
     * - title - 提示文案
     */
    config: {
      type: Object,
      default: () => ({
        title: ''
      })
    }
  },
  data() {
    return {};
  },
  onLoad() {
    // handleContact()
  },
  methods: {
    handleContact(e) {
      console.log('客服卡片收到的参数',e)
      let {query,path} = e.mpEvent.detail;
      let params = '';
      if (path) {
        for (let key in query) {
          params = params+key + '=' + query[key] + '&';
        }
        params = params.slice(0, params.length - 1);
        const link = `${path}?${params}`
        let isTab = isTabbarPage(link);
        if (isTab) {
          Taro.switchTab({
            url: link,
          });
        } else {
          Taro.navigateTo({ url: link });
        }
      }
    },

    //
  }
}
</script>

<style lang="scss">
.Service-wrapper {
  width: 80rpx;
  height: 80rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  border: none;
  border-radius: 50%;
  box-shadow: 0px 0px 16rpx rgba(0, 0, 0, 0.12);

  .sidebar_item-trigger {
    display: block;
    width: 48rpx;
    height: 48rpx;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: white;
    border: none;
    // border-radius: 50%;
    // box-shadow: 0px 0px 16rpx rgba(0, 0, 0, 0.12);
    line-height: 1;

    &::after {
      border: none;
    }

    .sidebar_item-icon {
      width: 48rpx;
      height: auto;
    }
  }

  &+.sidebar_item {
    margin-top: 32rpx;
  }

  &.hide {
    visibility: hidden;
  }
}
</style>
