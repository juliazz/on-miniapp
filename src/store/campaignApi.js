/**
 * ON Frontend API - 通过 手机号 换取 二维码
 */
export const CRMQRCODE = '/api/crm/qrcode';
// /**
//  * ON Frontend API - 获取预约活动信息
//  */
export const CYCLONREFERAL = '/api/crm/referal/program';

/**
* 解密微信步数
*/
export const WXRUNDATADECRYPT = '/api/crm/anniversary/upload/step';
/**
* 获取步数成绩
*/
export const GETSCORE = '/api/crm/anniversary/score';
/**
* 获取步数列表
*/
export const STEPLIST = '/api/crm/anniversary/step/list';

/**
* 获取活动状态
*/
export const GET_ACTIVITY_STATUS = '/api/crm/anniversary/info';

/**
* 获取用户订阅消息列表
*/
export const GET_SUBSCRIBE_LIST = '/api/crm/anniversary/subscribe/list';

/**
* 记录订阅消息
*/
export const RECORD_SUBSCRIBE = '/api/crm/anniversary/subscribe';

/**
* 参与活动
*/
export const JOIN_ACTIVITY = '/api/crm/anniversary/join';

/**
* 预约参与活动
*/
export const RESERVE_ACTIVITY = '/api/crm/anniversary/reserve';

/**
* 好友助力
*/
export const FRIEND_HELP = '/api/crm/anniversary/help';

/**
* 好友助力排名
*/
export const FRIEND_HELP_RANK = '/api/crm/anniversary/help/rank';

/**
* 上传成绩
*/
export const UPLOAD_SCORE = '/api/crm/anniversary/upload/score';

/**
* 获取奖品信息
*/
export const PRIZE_INFO = '/api/crm/anniversary/prize';

/**
* 排名列表
*/
export const RANK_LIST = '/api/crm/anniversary/rank/list';


export default {
  CRMQRCODE,
  CYCLONREFERAL,
  WXRUNDATADECRYPT,
  GETSCORE,
  GET_ACTIVITY_STATUS,
  RESERVE_ACTIVITY,
  GET_SUBSCRIBE_LIST,
  RECORD_SUBSCRIBE,
  JOIN_ACTIVITY,
  FRIEND_HELP,
  FRIEND_HELP_RANK,
  UPLOAD_SCORE,
  PRIZE_INFO,
  RANK_LIST,
  STEPLIST
};
