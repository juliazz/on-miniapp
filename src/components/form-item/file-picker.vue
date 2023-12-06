<template>
  <view class="uploader-box">
    <view class="up-place-holder flex_hfs_vc" @tap="_choose_file">
      <text class="fileName" v-if="localFile">{{localFile}}</text>
      <view class="picker_text placeholder-cls" v-else>请先将简历发送到您的微信的 文件传输助手，再点击此处选择 文件传输助手 获取附件。仅限pdf, docx, doc格式。</view>
    </view>
  </view>
</template>
<script>
import Emitter from "@/utils/emitter.js";
import Taro from "@tarojs/taro";
import types from "@/store/types";
import { Vict } from "@/utils";
export default {
  name: "iFileLoader",
  components: {},
  mixins: [Emitter],
  props: {
    max: { type: Number, default: 1 }, //最大上传数量
    value: {type: Object, },
    fileType: { type: String, default: "upload_file" }, //
    target: { type: String, default: $ON_API_HOST + types.RESUME_UPLOAD }, //上传路径
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
      localFile: '',
      maxSize: 8194304, // B (字节)
    };
  },
  mounted() {},
  methods: {
    _choose_file(ev) {
      let { mode, currentValue } = this;
      Taro.chooseMessageFile({
        count: 1,
        type: "file",
        success:(res)=> {
          const {tempFiles} =res
          this._upload_img_to_server(tempFiles, currentValue);
        },
      });
    },
    _upload_img_to_server(tempFiles, currentValue) {
      let { target, fileType } = this;
      let req = {
        files: tempFiles,
        name: fileType,
        url: target,
      };
      this.uploadFiles(req).then((upload_res) => {
          let { path, url, img_value, file_name} = upload_res;
          currentValue[0] = img_value;
          const localFile = {
              path,
              img_value,
              url,
            };
          this.localFile =file_name

          this.$emit('input', localFile);
          this.dispatch('iFormItem', 'form-change',  localFile);
      });
    },
    uploadFiles({ files, url, name = "file", needToken }) {
      let header = {};
      const onToken = Taro.getStorageSync("token");
      onToken && Object.assign(header, { "On-Token": onToken ,
      'content-type':'form-data'});
      let output = {};
      return new Promise((resolve) => {
        Taro.showLoading({ title: "文件上传中" });
        files.forEach((_itm, _idx) => {
          const { path, size } = _itm;
          console.log("_itm--------------->", _itm);
          if (size > this.maxSize) {
            Vict.toastMsg("附件不能超过8M", 2000);
            Taro.hideLoading();
            return;
          }
          console.log("上传图片传参----->", {
            url,
            filePath: path,
            name,
            header,
          });
          Taro.uploadFile({
            url,
            filePath: path,
            name,
            header,
            formData: {
              upload_file: path,
            },
            success: (upload_res) => {
              console.log("拿到的图片回传----->", upload_res);
              let { data, statusCode, errMsg } = upload_res;
              let upload_res_body =
                typeof data === "string" ? JSON.parse(data) : data;
                const {code} =upload_res_body
              if (
                code &&
                code == 200 &&
                upload_res_body &&
                upload_res_body.data &&
                errMsg == "uploadFile:ok"
              ) {
                output={
                  index: _idx,
                  file_name:_itm.name,
                  url:upload_res_body.data.url,
                  img_value: upload_res_body.data.value,
                  path: path,
                  success: true,
                  res: upload_res,
                };
                return;
              } else if( code &&
                code == 403
              ){
                Taro.showToast({ title: "文件格式错误 ", icon: "none" });
                output={
                  index: _idx,
                  file_name: null,
                  url:null,
                  path: path,
                  success: false,
                  res: upload_res,
                };
                this._del_temp_image();
              } else {
                Taro.showToast({ title: "网络错误", icon: "none" });
                output ={
                  index: _idx,
                  file_name: null,
                  url:null,
                  path: path,
                  success: false,
                  res: upload_res,
                };
                this._del_temp_image();
              }
              Taro.hideLoading();
            },
            fail:(failed_res)=> {
              Taro.showToast({ title: "网络错误", icon: "none" });
              console.log(failed_res)
              Taro.hideLoading();
              output ={
                index: _idx,
                url: null,
                file_name: null,
                path: path,
                success: false,
                res: failed_res,
              };
              this._del_temp_image();
            },
            complete() {
                resolve(output);
              Taro.hideLoading();
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
      this.currentValue = {};
      // this.value = {};
      this.init = {};
      this.localFile = {};
      this.$emit("input", {});
      this.dispatch("iFormItem", "form-change", {});
      console.log("this.localFile", this.localFile);
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
  height: 100%;
  width: 100%;
  .up-place-holder {
    width: 100%;
    height: 100%;
    line-height: 100%;
    margin-top: -10rpx;
  }
  .placeholder-cls{
      font-family: 'PingFang SC';
      font-style: normal;
      font-weight: 400;
      font-size: 28rpx;
      color: #999;
    }
}
</style>
