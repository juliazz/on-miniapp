<template>
  <!-- 适用于个人中心头像昵称 -->
  <view class="uploader-box">
    <view class="upload-area vict-flex-row">
      <image class="temp-image" :mode="imgMode" :src="currentValue"  v-if="currentValue" />
      <image class="temp-image" :mode="imgMode" :src="avatarIcon" v-else />
      <view class="edit-icon">
        <image :src="editIcon" />
      </view>
      <!-- <image class="temp-image" :mode="imgMode" :src="currentValue || avatarIcon" /> -->
      <block>
        <button class="icon-font icon-AddOutline-lujing1 btn btn-transparent" open-type="chooseAvatar"
          @chooseavatar="onChooseAvatar" />
        <!-- <text
          v-else
          class="icon-font icon-AddOutline-lujing1"
          @tap="_choose_image"
        /> -->
      </block>
      <!-- <block v-if="currentValue">
        <button class="icon-font icon-bianji btn btn-transparent edit-icon-box" open-type="chooseAvatar"
            @chooseavatar="editAvatar" v-if="authType == 'wxAvator'"></button>
        <view
          class="close-icon-box"
          @tap="_del_temp_image"
        >
          <view class="icon-close icon-font" />
        </view>
      </block> -->
    </view>
  </view>
</template>
<script>
import Taro from "@tarojs/taro";
import types from "@/store/types";
import Emitter from '@/utils/emitter.js';
import avatarIcon from '@/assets/images/icons/avatar.svg'
import editIcon from '@/assets/images/icons/edit_black.svg'
import {
  Vict, ajax, errorHandler, RES_SUCCESS_CODE, fixSlash
} from "@/utils";
export default {
  name: "IUploader",
  components: {},
  mixins: [ Emitter ],
  props: {
    authType: { type: String, default: "" }, //wxAvator 微信头像
    imgMode: { type: String, default: "aspectFit" },
    max: { type: Number, default: 1 }, //最大上传数量
    value: { type: String, default: '' },
    formType: { type: String, default: '' }, //member,team, performance
    fileType: { type: String, default: "upload_image" }, //
    target: { type: String, default: $ON_API_HOST + types.IMG_UPLOAD }, //上传路径
  },

  data() {
    return {
      currentValue: '', //表单值
      localFile: '',
      maxSize: 4194304, // B (字节) 4M
      avatarIcon,
      editIcon
    };
  },
  watch: {
    // value(value) {
    //   //初始值读取
    //   this.currentValue = value;
    // },
  },
  mounted() {
    this.currentValue = this.value;

  },
  methods: {
    // 头像值变化
    onChooseAvatar(evt) {
      const value = evt.detail.avatarUrl;
      const { formType } = this
      if (formType) {
        //活动用途接口
        this._upload_img_to_server({ files: value });
      } else {
        //个人中心头像,需要中转
        this.getOSSConfig(value)
      }
    },
    // 上传前参数拼接
    _upload_img_to_server(par) {
      const { files, severCon = {} } = par
      const { fileType, formType } = this
      const upLoadPath = `${$UP_ASSETS_HOST}${types.IMG_UPLOAD}`
      let req = {};
      // if(authType=='wxAvator'){
      req = Object.assign({
        // header
        url: `${upLoadPath}`,
        name: fileType,
        filePath: files
      }, {
        formData: {
          type: formType, //1:member, 2:team,  3:performance
        }
      })
      const par_ = Object.assign({ files }, { severCon: { ...req } })
      this.uploadOnFiles({ ...par_ })
    },
    //上传至On服务器
    uploadOnFiles({ files, severCon }) {
      const { authType } = this
      return new Promise((resolve) => {
        Taro.showLoading({ title: '图片上传中', mask: false })
        //chooseImage  path在数组中拿
          severCon = Object.assign(severCon, {
            filePath: files,
          })
        console.log('上传接口传参', severCon)
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
              this.currentValue = upload_res_body.data;
              this.$emit('input', this.currentValue)
              this.dispatch('iFormItem', 'form-change',this.currentValue);
              resolve();
              return;
            } else {
              Taro.showToast({ title: '网络错误', icon: 'none' });
              this._del_temp_image()
            }
            // Taro.hideLoading()
          },
          fail: (failed_res) => {
            console.log('failed_res', failed_res)
            Taro.showToast({ title: '网络错误', icon: 'none' });
            Taro.hideLoading()
            this._del_temp_image()
          },
          complete(res) {
            console.log('complete', res)
              // this.$emit('input', output&&output.img_value);
              // this.dispatch('iFormItem', 'form-change',  output&&output.img_value);
            Taro.hideLoading()
          },
        });

      });
    },
    /**
     * OSS Config
     */
    getOSSConfig(avatar) {
      ajax({
        url: types.OSS_CONFIG,
        method: "POST",
      })
        .then((res) => {
          const { code, data } = res;
          if (code === RES_SUCCESS_CODE) {
            this.uploadFiles({ severCon: data, avatar });
          }
        })
        .catch((err) => {
          errorHandler(err, true, "@getOSSConfig");
        });
    },

    //上传至服务器
    uploadFiles({ avatar, severCon }) {
      let key = `${severCon.dir ? severCon.dir + "/" : ""}${Date.now()}.jpg`;
      let output = [];
      const PAR = {
        url: severCon.host, // 开发者服务器的URL。
        filePath: avatar,
        name: "file", // 必须填file。
        formData: {
          key,
          policy: severCon.policy,
          OSSAccessKeyId: severCon.accessid,
          signature: severCon.signature,
          success_action_status: "200",
        },
      }
      Taro.showLoading({ title: '图片上传中', mask: false })
      Taro.uploadFile({
        ...PAR,
        success: (res) => {
          const { statusCode } = res;
          if (statusCode === RES_SUCCESS_CODE) {
            this.currentValue = fixSlash(`${severCon.host}/${key}`);
            this.$emit('input', this.currentValue)
          } else {
            errorHandler(res, true, "@doUploadFile::");
          }
        },
        fail: (failed_res) => {
          this._del_temp_image()
        },
        complete(res) {
          console.log('complete', res)
          Taro.hideLoading()
        },
      });
    },
    //处理返参
    formatRes() {

    },
    editAvatar(evt) {
      this._del_temp_image()
      this.onChooseAvatar(evt)
    },
    _del_temp_image(ev) {
      this.currentValue = ''
      this.localFile = ''
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
    // background: #333;
    background: none !important;
    border-radius: 10rpx;
    overflow: hidden;
    // border: 1px dashed #707070; color: #707070;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: visible !important;

    .btn {}

    .btn-transparent {
      border: none;
      opacity: 0;
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
      border-radius: 100%;
    }

    .edit-icon {
      width: 60rpx;
      height: 60rpx;
      position: absolute;
      right: -20rpx;
      bottom: -6rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 10;
      background: white;
      border-radius: 80rpx;
      box-shadow: 0px 4rpx 8rpx 0px #0000001A;

      image {
        width: 40%;
        height: 40%;
      }


    }
  }
}

.vict-flex-row {}
</style>
