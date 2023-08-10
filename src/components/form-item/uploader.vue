<template>
  <view class="uploader-box">
    <view v-for="(item, index) in init" :key="index">
      <view class="temp-image-con" @tap="_preview_init_image(index)">
        <image
          class="temp-image"
          mode="aspectFill"
          :src="initKey ? item[initKey] : item"
        ></image>
        <view class="icon-font icon-AddOutline-lujing"></view>
      </view>
    </view>
    <block v-for="(item, idx) in localFile" :key="idx">
      <!-- <view class="temp-image-con" @tap="_preview_temp_image(idx)">
        <image class="temp-image" mode="aspectFill" :src="item.src"></image> -->
        <!-- <view class="del icon-font icon-close"  @tap="_del_temp_image(index)"></view> -->
      <!-- </view> -->
      <view class="upload-area vict-flex-row"  >
        <image class="temp-image" :mode="imgMode" :src="item.src"  v-if="item.src"></image>
        <text class="icon-font icon-AddOutline-lujing1" @tap="_choose_image" v-if="!item.src"></text>
        <view class="close-icon-box"  @tap="_del_temp_image"  v-if="item.src">
          <view class="icon-close icon-font"  :data-index="idx"></view>
        </view>
      </view>
    </block>
  </view>
</template>
<script>
import Emitter from "@/utils/emitter.js";
import Taro from "@tarojs/taro";
import types from "@/store/types";
import {
  Vict,
} from "@/utils";
export default {
  name: "iUploader",
  components: {},
  mixins: [Emitter],
  props: {
    mode: { type: String, default: "server" }, //server 服务器 ，local 本地
    imgMode:{  type: String, default: "widthFix" },
    initKey: { type: String, default: "" },
    max: { type: Number, default: 1 }, //最大上传数量
    value: {type: Array, default: () => [] },
    fileType: { type: String, default: "upload_image" }, //
    formType: { type: Number, default: 1 }, //1:member, 2:team,  3:performance
    target: { type: String, default: $ON_API_HOST + types.IMG_UPLOAD }, //上传路径
  },
  watch: {
    value(value) {
      this.currentValue = value;
      console.log("value", this.currentValue);
    },
  },
  data() {
    return {
      currentValue: this.value,
      id: this.label,
      init: [], //服务器图片列表
      localFile: [{}],
      maxSize:4194304 // B (字节)
    };
  },
  mounted() {},
  methods: {
    _choose_image(ev) {
      let { mode, currentValue, max, localFile, init } = this;
      Taro.chooseMedia({
        count: this.max - currentValue.length - init.length,
        mediaType: ['image'],
        sizeType: ["original"], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album", "camera"], // 可以指定来源是相册还是相机，默认二者都有
        success: (temp_file) => {
          let { tempFiles } = temp_file;
          if (mode === "local") {
            tempFiles.forEach((_itm) => {
              console.log("_itm--------------->", _itm);
              const {size,path} =_itm  //图片单位是k 字节
              if(size>this.maxSize){
                Vict.toastMsg('图片不能超过5M')
                return
              }
              localFile.push({
                path: path,
                size: size,
              });
              currentValue[0]=path;
            });
          } else {
            this._upload_img_to_server(tempFiles, currentValue, localFile);
          }
        },
      });
    },
    _upload_img_to_server(tempFiles, currentValue, localFile) {
      let { target, fileType } = this;
      let req = {
        files: tempFiles,
        name: fileType,
        url: target,
      };
      this.uploadFiles(req).then((upload_res) => {
        upload_res.map((ele)=>{
          let {
              path,
              src,
              img_value,
              success,
              size
            } = ele
            currentValue[0]=img_value
             this.localFile=[{
                path,
                img_value,
                src,
                size
              }]
        })
      });
    },
    uploadFiles({ files, url, name = "file", needToken }) {
      let header = { };
      const onToken = Taro.getStorageSync('token');
      onToken&&Object.assign(header, {'On-Token': onToken})
      let output = [];
      return new Promise((resolve) => {
        Taro.showLoading({title: '图片上传中'})
        files.forEach((_itm, _idx) => {
          const {tempFilePath,size} =_itm
          console.log("_itm--------------->", _itm);
          if(size>this.maxSize){
            Vict.toastMsg('图片不能超过5M',2000)
            return
          }
          console.log('上传图片传参----->',{
            url,
            filePath: tempFilePath,
            name,
            header
          })
          Taro.uploadFile({
            url,
            filePath: tempFilePath,
            name,
            header,
            formData: {
              type: this.formType, //1:member, 2:team,  3:performance
            },
            success: (upload_res) => {
              console.log('拿到的图片回传----->',upload_res)
              let {data,statusCode,errMsg} =upload_res
              let upload_res_body =
                  typeof data === "string"
                    ? JSON.parse(data)
                    : data;
              if (
                statusCode &&statusCode==200&&upload_res_body&&upload_res_body.data&&
                errMsg == "uploadFile:ok"
              ) {
                  output.push({
                    index: _idx,
                    src: upload_res_body.data.url,
                    img_value:  upload_res_body.data.value,
                    path: tempFilePath,
                    size: _itm.size,
                    success: true,
                    res: upload_res,
                  });
                  return;
              }else{
                Taro.showToast({ title:'网络错误',icon: 'none'});
                output.push({
                  index: _idx,
                  src: null,
                  path: tempFilePath,
                  size: _itm.size,
                  success: false,
                  res: upload_res,
                });
                this._del_temp_image()
              }
              Taro.hideLoading()
            },
            fail(failed_res) {
              Taro.showToast({ title:'网络错误',icon: 'none'});
              Taro.hideLoading()
              output.push({
                index: _idx,
                src: null,
                path: tempFilePath,
                size: _itm.size,
                success: false,
                res: failed_res,
              });
              this._del_temp_image()
            },
            complete() {
              console.log('走了complete了吗')
              if (output.length === files.length) {
                resolve(output);
                // this.$emit('input', output&&output.img_value);
                // this.dispatch('iFormItem', 'form-change',  output&&output.img_value);
              }
              Taro.hideLoading()
            },
          });
        });
      });
    },
    _preview_temp_image(ev) {
      let { index } = ev.currentTarget.dataset,
        { localFile } = this.data;
      let urls = localFile.map((ele) => ele.path);
      wx.previewImage({
        current: urls[index], // 当前显示图片的http链接
        urls, // 需要预览的图片http链接列表
      });
    },
    _del_temp_image(ev) {
      // let { index } = ev.currentTarget.dataset,
      //   { value, localFile } = this;
      // if (value[index]) {
      //   value.splice(index, 1);
      // }
      // localFile.splice(index, 1);
      // this.$emit('input', value);
      // this.dispatch('iFormItem', 'form-change', value);
      this.currentValue=[]
      this.value=[]
      this.init=[]
      this.localFile =[{}]
      this.$emit('input', []);
      this.dispatch('iFormItem', 'form-change', []);
      console.log('this.localFile',this.localFile)
    },
    _preview_init_image(ev) {
      let { init = [] } = this.data,
        { index } = ev.currentTarget.dataset;
      this.triggerEvent("preview", {
        source: "init",
        list: init,
        index,
      });
    },
    _del_init_image(ev) {
      let { init = [] } = this;
      console.log(ev);
    },
  },
};
</script>
<style lang="scss" >
.uploader-box {
  justify-content: flex-start;
  $upload-area-size: 160rpx;
  .upload-area {
    display: flex;
    width: $upload-area-size;
    height: $upload-area-size;
    margin-right: 1px;
    background: #333;
    border-radius: 10rpx;
    overflow: hidden;
    // border: 1px dashed #707070; color: #707070;
    justify-content: center;
    align-items: center;
    position: relative;
    .icon-font {
      font-size: 30rpx;
      padding: 10rpx;
      z-index: 9;
    }
    .close-icon-box{
      width: 80rpx;
      height: 80rpx;
      position: absolute;
      z-index: 8;
      right: -40rpx;
      top: -40rpx;
      border-radius: 50%;
      background: rgba(0,0,0,0.4);

    }
    .icon-close{
      position: absolute;
      right: 30rpx;
      top: 30rpx;
    }
    .temp-image{
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
  }
}
</style>
