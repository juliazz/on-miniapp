<template>
  <view class="slot-machine-container">
    <view class="reel-container">
      <view
        class="reel"
        :style="{animation: animationInfo[0] || '', 'border-right': '2rpx solid #D2D2D2'}"
      >
        <view
          v-for="(item, index ) in slotItems[0]"
          :key="index"
          class="symbol"
        >
          <image :src="item" />
        </view>
      </view>
      <view
        class="reel"
        :style="{animation: animationInfo[1] || '', 'border-right': '2rpx solid #D2D2D2'}"
      >
        <view
          v-for="(item, index ) in slotItems[1]"
          :key="index"
          class="symbol"
        >
          <image :src="item" />
        </view>
      </view>
      <view
        class="reel"
        :style="{animation: animationInfo[2] || ''}"
      >
        <view
          v-for="(item, index ) in slotItems[2]"
          :key="index"
          class="symbol"
        >
          <image :src="item" />
        </view>
      </view>
    </view>
  </view>
</template>
  <script>
  import mixins from "@/utils/mixins";
  export default {
    name: "TabSlider",
    components: { },
    mixins: [mixins],
    inject: {
      page:{default: {}}
    },
    props: {
      start: { type: Boolean, default: false },
      timeLength: { type: Number, default: 0 },
      slotLength: { type: Number, default: 0 },
      slotItems: { type: Array, default: ()=>{
        return []
      } },
      winOrNot:{ type: Boolean, default: false },
    },
    data() {
      return {
        animationClass: [],
        animationInfo: [],
        animationIsStart: false,
        
      };
    },
    watch:{
      start(){
        if(!this.animationIsStart && this.start){
          this.startAnimation()
        }
      }
    },
    mounted(){
    },
    methods: {
      startAnimation(){
        if(this.animationIsStart){
          return
        }
        this.animationIsStart = true
        this.addAnimationInfo()
        setTimeout(()=>{
          this.animationIsStart = false
          this.animationInfo = []
          this.$emit('endDraw')
        },(Number(this.timeLength) + 3) * 1000 )
      },
      addAnimationInfo(){
        this.animationInfo.push(`spin ${this.timeLength}s ease-out forwards`)
        //animationInfo
        setTimeout(() => {
          if(this.animationInfo.length < 3){
            this.addAnimationInfo()
          }
        }, 500);
      }
    }
  };
  </script>
  <style lang="scss">
  .reel-container{
    width: 720rpx;
    height: 240rpx;
    overflow: hidden;
    position: relative;
    display: flex;
    .reel{
        width: 240rpx;
        height: fit-content;
        overflow: hidden;
        position: relative;
    }
  }
  .reel {
  display: flex;
  flex-direction: column;
}
.lottery-go{
  animation: spin 12s ease-in-out forwards; /* 调整动画持续时间和动画效果 */
}
.symbol {
  height: 240px; /* 每个符号的高度 */
  width: 240rpx;
  line-height: 240px;
  text-align: center;
  font-size: 30px;
  position: relative;
  image{
    width: 100%;
    height: 100%;
  }
}

@keyframes spin {
  0% {
    transform: translateY(0);
  }
  // 10% {
  //   transform: translateY(-20%); /* 调整 translateY 的值以控制滚动距离 */
  // }
  // 35% {
  //   transform: translateY(calc(-100% + 400rpx)); /* 调整 translateY 的值以控制滚动距离 */
  // }
  90% {
    transform: translateY(calc(-100% + 480rpx)); /* 调整 translateY 的值以控制滚动距离 */
  }
  95% {
    transform: translateY(calc(-100% + 475rpx)); /* 调整 translateY 的值以控制滚动距离 */
  }
  100% {
    transform: translateY(calc(-100% + 480rpx)); /* 调整 translateY 的值以控制滚动距离 */
  }
}
/* 当动画结束后停止在最后一个符号上 */
.symbol:last-child {
  animation: none;
}

  </style>