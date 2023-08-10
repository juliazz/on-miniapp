<template>
</template>

<script>


</script>

<style lang="scss">
.ucenter_wrapper {
  min-height: 100vh;
  .ucenter_header {
    width: 100%;
    .ucenter_header-bg {
      width: 100%;
      height: auto;
    }
  }
  .ucenter_content {
    padding: 0 32rpx 32rpx;
    background: #fbf7f6;
    .user_main {
      position: relative;
      margin-top: -160rpx;
      background-color: #fff;
      border-radius: 8rpx;
      .user_info {
        padding-bottom: 64rpx;
        .user_avatar-wrap {
          flex-direction: column;
          .user_avatar {
            width: 120rpx;
            height: 120rpx;
            margin-top: -60rpx;
            border-radius: 60rpx;
          }
          .user_title {
            display: inline-block;
            padding: 0 10rpx;
            margin: -15rpx auto 0;
            background: #ffc83a;
            border-radius: 14rpx;
            font-size: 16rpx;
            color: #070404;
            font-weight: 500;
            line-height: 30rpx;
          }
        }
        .user_name-wrap {
          margin-top: 56rpx;
          .user_name {
            font-size: 48rpx;
            color: #000;
            font-weight: 700;
            line-height: 1;
            position: relative;
          }
          .user_name-icon {
            width: 40rpx;
            height: auto;
            margin-left: 16rpx;
            position: absolute;
            top: 50%;
            right: -56rpx;
            transform: translateY(-50%);
          }
          .icon-erweima {
            font-size: 50rpx;
            font-weight: normal;
          }
          .user_name-nologin {
            font-size: 48rpx;
            color: #000;
            font-weight: 500;
            line-height: 1;
          }
        }
        .user_level-wrap {
          margin-top: 32rpx;
          .user_level-item {
            font-size: 24rpx;
            color: #000;
            line-height: 1;
            .text-bold {
              font-size: 28rpx;
              font-weight: 900;
              line-height: 1;
            }
            & + .user_level-item {
              margin-left: 32rpx;
            }
          }
          .user_level-nologin {
            font-size: 24rpx;
            color: #000;
            line-height: 1;
            image {
              width: 36rpx;
              height: auto;
              margin-left: 4rpx;
            }
          }
        }
      }
      .user_links {
        padding: 32rpx 0;
        border-top: 2rpx solid #faf7f6;
        display: flex;
        align-items: center;
        justify-content: space-around;
        flex-wrap: wrap;
        &.links_6 {
          .link_item {
            width: 33%;
          }
        }
        &.links_7,
        &.links_8 {
          justify-content: flex-start;
          .link_item {
            width: 25%;
          }
        }
        &.links_9,
        &.links_10 {
          justify-content: flex-start;
          .link_item {
            width: 20%;
          }
        }
        .link_item {
          width: 128rpx;
          height: 120rpx;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          .link_item-icon_wrap {
            height: 48rpx;
            .link_item-icon {
              width: 48rpx;
              height: auto;
            }
          }
          .link_item-text {
            font-size: 24rpx;
            color: #000;
            line-height: 150%;
            margin-top: 4rpx;
          }
        }
      }
    }
    .cyclon-promo{
      background: #fff;
      padding: 32rpx;
      margin: 32rpx 0 0;
      font-weight: 400;
      border-radius: 8rpx;
      .promo-title{
        font-weight: 400;
        font-size: 28rpx;
      }
      .clock-title{
        color: #767676;
        font-size: 20px;
      }
      .center-content{
        padding: 36rpx 0;
      }
      .left-proces{
        flex: 1;
        font-family: 'On Diatype Standard';
        font-style: normal;
        font-weight: 900;
        font-size: 80rpx;
        color: #767676;
      }
      .right-avator{
        flex: 2;
        padding-right: 20rpx;
        .avator-box{
          height: 108rpx;
          width: 108rpx;
          border-radius: 50%;
          overflow: hidden;
          margin: 4rpx;
          box-sizing: content-box;
          .avator-image{
            height: 100%;
            width: 100%;
          }
          &.active{
            border: 6rpx solid #DAD8D2;
          }
          &.hidden{
            display: none;
          }
          &.close{
            margin-left: -40px;
            &-2{
              margin-left: -52px;
            }
          }
          .icon-font{
            font-size: 40rpx;
            color: #DAD8D2;
          }
        }
        
        .place-avator{
          height: 100%;
          width: 100%;
          background-color: #fff;
          .icon-font{
            font-size: 108rpx;
          }
        }
        .num{
          background-color: #DAD8D2;
          color: #fff;
          font-family: 'On Diatype Standard';
          font-style: normal;
          font-weight: 700;
          font-size: 20Px;
        }


      }
      .bottom-line{
        font-style: normal;
        font-weight: 400;
        font-size: 20rpx;
        .promo-detail{
          color: #767676;
          min-width: 80rpx;
          border-bottom: 1px solid #767676;
        }
      }
    }
    .ucenter_swiper-wrap {
      margin-top: 32rpx;
      .ucenter_swiper {
        width: 100%;
        height: 320rpx;
        border-radius: 8rpx;
        overflow: hidden;
        .ucenter_swiper-item {
          .swiper_item-inner {
            width: 100%;
            height: 100%;
            .swiper_item-image {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
      .swiper_scrollbar {
        width: 400rpx;
        height: 1px;
        margin: 64rpx auto 0;
        background: #ccc;
        position: relative;
        .scrollbar-inner {
          width: 40rpx;
          height: 2px;
          background-color: #000;
          transition: all 0.1s ease-in;
          position: absolute;
          bottom: 0;
          left: 0;
        }
      }
    }
    .ucenter_link-wrap {
      padding: 0;
      margin: 0;
      background: transparent;
      border: none;
      border-radius: 0;
      &::after {
        content: "";
        border: none;
      }
    }
    .ucenter_links {
      padding: 32rpx 48rpx;
      margin-top: 32rpx;
      background-color: #fff;
      border-radius: 8rpx;
      overflow: hidden;
      .ucenter_link {
        width: 100%;
        height: 96rpx;
        &-text {
          font-size: 28px;
          color: #000;
          line-height: 96rpx;
          .ucenter_link-desc {
            font-size: 20rpx;
            color: #ccc;
            margin-left: 24rpx;
          }
        }
        &-icon {
          width: 28rpx;
          height: auto;
        }
      }
    }
  }
  // 弹窗 - QR-Code
  .center-dialog-inner {
    width: 622rpx;
    padding: 80rpx 48rpx;
    background: #fff;
    border-radius: 24rpx;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.1s ease-in;
    .dialog-closer {
      width: 48rpx;
      height: auto;
      position: absolute;
      top: 32rpx;
      right: 32rpx;
    }
    .dialog-header {
      font-size: 40rpx;
      color: #000;
      font-weight: 500;
      letter-spacing: -0.01em;
      text-align: center;
      line-height: 48rpx;
    }
    .dialog-content {
      margin-top: 40rpx;
      text-align: center;
      .codeImage {
        width: 400rpx;
        height: auto;
      }
    }
    .btn_group {
      margin-top: 40rpx;
      .btn {
        width: 400rpx;
      }
    }
  }
}
</style>
