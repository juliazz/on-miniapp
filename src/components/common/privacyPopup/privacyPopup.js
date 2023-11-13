import store from '@/store';
import { Vict} from '@/utils';

Component({
  data: {
    /** 弹框现隐 */
    innerShow: false,
    /** 遮罩层 */
    pricvacyShow: false,
    curPage:Vict.getCurrentPageUrl()
  },
  /**
   * 组件的属性列表
   */
  properties: {
    popPage: {
      type: String,
      value: ""
    }
  },
  lifetimes: {
    attached: function () {
      if (wx.getPrivacySetting) {
        wx.onNeedPrivacyAuthorization((resolve) => {
          this.resolvePrivacyAuthorization = resolve
        })
        wx.getPrivacySetting({
          success: (res) => {
            if (res.needAuthorization) {
              wx.hideTabBar();
              this.setData(
                {
                  pricvacyShow: true,
                },
                () => {
                  this.setData({
                    innerShow: true,
                  });
                }
              );
            } else {
              this.triggerEvent("agree");
            }
          },
        });
      } else {
        this.triggerEvent("agree");
      }
    },
    detached: function () {
      wx.showTabBar();
    },
  },
  observers:{
    innerShow(val){
      val&&store.state.globalData.TA.track({
        eventName: 'pop_up_show',
        properties:{
          pop_up_name: '用户协议和隐私政策提示',
          pop_up_page: Vict.getCurrentPageUrl()
        }
      })
    }
  },
  methods: {
    handleDisagree() {
      if(this.resolvePrivacyAuthorization) {
        this.resolvePrivacyAuthorization({ event: 'disagree'})
      }
      this.setData({
        innerShow: false,
      });
      store.state.globalData.TA.track({
        eventName: 'pop_up_end',
        properties:{
          pop_up_name: '用户协议和隐私政策提示',
          pop_up_wayout: '点击不同意',
        }
      })
    },
    handleAgree() {
      wx.showTabBar();
      if(this.resolvePrivacyAuthorization) {
        this.resolvePrivacyAuthorization({ buttonId: 'agree-btn', event: 'agree' })
      }
      this.setData(
        {
          innerShow: false,
        },
        () => {
          this.setData({
            pricvacyShow: false,
          });
          store.state.globalData.TA.track({
            eventName: 'pop_up_end',
            properties:{
              pop_up_name: '用户协议和隐私政策提示',
              pop_up_wayout: '点击同意',
            }
          })
        }
      );
      this.triggerEvent("agree");
    },
    popUp() {
      this.setData({
        innerShow: true,
      });
      
    },
    disPrivacy() {
      this.setData({
        pricvacyShow: false,
      });
    },
    /** 打开隐私协议 */
    handleOpenPrivacyContract() {
      wx.openPrivacyContract();
    },
    prevent() {},
    handleTouch() {
      this.setData({
        innerShow: true,
      });
    },
  },
});
