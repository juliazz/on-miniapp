<template>
  <view class="form-item-box">
    <view :class="['form-line','flex_hfs_vfs',type=='uploader' ? 'uploader' :'']">
      <label :for="labelFor" v-if="label" :class="['form-label',{'label-required': isRequired}]">{{label}}</label>
      <slot ></slot>
    </view>
    <view :class="['tips',tips ? 'showSelf' :'']">{{tips}}</view>
    <view :class="['message', isShowMes ? 'showSelf' : '']">{{message}}</view>
  </view>
</template>
<script>
import AsyncValidator from 'async-validator';
import Emitter from '@/utils/emitter';
export default {
  name: 'iFormItem',
  mixins: [ Emitter ],
  inject: [ 'form' ],
  props: {
    label: { type: String, default: '' },
    prop: { type: String },
    type:{type: String, default: 'input'},
    tips:{type: String, default: ''},
  },
  data() {
    return {
      isRequired: false, isShowMes: false, message: '', labelFor: this.type + new Date().valueOf()
    }
  },
  mounted() {
    if (this.prop) {
      // 触发父组件
      this.dispatch('iForm', 'form-add', this);
      // 设置初始值
      this.initialValue = this.fieldValue;
      this.setRules();
      if(this.prop=='teamRegion'){
        this.teamRegion=this.form.teamRegions
      }
    }
  },
  // 组件销毁前，将实例从 Form 的缓存中移除
  beforeDestroy () {
    this.dispatch('iForm', 'form-remove', this);
  },
  computed: {
    fieldValue() {
      return this.form.model[this.prop]
    }
  },
  methods: {
    setRules() {
      let rules = this.getRules();
      if (rules.length) {
        rules.forEach(rule => {
          if (rule.required !== undefined) this.isRequired = rule.required
        });
      }
      //监听子组件
      this.$on('form-blur', this.onFieldBlur);
      this.$on('form-change', this.onFieldChange);
    },
    getRules() {
      let formRules = this.form.rules;
      formRules = formRules ? formRules[this.prop] : [];
      return formRules;
    },

    // 过滤出符合要求的 rule 规则
    getFilteredRule (trigger) {
      const rules = this.getRules();
      return rules.filter(rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1);
    },
    /**
     * 校验表单数据
     * @param trigger 触发校验类型
     * @param callback 回调函数
     */
    validate(trigger, cb) {
      let rules = this.getFilteredRule(trigger);
      if(!rules || rules.length === 0) return true;
      // 使用 async-validator
      const validator = new AsyncValidator({ [this.prop]: rules });
      let model = {[this.prop]: this.fieldValue};
      validator.validate(model, { firstFields: true }, errors => {
        this.isShowMes = errors ? true : false;
        this.message = errors ? errors[0].message : '';
        if (cb) cb(this.message);
      })
    },
    resetField () {
      this.message = '';
      this.form.model[this.prop] = this.initialValue;
    },
    onFieldBlur() {
      this.validate('blur');
    },
    onFieldChange() {
      this.validate('change');
      this.dispatch('iForm', 'form-change', this);
    }
  }
}
</script>
<style lang="scss">
  .form-item-box{
    margin:10rpx 0;
    width: 100%;
    position: relative;

  }
  // .label-required:before {
  //   content: '*';
  //   color: red;
  // }
  .form-line{
    height: 84rpx;
    padding:0 12rpx;
    border-bottom: 1px solid #333;
    &.uploader{
      height: auto;
      padding-bottom: 32rpx;
    }
  }
  .form-label{
    min-width: 140rpx;
    line-height: 1.5;
    font-family: 'PingFang SC';
    font-weight: 400;
    font-size: 28rpx;
  }
  .tips,.message{
    opacity: 0;
    transition: all 0.3s;
    &.showSelf{
      opacity: 1;
    }
  }
  .message {
    font-size: 28rpx;
    color: #F13333;
    height: 40rpx;
    line-height: 40rpx;
    // position: absolute;
    // left: 0;
    // bottom: 4px;
  }
  .tips{
    margin-top: 4rpx;
    font-weight: 400;
    font-size: 24rpx;
    color: #999;
  }
</style>
