<template>
 
</template>

<script>

</script>

<style lang="scss">
  .category-wrapper {
    min-height: 100vh; background: #FAF7F6;padding-bottom: 48rpx;
    .category_navs-wrap {
      .category_navs-fixed {
        width: 100%; background: #FAF7F6; position: fixed; top: 0; left: 0; z-index: 1;
        .category_nav-header {
          padding: 0 32rpx 0 0; display: flex; justify-content: space-between; align-items: flex-start;
          .category_1st-items {
            box-sizing: border-box; width: calc(100% - 180rpx); height: 98rpx; padding: 0; white-space: nowrap; position: relative;
            &::after {
              content: ''; width: 104rpx; height: 60rpx; background: linear-gradient(268.7deg, #FAF7F6 14.55%, rgba(250, 247, 246, 0) 108.67%);
              position: absolute; top: 16rpx; right: 0; pointer-events: none;
            }
            .category_nav-item {
              display: inline-block; padding: 16px 0 22rpx 0; margin-left: 32rpx; font-size: 40rpx; color: #000; line-height: 1.5; white-space: nowrap; vertical-align: middle;
              &:last-child { margin-right: 48rpx; }
              &.active {
                padding: 8rpx 0 12rpx 0; font-size: 52rpx; font-weight: 500; position: relative;
                &::after {
                  content: ""; width: 100%; height: 4rpx; background-color: #000; position: absolute; bottom: 0; left: 0;
                }
              }
            }
          }
          .extra-tools {
            width: 160rpx; height: 100%; padding: 15rpx 0 19rpx 0;
            .icon-wrap {
              width: 64rpx; height: 64rpx; background: #F0ECEB; border-radius: 50%;
              .search-icon { width: 48rpx; height: auto; }
              .viewmode-icon { width: 40rpx; height: auto; }
              & + .icon-wrap { margin-left: 32rpx; background: rgba(0, 0, 0, 0.05); border-radius: 80rpx; }
            }
          }
          &.no-search {
            .category_1st-items { width: calc(100% - 80rpx); }
            .extra-tools { width: 64rpx; }
          }
        }
        .category_2nd-navs {
          box-sizing: border-box; height: 184rpx; padding: 38rpx 0; white-space: nowrap;
          .nav-item{
            display: inline-block;
            &:last-child {
              padding-right: 32rpx;
            }
            &:first-child{
              padding-left: 20rpx;
            }
          }
          .category_2nd-nav {
            display: inline-block; padding: 28rpx 48rpx; margin-left: 12rpx; background-color: #FFF; border: 6rpx solid transparent; border-radius: 80rpx;
            font-size: 32rpx; color: #000; line-height: 125%; font-weight: 500; white-space: nowrap;
            &.active { border-color: #DAD8D2; }
          }
        }
        &.vm-grid .category_nav-header { padding-bottom: 64rpx; }
      }
      //
      .category_navs-placeholder {
        width: 100%; height: 162rpx;
        &.has-nav2nd { height: 282rpx; }
      }
    }
    .category_nav-content {
      padding: 0 0 0 32rpx; position: relative;
      .category_2nd-items {
        .category_2nd-swiper {
          height: 924rpx;
          .category_2nd-swiper_item {
            .swiper_item-tile {
              width: 100%; height: 100%; padding: 0 16rpx 0 0;
              .swiper_item-tile_inner {
                width: 100%; height: 100%; border-radius: 16rpx; overflow: hidden; position: relative;
                filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.05)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1));
                .swiper_item-video, .swiper_item-cover { width: 100%; height: 100%; object-fit: cover; object-position: center; }
                .swiper_item-mask {
                  width: 100%; height: 540rpx; position: absolute; bottom: 0; left: 0;
                  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.4) 51.56%, rgba(0, 0, 0, 0.6) 100%);
                }
                .swiper_item-navs {
                  box-sizing: border-box; width: 100%; height: 96rpx; padding: 0 32rpx; white-space: nowrap; overflow-x: auto; position: absolute; bottom: 48rpx; left: 0;
                  .category_3rd-nav {
                    display: inline-block; padding: 28rpx 48rpx; background-color: #FFF; border: 0; border-radius: 96rpx;
                    font-size: 32rpx; color: #000; line-height: 125%; white-space: nowrap;
                    & + .category_3rd-nav { margin-left: 16rpx; }
                  }
                }
                .entrance-icon {
                  width: 72rpx; height: auto;
                  position: absolute; bottom: 48rpx; right: 48rpx;
                }
              }
            }
          }
        }
        .category_2nd-grid {
          // padding: 64rpx 0 0 0;
          // margin-top: 64rpx;
          display: flex; flex-wrap: wrap; justify-content: flex-start; align-items: stretch;
          .category_grid-item {
            width: 336rpx; height: 504rpx; margin: 16rpx 16rpx 0 0; background: #FFF; border-radius: 16rpx; overflow: hidden; position: relative;
            filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.05)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1));
            //
            &:nth-child(1), &:nth-child(2) { margin-top: 0; }
            .grid_item-video, .grid_item-cover { width: 100%; height: 100%; object-fit: cover; object-position: center; }
            .grid_item-mask {
              width: 100%; height: 380rpx; position: absolute; bottom: 0; left: 0;
              background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 51.56%, rgba(0, 0, 0, 0.7) 100%);
            }
            .grid_item-name {
              padding: 0 32rpx; font-size: 40rpx; color: #FFF; line-height: 150%;
              position: absolute; left: 0; bottom: 40rpx;
              &--navs { bottom: 144rpx; }
            }
            .grid_item-navs {
              box-sizing: border-box; width: 100%; padding: 0 30.5rpx; white-space: nowrap; overflow-x: auto; position: absolute; bottom: 48rpx; left: 0;
              .grid_item-nav {
                display: inline-block; padding: 17rpx 39.5rpx; background-color: #FFF; border: none; border-radius: 80rpx;
                font-size: 24rpx; color: #000; line-height: 125%; letter-spacing: 0.01em; white-space: nowrap;
                & + .grid_item-nav { margin-left: 16rpx; }
              }
            }
          }
        }
      }
      //
      .swiper_scrollbar {
        width: 400rpx; height: 1Px; margin: 32rpx auto 0; background-color: #CCC; transform: translateX(-16rpx);
        &-inner {
          width: 40rpx; height: 2Px; background-color: #000; transition: all 0.1s linear;
          position: absolute; bottom:0; left: 0;
        }
      }
      //
      &.vm-grid { padding-bottom: 40rpx; }
    }
  }
</style>
