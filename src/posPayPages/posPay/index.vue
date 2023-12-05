<template>
  <Pager
    :header="{ title: '支付结果', style: 'black' }"
    :sidebar="['contact']"
  >
    <view class="result_warpper">
      <view class="result_container">
        <view class="pay_status">
          <!-- 已支付完成 -->
          <template v-if="status == '1'">
            <text class="status_txt">
              已完成支付
            </text>
          </template>
          <!-- 支付未成功 -->
          <template v-else>
            <text class="status_txt">
              支付未成功
            </text>
          </template>
          <!-- <view class="pub_btn go_btn" style="margin-top:110rpx;" @tap="goShop">继续购物</view>
          <view class="pub_btn find_btn" @tap="goOrderDetail">查看详情</view> -->
          <view
            v-if="status === '1'"
            class="pub_btn go_btn"
            style="margin-top:110rpx;"
            @tap="showPup"
          >
            添加导购微信
          </view>
          <view
            v-else
            class="pub_btn go_btn"
            style="margin-top:110rpx;"
            @tap="showSaPup=true"
          >
            重新支付
          </view>
          <view
            class="pub_btn find_btn"
            @tap="onFind"
          >
            查看电子小票
          </view>
        </view>
        <view
          v-if="recommendList.length"
          class="rec_block"
        >
          <ProductSwiperVue
            :items="recommendList"
            :options="recmdOptions"
          />
        </view>
      </view>
    </view>
    <Dialog
      position="center"
      title=""
      :visible="showSaPup"
      @close="closePop"
    >
      <view class="pos-sa-qrcode">
        <view class="pos-sa-qrcode-title">
          请长按添加导购微信
        </view>
        <view class="pos-qrcode-sa">
          <image
            :src="saQrCode"
            mode="widthFix"
            :show-menu-by-longpress="true"
          />
        </view>
        <view
          class="pos-sa-qrcode-close"
          @tap="closePop"
        >
          我知道了
        </view>
      </view>
    </Dialog>
  </Pager>
</template>

<script>
import Pager from '@/components/common/Pager.vue';
import Taro, { eventCenter, getCurrentInstance } from '@tarojs/taro';
import ProductSwiperVue from '@/components/common/ProductSwiper.vue';
import utils, { ajax, loadCMSConfig, addCallback, runCallback, throttle, fixCMSPath, desensitizify } from '@/utils'
import types from '@/store/types';
import Dialog from '@/components/common/Dialog.vue'
import { getPosOrder, getSaQRCode, posPay} from '../utils/index'
const { envVersion } = Taro.getAccountInfoSync().miniProgram;
const env = envVersion === 'release' ? 'publish' : 'preview';

export default {
  name: "PayResult",
  components: {
    ProductSwiperVue,
    Dialog,
    Pager
  },
  data() {
    return {
      current: 0,
      swipers: [],
      orderSn:'',
      status:0,
      recmdOptions: {
        title: '为你推荐',
        itemBgColor: '#fff',
        tagBgColor: '#FAF7F6'
      },
      order:{},
      showSaPup: false,
      saQrCode:''
    }
  },
  computed: {
    /**
     * 为你推荐
     */
    recommendList() {
      const recommend = this.$store.state.recommend;
      const matched = recommend.filter(o => o.location === 'cart');
      if (Array.isArray(matched?.items) && matched.items.length) {
        const items = deepClone(matched.items).filter(o => o.color.enable_at_wcmp && o.color[env]);
        let ret = fixCMSPdtInfo(items);
        return ret;
      }
      return [];
    }
  },
  created() {
    Taro.hideShareMenu()
  },
  onLoad(options) {
    let {sn, status} = options
    if(sn) this.orderSn = sn
    if(status) this.status = status
    this.getOrderDetail()
  },
  onShow() { },
  methods: {
    onFind() {
      Taro.setStorageSync("STORE_ORDER_ITEM", this.order)
      Taro.navigateTo({
        url: `/subpages/myorder/invoice-detail/index`
      });
    },
   async showPup(){
      if(!this.saQrCode){
       const res = await getSaQRCode({order_number: this.orderSn})
       if(res.code === 200){
        const {wecom_qr_code} = res.data
        this.saQrCode = wecom_qr_code
       }
      }
      this.showSaPup = true
    },
    
    closePop(){
      this.showSaPup = false
    },
    //订单详情
    getOrderDetail(){
      return getPosOrder({order_number: this.orderSn}).then(res => {
          this.order = res.data
        }).catch(err => {
          console.log(err)
          reject(err)
        });
    },
    goShop(){
      Taro.switchTab({
        url: `/pages/category/index`
      });
    },
    goOrderDetail(){
      Taro.redirectTo({
        url: `/subpages/myorder/detail/index?orderSn=${this.orderSn}`
      })
    },
    countEnd(){
      this.getOrderDetail()
    }
  },
}
</script>

<style lang="scss">
.result_warpper {
  .result_container {
    .pay_status {
      padding-top: 160px;
      display: flex;
      flex-direction: column;
      font-size: 24px;
      align-items: center;
      width: 100%;
      line-height: 1.2;

      .status_txt {
        font-weight: 500;
        font-size: 40px;
        margin-bottom: 24px;
        line-height: 150%;
      }

      .status_desc {
        color: #767676;
        font-size: 28px;
        display: flex;
        align-items: center;
        line-height: 150%;
      }

      .pub_btn {
        height: 96px;
        width: 686px;
        border-radius: 80px;
        color: white;
        font-size: 28px;
        line-height: 96px;
        text-align: center;
        box-sizing: border-box;
      }

      .go_btn {
        background-color: black;
      }

      .find_btn {
        margin-top: 40px;
        border: 1Px solid #000000;
        color: #000000;
      }
    }

    .rec_block {
      margin-top: 112px;
    }

  }
}
.pos-sa-qrcode{
  width: 600rpx;
  height: 780rpx;
  border-radius: 24rpx;
  position: relative;
  background:white;
  padding: 80rpx;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  .pos-sa-qrcode-title{
    font-size: 40rpx;
    width: 100%;
    text-align: center;
    font-weight:600;
  }
  .pos-sa-qrcode-close{
    height: 96rpx;
    width: 380rpx;
    border: 2rpx solid black;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 32rpx;
    border-radius: 96rpx;
  }
  .pos-qrcode-sa{
    overflow: hidden;
    position: relative;
    image{
      width: 400rpx;
    }
  }
}
</style>