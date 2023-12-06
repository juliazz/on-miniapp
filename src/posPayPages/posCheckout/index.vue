<template>
  <Pager
    :header="{ title: '订单详情', style: 'black' }"
    :sidebar="['contact']"
    @ready="onPagerReady"
  >
    <!-- 门店订单详情 -->
    <view
      :class="['order-detail-page', showPop ? 'fixed' : '']"
    >
      <view class="order-detail-part">
        <view class="order-detail-box">
          <view class="item product-box">
            <view class="item-title product-title">
              商品信息
            </view>
            <block
              v-for="(v, i) in order.items"
              :key="i"
            >
              <view
                class="item-product"
                @tap.stop="goPdpPage(v)"
              >
                <view class="product">
                  <view
                    class="p-img-box"
                    hover-class="none"
                    hover-stop-propagation="false"
                  >
                    <image
                      class="p-img"
                      :webp="true"
                      :src="v.img_url"
                      mode="aspectFit"
                      lazy-load="false"
                    />
                  </view>
                  <view class="p-info">
                    <view class="p-name">
                      {{ v.style_display_name_cn }}
                    </view>
                    <view class="p-desc">
                      {{ v.style_display_name_cn2 }}
                    </view>
                    <view class="p-style">
                      <view class="p-color">
                        {{ v.gender }}
                      </view>
                      <view class="p-color">
                        {{ v.color }}
                      </view>
                      <view class="p-color">
                        尺码：{{ v.cn_size || 0 }}
                      </view>
                    </view>
                    <view class="p-price">
                      <view class="">
                        ¥ {{ v.unit_price }}
                      </view>
                      <view class="p-num">
                        × {{ v.quantity }}
                      </view>
                    </view>
                  </view>
                </view>
                <!-- 隐藏 -->
                <view
                  v-if="false && order.status == 'complete' && v.canRefund"
                  class="btn-box"
                >
                  <view
                    class="btn"
                    @tap.stop="refundOrder(i)"
                  >
                    退货
                  </view>
                </view>
              </view>
            </block>
            <view class="product-cost">
              <view class="cost-item">
                <view class="">
                  商品金额
                </view>
                <view class="">
                  ¥{{ order.total_paid }}
                </view>
              </view>
              <view class="cost-item">
                <view class="">
                  优惠金额
                </view>
                <view class="">
                  ¥ {{ order.discount_amount }}
                </view>
              </view>
              <view class="cost-item">
                <view class="">
                  运费
                </view>
                <view class="">
                  ¥{{ order.deliveryAmount || '0.00' }}
                </view>
              </view>
              <!-- 隐藏 -->
              <view
                v-if="order.points_deducted_amount"
                class="cost-item"
              >
                <view class="">
                  余额抵扣
                </view>
                <view class="">
                  ¥-{{ order.points_deducted_amount }}
                </view>
              </view>
            </view>
            <view class="product-account">
              <view>合计</view>
              <view>¥{{ order.total_paid }}</view>
            </view>
          </view>
          <!--  电子小票 -->
          <view
            v-if="false"
            class="item item-row"
          >
            <view class="item-title">
              电子小票
            </view>
            <view
              class="find-btn"
              @tap="onFind"
            >
              查看
            </view>
          </view>
        </view>
      </view>
      <view
        class="account-box  pos-account-box"
      >
        <view class="account-left">
          <view class="total-account">
            共{{ order.total_quantity }}件 | 合计 ¥{{ order.total_paid }}
          </view>
        </view>
        <view
          class="account-btn"
          @tap="payOrder"
        >
          立即支付
        </view>
      </view>
    </view>
    <view class="login-pup">
      <!-- 弹窗 - 登录方式引导 -->
      <LoginGuideVue
        :options="loginGuideOptions"
        @hide="onHideGuideClose"
        @success="onLoginSuccess"
        @confirm="onGuestConfirm"
      />
    </view>
  </Pager>
