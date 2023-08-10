import Taro from '@tarojs/taro';
import { throttle ,ajax,RES_SUCCESS_CODE,errorHandler,isTabbarPage} from '@/utils';
import types from '@/store/types';
export default {
  created() {
    this.onPageScrollFn = throttle(this.onPageScrollFn, 1000 / 60);
  },
  methods: {
    /**
     * 页面滚动事件处理
     */
     onPageScrollFn(evt) {
      Taro.eventCenter.trigger('scroll', evt);
      const { forceFloat } =this.headerOptions
      let changeable = (evt.scrollTop > 10)|| !forceFloat ? true : false
      this.toggleHeaderStyle( changeable );
    },
    /**
     * `Header` 样式切换
     */
    toggleHeaderStyle( changeable ) {
      if (typeof this.headerOptions === 'object') {
        this.headerOptions.backgroundColor = changeable ? 'white' : 'transparent';
        this.headerOptions.style = changeable ? 'black' : 'white';
      }
    },

    /**
     *
     * @param {Object} action
     * @returns
     */
    actionHandler(action) {
      if (!action || typeof action != 'object') return false;
      let { type, data, appId } = action;
      switch(type) {
        case "link":
          if(appId){
            Taro.navigateToMiniProgram({
              appId: appId,
              path: data,
              success: function(res) {
                // 打开成功
              }
            })
            return;
          }

         const httpIndex =data.indexOf('http')
          if(httpIndex==0){
            // cms 微信公众号文章
            Taro.navigateTo({ url: `/pages/web-view/index?src=${encodeURIComponent(data)}` });
          }
          else if (isTabbarPage(data)){
            Taro.switchTab({ url: data });
          }
          else{
            Taro.navigateTo({ url: data });
          }
          break;
        default:
          break;
      }
    },
    /**
     * 资源加载成功
     */
    onLoaded(resource, evt) {
      if (!resource) return;
      const { type, src } = resource;
      const { currentTarget: { id } , detail: { width, height } } = evt.mpEvent;
      this.$store.commit('addResource', {
        type,
        info: { id, src, statusCode: 200, statusText: 'Successed', width, height }
      });
    },
    /**
     * 资源加载失败
     */
    onLoadedError(resource, evt) {
      if (!resource) return;
      const { type, src } = resource;
      const { currentTarget: { id } , detail: { errMsg } } = evt.mpEvent || {};
      this.$store.commit('addResource', {
        type,
        info: { id, src, statusCode: 404, statusText: errMsg, width: 0, height: 0 }
      });
    }
  }
}
