<template>
  <Pager :header="headerOptions" :sidebar="['contact']">
  </Pager>
</template>
<script>
  import Pager from '@/components/common/Pager.vue';

  export default {
    name: 'cart',
    components: { Pager},
    data() {
      return {
        headerOptions: {
          title: '购物袋',
          backgroundColor: 'white',
          style: 'black',
          forceShowBacker:false
        },
      };
    },
  }

</script>

<!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss'>
  .pager-wrapper{
    background-color: #FAF7F6;
  }
  .cart-page {
    width: 100vw;
    position: relative;
    background: #FAF7F6;
    box-sizing: border-box;

    .cart-part {
      .empty-box {
        display: flex;
        flex-direction: column;
        text-align: center;
        align-items: center;
        padding-top: 96rpx;
        padding-bottom: 80rpx;

        .empty-title {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 500;
          font-size: 40rpx;
          line-height: 120%;
          color: #000;
        }

        .empty-note {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 28rpx;
          line-height: 120%;
          letter-spacing: 0.2em;
          color: #767676;
          margin-top: 24rpx;
        }

        .empty-btn {
          width: 304rpx;
          height: 96rpx;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background: #000000;
          border-radius: 80rpx;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 28rpx;
          letter-spacing: 0.01em;
          color: #FFFFFF;
          margin-top: 64rpx;
        }
      }

      .cart-box {
        padding: 32rpx 32rpx 160rpx;

        .item {
          display: flex;
          align-items: center;
          padding: 32rpx;
          position: relative;
          background-color: #fff;
          margin-bottom: 16rpx;

          .p-img {
            width: 168rpx;
            height: 168rpx;
            margin-right: 28rpx;
          }

          .p-info {
            width: 320rpx;

            .p-name {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 500;
              font-size: 28rpx;
              line-height: 150%;
              color: #333333;
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
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 400;
              font-size: 28rpx;
              line-height: 48rpx;
              color: #999999;
              margin-bottom: 16rpx;
            }

            .p-price {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 400;
              font-size: 24rpx;
              line-height: 32rpx;
              color: #333333;
              margin-bottom: 32rpx;
              position: absolute;
              top: 40rpx;
              right: 32rpx;
            }

            .count-box {
              display: flex;
              align-items: center;
              font-family: 'On DiatypeSemi Mono';
              font-style: normal;
              font-weight: 400;
              font-size: 24rpx;
              .p-btn-box{
                padding:8rpx
              }

              .p-btn {
                width: 40rpx;
                height: 40rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 32rpx;
                border-radius: 50%;
                background: #F7F7F7;

                .icon {
                  width: 20rpx;
                  height: 20rpx
                }
              }

              .p-num {
                width: 100rpx;
                height: 40rpx;
                display: flex;
                align-items: center;
                justify-content: center;
              }

              .note{
                color: #F46666;
                font-size: 24rpx;
                padding-left: 20rpx;
              }
            }

            .no-stock {
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 500;
              font-size: 28rpx;
              line-height: 28rpx;
              // text-align: center;
              color: #767676;
              display: flex;
              align-items: center;

              &.limited{
                font-size: 20rpx;
                padding-top: 10rpx;
                color: #F46666;
              }
              .notice-btn{
                width: 144rpx;
                height: 48rpx;
                background: #000000;
                border-radius: 48rpx;
                font-family: 'PingFang SC';
                font-style: normal;
                font-weight: 400;
                font-size: 24rpx;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #FFFFFF;
                margin-left:24rpx;
              }
            }
          }

          .p-delete {
            width: 40rpx;
            height: 40rpx;
            position: absolute;
            bottom: 32rpx;
            right: 32rpx;
          }
        }
      }
    }

    .recommend-part {
      &.has-items { padding-bottom: 160rpx; }
    }

    .account-box {
      width: 100%;
      height: 160rpx;
      padding: 32rpx;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: fixed;
      left: 0;
      bottom:0;
      box-sizing: border-box;
      z-index: 1;
      background-color: #fff;
      box-shadow: 0px -2rpx 16rpx rgba(0, 0, 0, 0.02);

      .account-left {
        .total-account {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 500;
          font-size: 32rpx;
          line-height: 28rpx;
          color: #000000;
        }

        .account-note {
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 24rpx;
          line-height: 28rpx;
          // letter-spacing: -0.408px;
          color: #999999;
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
        &.disabled{
          opacity: 0.3;
        }
      }
    }
    .pop-box {
      width: 622rpx;
      height: 726rpx;
      border-radius: 24rpx;
      background-color: #fff;
      position: relative;
      padding: 80rpx 48rpx;
      box-sizing: border-box;
      text-align: center;

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
        letter-spacing: -0.01em;
        color: #000000;
        margin-bottom: 32rpx;
      }

      .sub-title {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 400;
        font-size: 28rpx;
        line-height: 150%;
        text-align: center;
        color: #333333;
      }

      .p-img {
        width: 232rpx;
        height: 232rpx;
        margin-top: 32rpx;
      }

      .pop-btn-box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 48rpx;

        // width:256rpx;
        // height:96rpx;
        .btn-move {
          width: 256rpx;
          height: 96rpx;
          // background-color: #000;
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 28rpx;
          letter-spacing: 0.01em;
          color: #000;
          border-radius: 80rpx;
          border: 2rpx solid #000;
        }

        .btn-del {
          width: 256rpx;
          height: 96rpx;
          background-color: #000;
          display: flex;
          align-items: center;
          text-align: center;
          justify-content: center;
          font-family: 'PingFang SC';
          font-style: normal;
          font-weight: 400;
          font-size: 28rpx;
          letter-spacing: 0.01em;
          color: #FFFFFF;
          border-radius: 80rpx;
        }
      }
    }
  }

</style>
