<template>
 
</template>

<script>

</script>
<!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss'>
  .follow-wrapper {
    height: 64rpx; padding: 0 32rpx; background: #000; border-radius: 32rpx;
    position: fixed; top: 128rpx; right: 32rpx; z-index: 9;
    &:before {
      content: '';
      border-bottom: 12rpx solid #000;
      border-left: 16rpx solid transparent;
      border-right: 16rpx solid transparent;
      position: absolute; top: -12rpx; right: 96rpx;
    }
    .follow-text { font-size: 24rpx; color: #FFF; }
    .follow-closer { width: 32rpx; height: auto; margin-left: 16rpx; }
  }
</style>
