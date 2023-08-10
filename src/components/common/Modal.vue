<template>
  <block>
    <view v-if="toast" class="vict-toast-con" :style="appearanceStyles(true)">
      <slot></slot>
    </view>
    <view v-else-if="action" :hidden="!open">
      <view v-if="mask" class="vict-mask vict-fixed-top" @tap="!!maskClose? '_onTapCancel' : null"  :catch-move="prevent_touch_move"></view>
      <view :class="['vict-action-con', open? 'show' : 'hide']" :catch-move="prevent_touch_move">
        <slot></slot>
        <view class="vict-action-close" v-if="showCancel" data-name="name" @tap="_onTapCancel">{{cancel.text}}</view>
      </view>
    </view>
    <view wx:else :hidden="!open">
      <view v-if="mask&&open" :catch-move="prevent_touch_move"  :class="['vict-mask','vict-fixed-top']"
          @tap="!!maskClose? '_onTapCancel' : null" >
        </view>
      <view :class="['vict-modal-dialog vict-fixed-top', open? 'show' : 'hide']" :style="appearanceStyles" :catch-move="prevent_touch_move">
          <block v-if="!!closeIcon">
          <view class="vict-modal-close bottom vict-flex-row vict-absolute-center" v-if="bottomCloseIcon"  @tap="_onTapCancel"><slot name="vict-modal-close-bottom"></slot></view>
          <view class="vict-modal-close vict-flex-row" v-else  @tap="_onTapCancel"><slot name="vict-modal-close"></slot></view>
        </block>
        <view class="vict-modal-title">{{title}}<slot name="modal-title" ></slot></view>
        <view class="vict-modal-content"><slot></slot></view>
        <view class="vict-modal-btn-con vict-flex-row" v-if="btnText.length">
          <view v-if="btnText.length > 1 " @tap="_onTapCancel" class="vict-modal-btn vict-modal-btn-cancel">{{btnText[1]}}</view>
          <view class="vict-modal-btn vict-modal-btn-ensure" @tap="_onTapEnsure">
            <slot name="icon-ensure"></slot> {{btnText[0] }}
          </view>
        </view>
        <view v-else >
          <slot name="vict-modal-footer"></slot>
        </view>
      </view>
    </view>
  </block>
</template>

<script>
import Taro from '@tarojs/taro';
import { RES_SUCCESS_CODE, ajax, errorHandler, getPhoneNumber, desensitizify, VTypes } from '@/utils';
import types from '@/store/types';

export default {
  name: "Modal",
  props: {
    duration: { type: Number ,default: 2 },
    custom: { type: Boolean, default: false },
    mask: { type: Boolean, default: true },
    open: { type: Boolean ,default:false},
    bottomCloseIcon: { type: Boolean ,default:false},
    width: { type: Number ,default:538},
    top: { type: String, default: '44%' },
    bottom:{type: Boolean, default: false }, //底部的弹框
    toast: { type: Boolean, default: false }, // 是否是 toast 模式
    maskClose: { type: Boolean ,default:false},
    closeIcon: { type: Boolean, default: true },
    action: { type: Boolean ,default:false},
    title: { type: String ,default:'标题'},
    btnText: { type: Array ,default:['标题']},
  },
  computed: {
    /**
     * 组件样式
     */
    appearanceStyles(isToast) {
      let styles = {};
      const { animation ,width,top} = this;
      styles.width=width+'rpx'
      styles.top=top
      console.log(19999,top)
       if(!isToast){
        return styles;
      }
      styles.animation=animation
      return styles;

    },
    isOpen(val){
      console.log('computed',val)
      return this.open;
    }

  },
  data() {
    return {
      animation:'display: none;',
    }
  },
  beforeDestroy() {
  },
  methods: {
    /**
     * 重置场景
     */
    _closeModal() { this.open=false },
    _showToast() {
      let { duration } = this;
      let animation = `animation: vict-toasting linear ${duration}s; animation-fill-mode:forwards;`;
      this.animation=animation
      let timer = setTimeout(_ => {
        this.animation= 'display: none;'
        this.open=false
        clearTimeout(timer)
        }, this.duration * 1000)
    },
    prevent_touch_move() { },
    _onTapCancel(e) {
    if (!this.custom) { this._closeModal(); }
    this.$emit('onCancel', _ => { this._closeModal() });
  },
  _onTapEnsure(e) {
    console.log('_onTapEnsure-------------->');
    if (!this.custom) { this.open=false }
    this.$emit('onEnsure', _ => { this.open =false });
  },

  },
}
</script>

<style lang="scss">
@import "../../assets/css/vict_modal.scss";

</style>
