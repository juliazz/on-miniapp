<template>
  <view class="radio-group">
    <view class="radio-box" v-for="(item,index) in list" :key="index" :vlaue="currentValue">
      <view class="form_field-radio" @tap="toggle(item,index)" ref="radiobox">
        <image class="radio-icon" mode="widthFix " src="@/assets/images/icons/checkbox-checked.svg" v-if="currentValue==item.value" />
        <image class="radio-icon" mode="widthFix " src="@/assets/images/icons/checkbox.svg" v-else />
        <view class="label">{{item.label}}</view>
        <slot></slot>
      </view>
    </view>
  </view>
</template>
<script>
  import Emitter from '@/utils/emitter.js';

  export default {
    name: 'iCheckboxGroup',
    mixins: [ Emitter ],
    props: {
      value: { },
      list:{
        type: Array,
        default () {
          return [];
        }
      }
    },
    data () {
      return {
        currentValue: this.value,
        childrens: []
      };
    },
    methods: {
      toggle(item,index){
        const {value} =item
        console.log(value)
        if(value==this.currentValue){
          this.currentValue=null
          this.$emit('input', null);
          this.dispatch('iFormItem', 'on-form-change', null);
          return
        }
        this.currentValue=value
        this.$emit('input', value);
        this.dispatch('iFormItem', 'on-form-change', value);
      }
    },
    mounted () {

    },
    watch: {
      value (value) {
        this.currentValue = value
      }
    }
  };
</script>
<style lang='scss'>
.radio-group{
  display: flex;
  justify-content: space-between;
  .form_field-radio {
    padding: 0 20rpx ;
    display: flex;
    align-items: center;
    justify-content: center;
    .radio-icon {
      width: 28rpx;
      height: 28rpx;
    }
    .radio-text {
      font-size: 24rpx;
      color: #000;
      line-height: 1;
      margin-left: 24rpx;
    }
  }

}
</style>
