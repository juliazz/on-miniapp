<template>
  <!-- 弹窗 - 头像昵称 -->
  <Modal
    :open=" popOptions.visible "
    :width="100"
    :action="true"
    :close-icon="false"
    :position=" popOptions.position "
  >
    <view
      class="avator-get-pop login_stage"
      :catch-move=" true"
    >
      <view :class="['stage-inner',popOptions.theme]">
        <image
          class="stage-closer"
          mode="widthFix"
          :src="popOptions.theme=='black' ? closeWhite : closeBlack"
          @tap="onHide"
        />
        <view class="stage-header flex_hfs_vc">
          <image
            class="header-icon"
            mode="widthFix"
            src="@/assets/images/icons/logo-with-bg.svg"
          />
          <text class="header-title">
            {{ popOptions.popTitle || '个人信息' }}
          </text>
        </view>
        <view
          class="stage-content"
          :class="{'hide-nick-name': popOptions.hideNickName}"
        >
          <Form
            ref="form"
            :model="popOptions.formData"
            :rules=" rules "
          >
            <FormItem
              :label="popOptions.formLabel.pic"
              prop="pic"
              class="uploader-item"
              type="uploader"
            >
              <uploaderUserInfo
                v-model="popOptions.formData.pic"
                :form-type="popOptions.formType"
                auth-type="wxAvator"
                file-type="file"
              />
            </FormItem>
            <FormItem
              v-if="!popOptions.hideNickName"
              :label="popOptions.formLabel.name"
              prop="name"
            >
              <WeInput
                v-model="popOptions.formData.name"
                type="nickname"
                :is-auth-phone="false"
              />
            </FormItem>
            <view class="btn-actions">
              <button
                class="join-btn  btn"
                @tap="handleSubmit"
              >
                确认
              </button>
            </view>
          </Form>
        </view>
      </view>
    </view>
  </Modal>
</template>

<script>
import Taro from "@tarojs/taro";
import mixins from '@/utils/mixins';
import Form from "@/components/form/Form.vue";
import WePicker from "@/components/form-item/picker.vue";
import WeUploder from "@/components/form-item/uploader.vue";
import uploaderUserInfo from "@/components/form-item/uploaderUserInfo.vue";
import WeInput from "@/components/form-item/input.vue";
import FormItem from "@/components/form/FormItem.vue";
import Dialog from "@/components/common/Dialog.vue";
import Modal from "@/components/common/Modal.vue";
import rules from "@/components/form/rules";
import closeBlack from '@/assets/images/icons/close-noborder.svg'
import closeWhite from '@/assets/images/icons/close_white_bg_black.svg'
import {
  RES_SUCCESS_CODE,
  ajax,
  errorHandler,
  getPhoneNumber,
  desensitizify,
  VTypes,
  initWorker
} from "@/utils";
import types from "@/store/types";
export default {
  name: "GetNameAvator",
  components: { Dialog ,Form ,WePicker, WeUploder ,FormItem,WeInput,Modal,uploaderUserInfo},
  filters: {
    desensitizify(fieldValue, fieldName) {
      return desensitizify(fieldName, fieldValue);
    },
  },
  mixins: [mixins],
  provide() {
    return { pop: this }
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        visible: false,
        position: "bottom",
        theme: "white", // 主题  black | white
        authType:"wxAvator", //是否使用微信授权头像
        formType:"", //适用mutiple 新版接口时 服务器存储字段
        afterHandler: "",
        afterHandlerData: {},
        from:'Ucenter', //个人中心 Ucenter
        formLabel:{
          name:'姓名',
          pic:'头像'
        },
        formData: {
          name:'',
          pic: '',
          pics: [],
        },
      }),
    },
  },
  data() {
    return {
      stage: 1,
      /**
       * 用户状态
       * - isMember: 是否是会员
       * - isSubscribe: 是否已订阅
       */
      userStatus: {
        isMember: 0,
        isSubscribe: 0,
      },
      rules,
      closeBlack,
      closeWhite,
      pic:'',
      name:'',
    };
  },
  computed: {
     from() {
      return this.options?.from || false;
    },
    popOptions() {
      const { options } = this;
      return options;
    },
  },
  mounted() {
    // this.name = this.options.formData.name
    this.$on('form-change', feild => {
      //通知父视图 元数据改变
      // this.$emit('form-change', feild)

    });
  },
  methods: {
    /**
     * 隐藏
     */
    onHide() {
      this.$emit("close");
    },
    handleSubmit(eve){
      const {name,pic} =this.options.formData
      const par={
        nickName:name,
        avatarUrl: pic //pic&&pic.length&&pic[0],
      }
      this.$refs.form.validate(async (valid) => {
        if (valid){
        //个人中心直接提交
        if(this.from =='Ucenter'){
          ajax({
            url: types.USER_INFO_SET,
            method: "POST",
            data: {
              ...par
            }
          }).then(res => {
            const { code } = res;
            if (code === RES_SUCCESS_CODE) {
              this.changed = false;
              Taro.showToast({ title: "个人资料更新成功", icon: 'none', duration: 2000 ,
                success: () => {
                  this.$emit("close",'update');
                }
            });
            } else {
              errorHandler(res, true, '@onSave::');
            }
          }).catch(err => {
            errorHandler(err, true, '@onSave::');
          });

        }else{
          // 活动数据吐出数据 单独提交
          this.$emit("submit", {...par} );
        }

      // }
    }
      });
    },

  },
};
</script>

<style lang="scss">
.avator-get-pop {
  .stage-inner {
    width: 100%;
    padding: 42rpx 32rpx 104rpx;
    background: #fff;
    border-radius: 40rpx 40rpx 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;
    // 黑色主题
    &.black {
      background: #333;
      color: #fff;
      .stage-closer{
        color: #fff;
      }
      .stage-header{
        .header-title{
          color: #fff;
        }

      }
    }
    .stage-closer {
      width: 48rpx;
      height: auto;
      position: absolute;
      top: 40rpx;
      right: 32rpx;
    }

    .stage-header {
      .header-icon {
        width: 44rpx;
        height: auto;
      }

      .header-title {
        font-size: 28rpx;
        color: #000;
        font-weight: 500;
        line-height: 1;
        margin-left: 24rpx;
      }
    }

    .stage-content {
      margin-top: 48rpx;
      height: 600rpx;
      .input-placeholder{
        line-height: 44rpx !important;
      }
      &.hide-nick-name{
        height: 400rpx;
      }
      .we-form{
        border-top: none;
        padding: 0;
        text-align: left;

      }
      .join-btn{
        background: #000;
        color: #fff;
      }
      .form-line {
        border-color: #e5e5e5;
      }
    }
  }
}
</style>