</template>

<script>
import Pager from '@/components/common/Pager.vue';
import Taro from '@tarojs/taro'
import { ajax, loadCMSConfig, fixCMSPath, fixColorThumbnail, desensitizify, RES_SUCCESS_CODE, openCustomerServiceChat, showCustomLoading, hideCustomLoading } from '@/utils'
import types from '@/store/types';
import LoginGuideVue from "@/components/common/LoginGuide.vue";
import * as ssTrack from '@/utils/ssTrack'
import { getPosOrder, posPay} from '../utils/index'
// 默认线上订单
const DEFAULT_ORDER = 0
// 门店订单
const STORE_ORDER = 1
export default {
  name: 'OrderDetail',
  components: { Pager, LoginGuideVue },
  data() {
    return {
      orderSn: '',
      layoutSizeInfo: { headerHeight: 0, tabbarHeight: 0 },
      order: {},
      showPop: null,
      orderType: null,
      cancelReasonList: [
        // { value: '7天无理由退货', checked: false },
        // { value: '颜色或尺码错误', checked: false },
        // { value: '其他', checked: false },
        { value: '拍错商品（尺码/颜色/数量等）', checked: false },
        { value: '个人信息错误 （地址/电话等信息）', checked: false },
        { value: '不想要了', checked: false },
        { value: '发货速度不满意 / 未按时发货', checked: false },
      ],
      currentCancelReason: '',
      editable: false,
      editReason: '',
      icon_checkbox_checked: require('@/assets/images/icons/checkbox-checked.svg'),
      icon_checkbox_default: require('@/assets/images/icons/checkbox.svg'),
      currentItemIndex: '',
      storeList: [],
      store: {},
       /**
       * LoginGuide 配置选项
       */
       loginGuideOptions: {
        visible: false,
        hideAsGuest: false,
        enableGuest: false,
        btnText4Guest: "使用游客身份浏览",
        afterHandler: "",
        afterHandlerData: {},
      },
      isMember: 0
    };
  },
  computed: {
  },
  watch: {
    editReason(e) {
      this.currentCancelReason = e
    }
  },
  created() {
    Taro.hideShareMenu()
  },
 async onLoad(options) {
  console.log('options-----------', decodeURIComponent(options.scene))
    showCustomLoading();
    await this.$store.state.loginPromise;
    this.isMember = Taro.getStorageSync('lw_loginStatus')
    if(!this.isMember){
      this.loginGuideOptions.visible = true
    }
    const config = {
      ...options,
    }
    const scene = decodeURIComponent(options.scene)
    if(scene && scene.includes('posOrder=')){
      config.orderSn = scene.replace('posOrder=', '')
    }
    await this.init(config)
    hideCustomLoading()
  },
  methods: {
    onHideGuideClose(){
      this.loginGuideOptions.visible = false
      console.log()
    },
    onLoginSuccess(){
      this.loginGuideOptions.visible = false
    },
    onGuestConfirm(){
      this.loginGuideOptions.visible = false
    },
    init(options = {}) {
      options.orderSn && (this.orderSn = options.orderSn)
      this.getStoreOrderDetail()
    },
    desensitizify,
    fixCMSPath,
    fixColorThumbnail,
    onPagerReady(res) {
      this.layoutSizeInfo = res;
    },
    /**
     * 加载门店数据
     */
    loadStores() {
      loadCMSConfig('store').then(stores => {
        if (Array.isArray(stores) && stores.length) {
          this.storeList = stores
        } else {
          console.warn('@loadStores::', res);
        }
      }).catch(err => {
        console.warn('@loadStores::', err);
      });
    },
    //订单详情
    getOrderDetail() {
      return new Promise(async (resolve, reject) => {
        ajax({
          url: types.ORDER_INFO,
          data: {
            orderSn: this.orderSn,
          }
        }).then(res => {
          resolve(res)
          console.log(res)
          this.order = res.data
          if (this.order.store && this.order.store.store_code) {
            this.store = this.storeList.find(store => store.store_code == this.order.store.store_code)
            console.log(this.store)
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        });
      });
    },
    // 获取门店订单详情
    async getStoreOrderDetail() {
      await getPosOrder({order_number: this.orderSn}).then(res => {
        const data = res.data
        res.code === 200 && (this.order = data)
        if(data.is_paid && Number(data.is_paid) === 1){
          this.onAfterPayment(this.orderSn, 1)
        }
      }).catch(err => {
        console.log(err)
      });
    },
    // 获取加密订单号
    getRsaOrderNumber() {
      return new Promise((resolve, reject) => {
          ajax({
            url: types.TXT_TO_RAS,
            data: {
              str: this.orderSn
            }
          }).then(res => {
            const data = res.data;
            if (res.code === 200) {
              const _enTxt = data.str
              resolve(_enTxt)
            }
            reject(res)
          }).catch(err => {
            reject(err)
            console.log(err)
          });
      })
    },
    showPopLogistic() {
      // this.showPop = 'logistic'
      Taro.navigateTo({
        url: `/subpages/myorder/logistic/index?orderSn=${this.orderSn}`
      });
    },
    onFind() {
      Taro.setStorageSync("STORE_ORDER_ITEM", this.order)
      Taro.navigateTo({
        url: `/subpages/myorder/invoice-detail/index`
      });
    },
    closePop() {
      this.showPop = null
    },
    //再次购买
    reCreateOrder() {
      Taro.navigateTo({
        url: `/subpages/checkout/index?orderSn=${this.orderSn}`
      });
    },
    //唤起支付
    payOrder() {
      if(this.payPenging) return;
      this.payPenging = true;
      const orderSn = this.orderSn
      return posPay({order_number: this.orderSn}).then(res => {
          if (RES_SUCCESS_CODE === res.code) {
            let _config = res.data 
            Taro.requestPayment({
              ..._config,
              success: res => {
                this.onAfterPayment(orderSn, 1)
                this.payPenging = false;
              },
              fail: err => {
                // this.onAfterPayment(orderSn, 2);
                Taro.showToast({ title: "支付失败"});
                this.payPenging = false;
              }
            });
          } else if (res.code == 449) {
            this.getOrderDetail()
            this.payPenging = false;
          } else {
            Taro.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
            this.payPenging = false;
          }
        }).catch(err => {
          console.log(err)
          this.payPenging = false;
          reject(err)
        });
    },

    /**
     * 付费订单支付结果处理
     * @param {String} sn 订单SN
     * @param {Number} status 支付结果. 1: 成功; 2: 失败
     */
    onAfterPayment(sn, status) {
      if (sn && status) {
        Taro.redirectTo({
          url: `/posPayPages/posPay/index?sn=${sn}&status=${status}`
        });
      } else {
        console.warn('@onAfterPayment::', sn, status);
      }
    },
    //取消订单原因弹框
    showPopCancel() {
      this.showPop = 'cancelReason'
    },
    //选择原因
    selectCancelReason(item) {
      this.cancelReasonList.forEach(v => v.checked = false)
      item.checked = true
      if (item.value == '其他') {
        this.currentCancelReason = this.editReason
        this.editable = true
      } else {
        this.currentCancelReason = item.value
        this.editable = false
      }
    },
    //取消订单
    cancelOrder() {
      if (!this.currentCancelReason) {
        // let _text = this.editReason == ''?'请输入取消订单的原因':'请选择取消订单的原因'
        let _text = '请选择取消订单的原因'
        Taro.showToast({
          title: _text,
          icon: 'none',
          duration: 2000
        })
        return false
      }
      return new Promise(async (resolve, reject) => {
        ajax({
          url: types.ORDER_CANCEL,
          data: {
            orderSn: this.orderSn,
            reason: this.currentCancelReason
          }
        }).then(res => {
          resolve(res)
          console.log(res)
          if (RES_SUCCESS_CODE === res.code) {
            Taro.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              success: res => {
                this.showPop = null
                this.getOrderDetail()
              }
            })
          } else {
            Taro.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(err => {
          Taro.showToast({
            title: err.message,
            icon: 'none',
            duration: 2000
          })
          console.log(err)
          reject(err)
        });
      });
    },
    //确认收货
    receiveOrder() {
      return new Promise(async (resolve, reject) => {
        ajax({
          url: types.ORDER_COMPLETE,
          data: {
            orderSn: this.orderSn,
          }
        }).then(res => {
          resolve(res)
          console.log(res)
          if (RES_SUCCESS_CODE === res.code) {
            Taro.showToast({
              title: '收货成功',
              icon: 'success',
              duration: 2000,
              success: res => {
                this.getOrderDetail()
              }
            })
          } else {
            Taro.showToast({
              title: res.message,
              icon: 'none',
              duration: 2000
            })
          }
        }).catch(err => {
          console.log(err)
          reject(err)
        });
      });
    },
    //申请退货
    showPopAfterSale(i) {
      this.showPop = 'afterSale'
      this.currentItemIndex = i
    },
    //退货
    refundOrder(i) {
      Taro.navigateTo({
        url: `/subpages/myorder/refund-only/index?orderSn=${this.orderSn}&itemIndex=${i}`
      });
    },
    // 跳pdp
    goPdpPage(v) {
      if (!v.colors) return;
      const { style_slug, product_slug } = v.colors;
      if (style_slug && product_slug) {
        // console.log('colors ------->', v)
        ssTrack.track_product_click(v.sku, v.style_display_name, v.style_product_type, true)
        Taro.navigateTo({
          url: `/subpages/pdp/index?style_slug=${style_slug}&product_slug=${product_slug}`
        });
      } else {
        console.warn('@onViewInfo::', v);
      }
    },
    //复制
    setClipboard() {
      const orderNum = this.orderType == DEFAULT_ORDER ? this.order.orderSn : this.order.order_number
      Taro.setClipboardData({
        data: orderNum,
        success: function (res) {
          Taro.getClipboardData({
            success: function (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    },
  }
}
</script>

  <!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss' >
.order-detail-page {
  width: 100vw;
  height: 100vh;
  position: relative;
  background: #FAF7F6;

  &.fixed {
    overflow: hidden;
  }

  .order-detail-part {
    background: #FAF7F6;
    padding-bottom: calc(80px + constant(safe-area-inset-bottom));
    padding-bottom: calc(80px + env(safe-area-inset-bottom));

    .order-detail-box {
      padding: 40rpx 32rpx;

      .item {
        position: relative;
        background-color: #fff;
        margin-bottom: 32rpx;
        border-radius: 8rpx;
        padding: 32rpx;

        .item-title {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 600;
          font-size: 28rpx;
          line-height: 120%;
          // letter-spacing: -0.399478px;
          color: #000000;
        }
      }

      .item-row {
        display: flex;
        justify-content: space-between;
        padding-bottom: 16px;

        .find-btn {
          height: 48px;
          width: 144px;
          border: 1PX solid #000;
          border-radius: 86px;
          font-size: 24px;
          line-height: 45px;
          text-align: center;
        }
      }

      .status-box {
        padding: 32rpx;

        .status {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 600;
          font-size: 32rpx;
          line-height: 120%;
          color: #000000;
        }

        .sub-status {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 300;
          font-size: 28rpx;
          line-height: 100%;
          color: #000;
          margin-top: 32rpx;
          display: flex;
          align-items: center;

          .icon-clock {
            width: 30rpx;
            height: 30rpx;
            margin-right: 8rpx;
          }
        }
      }

      .address-box {
        padding: 40rpx 32rpx;

        .receiver {
          display: flex;
          align-items: center;
          justify-content: space-between;

          .name {
            display: flex;
            align-items: center;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 28rpx;
            line-height: 28rpx;
            color: #000000;

            .icon-address-order {
              width: 48rpx;
              height: 48rpx;
              margin-right: 16rpx;
            }
          }

          .tel {
            font-family: 'On Diatype Standard';
            font-style: normal;
            font-weight: 400;
            font-size: 28rpx;
            line-height: 28rpx;
            color: #000000;
          }
        }

        .address {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 24rpx;
          line-height: 32rpx;
          color: #767676;
          margin-top: 28rpx;
        }
      }

      .product-box {
        padding: 0;

        .product-title {
          padding: 32rpx 32rpx 0;
        }

        .item-product {
          padding: 32rpx;
          border-bottom: 2rpx solid #FBF7F6;

          .item-status {
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 26rpx;
            line-height: 120%;
            color: #000000;
            margin-bottom: 32rpx;
          }

          .product {
            display: flex;
            align-items: center;

            .p-img-box {
              width: 168rpx;
              height: 168rpx;
              margin-right: 40rpx;

              .p-img {
                width: 168rpx;
                height: 168rpx;
              }
            }

            .p-info {
              min-width: 400rpx;
              flex: 1;

              .p-name {
                font-family: 'On Diatype Standard';
                font-style: normal;
                font-weight: 500;
                font-size: 28rpx;
                color: #000;
                line-height: 150%;
                // margin-bottom: 16rpx;
              }

              .p-desc {
                font-family: 'On Diatype Standard';
                font-style: normal;
                font-weight: 500;
                font-size: 24rpx;
                color: #000000;
                line-height: 150%;
                margin-bottom: 12rpx;
              }

              .p-style {
                // display: flex;
                // align-items: center;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 24rpx;
                line-height: 24rpx;
                color: #767676;
                margin-top: 8rpx;
                margin-bottom: 32rpx;
                line-height: 150%;

                .p-color {
                  margin-top: 8rpx;
                  // margin-right: 32rpx;
                }
              }

              .p-price {
                display: flex;
                align-items: center;
                justify-content: space-between;
                font-family: 'On Diatype Standard';
                font-style: normal;
                font-weight: 400;
                font-size: 28rpx;
                line-height: 28rpx;
                color: #000;

                .p-num {
                  color: #767676;
                }
              }
            }
          }

          .btn-box {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 32rpx;

            .btn {
              width: 144rpx;
              height: 48rpx;
              border: 2rpx solid #000000;
              border-radius: 24rpx;
              display: flex;
              align-items: center;
              justify-content: center;
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 500;
              font-size: 22rpx;
              text-align: center;
              color: #000000;
            }
          }
        }

        .product-cost {
          padding: 16rpx 32rpx;
          border-bottom: 2rpx solid #FBF7F6;

          .cost-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: 'On Diatype Standard';
            font-style: normal;
            font-weight: 400;
            font-size: 28rpx;
            color: #767676;
            padding: 16rpx 0;
          }
        }

        .product-account {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'On Diatype Standard';
          font-style: normal;
          font-weight: 600;
          font-size: 28rpx;
          color: #000;
          padding: 32rpx;
        }

        .order-info-item {
          padding: 48rpx 32rpx;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-family: 'On Diatype Standard';
          font-style: normal;
          font-weight: 400;
          font-size: 28rpx;
          line-height: 28rpx;
          color: #767676;
          border-bottom: 2rpx solid #FAF7F6;

          .info-item-row {
            min-width: 140px;
          }

          .info-item-txt {
            // display: -webkit-box;
            // -webkit-line-clamp:1;
            // -webkit-box-orient:vertical;
            // text-overflow: ellipsis;
            // overflow: hidden;
            line-height: 38px;
            text-align: right;
          }
          &:last-child {
            border-bottom: none;
          }

          .order-info-item-right {
            max-width: 400rpx;
            text-align: right;
          }

          .icon-copy {
            width: 32rpx;
            height: 32rpx;
            margin-left: 8rpx;
            margin-bottom: 4rpx;
          }
        }
      }

      .logistic-box {
        padding-top: 32rpx;

        .logistic-steps {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 32rpx;

          .logistic-step {
            flex: 1;
            margin-right: 16rpx;
            box-sizing: border-box;

            .logistic-title {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 400;
              font-size: 24rpx;
              line-height: 28rpx;
              color: #000;
            }

            .logistic-sub-title {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 400;
              font-size: 24rpx;
              line-height: 24rpx;
              color: #767676;
              margin-top: 16rpx;
              width: 460rpx;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }

          }

          .logistic-btn {
            width: 144rpx;
            height: 48rpx;
            border: 2rpx solid #000000;
            border-radius: 24rpx;
            display: flex;
            align-items: center;
            justify-content: center;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 500;
            font-size: 22rpx;
            text-align: center;
            // // letter-spacing: -0.38px;
            color: #000000;
          }
        }
      }

      .bottom-btn-box {
        width: 100%;
        height: 96rpx;
        border: 2rpx solid #000000;
        border-radius: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 32rpx;
        line-height: 125%;
        color: #000000;
        margin-top: 16rpx;

        &.type2 {
          border: none;
          background-color: #000;
          color: #fff;
        }
      }

    }
  }

  .account-box {
    width: 100%;
    padding: 32rpx;
    // padding-bottom: constant(safe-area-inset-bottom);
    // padding-bottom: env(safe-area-inset-bottom);
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    left: 0;
    bottom: 0;
    // bottom:calc(constant(safe-area-inset-bottom));
    // bottom:calc(env(safe-area-inset-bottom));
    z-index: 9;
    background-color: #fff;
    &.pos-account-box{
      height: 300rpx;
      padding-bottom: 50rpx;
      padding-top: 140rpx;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 1));
    }
    .account-box-top{
      height: 100rpx;
      width: 100%;
    }

    .account-left {
      .total-account {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 32rpx;
        line-height: 28rpx;
        // letter-spacing: -0.408px;
        color: #000000;
      }

      .account-note {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 24rpx;
        line-height: 28rpx;
        // letter-spacing: -0.408px;
        color: #767676;
        margin-top: 16rpx;
      }
    }

    .account-btn {
      width: 304rpx;
      height: 96rpx;
      background: #000000;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 86rpx;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 600;
      font-size: 28rpx;
      text-align: center;
      color: #FFFFFF;
    }
  }

  .pop-bottom-box {

    .pop-note {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 24rpx;
      line-height: 28rpx;
      color: #999999;
      margin-top: 16rpx;
    }

    .steps-box {
      padding: 0 8rpx;
      max-height: 600rpx;
      overflow-y: auto;

      .step {
        border-left: 2rpx solid #DFDFDF;
        padding-left: 56rpx;
        position: relative;
        // height: 148rpx;
        padding-bottom: 24rpx;

        &:last-child {
          border-left: 2rpx solid transparent;
        }

        .step-title {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 24rpx;
          line-height: 28rpx;
          // letter-spacing: -0.408px;
          color: #000;
        }

        .step-sub-title {
          margin-top: 16rpx;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 20rpx;
          line-height: 28px;
          // letter-spacing: -0.408px;
          color: #767676;
          min-height: 80rpx;
        }

        .step-dot {
          width: 12rpx;
          height: 12rpx;
          background: #000;
          border-radius: 50%;
          position: absolute;
          top: 0;
          left: 0;
          transform: translate(-50%);
        }
      }
    }

    .checkbox-group {
      margin-top: 40rpx;

      .option-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24rpx 0;

        .option-text {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 28rpx;
          line-height: 28rpx;
          color: #333333;
        }

        .option-icon {
          width: 36rpx;
          height: 36rpx;
        }
      }
    }

    .describe-box {
      margin-top: 10rpx;
      width: 100%;
      height: 340rpx;
      border: 2rpx solid #CCCCCC;
      border-radius: 8rpx;
      box-sizing: border-box;
      padding: 16rpx;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 24rpx;
    }

    .btn-box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 64rpx 0 80rpx;

      .btn {
        width: 332rpx;
        height: 96rpx;
        box-sizing: border-box;
        border: 2rpx solid #000000;
        border-radius: 48rpx;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 28rpx;
        text-align: center;
        color: #000000;

        &.btn-confirm {
          color: #fff;
          background-color: #000;
        }
      }
    }

  }

  .pop-product-box {
    padding-left: 32rpx;
    padding-right: 32rpx;
    background-color: #FAF7F6;

    .pop-product-title {
      font-weight: 500;
      margin-bottom: 48rpx;
    }

    .item-product {
      // display: flex;
      // align-items: center;
      padding: 32rpx;
      // border-bottom: 2rpx solid #FBF7F6;
      background-color: #fff;
      margin-bottom: 24rpx;

      .product {
        display: flex;
        align-items: center;

        .p-img-box {
          width: 168rpx;
          height: 168rpx;
          margin-right: 40rpx;

          .p-img {
            width: 168rpx;
            height: 168rpx;
          }
        }

        .p-info {
          min-width: 400rpx;
          flex: 1;

          .p-name {
            font-family: 'On Diatype Standard';
            font-style: normal;
            font-weight: 500;
            font-size: 28rpx;
            color: #000;
            margin-bottom: 16rpx;
          }

          .p-style {
            display: flex;
            align-items: center;
            font-family: 'PingFang SC';
            font-style: normal;
            font-weight: 400;
            font-size: 24rpx;
            line-height: 24rpx;
            color: #767676;
            margin-bottom: 32rpx;

            .p-color {
              margin-right: 32rpx;
            }
          }

          .p-price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-family: 'On Diatype Standard';
            font-style: normal;
            font-weight: 400;
            font-size: 28rpx;
            line-height: 28rpx;
            color: #000;

            .p-num {
              color: #767676;
            }
          }
        }
      }

      .btn-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-top: 32rpx;

        .btn {
          width: 144rpx;
          height: 48rpx;
          border: 2rpx solid #000000;
          border-radius: 24rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 500;
          font-size: 22rpx;
          text-align: center;
          // // letter-spacing: -0.38px;
          color: #000000;
        }
      }
    }
  }

  .after_sale-box {
    .text {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 28rpx;
      line-height: 150%;
      display: flex;
      align-items: center;
      text-align: center;
      color: #000000;
    }

    .text_1 {
      margin-top: 32rpx;
    }

    .btn {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 400rpx;
      height: 96rpx;
      background: #000000;
      border-radius: 48rpx;
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 500;
      font-size: 32rpx;
      color: #fff;
      margin: 64rpx 0;
    }

    .text_3 {
      margin-top: 18rpx;

      .msg {
        border: none;
        background-color: transparent !important;
        display: flex;
        align-items: center;
        padding: 0;
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 28rpx;
        line-height: 150%;
        margin: 0;
        text-decoration: underline;

        &::after,
        &::before {
          content: '';
          border: none;
          border-radius: 0;
        }
      }

      .icon {
        width: 48rpx;
        height: 48rpx;
        margin-right: 8rpx;
      }
    }
  }

  .pop-center-box {
    width: 622rpx;
    padding: 80rpx 40rpx;
    box-sizing: border-box;
    background-color: white;
    border-radius: 24rpx;
    position: fixed;
    left: 50%;
    top: 50%;
    z-index: 3;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;

    .pop-close {
      width: 48rpx;
      height: 48rpx;
      position: absolute;
      top: 32rpx;
      right: 32rpx;
    }

    .pop-title {
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 500;
      font-size: 40rpx;
      line-height: 120%;
      text-align: center;
      color: #000000;
    }
  }
}
</style>
