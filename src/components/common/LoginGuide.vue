<template>
  <view class="login_guide-wrapper" v-if="visible">
    <!-- 弹窗 - 登录方式引导 -->
    <view class="login_guide-entrance login_stage" :catch-move="true" v-if="stage == 1">
      <view class="stage-inner">
        <image class="stage-closer" mode="widthFix" src="@/assets/images/icons/close-noborder.svg" @tap="onHide" />
        <view class="stage-header flex_hfs_vc">
          <image class="header-icon" mode="widthFix" src="@/assets/images/icons/logo-with-bg.svg" />
          <text class="header-title">On昂跑官方商城</text>
        </view>
        <view class="stage-content">
          <view class="login-title">登录或加入昂跑</view>
          <view class="login-desc">登录即可解锁更多权益</view>
          <view class="login-desc" v-if="options.tips">{{ options.tips }}</view>
          <view class="login-btns">
            <button class="btn btn-black" open-type="getPhoneNumber" @getPhoneNumber="getPhoneNumber">
              使用微信手机号
            </button>
            <button class="btn" @tap="onUseOthersMobile">使用其他手机号</button>
            <button class="btn" @tap="onGuestConfirm" v-if="enableGuest">
              {{ btnText4Guest }}
            </button>
          </view>
        </view>
      </view>
    </view>
    <!-- 弹窗 - 微信授权手机号码 -->
    <view class="login_wxmobile-stage login_stage" :catch-move="true" v-if="stage == 2">
      <view class="stage-inner">
        <image class="stage-closer" mode="widthFix" src="@/assets/images/icons/close-noborder.svg" @tap="onHide" />
        <view class="stage-header flex_hfs_vc">
          <image class="header-icon" mode="widthFix" src="@/assets/images/icons/logo-with-bg.svg" />
          <text class="header-title">On昂跑官方商城</text>
        </view>
        <view class="stage-content">
          <view class="login_wxmobile-desc">登录即可解锁更多权益</view>
          <view class="login-desc" v-if="options.tips">{{ options.tips }}</view>
          <view class="login_wxmobile-text ff_ods">{{
            mobileInfo.mobile | desensitizify("mobile")
          }}</view>
          <view class="login-btns">
            <button class="btn btn-black" :disabled="disabledWXLoginBtn" @tap="doLoginWithWxMobile">
              登录
            </button>
          </view>
          <view class="login-extras">
            <view class="checkbox" @tap="togglePrivacy">
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox-checked.svg"
                v-if="formValues.privacyStatus" />
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox.svg" v-else />
              <block v-if="userStatus.isMember">
                <view class="checkbox-text">本人声明已年满16周岁，勾选以确认您已阅读并接受 On 昂跑的
                  <text class="link" @tap.stop="doViewPage('privacy', 1)">隐私政策</text>
                  。
                </view>
              </block>
              <block v-else>
                <view class="checkbox-text">本人声明已年满16周岁，勾选以确认您已阅读并接受 On 昂跑的
                  <text class="link" @tap.stop="doViewPage('privacy', 1)">隐私政策</text>
                  和
                  <text class="link" @tap.stop="doViewPage('privacy', 3)">
                    通用条款</text>
                  。
                </view>
              </block>
            </view>
            <view class="checkbox" @tap="toggleNotice" v-if="!userStatus.isSubscribe">
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox-checked.svg"
                v-if="formValues.noticeStatus" />
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox.svg" v-else />
              <view class="checkbox-text">订阅昂跑最新资讯和新品通知</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <!-- 弹窗 - 手机号码 + (短信验证码 | 密码) -->
    <view class="login_mobile-stage login_stage" :catch-move="true" v-if="stage == 3">
      <view class="stage-inner">
        <image class="stage-closer" mode="widthFix" src="@/assets/images/icons/close-noborder.svg" @tap="onHide" />
        <view class="stage-header flex_hfs_vc">
          <image class="header-icon" mode="widthFix" src="@/assets/images/icons/logo-with-bg.svg" />
          <text class="header-title">On昂跑官方商城</text>
        </view>
        <view class="stage-content">
          <view class="login-title">登录或加入昂跑</view>
          <view class="login-desc">登录即可解锁更多权益</view>
          <view class="login-desc" v-if="options.tips">{{ options.tips }}</view>
          <view class="login-form">
            <view class="form_field flex_hfs_vc">
              <view class="form_field-label">手机</view>
              <view class="form_field-value flex_hfs_vc">
                <input class="form_field-input" placeholder-class="placeholder-cls" type="number" maxlength="11"
                  placeholder="请输入手机号" v-model="formValues.mobile" @input="onInput" cursor-spacing="20" />
              </view>
            </view>
            <view class="form_field flex_hfs_vc" v-if="formValues.type === 2">
              <view class="form_field-label">密码</view>
              <view class="form_field-value flex_hfs_vc">
                <input class="form_field-input" placeholder-class="placeholder-cls" type="password" maxlength="16"
                  placeholder="请输入密码" v-model="formValues.code" cursor-spacing="20" key="pwd-real" v-if="eyeClosed" />
                <input class="form_field-input" placeholder-class="placeholder-cls" type="text" maxlength="16"
                  placeholder="请输入密码" v-model="formValues.code" cursor-spacing="20" key="pwd-fake" v-else />
                <image class="form_field-trigger" mode="widthFix" src="@/assets/images/icons/eye-closed.svg"
                  @tap="toggleEyeStatus" v-show="eyeClosed" />
                <image class="form_field-trigger" mode="widthFix" src="@/assets/images/icons/eye-opened.svg"
                  @tap="toggleEyeStatus" v-show="!eyeClosed" />
              </view>
            </view>
            <view class="form_field flex_hfs_vc" v-else>
              <view class="form_field-label">验证码</view>
              <view class="form_field-value flex_hfs_vc">
                <input class="form_field-input" placeholder-class="placeholder-cls" type="text" maxlength="6"
                  placeholder="请输入验证码" v-model="formValues.code" cursor-spacing="20" />
                <button class="text-btn" :disabled="disabledSendSMSBtn" @tap="doSendSMS">
                  发送验证码{{ countdown ? `(${countdown}s)` : "" }}
                </button>
              </view>
            </view>
          </view>
          <view class="login-btns">
            <button :class="['btn btn-black', disabledLoginBtn ? 'disabled' : '']" @tap="doLoginWithMobile">
              登录
            </button>
            <button class="btn" @tap="toggleMobileMethod">
              {{ formValues.type == 2 ? "验证码登录" : "密码登录" }}
            </button>
          </view>
          <view class="login-extras">
            <view class="checkbox" @tap="togglePrivacy">
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox-checked.svg"
                v-if="formValues.privacyStatus" />
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox.svg" v-else />
              <block v-if="userStatus.isMember">
                <view class="checkbox-text">本人声明已年满16周岁，勾选以确认您已阅读并接受 On 昂跑的
                  <text class="link" @tap.stop="doViewPage('privacy', 1)">隐私政策</text>
                  。
                </view>
              </block>
              <block v-else>
                <view class="checkbox-text">本人声明已年满16周岁，勾选以确认您已阅读并接受 On 昂跑的
                  <text class="link" @tap.stop="doViewPage('privacy', 1)">隐私政策</text>
                  和
                  <text class="link" @tap.stop="doViewPage('privacy', 3)">通用条款</text>
                  。
                </view>
              </block>
            </view>
            <view class="checkbox" @tap="toggleNotice" v-if="!userStatus.isSubscribe">
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox-checked.svg"
                v-if="formValues.noticeStatus" />
              <image class="checkbox-icon" mode="widthFix " src="@/assets/images/icons/checkbox.svg" v-else />
              <view class="checkbox-text">订阅昂跑最新资讯和新品通知</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from "@tarojs/taro";
