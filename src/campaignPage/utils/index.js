import types from './types';
import {ajax} from '@/utils'



/**
 * 
 *  随机排列这个数组的items，并且某项固定
 *
 * 
 * 
 */
export const shuffleAndFixIndexToPosition = (originalArray, fixedIndex, fixedPosition) =>{
  const arr1 = originalArray.map((_, index) => index); // 生成索引数组 arr1
  const arr2 = arr1.slice().sort(() => Math.random() - 0.5); // 随机排列索引数组得到 arr2
  if((fixedIndex === 0) || fixedIndex){
    // 找到固定的索引在 arr2 中的位置
    const fixedIndexInArr2 = arr2.indexOf(fixedIndex);
    // 将固定项放到指定位置
    arr2.splice(fixedPosition, 0, arr2.splice(fixedIndexInArr2, 1)[0]);
  }

  // 根据 arr2 的顺序排列 originalArray
  const arr3 = arr2.map(index => originalArray[index]);

  return arr3;
}

/**
     * 获取cny信息
     * @param  无
     * @returns res
     */
export const getCnyInfo = async ()=>{
  // await getOnToken().catch(err => console.warn('@doSilentLogin::', err));
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.CNY_INFO, method: "GET", showLoading: true, host: $ON_API_HOST
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@getScore::");
    });
  })
};


/**
     * cny 记录订阅消息
     * @param{Object} data
     * @returns res
     */
export const cnyRecordSubcribe = async (data)=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.CNY_SUBSCRIBE, method: "POST", showLoading: true, host: $ON_API_HOST, data
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@cnyRecordSubcribe::");
    });
  })
};

/**
     * cny 是否订阅
     * @param{Object} data
     * @returns res
     */
export const cnyIsSubcribe = async (data)=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.CNY_IS_SUBSCRIBE, method: "POST", showLoading: true, host: $ON_API_HOST, data
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@cnyIsSubcribe::");
    });
  })
};



/**
     * cny 抽奖
     * @param 无
     * @returns res
     */
export const cnyDraw = async ()=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.CNY_DRAW, method: "POST", showLoading: true, host: $ON_API_HOST
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@cnyDraw::");
    });
  })
};



/**
   * cny 获取抽奖资格
   * @param  无
   * @returns res
   */
export const getCnyQualify = async ()=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.CNY_DRAW_QUALIFY, method: "GET", showLoading: true, host: $ON_API_HOST
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@getCnyQualify::");
    });
  })
};



/**
   * cny 获取抽奖记录
   * @param  无
   * @returns res
   */
export const getCnyRecordList = async ()=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.CNY_RECORD_LIST, method: "GET", showLoading: true, host: $ON_API_HOST
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@getCnyRecordList::");
    });
  })
};

/**
   * cny 获奖列表
   * @param  无
   * @returns res
   */
export const getCnyPrizeList = async ()=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.CNY_PRIZE_LIST, method: "GET", showLoading: true, host: $ON_API_HOST
    }).then((res) => {
      reslove(res)
    }).catch((err) => {
      reject()
      errorHandler(err, true, "@getCnyPrizeList::");
    });
  })
};
export default {
  getCnyInfo, cnyRecordSubcribe, cnyIsSubcribe, cnyDraw, getCnyQualify, getCnyRecordList, getCnyPrizeList,
  shuffleAndFixIndexToPosition
};

