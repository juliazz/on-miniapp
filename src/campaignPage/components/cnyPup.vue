<template>
  <view
    v-if="show"
    :style="bgStyle"
    class="activity-pup"
    @tap="close"
  >
    <view
      :class="{'is-bottom': isBottom}"
      :style="{...customStyle, ...style,background: bgColor}"
      class="pup-content" 
    >
      <image
        v-if="showClose"
        mode="widthFix"
        src="@/assets/images/icons/close-noborder.svg"
        class="modal-closer"
        @tap="close"
      />
      <slot />
    </view>
  </view>
</template>
<script>
export default {
  name: "CnyPup",
 props:{
  wWidth:{ type: Number, default() { return 375 } },
  show:{ type: Boolean, default() { return false } },
  isBottom:{ type: Boolean, default() { return false } },
  bgColor:{ type: String, default() { return 'white' } },
  customStyle: { type: Object, default() { return {} } },
  bgStyle: { type: Object, default() { return {} } },
  showClose:{ type: Boolean, default() { return true } },
 },
  data() {
    return {
      style:{}
    };
  },
  computed: {
  },
  watch:{
    show(val){
      if(this.isBottom && val){
        setTimeout(()=>{
          this.style = {bottom: '0px'}
        },200)
      }else{
        this.style = {}
      }
      if(val){
        wx.setPageStyle({
          style: {
            overflow: 'hidden',
            width: '100%',
            height: '100%'
          }
        })
      }else{
        wx.setPageStyle({
          style: {
            overflow: 'initial'
          }
        })
      }
    }
  },
  mounted() {
  },
  methods: {
    close(){
      this.$emit('close')
    }
  }
};
</script>

<style lang="scss">
.activity-pup{
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,.5);
  z-index: 99;
  display: flex;
  justify-content: center;
  align-items: center;
  .pup-content{
    box-sizing: border-box;
    padding: 40rpx;
    width: 90%;
    min-height: 100rpx;
    border-radius: 10rpx;
    position: relative;
    overflow: hidden;
    &.is-bottom{
      width: 100%;
      position: absolute;
      left: 0;
      bottom: -100%;
      transition: bottom .5s;
    }
  }
}
.close{
  position: absolute;
  top: 5rpx;
  right: 20rpx;
}
.modal-closer{
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    right: 20rpx;
    top: 20rpx;
    z-index: 1;
  }
</style>
