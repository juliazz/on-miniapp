// import {sendGiftTempID,createSuccTempID} from "../orderPackage/utils";
import types from '@/store/types';
import {ajax,RES_SUCCESS_CODE} from '@/utils';
class subSrcHandler {
  constructor(app) {
    this.app = app
    this.data ={

    };
  }
    // 获取用户当前设置
    getWxSetting=()=> {
      wx.getSetting({
        withSubscriptions: true,
        success: res => {
          const { subscriptionsSetting } = res
          this.data.itemSettings=subscriptionsSetting.itemSettings ? subscriptionsSetting.itemSettings : ''
        },
        fail: err => {
          console.log(err, '获取当前设置失败');
        }
      })
    }
	 //发送订阅消息成功通知
  devCommonSubcribe =(_acceptList,sku = '')=>{
    return new Promise(async(resolve, reject) => {
      ajax({
        url: types.SUBSCRIBE_ADD,
        data:{
          templateId:_acceptList,
          state:'formal',//developer为开发版；trial为体验版；formal为正式版；默认为正式版
          sku
        },
      }).then(res => {
        if (RES_SUCCESS_CODE === res.code) {
          resolve(res)
          console.log('发送订阅成功！')
        }else{
          Taro.showToast({
            title: res.message,
            icon: 'none',
            duration: 2000
          })
        }
      }).catch(err => {
        Taro.showToast({
          title: err.message,
          icon: 'none',
          duration: 2000
        })
        console.log(err)
        reject(err)
      });
    });
  }


}
export default new subSrcHandler();
