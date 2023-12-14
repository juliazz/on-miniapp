<template>
  <view
    :id="`_${identifier}_${config.id}`"
    :class="['single_image-wrapper', isEmbedded ? 'is-embedded' : '','cms_com']"
    :style="appearanceStyles"
    :data-cms-id="config.id"
  >
    <view
      class="single_image-container"
      :style="containerStyles"
      @tap="
        actionHandler(
          config.content &&
            config.content.image_link &&
            (!Array.isArray(config.content.buttons) ||
              !config.content.buttons.length)
            ? {
              type: 'link',
              data: config.content.image_link,
              appId: config.content.app_id,
            }
            : null
        )
      "
    >
      <image
        :class="['single_image-inner', isFullHeight ? 'fullHeight' : '']"
        :mode="isEmbedded ? 'aspectFill' : 'scaleToFill'"
        :webp="true"
        :src="fixCMSPath(config.content.image, 1125, false)"
        @load="onImageLoad($event)"
        @error="
          onLoadedError(
            { type: 'image', src: fixCMSPath(config.content.image, 1125, false) },
            $event
          )
        "
      />
      <view :class="['handle-area', isActive ? 'show' : '']">
        <!-- 主标题 -->
        <view
          v-if="config.content.title"
          class="single_image-ttile"
          :style="titleStyles"
        >
          {{
            config.content.title
          }}
        </view>
        <!-- 副标题 -->
        <view
          v-if="config.content.sub_title"
          class="single_image-sub_ttile"
          :style="subtitleStyles"
        >
          {{
            config.content.sub_title
          }}
        </view>
        <!-- 热区 -->
        <block
          v-if="
            config.content &&
              Array.isArray(config.content.hotareas) &&
              config.content.hotareas.length
          "
        >
          <view
            v-for="(hotArea, hotIdx) in config.content.hotareas"
            :key="hotIdx"
            class="single_image-hotarea"
            :style="toStylesForHotArea(hotArea)"
            @tap.stop=" jumpToLink(hotArea)"
          />
        </block>
        <!-- 按钮 -->
        <view
          v-if="
            config.content &&
              Array.isArray(config.content.buttons) &&
              config.content.buttons.length"
          class="single_image-btns btn_group"
          :style="btnGroupStyles"
        >
          <block
            v-for="(btn, btnIdx) in config.content.buttons"
            :key="btnIdx"
          >
            <button
              class="btn"
              :open-type="isCanShare(btn)"
              :style="toStylesForBtn(btn)"
              @tap.stop="jumpToLink(btn)"
            >
              {{ btn.text }}
            </button>
          </block>
        </view>
      </view>
    </view>
    <!-- 弹窗 - 登录方式引导 -->
    <LoginGuideVue
      :options="loginGuideOptions"
      @hide="onHideGuideClose"
      @success="onLoginSuccess"
      @confirm="onGuestConfirm"
    />
    <view
      v-if="showShadow"
      class="cny-shadow"
      @tap="subscribe"
    />
  </view>
</template>

