<template>
  <Pager :header="headerOptions" :loader="true" :isCMSPage="true" @ready="onPagerReady">
    <CMSLayout :source="source" :extras="cmsExtras"  />
  </Pager>
</template>
<script>
import Pager from '@/components/common/Pager.vue';
import CMSLayout from '@/components/CMSLayout.vue';
import Taro from '@tarojs/taro';
import mixins from '@/utils/mixins';
import { loadCMSConfig, makeShare,fixCMSPath, getUCenterInfo ,makeBind, showCustomLoading, hideCustomLoading ,Vict} from '@/utils';

export default {
  name: 'LandingPage',
  mixins: [mixins],
  components: { Pager, CMSLayout },
  data() {
    return {
      headerOptions: {
        title: '',
        backgroundColor: 'transparent',
        style: 'white',
        forceFloat: true
      },
      channel:'',
      isUserInfoReady:null,
      source: {},
      cmsExtras: {}

    };
  },
  created() {},
  async onLoad(options) {
    // await getUCenterInfo()
    this.$initParams = options;
    const { frame , sid, key,channel} = options;
    if(key==='cloudsuffer_launch'){
      Taro.redirectTo({ url: `/onRunClubPackage/pages/landing/index?key=cloudsuffer_launch` });
      return
    }
    if (frame || key) this.pageKey = frame || key;
    if (sid) {
      await this.$store.state.loginPromise;
      wx.hideShareMenu();
      makeBind(sid).catch(err => console.warn('@onLoad.makeBind::', err));
      wx.showShareMenu({
        withShareTicket: true,
        menus: ['shareAppMessage', 'shareTimeline']
      });
    }
  },
  async onShow(options) {
    showCustomLoading();
    await this.$store.state.loginPromise;
    // await getUCenterInfo();
    await this.loadSource(this.pageKey);

    hideCustomLoading();
  },
  /**
   * 页面滚动事件处理
   */
  onPageScroll(evt) {
    this.onPageScrollFn(evt);
  },
  onShareTimeline(){
    const { share_title, share_image } = this.source || {};
    const { key, frame } = this.$initParams;
    let args = `key=${key || frame}`
    let title = share_title || "On昂跑官方体验中心";
    let page = `pages/landing/index`
    const promise =  makeShare(args, page, title, share_image)
    return {
      title,
      query:args,
      imageUrl:fixCMSPath(share_image)
    };
  },
  /**
   * 页面分享设置
   */
  onShareAppMessage(evt) {
    console.log('onShareAppMessage----->')
    const { key, frame } = Taro?.getCurrentInstance()?.router?.params || this.$initParams;
    const { share_title, share_image } = this.source || {};
    let args = `key=${key || frame}`
    let page = `pages/landing/index`
    let title = share_title || 'Dream On.'
    console.log('分享图片路径----->',share_image)
    const promise = makeShare(args, page, title, share_image)
    return {
      promise
    };
  },
  methods: {
    fixCMSPath,
    /**
     * `Pager` 组件 `Ready` 事件
     */
    onPagerReady(res) {
      this.cmsExtras = res;
    },
    /**
     * 数据加载
     */
    loadSource(name) {
      return loadCMSConfig('landing', name).then(res => {
        this.source = res;
        //
        const {share_title,header_background,header_float,header_style} =this.source
        if (share_title) this.headerOptions.title = share_title;
        if (header_background) this.headerOptions.backgroundColor = header_background;
        if (header_style) this.headerOptions.style = header_style;
        this.headerOptions.forceFloat = header_float;

      }).catch(err => console.warn(err));
    },

  }
}
</script>

<!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss'>

</style>
