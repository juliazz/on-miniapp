<template>
  <view class="store_component" v-if="source">
    <view class="store_row" style="margin-bottom: 30rpx">
      <view class="store_colum">
        <text class="store_txt store_title">{{ source.store_name }}</text>
      </view>
      <view class="store_right" v-if="source.distance">
        <text class="right_pub_txt">{{ source.distance / 1000 | toFixed }}km</text>
      </view>
    </view>
    <view class="store_row" style="margin-bottom: 18rpx" v-if="source.operation_start_time">
      <view class="store_colum">
        <image class="location_icon" mode="aspectFit" src="@/assets/images/icons/icon_clock_black.svg" />
        <text class="store_txt">{{ source.operation_start_time }} - {{ source.operation_end_time }}</text>
      </view>
    </view>
    <view class="store_row" style="margin-bottom: 18rpx">
      <view class="store_colum">
        <image class="location_icon" mode="aspectFit" src="@/assets/images/icons/address_icon.svg" />
        <text class="store_txt">{{ source.city }} {{ source.address }}</text>
      </view>
    </view>
    <view class="store_row">
      <view class="store_colum" style="margin-bottom: 18rpx">
        <image class="location_icon" mode="aspectFit" src="@/assets/images/icons/mobile_icon.svg" />
        <text class="store_txt">{{ source.telephone }}</text>
      </view>
    </view>
    <view class="store_row" style="margin-bottom: 48rpx">
      <view class="store_colum">
        <!-- type: DIRECT | FRANCHISE | GENERAL -->
        <block v-if="source.store_type === 'DIRECT'">
          <view class="yello_icon"></view>
          <text class="store_txt">直营店</text>
          <text class="store_txt" v-if="source.product_range">{{source.product_range}}</text>
        </block>
        <block v-else-if="source.store_type === 'GENERAL'">
          <view class="yello_icon grey_icon"></view>
          <text class="store_txt">综合店</text>
          <text class="store_txt" v-if="source.product_range">{{source.product_range}}</text>
        </block>
        <block v-else>
          <view class="yello_icon grey_icon"></view>
          <text class="store_txt">专营店</text>
          <text class="store_txt" v-if="source.product_range">{{source.product_range}}</text>
        </block>
      </view>
      <view class="store_right" @tap="doViewInfo">
        <text class="right_pub_txt go_txt">前往门店</text>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";

export default {
  name: "StoreItem",
  data() {
    return {};
  },
  props: {
    source: { type: Object, required: true },
  },
  created() {},
  onLoad(options) {},
  computed: {},
  methods: {
    /**
     * 查看门店详情
     */
    doViewInfo() {
      Taro.navigateTo({
        url: `/subpages/store/info/index?id=${this.source.id}`
      });
    }
  },
  filters: {
    toFixed(v) {
      return isNaN(v) ? v : Number(v).toFixed(2);
    }
  }
};
</script>

<style lang="scss">
.store_component {
  border-bottom: 1px solid #e5e5e5; margin-bottom: 48px;
  .store_row {
    display: flex; justify-content: space-between; align-items: center;
    .store_colum {
      width: 540px; display: flex; align-items: center;
      .yello_icon { height: 28px; width: 28px; min-height: 28px; min-width: 28px; border-radius: 50%; margin-right: 18px; background-color: #ffc83a; }
      .grey_icon { background-color: #797771; }
      .extra_icon { background-color: #EEE; }
      .location_icon { height: 30px; width: 30px; min-height: 30px; min-width: 30px; margin-right: 16px; }
      .store_txt { color: #999; font-size: 24px; margin-right: 32px;}
      .store_title { color: #000; font-size: 28px; font-weight: 500; }
    }
    .store_right {
      .right_pub_txt { font-size: 24px; color: #000; }
      .go_txt { border-bottom: 1px solid #000; }
    }
  }
}
</style>
