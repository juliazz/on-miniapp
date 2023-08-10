<template>
  <view class="check-box">
    <input
      v-if="group"
      type="checkbox"
      :disabled="disabled"
      :value="label"
      v-model="model"
      @change="change"
    />
    <view class="form_field-checkbox flex_hfs_vc" @tap="toggleNotice" v-else ref="checkbox">
      <view class="checkbox-par">
        <view class="checkbox-icon-box flex_abs_center" mode="widthFix"  >
          <view class="checkbox-icon-point" mode="widthFix" v-if="currentValue"></view>
        </view>
      </view>
      <slot></slot>
    </view>
  </view>
</template>

<script>
import Emitter from "@/utils/emitter.js";
import { findComponentUpward } from "@/utils/assist.js";

export default {
  name: "iCheckbox",
  mixins: [Emitter],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [String, Number, Boolean],
      default: false,
    },
    trueValue: {
      type: [String, Number, Boolean],
      default: true,
    },
    falseValue: {
      type: [String, Number, Boolean],
      default: false,
    },
    label: {
      type: [String, Number, Boolean],
    },
  },
  data() {
    return {
      currentValue: this.value,
      model: [],
      group: false,
      parent: null,
    };
  },
  mounted() {
    if (this.$parent.labelFor) this.$refs.checkbox.id = this.$parent.labelFor;
    this.parent = findComponentUpward(this, "iCheckboxGroup");

    if (this.parent) {
      this.group = true;
    }

    if (this.group) {
      this.parent.updateModel(true);
    }
  },
  watch: {
    value(value) {
      // 备用后期支持多选框
      // if (val === this.trueValue || val === this.falseValue) {
      //   this.updateModel();
      // } else {
      //   throw "Value should be trueValue or falseValue.";
      // }
      this.currentValue = value
    },
  },
  methods: {
    change(event) {
      if (this.disabled) {
        return false;
      }
      const checked = event.target.checked;
      this.currentValue = checked;
      const value = checked ? this.trueValue : this.falseValue;
      this.$emit("input", value);
      if (this.group) {
        this.parent.change(this.model);
      } else {
        this.$emit("on-change", value);
        this.dispatch("iFormItem", "on-form-change", value);
      }
    },
    updateModel() {
      this.currentValue= !this.currentValue
      // this.currentValue = this.value === this.trueValue;
    },
    toggleNotice() {
      this.currentValue= !this.currentValue
      this.$emit('input', this.currentValue);
      this.dispatch('iFormItem', 'form-change', this.currentValue);
    },

  },
};
</script>
<style lang='scss'>
.check-box{
  flex: 1;
  .form_field-checkbox {

    .checkbox-icon-box {
      // position: absolute;
      // left: 0;top: 0;
      box-sizing: border-box;
      width: 32rpx;
      height: 32rpx;
      border-radius: 4rpx;
      border: 2rpx solid #fff;

    }
    .checkbox-text {
      font-size: 24rpx;
      color: #000;
      line-height: 1;
      margin-left: 24rpx;
    }
    .checkbox-par{
      position: relative;
      margin-right: 20rpx;
    }

    .checkbox-icon-point{
      height: 20rpx;
      width: 20rpx;
      background: #fff;
    }

  }

}
</style>
