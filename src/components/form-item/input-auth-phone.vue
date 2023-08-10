<template>
  <view class="button-box">
   <button class="auth-button" open-type="getPhoneNumber" @getPhoneNumber="getPhoneNumber"
   >{{text}}</button>
  </view>
</template>
<script>
import Emitter from '@/utils/emitter.js';
import { RES_SUCCESS_CODE, ajax, errorHandler, getPhoneNumber, desensitizify } from '@/utils';
export default {
  name: 'auth-phone-btn',
  mixins: [ Emitter ],
  props: {
    text: { type: String, default: '微信'},
    type: { type: String, default: 'text'},
    value: { type: String, default: ''}
  },
  watch: {
    value(value) {
      this.currentValue = value
    }
  },
  data() {
    return { currentValue: this.value, id: this.label }
  },
  mounted () {
    if (this.$parent.labelFor) this.$refs.input.id = this.$parent.labelFor;
  },
  methods: {
        /**
     * 授权手机号码处理 & 登录
     */
    async getPhoneNumber(evt) {
      const { code } = evt.detail;
      if (!code) {
        // Taro.showToast({ title: '已拒绝', icon: 'none' });
        return false;
      }
      const res = await getPhoneNumber(code).catch(err => console.warn('@UCenter.getPhoneNumber::', err));
      if (res) {
        const { purePhoneNumber: mobile, countryCode } = res;
        this.mobileInfo = { mobile, countryCode };
        this.$emit('mobilebind', mobile);
        // this.dispatch('iFormItem', 'form-change', mobile);
        //
        // this.queryIsMemberByMobile(mobile).then(res => {
        //   const { info } = res;
        //   if (info) {
        //     this.userStatus = { ...info };
        //     this.onShowLogin4WxMobile();
        //   } else {
        //     console.warn('@getPhoneNumber::', res);
        //   }
        // }).catch(err => {
        //   errorHandler(err, true, '@getPhoneNumber::');
        // });
      } else {
        Taro.showToast({ title: '手机号码获取失败', icon: 'none' });
      }
    },
  }
}
</script>

<style lang="scss"  >
.button-box{
  position: absolute;
  height: 70rpx;
  right: 0;
  bottom:0;
  z-index: 99;
  width: auto;
}
  .auth-button {
    display:inline-block;
  }
</style>
