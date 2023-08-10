<template>
    <!-- <view class="annui flex center" @tap="mapWeizhi">开始配送</view> -->
    <view class="info" >
    <view>
      后台获取次数：{{count}}
    </view>
      <view class="index">
        返回信息:
        <br/><br/><br/><br/>
        <!-- <CMSLayout :source="source" /> -->
        <!-- <video src="https://on-running.oss-cn-shanghai.aliyuncs.com/cms_stage/videos/108 00437-tank_T-ss22-denim_navy-m-video Graded.mp4" autoplay="true" /> -->
      </view>
      <view class=""  v-for="(node, index) in source" :key="index">
        <text>{{index}}:</text>
        <text>{{node}}</text>
      </view>
    <view>
    <view> -------------------- </view>
      前台获取次数：{{frontCount}}
    </view>
      <view class="index">
        返回信息:
        <br/><br/><br/><br/>
        <!-- <CMSLayout :source="source" /> -->
        <!-- <video src="https://on-running.oss-cn-shanghai.aliyuncs.com/cms_stage/videos/108 00437-tank_T-ss22-denim_navy-m-video Graded.mp4" autoplay="true" /> -->
      </view>
      <view class=""  v-for="(node, index) in frontSource" :key="index">
        <text>{{index}}:</text>
        <text>{{node}}</text>
      </view>
      <view> -------------------- </view>
      <cell bind:startmessage='startmessage' bind:completemessage="completemessage" url='https://work.weixin.qq.com/gm/bc2fd3ff23bc7710c310710ecd34dd57'  />

      <view class="downloa" @tap="downloadVideo">下载视频</view>
      <br/>
      <view class="downloa" @tap="downQRcode">下载二维码</view>
      <image class="qrCode" :src='imgUrl'></image>

</view>
</template>

<script>
// 


</script>

<!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss'>
.info{
  padding:10vh 20px;
  .index{
    margin-bottom: 10px;
  }
  .qrCode{
    height: 100px;
    width: 100px;
  }
}
</style>
