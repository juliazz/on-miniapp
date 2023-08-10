<template>
  <Pager  >
    <web-view class="web_view-wrapper" :src="link"></web-view>
  </Pager>
</template>

<script>
import Taro from '@tarojs/taro';
import Pager from '@/components/common/Pager.vue';
import { makeShare, makeBind } from '@/utils';
export default {
  name: 'WebView',
  components: { Pager },
  data() {
    return {
      link:'',// 'https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU3NTY5NTQ2NQ==&scene=124#wechat_redirect'
    }
  },
  /**
   * 页面分享设置
   */
  onShareAppMessage(evt) {
    let args = ''
    let page = `pages/index/index`
    let title = 'Dream On.'
    const promise = makeShare(args, page, title)
    return {
      promise
    };
  },
  onLoad(options) {
    const { sid , src} = options;
    if(sid){
      makeBind(sid).then((res)=>{
        console.log(res)
      })
    }
    if(src){
      this.link = decodeURIComponent(src)
    }else{
      this.link = 'https://mp.weixin.qq.com/s/CfW6grvA14u8o4JfoBhOhg'
    }

    console.log(this.link)
  },
}
</script>

<style>

</style>
