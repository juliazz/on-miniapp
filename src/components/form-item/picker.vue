<template>
  <view class="form-feild">
    <!-- 生日 -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'date'"
      mode="date"
      :start="startDate"
      :end="allowMaxDate"
      :value="formValues[data]"
      :data-no-change="true"
      @change="onPickerChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues[data]||formValues[data]!==''">{{
          formValues[data]
        }}</view>
        <view class="picker_text placeholder-cls" v-else>请选择</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
     <!-- 称谓（性别） -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'gender'"
      :range="formOptions.gender"
      range-key="label"
      :value="genderStr"
      @change="onPickerChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues.gender !== ''">{{
          formOptions.gender[formValues.gender].label
        }}</view>
        <view class="picker_text placeholder-cls" v-else>请选择</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
     <!-- 称谓（颜色） -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'color'"
      :range="formOptions.color"
      range-key="color_name"
      :value="formValues.color"
      @change="onPickerChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues.color">{{
          formOptions.color[formValues.color].color_name
        }}</view>
        <view class="picker_text placeholder-cls" v-else>请选择</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
     <!-- 省市区 -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'region'"
      mode="multiSelector"
      :range="regions"
      range-key="label"
      :value="regionIndexes"
      @change="onRegionChange"
      @columnchange="onColumnChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues.province">
          {{ formValues.province }} {{ formValues.city }}
          {{ formValues.district }}
        </view>
        <view class="picker_text placeholder-cls" v-else>请选择</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
     <!-- 战队 -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'team'"
      :range="formOptions.teamRegion"
      range-key="name"
      :value="formValues.teamRegion"
      @change="onPickerChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues.teamRegion !== ''">{{
          formOptions.teamRegion[formValues.teamRegion].name
        }}</view>
        <view class="picker_text placeholder-cls" v-else>请选择</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
    <!-- 鞋码 -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'shoeSize'"
      :range="formOptions.shoeSize"
      range-key="size"
      :value="formValues.shoeSize"
      :disabled="formValues.gender == ''"
      @tap="onPickerTap"
      @change="onPickerChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues.shoeSize !== ''">{{
          formOptions.shoeSize[formValues.shoeSize].size
        }}</view>
        <view class="picker_text placeholder-cls" v-else-if="formValues.gender == ''">{{stepPlaceHolder}}</view>
        <view class="picker_text placeholder-cls" v-else>请选择鞋码</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
    <!-- 订阅鞋码 -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'shoeSizeOrder'"
      :range="formOptions.shoeSizeOrder"
      :range-key="rangeKey"
      :value="formValues.shoeSizeOrder"
      :disabled="formValues.gender == ''"
      @tap="onPickerTap"
      @change="onPickerChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues.shoeSizeOrder||formValues.shoeSizeOrder !== ''">{{formOptions.shoeSizeOrder[formValues.shoeSizeOrder][rangeKey]}}</view>
        <view class="picker_text placeholder-cls" v-else-if="formValues.gender == ''">{{stepPlaceHolder}}</view>
        <view class="picker_text placeholder-cls" v-else>请选择鞋码</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
    <!-- 用时 -->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'time'"
      mode="multiSelector"
      range-key="label"
      :range="formOptions.timeData"
      @change="timePickerChange"
      :value="timeTransform"
    >
    <view class="picker-inner flex_hsb_vc">
      <view class="picker_text" v-if="formValues.time !== ''">{{
        timeTransform
      }}</view>
      <view class="picker_text placeholder-cls" v-if="formValues.time == ''">请选择</view>
      <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
    <!-- 门店   通用类型 源数据直接传入-->
    <picker
      class="form_field-control"
      ref="picker"
      v-if="type == 'normal'"
      :range-key="rangeKey"
      :range="range"
      :value="formValues[data]"
      @change="onPickerChange"
    >
      <view class="picker-inner flex_hsb_vc">
        <view class="picker_text" v-if="formValues[data]||formValues[data]!== ''">{{
          range[formValues[data]][rangeKey]
        }}</view>
        <view class="picker_text placeholder-cls" v-else>{{stepPlaceHolder}}</view>
        <view class="icon-font icon-a-VectorStroke1"></view>
      </view>
    </picker>
  </view>