import mixins from '@/utils/mixins';
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
import store from '@/store';
export default {
  name: "LoginGuide",
  mixins: [mixins],
  props: {
    options: {
      type: Object,
      default: () => ({
        visible: false,
        hideAsGuest: false,
        enableGuest: false,
        btnText4Guest: "继续使用游客身份",
        tips: "",
        afterHandler: "",
        afterHandlerData: {}
      }),
    },
  },
  computed: {
    /**
     * `LoginGuide` 组件显示状态
     */
    visible() {
      return this.options?.visible || false;
    },
    /**
     * 关闭时是否以`游客身份`继续
     */
    hideAsGuest() {
      return this.options?.hideAsGuest || false;
    },
    /**
     * 是否启用`游客身份`功能按钮
     */
    enableGuest() {
      return this.options?.enableGuest || false;
    },
    /**
     * `游客身份`功能`按钮文本`
     */
    btnText4Guest() {
      return this.options?.btnText4Guest || "继续使用游客身份";
    },
    /**
     * `登录成功` 或 `确认游客身份` 的后续处理
     * - 如果是 `String` 类型, 则当做页面路径处理(跳转)
     * - 如果是 `Function` 类型, 则执行该回调函数
     * @returns {String|Function} `页面路径` 或 `回调函数`
     */
    afterHandler() {
      return this.options?.afterHandler;
    },
    afterHandlerData() {
      return this.options?.afterHandlerData;
    },
    /**
     * 微信授权手机号码方式, `登录`按钮`禁用`状态
     */
    disabledWXLoginBtn() {
      const { privacyStatus } = this.formValues;
      return !privacyStatus;
    },
    /**
     * `发送短信`按钮`禁用`状态
     */
    disabledSendSMSBtn() {
      const { mobile } = this.formValues;
      return !mobile || !VTypes.mobile.test(mobile) || !!this.countdown;
    },
    /**
     * 其他手机号码登录方式, `登录`按钮`禁用`状态
     */
    disabledLoginBtn() {
      const { mobile, code, privacyStatus } = this.formValues;
      // return !mobile || !VTypes.mobile.test(mobile) || !code || !privacyStatus;
      return !privacyStatus;
    },
  },
  data() {
    return {
      stage: 1,
      eyeClosed: true,
      countdown: 0,
      /**
       * 手机号新信息
       * - mobile: 手机号码
       * - countryCode: 区号
       */
      mobileInfo: {
        mobile: "",
        countryCode: "",
      },
      /**
       * 用户状态
       * - isMember: 是否是会员
       * - isSubscribe: 是否已订阅
       */
      userStatus: {
        isMember: 0,
        isSubscribe: 0,
      },
      /**
       *
       */
      formValues: {
        type: 1, // 1: 短信验证码, 2: 密码
        mobile: "",
        code: "",
        privacyStatus: false,
        noticeStatus: false,
      },
    };
  },
  beforeDestroy() {
    this._smsTimer && clearInterval(this._smsTimer);
    this.$worker?.terminate();
  },
  methods: {
    /**
     * 重置场景
     */
    doReset() {
      this.stage = 1;
    },
    /**
     * 显示
     */
    onShow(stage) {
      const oldStage = this.stage;
      this.doReset();
      this.$emit("close", { oldStage, newStage: stage });
    },
    /**
     * 隐藏
     */
    onHide() {
      const oldStage = this.stage;
      if (this.hideAsGuest) {
        this.onGuestConfirm();
      } else {
        this.doReset();
      }
      this.$emit("hide", { oldStage, newStage: 0 });
    },
    /**
     * 授权手机号码处理 & 登录
     */
    async getPhoneNumber(evt) {
      const { code } = evt.detail;
      if (!code) {
        // Taro.showToast({ title: '已拒绝', icon: 'none' });
        return false;
      }
      const res = await getPhoneNumber(code).catch((err) =>
        console.warn("@UCenter.getPhoneNumber::", err)
      );
      if (res) {
        const { purePhoneNumber: mobile, countryCode } = res;
        this.mobileInfo = { mobile, countryCode };
        //
        this.queryIsMemberByMobile(mobile)
          .then((res) => {
            const { info } = res;
            if (info) {
              this.userStatus = { ...info };
              this.onShowLogin4WxMobile();
            } else {
              console.warn("@getPhoneNumber::", res);
            }
          })
          .catch((err) => {
            errorHandler(err, true, "@getPhoneNumber::");
          });
      } else {
        Taro.showToast({ title: "手机号码获取失败", icon: "none" });
      }
    },
    /**
     * 根据手机号码查询是否为会员及其订阅状态
     */
    queryIsMemberByMobile(mobile) {
      return new Promise((resolve, reject) => {
        ajax({
          url: types.USER_STATUS,
          method: "POST",
          data: { mobile },
        })
          .then((res) => {
            const { code, data } = res;
            if (code === RES_SUCCESS_CODE) {
              resolve(data);
            } else {
              reject(res);
            }
          })
          .catch((err) => {
            errorHandler(err, true, "@queryIsMemberByMobile::");
            reject(err);
          });
      });
    },
    /**
     * 显示弹窗 - 使用微信手机号继续登录
     */
    onShowLogin4WxMobile() {
      this.stage = 2;
    },
    /**
     * 切换 `隐私政策` 及 `入会规则` 勾选状态
     */
    togglePrivacy() {
      this.formValues.privacyStatus = !this.formValues.privacyStatus;
    },
    /**
     * 切换订阅勾选状态
     */
    toggleNotice() {
      this.formValues.noticeStatus = !this.formValues.noticeStatus;
    },
    /**
     * 切换 `eye` 图标
     */
    toggleEyeStatus() {
      this.eyeClosed = !this.eyeClosed;
    },
    /**
     * 打开页面
     * @param {String} key 页面标识
     * @param {Number} vType 验证类型. 0=无; 1=登录; 2=游客
     */
    doViewPage(key, id) {
      let link = "";
      switch (key) {
        case "privacy":
          link = `/subpages/legal/index?id=${id}`;
          break;
        case "notice":
          break;
      }
      if (link) {
        Taro.navigateTo({ url: link });
      } else {
        Taro.showToast({ title: `未知页面 - ${key}`, icon: "none" });
      }
    },
    /**
     * 登录 - 授权手机号码
     */
    doLoginWithWxMobile() {
      const { mobile, countryCode } = this.mobileInfo;
      const { noticeStatus } = this.formValues;
      this.doLoginXHR({
        mobile,
        countryCode,
        type: 3,
        isSubscribe: noticeStatus ? 1 : 0,
      });
    },
    /**
     * 登录弹窗 - 手机号码
     * - 默认为短信验证码方式
     */
    onUseOthersMobile() {
      this.stage = 3;
      this.formValues.type = 1;
    },
    /**
     * 输入处理
     */
    onInput(evt) {
      const mobile = evt.detail.value;
      if (!mobile || mobile.length != 11) return false;
      if (!VTypes.mobile.test(mobile))
        return Taro.showToast({ title: "手机格式不正确", icon: "none" }), false;
      this.queryIsMemberByMobile(mobile)
        .then((res) => {
          const { info } = res;
          if (info) {
            this.userStatus = { ...info };
          } else {
            console.warn("@onInput", res);
          }
        })
        .catch((err) => {
          errorHandler(err, true, "@onInput::");
        });
    },
    /**
     * 发送短信
     */
    doSendSMS() {
      const { mobile } = this.formValues;
      ajax({
        url: types.SEND_SMS,
        method: "POST",
        data: { mobile, scene: "login" },
      })
        .then((res) => {
          const { code } = res;
          if (code === RES_SUCCESS_CODE) {
            clearInterval(this._smsTimer);
            // this.doCountdown();
            this.$worker = initWorker('workers/countdown.js', time => {
              this.countdown = time;
            });
            this.$worker?.postMessage(60);
          } else {
            errorHandler(res, true, "@doSendSMS::");
          }
        })
        .catch((err) => {
          errorHandler(err, true, "@doSendSMS::");
        });
    },
    /**
     * 倒计时
     */
    doCountdown() {
      this.countdown = 60;
      this._smsTimer = setInterval(() => {
        this.countdown--;
        if (this.countdown <= 0) clearInterval(this._smsTimer);
      }, 1000);
    },
    /**
     * 登录 - 手机号码 + (短信验证码 | 密码)
     */
    doLoginWithMobile() {
      const { mobile, code, type, privacyStatus, noticeStatus } =
        this.formValues;
      if (!mobile || !VTypes.mobile.test(mobile))
        return Taro.showToast({ title: "请输入手机号", icon: "none" }), false;
      if (type === 1 && !code)
        return Taro.showToast({ title: "请输入验证码", icon: "none" }), false;
      if (type === 2 && !code)
        return Taro.showToast({ title: "请输入密码", icon: "none" }), false;
      if (!privacyStatus)
        return (
          Taro.showToast({ title: "请阅读并同意所有条款", icon: "none" }), false
        );
      //
      this.doLoginXHR({
        mobile,
        code,
        type,
        isSubscribe: noticeStatus ? 1 : 0,
      });
    },
    /**
     * 切换手机登录方式: 短信验证码 | 密码
     */
    toggleMobileMethod() {
      this.formValues.type = this.formValues.type == 1 ? 2 : 1;
    },
    /**
     * 登录
     * @param {Object} args 登录请求的参数. 包含 `mobile`, `code`, `type` 字段
     */
    doLoginXHR(args) {
      let argPlus = args
      const { mobile, type } = args;
      const { query } = store.state.APPLaunchOption
      if (query && query.sid) {
        argPlus = Object.assign({ ...argPlus }, {
          source: query.sid
        })
      }
      console.log('USER_MOBILE_LOGIN----par', query)
      if (!mobile || !type)
        return console.warn("@doLoginXHR:: 缺少必要参数", args), false;
      return ajax({
        url: types.USER_MOBILE_LOGIN,
        method: "POST",
        data: argPlus,
      })
        .then((res) => {
          const { code, data } = res;
          if (code === RES_SUCCESS_CODE) {
            // Taro.setStorageSync('lw_token', data.token);
            Taro.setStorageSync("lw_loginStatus", res.wxUserStatus);
            Taro.setStorageSync("isUserMember", 1);
            Taro.setStorageSync("mobile", mobile);
            this.afterSuccess();
            //
            if (!this.userStatus.isMember) {
              this.doJoinMember();
            }
          } else {
            errorHandler(res, true, "@doLoginXHR::");
          }
        })
        .catch((err) => {
          errorHandler(err, true, "@doLoginXHR::");
        });
    },
    /**
     * 入会
     */
    doJoinMember() {
      const { query } = store.state.APPLaunchOption
      let par = {}
      if (query && query.sid) {
        par = Object.assign({}, {
          source: query.sid
        })
      }
      console.log('USER_JOIN----par', par)
      ajax({
        url: types.USER_JOIN,
        method: "POST",
        data: par
      })
        .then((res) => {
          const { code } = res;
          let msg = "注册成功";
          if (code !== RES_SUCCESS_CODE) msg = "网络开小差了，请重试！";
          Taro.showToast({ title: msg, icon: "none" });
        })
        .catch((err) => {
          errorHandler(err, true, "@doJoinMember::");
        });
    },
    /**
     * 登录成功回调处理
     */
    afterSuccess() {
      this.doReset();
      this.doAfterHandler();
      this.$emit("success");
    },
    /**
     * 继续使用游客身份
     */
    onGuestConfirm() {
      this.doReset();
      this.$emit("confirm");
      this.doAfterHandler();
    },
    /**
     * `登录成功` 或 `确认游客身份` 的后续处理
     */
    doAfterHandler() {
      const { afterHandler, afterHandlerData } = this;
      if (!afterHandler) return;
      if (typeof afterHandler === "function") {
        afterHandler(afterHandlerData);
      } else if (typeof afterHandler === "string") {
        this.actionHandler({
          type: 'link',
          data: afterHandler,
          appid: null
        })
        // Taro.navigateTo({ url: afterHandler });
      } else if (typeof afterHandler === "object") {
        this.actionHandler({
          type: 'link',
          data: afterHandler.link,
          appid: afterHandler.app_id
        })
      } else {
        console.warn("@doAfterHandler::", afterHandler);
      }
    },
  },
  filters: {
    desensitizify(fieldValue, fieldName) {
      return desensitizify(fieldName, fieldValue);
    },
  },
};
</script>

