<template>
  <CMSLayout
    :source="source"
    :extras="cmsExtras"
  />
</template>
<script>
import Pager from '@/components/common/Pager.vue';
import CMSLayout from '@/components/CMSLayout.vue';
import Taro from '@tarojs/taro';
import mixins from '@/utils/mixins';
import { loadCMSConfig, makeShare,fixCMSPath, getUCenterInfo ,makeBind, showCustomLoading, hideCustomLoading ,Vict} from '@/utils';

export default {
  name: 'LoadCms',
  components: { CMSLayout },
  mixins: [mixins],
  props:{
    pageKey: { type: String, default: '' }
  },
  data() {
    return {
      source: {},
      cmsExtras: {}

    };
  },
  created() {},
  async mounted() {
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
