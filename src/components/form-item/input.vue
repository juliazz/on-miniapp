<template>
  <view class="input-box">
    <!-- <input ref="input" class="input" :type="type" :value="desensitizify('mobile', currentValue, false)" :placeholder="placeholder" :maxlength="maxlength" @input="handleInput" @blur="handleBlur" /> -->
    <input ref="input" :class="['input',`line-${placeholderLine}`]" :type="type" :value="value" :disabled="disabled" :placeholder="placeholder" :maxlength="maxlength" @input="handleInput" @blur="handleBlur" />
    <text class="unit">{{unit}}</text>
    <block  v-if="type=='phone&&isAuthPhone'">
     <AuthPhoneBtn text="微信授权" v-on:mobilebind="getWxMobile"></AuthPhoneBtn>
    </block>
    <slot></slot>
  </view>
</template>
<script>
import Emitter from '@/utils/emitter.js';
import {
  desensitizify,errorHandler
} from "@/utils";
import AuthPhoneBtn from '@/components/form-item/input-auth-phone.vue'
import types from "@/store/types";
export default {
  name: 'iInput',
  components: { AuthPhoneBtn},
  mixins: [ Emitter ],
  props: {
    type: { type: String, default: 'text'},
    value: { type: String, default: ''},
    unit: { type: String, default: ''},
    isAuthPhone:{type: Boolean, default: true},
    disabled:{type: Boolean, default: false},
    placeholder:{type: String, default: '请输入'},
    maxlength:{type: Number, default: 20},
    placeholderLine:{type: Number, default: 1},
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
    desensitizify,
    handleInput(e) {
      // const value = e.target.value;
      // this.currentValue = value;
      // this.$emit('input', value);
      // this.dispatch('iFormItem', 'form-change', value);
    },
    handleBlur(e) {
      const value = e.target ? e.target.value : e.detail.value;
     
      this.$emit('input', value);
       this.currentValue = value;
      this.dispatch('iFormItem', 'form-blur', this.currentValue);
    },
    getWxMobile(phone){
      this.currentValue = phone
      this.$emit('input', phone);
       this.dispatch('iFormItem', 'form-blur', phone);
    }
  }
}
</script>
<style lang="scss">
  .input-placeholder{
    font-family: "PingFang SC";
    font-style: normal;
    font-weight: 400;
    font-size: 28rpx;
    color: #999;
    line-height: 1.5;
    // line-height: 28rpx !important;
  }
  .input{
    word-wrap: break-word;
    white-space: pre-line;
    &.line-2{
      height: 70rpx;
    }
  }
.input-box{
  position: relative;
  width: 65vw;
  .unit{
    position: absolute;
    top: 0rpx;
    left: 33%;
  }

}
</style>