<style lang="scss">
// 弹窗 - 登录方式引导
.login_guide-entrance {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;

  .stage-inner {
    width: 100%;
    padding: 42rpx 32rpx 104rpx;
    background: #fff;
    border-radius: 10rpx 10rpx 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;

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

      .login-title {
        font-size: 40rpx;
        color: #000;
        line-height: 150%;
      }

      .login-desc {
        font-size: 28rpx;
        color: #999;
        line-height: 150%;
      }

      .login-btns {
        margin-top: 80rpx;

        .btn {
          width: 100%;

          &+.btn {
            margin-top: 32rpx;
          }
        }
      }
    }
  }
}

// 弹窗 - 登录方式 - 微信授权手机号码
.login_wxmobile-stage {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;

  .stage-inner {
    width: 100%;
    padding: 42rpx 32rpx 104rpx;
    background: #fff;
    border-radius: 10rpx 10rpx 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;

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

      .login_wxmobile-desc {
        font-size: 28rpx;
        color: #999;
        line-height: 150%;
      }

      .login_wxmobile-text {
        font-size: 52rpx;
        color: #000;
        letter-spacing: -0.02em;
        line-height: 120%;
        text-align: center;
        margin-top: 48rpx;
      }

      .login-btns {
        margin-top: 80rpx;

        .btn {
          width: 100%;
        }
      }

      .login-extras {
        margin-top: 64rpx;

        .checkbox {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;

          &-icon {
            width: 28rpx;
            height: 28rpx;
            margin-top: 4rpx;
            flex-shrink: 0;
          }

          &-text {
            font-size: 24rpx;
            color: #000;
            line-height: 36rpx;
            margin-left: 16rpx;

            .link {
              text-decoration: underline;
            }
          }

          &+.checkbox {
            margin-top: 16rpx;
          }
        }
      }
    }
  }
}

