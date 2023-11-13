<template>
  <view class="we-form">
     <slot></slot>
  </view>
</template>
<script>
import FormDataHandler from "@/utils/from-Handler.js";
import Emitter from '@/utils/emitter';
import types from '@/store/types';
import Taro from "@tarojs/taro";
import {ajax, showCustomLoading, hideCustomLoading ,errorHandler,RES_SUCCESS_CODE} from '@/utils';
export default {
  name: 'iForm',
  mixins: [ Emitter ],
  // inject: [ 'pop' ],
  data() {
    return { fields: [] }
  },
  props: {
    model: { type: Object },
    rules: { type: Object }
  },
  mounted() {

  },
  provide() {
    return { form: this }
  },
  methods: {
    resetFields() {
      this.fields.forEach(field => field.resetField())
    },
    validate(cb) {
      return new Promise(resolve => {
        let valid = true, count = 0;
        this.fields.forEach(field => {
          field.validate('', error => {
            if (error) valid = false;
            if (++count === this.fields.length) {
              resolve(valid);
              if (typeof cb === 'function') cb(valid);
            }
          })
        })
      })
    },
    setShoneSize(gender,shoneSizeFeild){
      const {regions,shoeSize} = FormDataHandler.getFormData();
      const chilPicker=shoneSizeFeild.$children[0]
      if(gender==1){
        chilPicker.formOptions.shoeSize=shoeSize.mens
      }else if(gender==2){
        chilPicker.formOptions.shoeSize=shoeSize.womens
      }else{
        chilPicker.formOptions.shoeSize=shoeSize.womens
      }
      chilPicker.formValues.gender=gender
    },
    setColorRange(product_id,sizeFeild){
      this.setOrderShoneSize(product_id,sizeFeild,'shoeSizeOrder')
    },
    //门店预约
    async setOrderShoneSize(product_id,shoneSizeFeild,sizeKey='shoeSize'){
      const chilPicker=shoneSizeFeild.$children[0]
      showCustomLoading()
      const shoeSizeList= await this.getOrderShowSize(product_id)
      hideCustomLoading()
      chilPicker.formOptions[sizeKey]=shoeSizeList
      chilPicker.formValues.gender=product_id
    },
    getOrderShowSize(product_id){
      if(!product_id){ Taro.showToast({ title: '颜色选择有误', icon: 'none',duration: 2000  }); return }
      return new Promise((resolve,reject)=>{
        ajax({
        url: types.GET_SUBSCRIBE_SIZE,
        host: $ON_API_HOST,
        method: "POST",
        data:{
          product_id
        }
      }).then(res => {
        const { code, data } = res;
        if (code === RES_SUCCESS_CODE) {
          resolve(data)
        } else {
          reject()
          errorHandler(res, false, '@showsize');
        }
      }).catch(err => {
        reject()
        errorHandler(err, false, '@showsize');
      });
      })
    }
  },
  created() {
    this.dispatch('getNameAvator', 'form-add',  this);
    this.$on('form-add', field => {
      if (field) this.fields.push(field);
      if(field.prop=='shoeSizeOrder'){
       let shoneSizeFeild =this.fields.find((item)=>{
        return item.prop=='color'
      })
      //如果颜色有值需先加载尺码
      // shoneSizeFeild&&shoneSizeFeild.fieldValue&&this.setColorRange(shoneSizeFeild.fieldValue,field)
      }

    });
    this.$on('form-remove', field => {
      if (field.prop) this.fields.splice(this.fields.indexOf(field), 1);
    })
    this.$on('form-change', field => {
      if(field.prop=='gender'){
        //squadRace的鞋码
       let shoneSizeFeild =this.fields.find((item)=>{
        return item.prop=='shoeSize'
      })
      shoneSizeFeild&&this.setShoneSize(field.fieldValue,shoneSizeFeild)
      }
      if(field.prop=='color'){
        let orderShoneSizeFeild =this.fields.find((item)=>{
        return item.prop=='shoeSizeOrder'
      })
      //选择后吐出的是一个对象
      const {product_id} =field.fieldValue||{}
      orderShoneSizeFeild&&this.setColorRange(product_id,orderShoneSizeFeild)
      }
      console.log('form-change------', field.fieldValue)
      this.dispatch('getNameAvator', 'form-change',  field.fieldValue);
    })
    // 引入赛区数据
    const {teamRegions} = FormDataHandler.getFormData();
    this.teamRegions=teamRegions

  }
}
</script>
<style lang="scss">
  .we-form{
    border-top: 1rpx solid #000;
    padding:32rpx 32rpx 0;

  }
  </style>
