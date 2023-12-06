<template>
  <block>
    <view v-if="toast" class="vict-toast-con" :style="appearanceStyles(true)">
      <slot></slot>
    </view>
    <view v-if="open" >
      <view v-if="mask&&open" :catch-move="prevent_touch_move"  :class="['vict-mask','vict-fixed-top']"
          @tap="!!maskClose? '_onTapCancel' : null" >
        </view>
      <view :class="[`'vict-modal-dialog vict-fixed-top,${position}-modal`, open? 'show' : 'hide']" :style="appearanceStyles" :catch-move="prevent_touch_move">
          <block v-if="!!closeIcon">
          <!-- <view class="vict-modal-close bottom vict-flex-row vict-absolute-center" v-if="bottomCloseIcon"  @tap="_onTapCancel"><slot name="vict-modal-close-bottom"></slot></view> -->
          <view class="vict-modal-close vict-flex-row" @tap="_onTapCancel">
            <image class="stage-closer" mode="widthFix" src="@/assets/images/icons/close-noborder.svg"  />
            <slot name="vict-modal-close"></slot>
          </view>
        </block>
        <view class="vict-modal-title" v-if="title">{{title}}<slot name="modal-title" ></slot></view>
        <view class="vict-modal-content"><slot></slot></view>
        <view :class="['vict-modal-btn-con',':',btnText.length > 1?'vict-flex-row':'flex_hc_vc']" v-if="btnText.length">
          <button v-if="btnText.length > 1 " @tap="_onTapCancel" class="btn ">{{btnText[1]}}</button>
          <button class="btn btn-black" @tap="_onTapEnsure">
            <slot name="icon-ensure"></slot> {{btnText[0] }}
          </button>
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
    width: { type: Number ,default:100},
    top: { type: String, default: '44%' },
    bottom: { type: String, default: '0' },
    position:{type: String, default: 'center' }, // 位置
    toast: { type: Boolean, default: false }, // 是否是 toast 模式
    maskClose: { type: Boolean ,default:false},
    closeIcon: { type: Boolean, default: true },
    action: { type: Boolean ,default:false},
    title: { type: String ,default:''},
    btnText: { type: Array ,default: () => []},
  },
  computed: {
    /**
     * 组件样式
     */
    appearanceStyles(isToast) {
      let styles = {};
      const { animation ,width,top,position} = this;
      styles.width=width+'vw'
      if(position=='bottom'){
        styles.top='auto'
        styles.bottom=0
      }else{
        styles.bottom='auto'
        styles.top=top
      }
      
       if(!isToast){
        return styles;
      }
      styles.animation=animation
      return styles;

    },
    isOpen(val){
      return this.open;
    }

  },
  data() {
    return {
      animation:'display: none;',
    }
  },
  created() {
  },
  beforeDestroy() {
  },
  methods: {
    /**
     * 重置场景
     */
    _closeModal() { 
      // this.open=false 
      this.$emit('onClose');
    },
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
    console.log('this.custom',this.custom)
    this.$emit('onCancel', _ => { this._closeModal() });
  },
  _onTapEnsure(e) {
    
    // if (!this.custom) { this.open=false }
    this.$emit('onEnsure', _ => { this._closeModal() });
  },

  },
}
</script>

<style lang="scss">
@import "../../assets/css/vict_modal.scss";

</style>