<script>
import Taro,{ eventCenter, getCurrentInstance }  from "@tarojs/taro";
import types from "@/store/types";
import { fixCMSPath, fixCMSNumber, isTabbarPage} from "@/utils";
import mixins from "@/utils/mixins";
import LoginGuideVue from "@/components/common/LoginGuide.vue";
import deviceUtil from "@/utils/device-util";
import {
  getCnyInfo,
  cnyRecordSubcribe
} from "../utils";
export default {
  name: "SingleImage",
  components: { LoginGuideVue },
  mixins: [mixins],
  props: {
    /**
     * 唯一 ID
     */
    identifier: { type: String, required: true },
    /**
     * 组件配置
     */
    config: { type: Object, required: true },
    /**
     * 是否嵌入在其他容器类组件中
     */
    embedded: { type: Boolean, default: false },
    /**
     * 文字是否跟随图片滑动  1不滑动  0滑动
     */
    isFollow: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isFullHeight: { type: Boolean, default: false },
  },
  data() {
    return {
      loginToken: null,
      /**
       * 游客提示弹窗 - 用户是否已确认保持游客身份继续访问
       */
      isConfirmGuest: Taro.getStorageSync(types.DIALOG_GUEST_CONFIRM_UCENTER),
      /**
       * LoginGuide 配置选项
       */
      loginGuideOptions: {
        visible: false,
        hideAsGuest: false,
        enableGuest: false,
        btnText4Guest: "使用游客身份浏览",
        afterHandler: "",
        afterHandlerData: {},
      },
      selfHeight:null,
      isMember:null,
      need_auth:false,
      activityInfo: null,
      isSubcribe: false,
      showShadow: true
    };
  },
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      const { padding_top, padding_right, padding_bottom, padding_left } =
        this.config;
      padding_top &&
        !isNaN(padding_top) &&
        (styles.paddingTop = `${fixCMSNumber(padding_top)}rpx`);
      padding_right &&
        !isNaN(padding_right) &&
        (styles.paddingRight = `${fixCMSNumber(padding_right)}rpx`);
      padding_bottom &&
        !isNaN(padding_bottom) &&
        (styles.paddingBottom = `${fixCMSNumber(padding_bottom)}rpx`);
      padding_left &&
        !isNaN(padding_left) &&
        (styles.paddingLeft = `${fixCMSNumber(padding_left)}rpx`);
      return styles;
    },
    /**
     * 内容样式
     */
    containerStyles() {
      let styles = {};
      const { selfHeight } =this
      const { image_border_radius } = this.config.content;
      image_border_radius &&
        !isNaN(image_border_radius) &&
        (styles.borderRadius = `${fixCMSNumber(image_border_radius)}rpx`);
      selfHeight &&
      (styles.height = `${selfHeight}px`);
      return styles;
    },
    /**
     * 主标题样式
     */
    titleStyles() {
      let styles = {};
      const { font_color, title_bottom_space } = this.config.content;
      font_color && (styles.color = font_color);
      title_bottom_space &&
        !isNaN(title_bottom_space) &&
        (styles.bottom = `${fixCMSNumber(title_bottom_space)}rpx`);
      return styles;
    },
    /**
     * 副标题样式
     */
    subtitleStyles() {
      let styles = {};
      const { font_color, sub_title_bottom_space } = this.config.content;
      font_color && (styles.color = font_color);
      sub_title_bottom_space &&
        !isNaN(sub_title_bottom_space) &&
        (styles.bottom = `${fixCMSNumber(sub_title_bottom_space)}rpx`);
      return styles;
    },
    /**
     * 按钮组样式
     */
    btnGroupStyles() {
      let styles = {};
      const { button_bottom_space } = this.config.content;
      button_bottom_space &&
        !isNaN(button_bottom_space) &&
        (styles.bottom = `${fixCMSNumber(button_bottom_space)}rpx`);
      return styles;
    },
    /**
     * 是否内嵌在其他组件中
     */
    isEmbedded() {
      return !!this.embedded || this.isFullHeight;
    },
    /**
     * 是否需要授权
     */
    isPopAuth() {
      const { need_auth } = this.config.content;
      // const need_auth =true ;
      return need_auth && this.isMember;
    },
    isCanShare(){
      return function (btn) {
        const {can_share} =btn
        const {isMember} =this
        const type  = isMember&&can_share ? 'share' :''
        return type
      }
    }

  },
  created() {
    this.onPageShow = this.onPageShow.bind(this);
    this.$routerPage = getCurrentInstance().router;
    eventCenter.on(this.$routerPage.onShow, this.onPageShow);
  },
  async mounted() {
    await this.$store.state.loginPromise;
    // if(!Taro.getStorageSync('userInfo')){
    // await getUCenterInfo()
    // }
    this.isMember = Taro.getStorageSync('lw_loginStatus')
    // this.isMember = false
    this.initComponent();
    if(this.config && this.config.content && this.config.content.name === 'wxmp-roger-01'){
      this.getCnyInfo()
    }else{
      this.showShadow = false
    }
  },
  beforeDestroy() {
    eventCenter.off(this.$routerPage.onShow, this.onPageShow);
  },

  methods: {
    async getCnyInfo(){
      const res = await getCnyInfo()
      if(res.code === 200){
        this.activityInfo = res.data?.activity_info
        this.isSubcribe = res.data.has_subscribe
        if(this.activityInfo && this.activityInfo.status === 0){
          this.showShadow = true
        }else{
          this.showShadow = false
        }
      }
    },
    subscribe(){
      console.log('subscribe------------')
     if(!this.activityInfo || this.activityInfo.status > 0 ){
      return
     }
     if(this.isSubcribe){
      return Taro.showToast({ title: "订阅成功，敬请期待", icon: 'none'});
     }
      const templateIds = this.$store.state.templateId[process.env.NODE_ENV].templateIds.CNY2024
      const templateId= templateIds && templateIds.activityStart
      Taro.requestSubscribeMessage({
        tmplIds: [templateId],
        success: async (sres) => {
          console.log('sres---------', sres)
          if(sres[templateId] === 'accept'){
            cnyRecordSubcribe({type: 6})
            this.isSubcribe = true
            Taro.showToast({ title: "订阅成功", icon: 'none'});
          }
        },
        complete(sres){
          if(sres.errMsg.includes('requestSubscribeMessage:fail')){
            Taro.showToast({ title: "订阅失败", icon: 'none'});
          }
        }
      })
    },
    fixCMSPath,
    /**
     * 初始化组件
     */
    initComponent() {
      if (!this.embedded) {
        this.$emit("ready", { name: "SingleImage", images: 1 });
      }
    },
    async onPageShow() {
       //获取会员信息
        // await getUCenterInfo()
        this.isMember = Taro.getStorageSync('lw_loginStatus')
        // this.isMember = false
    },
    /**
     * 按钮样式
     */
    toStylesForBtn(itemConfig) {
      let styles = {};
      const { color, background_color, border_color } = itemConfig;
      color && (styles.color = color);
      styles.backgroundColor = background_color || "transparent";
      border_color && (styles.border =`2rpx solid ${border_color}`);
      return styles;
    },
    /**
     * 热区样式
     */
    toStylesForHotArea(itemConfig) {
      let styles = {};
      const { width, height, position_x, position_y } = itemConfig;
      width && !isNaN(width) && (styles.width = `${fixCMSNumber(width)}rpx`);
      height &&
        !isNaN(height) &&
        (styles.height = `${fixCMSNumber(height)}rpx`);
      position_x &&
        !isNaN(position_x) &&
        (styles.left = `${fixCMSNumber(position_x)}rpx`);
      position_y &&
        !isNaN(position_y) &&
        (styles.top = `${fixCMSNumber(position_y)}rpx`);
      return styles;
    },
    /**
     * 登录弹窗 - 引导
     */
    onShowLoginGuide(enableGuest) {
      // this.loginGuideOptions.enableGuest = !!enableGuest;
      this.loginGuideOptions.visible = true;
    },
    onImageLoad($event){
      this.onLoaded({ type: 'image', src: fixCMSPath(this.config.content.image, 1125) }, $event)
      const { isEmbedded } =this
      if(!isEmbedded){
        //  this.selfHeight = calcHeight
        this.initSelfHeight($event)
      }

    },
    initSelfHeight($event){
      const selector = `.single_image-wrapper`;
      Taro.nextTick(() => {
        Taro.createSelectorQuery().select(selector).boundingClientRect().exec(res => {
          if (res && res[0] && res[0].height) {
            const {width} = res[0]
            this.selfHeight =deviceUtil.getCalcWidth({...$event.detail},width)
          } else {
            this.initSelfHeight($event);
          }
        });
      })
    },

    /**
     * `LoginGuide` 关闭
     */
    onHideGuideClose() {
      this.loginGuideOptions.visible = false;
    },
    /**
     * `LoginGuide` 登录成功
     */
    onLoginSuccess() {
      this.onHideGuideClose();
      this.loginToken = 1;
      Taro.setStorageSync("lw_loginStatus", 1);
      Taro.setStorageSync("isUserMember", 1);
      this.isMember = true
    },
    /**
     * `LoginGuide` 确认继续使用`游客身份`
     */
    onGuestConfirm() {
      this.onHideGuideClose();
    },

    jumpToLink(btn) {
      // const btn={
      //   description:'',
      //   link:'/subpages/pdp/index?style_slug=cloud-x-3-60&product_slug=cloud-x-3-ivory-black-m-60.98706'
      // }
      const {need_auth,red_envelope_desc} =btn
      if (need_auth && !this.isMember) {
        if(red_envelope_desc=='redPacket'){
          this.loginGuideOptions.afterHandler = this.getRedPacket;
          this.loginGuideOptions.afterHandlerData = btn;
        }else{
          this.loginGuideOptions.afterHandler =  !btn.can_share?btn :null;
        }
        this.onShowLoginGuide(true);
      } else {
        if(red_envelope_desc=='redPacket'){
          this.getRedPacket(btn)
          return
        }
        !btn.can_share&&this.actionHandler({
          type:'link',
          data:btn.link,
          appid:btn.app_id
        })
      }
    },
    handleLink(link) {
      if (link.includes("http")) {
        Taro.navigateTo({
          url: `/pages/web-view/index?src=${encodeURIComponent(link)}`,
        });
      }
      else if(isTabbarPage(link)){
        Taro.switchTab({ url: link });
      }
      else {
        Taro.navigateTo({ url: link });
      }
    },
    getRedPacket(btn){
      const {link} =btn
      wx.showRedPackage({
        url: link,
        success: res=>{
          console.log('跳转成功了-----', res)
        }

      })
    }
  },
};
</script>

