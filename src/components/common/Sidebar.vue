<template>
<movable-area>
  <movable-view direction="all" :x="x" :y="y" style="pointer-events: auto;" @change="move">
    <view class="sidebar-wrapper" v-if="Array.isArray(config) && config.length">
      <block v-for="(item, index) in config" :key="index">
        <Service  v-if="item === 'contact'"></Service>
        <view :class="sidebar_item" v-else-if="item === 'share'">
          <button class="sidebar_item-trigger" open-type="share">
            <image class="sidebar_item-icon" mode="widthFix" src="@/assets/images/icons/share.svg" />
          </button>
        </view>
      </block>
    </view>
  </movable-view>
</movable-area>
</template>

<script>
import { openCustomerServiceChat ,debounce} from '@/utils';
import Service from "@/components/common/Service.vue";
export default {
  name: 'Sidebar',
  components: {Service },
  props: {
    /**
     * `Sidebar` 配置项数组
     * - key - 侧边按钮 `Key`, 有效值为: `contact`, `share`, `home`, `top`
     */
    config: { type: Array, required: true },
    showContact: { type: Boolean, default: true }
  },
  data() {
    return {
    };
  },
  computed:{
    x(){
      return this.$store.state.iocnPosition.x
    },
    y(){
      return this.$store.state.iocnPosition.y
    }
  },
  methods: {
    //
    move:debounce( function(e) {
      this.$store.state.iocnPosition.x = e.detail.x
      this.$store.state.iocnPosition.y = e.detail.y
    },200)
  }
}
</script>

<style lang="scss">
.sidebar-wrapper {
  width: 80rpx;
  // position: fixed;
  // bottom: 256rpx;
  // right: 32rpx;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;

  .sidebar_item {
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
}
movable-area {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 1;
  width: 100%;
  height: 70%;
  pointer-events: none;
}
movable-view {
  width: fit-content;
  height: fit-content;
}
.submit_btn{
  background: #fff;
  border-radius: 10rpx;
  color: #000;
  font-size: 28rpx;
}

.flexbox_auto{
  display: flex;
  align-items: center;
  justify-content: center;
}

.rect{
  height: 100rpx;
  width: 120rpx;
}

</style>
