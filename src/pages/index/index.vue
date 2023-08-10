<template>
 
</template>

<script>
import Pager from '@/components/common/Pager.vue';
import mixins from '@/utils/mixins';

export default {
  name: 'Index',
  mixins: [mixins],
  components: { Pager },
  data() {
    return {
      headerOptions: {
        title: '首页',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        style: 'white',
        forceFloat: true,
        enableSearch: true,
        enableScaner: true,
        enableLogo4M: true
      },
      source: {},
      cmsExtras: {},
      announcement: null,
      showContact: false,
      scrollHeight:0,
    };
  },
  computed: {
  
  },
  created() {
   
  },
  /**
   * 页面分享设置
   */
  onShareAppMessage(evt) {
    const { share_title, share_image } = this.source || {};
    let args = ''
    let page = `pages/index/index`
    let title = share_title || 'Dream On.'
    const promise = makeShare(args, page, title, share_image)
    return {
      promise
    };
  },
  onShareTimeline(){
    const { share_title, share_image } = this.source || {};
    let page = `pages/index/index`
    let args = ''
    let title = share_title || 'On昂跑官方体验中心'
    makeShare(args, page, title, share_image)
    console.log('分享图片路径----->',share_image)
    return {
      title,
      query:'',
      imageUrl:fixCMSPath(share_image)
    };
  },
  async onLoad(options) {
    const { sid } = options;
    if(sid){
      await this.$store.state.loginPromise;
      wx.hideShareMenu();
      makeBind(sid).then((res)=>{
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      })
        console.log(res)
      })
    }
  },
  onPullDownRefresh: function () {
  },
  /**
   * 页面滚动事件处理
   */
  onPageScroll(evt) {

  },

  methods: {
   
  }
}
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