<style lang="scss">
.single_image-wrapper {
  width: 100%;
  position: relative;
  .single_image-container {
    position: relative;
    overflow: hidden;
    .single_image-inner {
      width: 100%;
      height: 100%;
      margin: 0;
      vertical-align: top;
      overflow: hidden;
      &.fullHeight {
        height: 100vh;
      }
    }

    .single_image-ttile {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 204rpx;
      font-size: 64rpx;
      line-height: 1;
      text-align: center;
    }

    .single_image-sub_ttile {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 144rpx;
      font-size: 36rpx;
      line-height: 1;
      text-align: center;
    }

    .single_image-hotarea {
      width: 0;
      height: 0;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      color: #fff;
    }

    .single_image-btns {
      width: 100%;
      position: absolute;
      left: 0;
      bottom: 24rpx;
      z-index: 2;
      /* .btn{
        background-color: transparent;
      } */

      .btn:first-child:last-child {
        width: 272rpx;
      }

    }

    .handle-area {
      opacity: 0;
      height: 0;
      &.show {
        opacity: 1;
        height: auto;
        transition: all 1s ease 0.3s;
      }
    }
  }

  &.is-embedded {
    height: 100%;

    .single_image-container {
      height: 100%;

      .single_image-inner {
        height: 100%;

        &.fullHeight {
          height: 100vh;
        }
      }
    }
  }
}
.cny-shadow{
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
