<template>
  <Pager :header="headerOptions" :loader="true" :pageStyle="pageOptions">
    <view class="join-page-wrapper">
      <image :src="codeUrl" mode="widthFix" :webp="true" @tap="onPreviewImage"></image>
      <!-- <image :src="fixCMSPath(codeUrl, 1125)" mode="widthFix" :webp="true" @tap="onPreviewImage"></image> -->
      <!-- <view> 识别二维码联系门店，获得更多服务 </view> -->
    </view>
  </Pager>
</template>
<script>
import Pager from "@/components/common/Pager.vue";
import Taro from "@tarojs/taro";
import types from "@/store/types";
import {
  showCustomLoading,
  hideCustomLoading,
  fixCMSPath,
} from "@/utils";
export default {
  name: "Club",
  components: { Pager },
  computed: {
    headerOptions() {
      let option = {
        backgroundColor: "#fff",
        style: "black",
        enableBack2Home: true,
      };
      const title = "联系门店";
      option.title = title;
      return option;
    },
  },
  data() {
    return {
      isLoad: null,
      channel: "online",
      orderId: null, //活动id
      orderStatus: "ordered", // ordered
      btnText: "立即预约", //
      navTitle: "",
      codeUrl:'',
      pageOptions: {
        backgroundColor: "#fff",
      },
    };
  },
  mounted() {
  },
  async onLoad() {
    let {shopCode = "" } =
      Taro.getCurrentInstance().router.params;
    showCustomLoading();
    // this.codeUrl='http://on-running.oss-cn-shanghai.aliyuncs.com/cms_stage/images/74670e5b0201a9285b4801ab865b6109.jpg'
    this.codeUrl=shopCode
    hideCustomLoading();
    Taro.hideShareMenu();
  },
  methods: {
    fixCMSPath,
    /**
     * 图片预览
     */
     onPreviewImage() {
      const code = fixCMSPath(this.codeUrl, 1125)
      const imageSet = [code];
      if (code) {
        Taro.previewImage({ current: code, urls: imageSet });
      } else {
        console.warn('@onPreviewImage::','二维码路径不存在');
      }
    },
  },
};
</script>

<style lang="scss"  >
.join-page-wrapper {
  display: flex;
  align-items: center;
  height: 80vh;
  justify-content: center;
  flex-wrap: wrap;
  background: #fff;
  color: #000;

}
</style>
