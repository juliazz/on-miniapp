<template>
  <view class="cny-poster-container">
    <view class="cny-poster">
      <image
        :src="fixCMSPath(imgUrl, 1125)"
        mode="widthFix"
        @load="load"
      />
      <view v-if="winOrNot" class="winner-phone">
        {{ desensitizify(mobile) }}
      </view>
    </view>
    <view :style="{opacity: showBtn ? 1 : 0}" class="cny-btn-container">
      <view
        v-if="winOrNot"
        class="cny-poster-btn"
        @tap="createImg($event)"
      >
        <text> 保存图片</text>
        <text class="iconfont icon-btn_log cny-btn-log-icon" />
      </view>
      <view
        v-else
        class="cny-poster-btn"
        @tap="goBack"
      >
        <text> 返回活动</text>
        <text class="iconfont icon-btn_log cny-btn-log-icon" />
      </view>
    </view>
    <view class="canvas-container-reward">
      <canvas
        :style="{'width': '590px', height: '850px'}"
        canvas-id="reward-canvas"
      />
    </view>
  </view>
</template>
<script>
import Taro from '@tarojs/taro';
import {
    fixCMSPath,numFormat,
    showCustomLoading, hideCustomLoading,
    desensitizify
  } from '@/utils';
import avatarIcon from '@/assets/images/icons/avatar.svg'
export default {
  name: 'PosterC',
  components: {},
  props:{
    winOrNot:{ type: Boolean, default() { return false } },
    imgUrl: { type: String, default() { return '' } },
    mobile: { type: String, default() { return '' } }
  },
   data() {
    return {
      steps: 0,
      pageOptions: {
        backgroundColor: "#fff",
      },
      progressWidth: '0px',
      screenWidth: 375,
      imgShow: false,
      myCanvas: null,
      prizeInfo: {},
      canvasImg:'',
      showPup: false,
      showRule: false,
      showRankList: false,
      rankList: [],
      avatarIcon,
      userInfo:{},
      phone: '',
      isGetTitle: false,
      hadGetTitle: false,
      showBtn: false
    };
  },
  async mounted() {
    await this.$nextTick(()=>{
      this.myCanvas = Taro.createCanvasContext('reward-canvas')
      // this.createImg()
    })
  },
  methods: {
    load(){
      setTimeout(()=>{
        this.showBtn = true
      },500)
    },
    fixCMSPath,
    makeNumber(data){
      return numFormat(data)
    },
    showModal(key){
      if(key === 'rule'){
        this.showPup = true
        this.showRule = true
      }else{
        this.showPup = true
        this.showRankList = true
      }
    },
    saveImageToPhotosAlbum(canvasImg){
      console.log('saveImageToPhotosAlbum---------', canvasImg)
      // this.createImg()
      const that = this
      if(canvasImg){
        Taro.saveImageToPhotosAlbum({
        filePath: canvasImg,
        success(res) {
          console.log('saveImageToPhotosAlbum', res)
         },
         complete(res){
          console.log('saveImageToPhotosAlbum',res)
          if(res.errMsg === "saveImageToPhotosAlbum:ok"){
            Taro.showToast({ title: "保存成功"});
            that.$emit('close')
          }else{
            Taro.showToast({ title: "保存失败"});
          }
          hideCustomLoading()
         }
      })
      }else{
        Taro.showToast({ title: "保存失败"});
        hideCustomLoading()
      }
     
    },
    handleCanvarToImg() {
        const that=this;
        Taro.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 590,
          height: 850,
          canvasId: 'reward-canvas',
          success: function(res) {
            that.canvasImg=res.tempFilePath
            that.saveImageToPhotosAlbum(res.tempFilePath)
          }
        })
    },
    createImg(e){
      e.stopPropagation()
      const that = this
      showCustomLoading()
      setTimeout(()=>{
        console.log('createImg setTimeout')
        wx.getImageInfo({
        src: that.imgUrl,
        success(res){
          console.log('createImg success', res)
          const context = that.myCanvas
          context.drawImage(res.path, 0, 0, res.width, res.height, 0,0,590, 850,);
          context.setFontSize(16)
          context.font='fusion-pixel-10px-monospaced-zh_hans'
          context.setFillStyle('#D2D2D2')
          context.fillText((that.desensitizify(that.mobile)), 296, 495)
          context.draw(false, that.handleCanvarToImg)
        },
        complete(res){
          console.log('createImg', res)
          if(res.errMsg !=="getImageInfo:ok"){
            Taro.showToast({ title: "保存失败"});
            hideCustomLoading()
          }
        }
      })
      }, 3000)
    },
    goBack(){
      this.$emit('close')
    },
    desensitizify(data){
      if(data){
        return desensitizify('mobile', data)
      }
    }
  }
}
</script>

<style lang="scss">
.cny-poster-container{
  width: 100%;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  font-family: 'fusion-pixel-10px-monospaced-zh_hans';
  .canvas-container-reward{
    position: absolute;
    left: 10000px;
    top: 0;
    overflow: hidden;
    opacity: 0;
    .canvas{
      position: absolute;
      left: 10000px;
      top: 0;
      overflow: hidden;
      opacity: 0;
    }
  }
  .sub-container{
    width: 710rpx;
    position: relative;
    overflow: visible;
    margin-top: 40rpx;
    padding-bottom: 40rpx;
    min-height: 650rpx;
    .main-img-container{
      width: 100%;
      min-height: 1120rpx;
      overflow: hidden;
      display: flex;
    }
  }
  .reward-img{
    width: 100%;
    min-height: 650rpx;
    display: block;
  }
  .side-bar{
    position: absolute;
    right: -20rpx;
    top: 30rpx;
    .side-bar-item{
      background: rgb(249, 63, 76, 0.05);
      width: 140rpx;
      height: 50rpx;
      border-radius:50rpx 0 0 50rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      color: #767676;
    }
    .read-rule{
      margin-bottom: 20rpx;
    }
  }
  .cny-poster{
    overflow: hidden;
    position: relative;
    min-height: 900rpx;
    width: 100%;
    image{
      width: 100%;
    }
    .winner-phone{
      position: absolute;
      top: 537rpx;
      left: 350rpx;
      color: #D2D2D2;

    }
  }
}
.cny-btn-container{
  width: 100%;
  height: 200rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  
  .cny-poster-btn{
    height: 96rpx;
    width: 290rpx;
    background: #F0C38C;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #B22526;
    font-size: 40rpx;
    .cny-btn-log-icon{
      width: 66px;
      height: 44rpx;
      margin-left: 10rpx;
      font-size: 40rpx;
    }
  }
}

</style>
