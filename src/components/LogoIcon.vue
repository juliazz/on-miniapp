<template>
  <view class="logo-wrapper">
    <image class="logo-icon" mode='widthFix' src='@/assets/images/icons/logo.svg' />
    <view class="logo-text">On-Running</view>
  </view>
</template>

<script>
export default { 
  name: 'LogoIcon',
  methods: {
    sonClick () {
      this.$emit('show', 111, 222);
    }
  } }
</script>

<style lang='scss'>
.logo-wrapper {
  image { width: 160rpx; }
}
</style>