// 弹窗 - 登录方式 - 手机号码 & 短信验证码
.login_mobile-stage {
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;

  .stage-inner {
    width: 100%;
    padding: 42rpx 32rpx 104rpx;
    background: #fff;
    border-radius: 10rpx 10rpx 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
    z-index: 2;

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

      .login-title {
        font-size: 40rpx;
        color: #000;
        line-height: 150%;
      }

      .login-desc {
        font-size: 28rpx;
        color: #999;
        line-height: 150%;
      }

      .login-form {
        .form_field {
          height: 120rpx;
          padding-top: 38rpx;
          border-bottom: 2rpx solid #e5e5e5;

          &-label {
            width: 152rpx;
            height: 100%;
            padding: 0 0 0 12rpx;
            font-size: 28rpx;
            color: #000;
            line-height: 80rpx;
          }

          &-value {
            flex: 1;
            height: 100%;

            .form_field-input {
              flex: 1;
              height: 100%;
              font-size: 28rpx;
            }

            .text-btn {
              display: inline-block;
              height: 44rpx;
              padding: 0;
              margin: 0;
              background-color: transparent;
              border: none;
              border-bottom: 2rpx solid #000;
              border-radius: 0;
              font-size: 28rpx;
              color: #000;
              line-height: 44rpx;

              &::after {
                content: "";
                border: none;
              }

              &[disabled] {
                opacity: 0.3;
              }
            }

            .form_field-trigger {
              width: 48rpx;
              height: auto;
              margin-left: 40rpx;
            }
          }
        }
      }

      .login-btns {
        margin-top: 64rpx;

        .btn {
          width: 100%;

          &+.btn {
            margin-top: 32rpx;
          }
        }
      }

      .login-extras {
        margin-top: 64rpx;

        .checkbox {
          display: flex;
          justify-content: flex-start;
          align-items: flex-start;

          &-icon {
            width: 28rpx;
            height: 28rpx;
            margin-top: 4rpx;
            flex-shrink: 0;
          }

          &-text {
            font-size: 24rpx;
            color: #000;
            line-height: 36rpx;
            margin-left: 16rpx;

            .link {
              text-decoration: underline;
            }
          }

          &+.checkbox {
            margin-top: 16rpx;
          }
        }
      }
    }
  }
}
</style>
