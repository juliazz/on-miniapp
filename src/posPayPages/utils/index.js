import types from './types';
import {ajax} from '@/utils'



/**
 * 
 *  获取 POS订单详情
 *
 */

export const getPosOrder = async (data)=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.POS_ORDER_DETAIL, method: "POST", showLoading: true, host: $ON_API_HOST, data
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@getPosOrder::");
    });
  })
};

/**
 * 
 *  获取 SA QR
 *
 */

export const getSaQRCode = async (data)=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.SA_QR, method: "POST", showLoading: true, host: $ON_API_HOST, data
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@getSaQRCode::");
    });
  })
};

/**
 * 
 *  POS shouqianba Pay
 *
 */

export const posPay = async (data)=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.POS_PAY, method: "POST", showLoading: true, host: $ON_API_HOST, data
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@getSaQRCode::");
    });
  })
};

/**
 * 
 *  Notify register result
 *
 */
export const notifyRegisterResult = async (data)=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.STORE_MEMBER, method: "POST", showLoading: true, host: $ON_API_HOST, data
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@notifyRegisterResult::");
    });
  })
};
export default {
  getPosOrder, getSaQRCode, posPay, notifyRegisterResult
};

