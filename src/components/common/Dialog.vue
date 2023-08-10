<template>
  <view :class="['dialog-wrapper', `dialog-${position}`]" v-if="visible">
    <view class="dialog-container">
      <slot></slot>
    </view>
    <view class="mask" :catch-move="true" @tap="onClickMask"></view>
  </view>
</template>

<script>
export default {
  name: 'Dialog',
  components: { },
  props: {
    visible: { type: Boolean, default: false },
    position: { type: String, default: 'center', validator: v => ['center', 'bottom'].includes(v) },
    maskClosable: { type: Boolean, default: true }
  },
  data() {
    return { };
  },
  methods: {
    onClickMask(){
      if (this.maskClosable) this.$emit('close');
    }
  }
}

</script>

<!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss'>
.dialog-wrapper {
  .mask {
    width: 100vw; height: 100vh; background-color: rgba(0, 0, 0, 0.7);
    position: fixed; top: 0; left: 0; z-index: 99;
    display: flex; align-items: center; justify-content: center;
  }
  &.dialog-center {
    .dialog-container { position: fixed; top:50%; left:50%; z-index: 100; transform: translate(-50%, -50%); }
  }
  &.dialog-bottom {
    .dialog-container { width: 100%; position: fixed; left: 0; bottom: 0; z-index: 100; }
  }
}
</style>
