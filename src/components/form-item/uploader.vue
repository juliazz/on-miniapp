<template>
  <view class="uploader-box">
    <view v-for="(item, index) in init" :key="index">
      <view class="temp-image-con" @tap="_preview_init_image(index)">
        <image class="temp-image" mode="aspectFill" :src="initKey ? item[initKey] : item"></image>
        <view class="icon-font icon-AddOutline-lujing"></view>
      </view>
    </view>
    <block v-for="(item, idx) in localFile" :key="idx">
      <!-- <view class="temp-image-con" @tap="_preview_temp_image(idx)">
        <image class="temp-image" mode="aspectFill" :src="item.src"></image> -->
      <!-- <view class="del icon-font icon-close"  @tap="_del_temp_image(index)"></view> -->
      <!-- </view> -->
      <view class="upload-area vict-flex-row">
        <image class="temp-image" :mode="imgMode" :src="item.src" v-if="item.src"></image>
        <block v-if="!item.src">
          <button class="icon-font icon-AddOutline-lujing1 btn btn-transparent" open-type="chooseAvatar"
            @chooseavatar="onChooseAvatar" v-if="authType == 'wxAvator'"></button>
          <text class="icon-font icon-AddOutline-lujing1 safe-padding" @tap="_choose_image" v-else></text>
        </block>
        <block v-if="item.src">
          <view class="close-icon-box" @tap="_del_temp_image" >
            <view class="icon-close icon-font" :data-index="idx"></view>
          </view>
        </block>
      </view>
    </block>
  </view>
</template>
<script>
import Taro from "@tarojs/taro";
import types from "@/store/types";
import Emitter from "@/utils/emitter.js";
import {
  Vict, ajax, errorHandler, RES_SUCCESS_CODE, fixSlash
} from "@/utils";
export default {
  name: "iUploader",
  components: {},
  mixins: [Emitter],

  props: {
    authType: { type: String, default: "" }, //wxAvator 微信头像
    mode: { type: String, default: "server" }, //server 服务器 ，local 本地
    imgMode: { type: String, default: "aspectFit" },
    initKey: { type: String, default: "" },
    max: { type: Number, default: 1 }, //最大上传数量
    value: { type: Array, default: () => [] },
    fileType: { type: String, default: "upload_image" }, //
    formType: { type: String, default: '' }, //member,team, performance
    target: { type: String, default: '' }, //上传路径
  },
  watch: {
    value(value) {
      //初始值读取
      this.currentValue = value;
      this.localFile = [
        {
          src: value[0],
        },
      ]
    },
  },
  computed: {
    upLoadPath() {
      const { authType, target,formType } = this
      let  url
         url =  $UP_ASSETS_HOST + types.IMG_UPLOAD
      return url
    }

  },
  data() {
    return {
      id: this.label,
      currentValue: [], //表单值
      init: [], //服务器图片列表
      localFile: [{}],
      maxSize: 5242880 // B (字节) 5M
    };
  },
  mounted() {

  },
  methods: {
    // 头像值变化
    onChooseAvatar(evt) {
      const value = evt.detail.avatarUrl;
      //活动用途接口
      this._upload_img_to_server({ files: [value] });
    },
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
              const { size, path } = _itm  //图片单位是k 字节
              if (size > this.maxSize) {
                Vict.toastMsg('图片不能超过5M')
                return
              }
              localFile.push({
                path: path,
                size: size,
              });
              currentValue[0] = path;
            });
          } else {
            this._upload_img_to_server({ files: tempFiles });
          }
        },
      });
    },
    // 上传前参数拼接
    _upload_img_to_server(par) {
      const { files, severCon = {} } = par
      const { currentValue, authType, formType } = this
      let { upLoadPath, fileType } = this;
      let req = {};
      // if(authType=='wxAvator'){
        req = Object.assign({
            // header
            url: `${upLoadPath}`,
            name: fileType,
            filePath: files[0]
          },{
            formData: {
              type: formType, //1:member, 2:team,  3:performance
            }
          })
      // }else{
        // req = Object.assign({
        //     // header
        //     name: fileType,
        //     url: `${upLoadPath}`,
        //     type: formType,
        //   })
      // }
      const par_ = Object.assign({ files }, { severCon: { ...req } })
      this.uploadFiles({ ...par_ }).then((upload_res) => {
        upload_res.map((ele) => {
          let {
            path,
            src,
            img_value,
          } = ele
          //用于表单提交
          this.currentValue[0] = img_value
          this.$emit('input', this.currentValue);
          this.dispatch('iFormItem', 'form-change', this.currentValue);
          console.log('this.currentValue', this.currentValue)
          //用于展示
          this.localFile = [{
            path,
            img_value,
            src,
          }]
        })
      });
    },
    //上传至服务器
    uploadFiles({ files, severCon }) {
      let output = [];
      const { authType } = this
      return new Promise((resolve) => {
        Taro.showLoading({ title: '图片上传中' ,mask:false})
        files.forEach((_itm, _idx) => {
          const { tempFilePath, size } = _itm
          if (size && (size > this.maxSize)) {
            Vict.toastMsg('图片不能超过5M', 2000)
            return
          }
          //chooseImage  path在数组中拿
          if(!authType){
            severCon = Object.assign(severCon, {
              filePath: tempFilePath,
            })
          }
          console.log('上传接口传参',severCon)
          Taro.uploadFile({
            ...severCon,
            success: (upload_res) => {
                let { data, statusCode, errMsg } = upload_res
                let upload_res_body =
                  typeof data === "string"
                    ? JSON.parse(data)
                    : data;
                if (
                  statusCode && statusCode == 201 && upload_res_body && upload_res_body.data &&
                  errMsg == "uploadFile:ok"
                ) {
                  const { url, value } = upload_res_body.data
                  console.log('upload_res_body----->', upload_res_body)
                  output.push({
                    index: _idx,
                    src: upload_res_body.data,
                    img_value: upload_res_body.data,
                    path: tempFilePath,
                  });
                  return;
                } else {
                  Taro.showToast({ title: '网络错误', icon: 'none' });
                  output.push({
                    index: _idx,
                    src: null,
                    path: tempFilePath,
                  });
                  this._del_temp_image()
                }
              // Taro.hideLoading()
            },
            fail: (failed_res) => {
              Taro.showToast({ title: '网络错误', icon: 'none' });
              Taro.hideLoading()
              output.push({
                index: _idx,
                src: null,
                path: tempFilePath,
              });
              this._del_temp_image()
            },
            complete(res) {
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
    editAvatar(evt) {
      this._del_temp_image()
      this.onChooseAvatar(evt)
    },
    _del_temp_image(ev) {
      this.currentValue = []
      this.init = []
      this.localFile = [{}]
      this.$emit('input',[]);
      this.dispatch('iFormItem', 'form-change',[]);
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

    .btn {}

    .btn-transparent {
      border: none;
    }

    .icon-font {
      font-size: 30rpx;
      // padding: 10rpx;
      z-index: 9;
    }

    .close-icon-box {
      width: 80rpx;
      height: 80rpx;
      position: absolute;
      z-index: 8;
      right: -40rpx;
      top: -40rpx;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.4);

    }

    .edit-icon-box {
      @extend .close-icon-box;

      bottom: -40rpx;
    }

    .icon-close {
      position: absolute;
      right: 40rpx;
      top: 40rpx;
    }

    .temp-image {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: 2;
    }
    .safe-padding{
      padding: 20rpx;
    }
  }
}
</style>