</template>
<script>
import Emitter from "@/utils/emitter.js";
import { dateFormat } from "@/utils";
import FormDataHandler from "@/utils/from-Handler.js";
export default {
  name: "iPicker",
  mixins: [Emitter],
  props: {
    label: { type: String, default: "text" },
    data: { type: String }, //字段
    fullValue: { type: Boolean, default: false}, //是否取全值
    startYear: { type: Number,default: 10 }, // 时间选择器开始日期(现在Y - startYear)
    endYear: { type: Number,default: 10 }, // 时间选择器结束日期(现在Y + endYear)
    startYMD: { type: String,default: '' }, // 时间选择器开始日期(YMD)格式
    endYMD: { type: String,default: '' }, // 时间选择器结束日期(YMD)格式
    type: { type: String, default: "date" }, //类型
    value: { type: [String,Number,Object], default: "" },
    valueKey:{ type: String, default: "id" },//源数据数组后端取值的key
    rangeKey:{ type: String, default: "size" },//源数据数组前端渲染的key
    stepPlaceHolder:{ type: String, default: "" },//上层数据未选择时占位符
    range:{ type: Array,  default: () => ([]) },// 源数据
  },
  computed: {
    /**
     * 生日必须年满16周岁
     */
    allowMaxDate() {
      let data
      if(this.endYMD){
        data = dateFormat(
          new Date(this.endYMD),
          "YYYY-MM-dd"
        );
      }else{
        data= dateFormat(
          new Date(new Date().getTime() + this.endYear * 365 * 24 * 60 * 60 * 1000),
          "YYYY-MM-dd"
        );
      }
      return data
    },
    startDate() {
      let data
      if(this.startYMD){
        data = dateFormat(
          new Date(this.startYMD),
          "YYYY-MM-dd"
        );
      }else{
        data = dateFormat(
          new Date(new Date().getTime() - this.startYear * 365 * 24 * 60 * 60 * 1000),
          "YYYY-MM-dd"
        );
      }
      return data
    },
    genderStr(){
      return this.formValues.gender+''
    },
    timeTransform(){
      if(this.formValues.time&&this.formValues.time.length){
        const [h,m,s] =this.formValues.time
        const timeValue = h ? h +'时'+ m +'分' + s + "秒" :m +'分' + s + "秒"
        return timeValue
      }
      else return ''

    },


  },
  data() {
    return {
      formValues: {
        birthday: "",
        gender:'',
        date:'',
        teamRegion: '',
        province:'',
        regions:'',
        city:'',
        district:'',
        shoeSize:'',
        shoeSizeOrder:'',
        color:'', //
        time:'', //跑步用时
        times:'', //门店预约时间
        orderRegion:'',
      },
      regions: [],
      regionSource:{}, //省市区源码
      shoeSizes: { //所有性别鞋码
        mans: [],
        womans: [],
      },
      regionIndexes: [0, 0, 0],
      formOptions: {
        gender: [
          { label: "男士", id: 1 },
          { label: "女士", id: 2 }
        ],
        teamRegion: [],
        shoeSize:[{},{}], //当前选择性别的鞋码
        shoeSizeOrder:[{},{}], //当前选择性别的鞋码
        province: "",
        city: ""
      },
    };
  },
  mounted() {
    const {value,data} =this
    //  if (this.$parent.labelFor) this.$refs.picker.id = this.$parent.labelFor||null;
    value&&this.backOriginValue()
  },
  async created () {
    if (this.type == "region") {
       // 加载地区数据
      await FormDataHandler.loadRegionsConfig()
      const {regions,regionSource} =  FormDataHandler.getFormData();
      this.regions=regions
      this.regionSource=regionSource
    }
    // 战队数据
    if(this.type=='team'){
      let {teamRegions} =  FormDataHandler.getFormData();
      this.formOptions.teamRegion = teamRegions
    }
    // 时间选择器
    if(this.type=='time'){
      const {timeData} =  FormDataHandler.getFormData();
      this.formOptions.timeData = timeData
    }
    // 颜色选择器
    if(this.type=='color'){
      this.formOptions.color = this.$store.state.orderProductColor
      console.log()
    }


  },
  methods: {
    // 生日值变化
    onBirthdayChange(evt) {
      const birthday = evt.detail.value;
      this.formValues.birthday = birthday;
      this.dispatch("iFormItem", "form-change", birthday);
    },
    // 称谓值变化
    onAppellationChange(evt) {
      const gender = evt.detail.value;
      this.formValues.gender = gender;
      this.dispatch("iFormItem", "form-change", gender);
    },
    //picker变化
    onPickerChange(evt){
      let {value} = evt.detail;
      let {noChange} = evt.currentTarget.dataset;
      const {fullValue,data,type} =this
      const key =data?data:type
      this.formValues[key] = value;
      this.$emit('this.$parent', this.$parent);
      console.log('this.formValues',this.formValues)
      if(!noChange){
        value =this.transIndexToValue(key,value,fullValue)
      }
      console.log('value===>',value)
      this.$emit('input', value);
      this.dispatch('iFormItem', 'form-change', value);
    },
    // 时间选择器(两级选择器)
    timePickerChange(eve){
      let {value} = eve.detail;
      this.formValues.time=value
      const [h,min,sec] =value
      //将时间转化成秒数
      const secNum =h*60*60+ min*60+sec
      this.$emit('input', secNum);
      this.dispatch("iFormItem", "form-change", secNum);

    },
    //返回指定取值
    transIndexToValue(key,index,fullValue){
      const list = this.formOptions&&this.formOptions[key] ? this.formOptions[key] : this.range
      const valueKey=this.valueKey
      let value
      if(fullValue){
        value =list[index]
      }else{
        value =list[index][valueKey]
      }
     return value
    },

    //传入数据还原
    backOriginValue(){
      const {data,value,rangeKey,range,valueKey,formValues} =this
      let index
      // 有range List（源数据） 的情况
      if(range&&range.length){
        index= range.findIndex((item)=>{
         return (item[rangeKey]==value)||(item[valueKey]==value)
       })
       if(index>=0){
          formValues[data] =index
        }
      }else{
        if(value&&(JSON.stringify(value)!== "{}")){
          formValues[data] =value
        }
      }

    },
    onPickerTap(eve){
      let {value} = eve.detail;
    },
        /**
     * 省市区组件 - 选中项变更
     */
    onRegionChange(evt) {
      const [province, city, district] = evt.detail.value;
      console.log('this.regions',this.regions)
      const [allProvinces, allCities, allDistricts] = this.regions;
      this.formValues.province = allProvinces[province].label;
      this.formValues.city = allCities[city].label;
      this.formValues.district = allDistricts[district].label;
      let adress= this.formValues.province+this.formValues.city+this.formValues.district
      let par ={
        province:this.formValues.province,
        city:this.formValues.city,
        district:this.formValues.district
      }
      par= JSON.stringify(par)
      this.$emit("input", par);
      this.dispatch("iFormItem", "form-change", par);
    },
        /**
     * 省市区组件 - 列选中项变更
     */
    onColumnChange(evt) {
      const { column, value } = evt.detail;
      if (column === 0) {
        const selectedProvinceKey = this.regions[column][value].value;
        const allCities = this.findRegionArrayByObjectKey(selectedProvinceKey);
        //
        const selectedDistrictKey = allCities[0].value;
        const allDistricts = this.findRegionArrayByObjectKey(selectedDistrictKey);
        //
        this.regions = [this.regions[0], allCities, allDistricts];
        //
        this.regionIndexes = [value, 0, 0];
      } else if (column === 1) {
        const selectedDistrictKey = this.regions[column][value].value;
        const allDistricts = this.findRegionArrayByObjectKey(selectedDistrictKey);
        //
        this.regions = [this.regions[0], this.regions[1], allDistricts];
        //
        this.regionIndexes = [this.regionIndexes[0], value, 0];
      } else if (column === 2) {
        this.regionIndexes = [this.regionIndexes[0], this.regionIndexes[1], value];
      }

    },
        /**
     * 查找并转换
     */
    findRegionArrayByObjectKey(key) {
      let target = this.regionSource[key];
      if (target && !Array.isArray(target)) {
        let allRegions = [];
        for (let key in target) {
          allRegions.push({ label: target[key], value: key });
        }
        return allRegions;
      } else {
        return target.map((o, i) => ({ label: o, value: i }));
      }
    },
  }
};
</script>
<style lang="scss">
.form-feild {
  width: 100%;
  .picker-inner {
    flex: 1;
    width: 65vw;
    .icon-font {
      font-size: 22rpx;
      color: #333;
    }
    .placeholder-cls{
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 28rpx;
      color: #999;
    }
  }
}
.form_field-control {
  height: 100%;
  width: 65vw;
}
</style>
