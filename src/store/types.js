/**
 * ON Frontend API - 通过 Code 换取 OpenID
 */
export const CODE2OPENID = '/api/getTokenByWxCode';

/**
 * ON Frontend API - 通过 Code 换取手机号
 */
export const GET_PHONE_NUMBER = '/api/getPhoneNumber';

/**
 * 发送短信
 */
export const SEND_SMS = '/api/member/sendSMS';

/**
 * 区域 - 列表
 */
export const REGION_LIST = '/api/member/address/getBook';

/**
 * 用户 - 静默登录
 */
export const USER_OPENID_LOGIN = '/api/member/wx/signIn';

/**
 * 用户 - 手机登录
 */
export const USER_MOBILE_LOGIN = '/api/member/login';

/**
 * 用户 - 中心
 */
export const USER_CENTER = '/api/member/getUserCenter';

/**
 * 用户 - 入会和订阅状态
 */
export const USER_STATUS = '/api/member/getUserStatus';

/**
 * 用户 - 入会
 */
export const USER_JOIN = '/api/member/join';

/**
 * 用户 - 获取信息
 */
export const USER_INFO_GET = '/api/member/getProfile';

/**
 * 用户 - 更新信息
 */
export const USER_INFO_SET = '/api/member/updateProfile';

/**
 * 用户 - 修改密码
 */
export const USER_CHANGE_PWD = '/api/member/changePwd';

/**
 * 用户 - 收藏列表
 */
export const USER_COLLECTION_LIST = '/api/member/collect/list';

/**
 * 用户 - 收藏商品的IDs
 */
export const USER_COLLECTION_PIDS = '/api/member/collect/listIndex';

/**
 * 用户 - 添加收藏
 */
export const USER_COLLECTION_ADD = '/api/member/collect/add';

/**
 * 用户 - 取消收藏
 */
export const USER_COLLECTION_CANCEL = '/api/member/collect/cancel';

/**
 * 地址 - 数据源
 */
export const ADDRESS_CONFIG = '/api/member/address/getBook';

/**
 * 地址 - 列表
 */
export const ADDRESS_LIST = '/api/member/address/list';

/**
 * 地址 - 获取
 */
export const ADDRESS_INFO = '/api/member/address/get';

/**
 * 地址 - 保存
 */
export const ADDRESS_SAVE = '/api/member/address/save';

/**
 * 地址  -删除
 */
export const ADDRESS_DELETE = '/api/member/address/del';

/**
 * 产品 - 列表
 */
export const PLP_LIST = '/api/goods/plp';

/**
 * 产品 - 详情
 */
export const PDP_INFO = '/api/goods/pdp';

/**
 * 产品 - 添加足迹
 */
export const PDP_VISITED = '/api/goods/saveLatestView';

/**
 * 产品 - 最近浏览
 */
export const BROWSED_HISTORY = '/api/goods/getLatestView';

/**
 * 产品 - 搜索
 */
export const SEARCH = '/api/goods/search';

/**
 * 产品 - 搜索历史
 */
export const SEARCH_HISTORY = '/api/goods/searchHistory';

/**
 * 购物袋 - 信息
 */
export const CART_INFO = '/api/order/cart/get';

/**
 * 购物袋 - 加入商品
 */
export const CART_ADD = '/api/order/cart/add';

/**
 * 购物袋 - 更新商品
 */
export const CART_UPDATE = '/api/order/cart/update';

/**
 * 购物袋 - 删除商品
 */
export const CART_DELETE = '/api/order/cart/del';

/**
 * 购物袋 - 商品数量
 */
export const CART_NUMBER = '/api/order/cart/getCartNum';

/**
 * 订单 - 确认
 */
export const ORDER_CONFIRM = '/api/order/checkout/confirm';

/**
 * 订单 - 使用优惠码
 */
export const ORDER_CHECK_COUPON_CODE = '/api/order/checkout/checkCouponCode';


/**
 * 订单 - 使用优惠码
 */
export const ORDER_USE_COUPON_CODE = '/api/order/checkout/useCouponCode';

/**
 * 订单 - 清除优惠码
 */
export const ORDER_DEL_COUPON_CODE = '/api/order/checkout/delCouponCode';
/**
 * 订单 - 创建
 */
export const ORDER_CREATE = '/api/order/checkout/createOrder';

/**
 * 订单 - 支付配置
 */
export const ORDER_PAY = '/api/order/order/pay';

/**
 * 订单 - 状态列表
 */
export const ORDER_STATUS_LIST = '/api/order/order/getStatusList';

/**
 * 订单 - 订单列表
 */
export const ORDER_LIST = '/api/order/order/list';

/**
 * 订单 - 订单详情
 */
export const ORDER_INFO = '/api/order/order/detail';

/**
 * 订单 - 售后单列表
 */
export const AFTERSALE_LIST = '/api/order/afterSale/list';

/**
 * 订单 - 售后单详情
 */
export const AFTERSALE_DETAIL = '/api/order/afterSale/detail';

/**
 * 订单 - 物流信息
 */
export const ORDER_LOGISTICS = '';

/**
 * 订单 - 申请退款
 */
export const ORDER_REFUND = '';

/**
 * 订单 - 申请售后
 */
export const ORDER_SERVICE = '/api/order/afterSale/apply';

/**
 * 订单 - 提交退货地址
 */
export const ORDER_RETURN_SUBMIT = '';

/**
 * 订单 - 撤销申请售后
 */
export const ORDER_CANCEL_SERVICE = ''

/**
 * 订单 - 撤销申请退款
 */
export const ORDER_CANCEL_REFUND = '/api/order/afterSale/afterSaleCancel';

/**
 * 订单 - 重新下单
 */
export const ORDER_REORDER = '/api/order/order/reorder';

/**
 * 订单 - 取消订单
 */
export const ORDER_CANCEL = '/api/order/afterSale/cancel';

/**
 * 订单 - 完成订单
 */
export const ORDER_COMPLETE = '/api/order/order/complete';

/**
 * 查找有指定SKU的附近门店
 */
export const GET_STORE_BY_SKU = '/api/goods/getStoreStockData';

/**
 * OSS Config
 */
export const OSS_CONFIG = '/api/support/oss/getToken';

/**
 * 分享 - 普通分享
 */
export const MAKE_SHARE = '/api/member/share/makeShare';

/**
 * 分享 - 获取分享二维码
 */
export const MAKE_SHARE_QRCODE = '/api/member/share/makeShareQrcode';

/**
 * 分享 - 绑定分享关系
 */
export const MAKE_BIND = '/api/member/share/makeBind';


// 以下为其他常量, 如: Storage 的 Key; Store 方法名

/**
 * Key - 开屏组件 - 是否已展示
 */
export const CMP_SPLASH_VISITED = 'lw_splash_visited';

/**
 * Key - 添加到我的小程序提示显示状态
 */
export const HOME_FOLLOW_TIP = 'lw_follow_show';

/**
 * Key - 确认`继续使用游客身份` - 个人中心
 */
export const DIALOG_GUEST_CONFIRM_UCENTER = 'lw_guest_confirm_ucenter';

/**
 * Key - 确认`继续使用游客身份` - 订单结算
 */
export const DIALOG_GUEST_CONFIRM_CHECKOUT = 'lw_guest_confirm_checkout';

/**
 * Key - Worker 停止信号标识
 */
export const WORKER_SIGNAL_STOP = '__WORKER_SIGNAL_STOP__';

/**
 * 订阅消息 - 通知
 */
export const SUBSCRIBE_ADD = '/api/order/subscribe/add';
/* * 扫描
 */
export const PRODUCT_SCAN = '/api/goods/product/scan';

/**
 * 登录文案
 */
export const SUPPORT_CONFIG = '/api/support/config/get';


/**
 * squardRace - 参加活动(报名)
 */
export const JOIN_ACTIVITY = '/api/srace/join-activity'; //1
/**
 * squardRace - 创建队伍
 */ //1
export const CREATE_TEAM = '/api/srace/create-team'; //1
/**
 * squardRace - 获取鞋码数据
 */
export const GET_SHOES_SIZES = '/api/srace/get-shoes-sizes'; //1
/**
 * squardRace - 获取战区
 */
export const GET_TEAM_REGIONS = '/api/srace/get-regions'; //1
/**
 * squardRace -申请加入队伍
 */
export const APPLY_TEAM = '/api/srace/apply-team';  // 1
/**
 * squardRace -获取队伍列表
 */
export const GET_TEAM = '/api/srace/get-teams';
/**
 * squardRace -入队审批(是否同意入队)  ( status 2 、0 ??)
 */
export const CHECK_APPLY = '/api/srace/check-apply';
/**
 * squardRace -队伍审批列表()
 */
export const GET_APPLY = '/api/srace/get-apply';
/**
 * squardRace 上传成绩(传参 缺少日期+队伍id 头像)??
 */
export const ADD_PERFORMANCE = '/api/srace/add-performance';
/**
 * squardRace 上传记录 (+队伍id )??
 */
export const GET_PERFORMANCE = '/api/srace/get-performance';
/**
 * squardRace 上传图片
 */
export const IMG_UPLOAD = '/api/srace/upload-image';

/**
 * squardRace 获取赛事排行榜
 */
export const GET_RANCE = '/api/srace/get-races';
/**
 * squardRace 获取成员数据接口
 */
export const GET_MEMBERS = '/api/srace/get-members';
/**
 * squardRace 获取用户参赛信息
 */
export const GET_MEMBER_INFO = '/api/srace/get-member-info';
/**
 * squardRace 获取队伍数据接口
 */
export const GET_TEAM_INFO = '/api/srace/get-team-info';
/**
* 分享 - 获取分享二维码
*/
export const MAKE_SHARE_QRCODE_ON = '/api/getWechatMpQrCode';

/**
 * squardRace 获取队伍数据接口
 */
export const GET_ACTIVITY_STATUS = '/api/srace/get-activity-status';

/**
 * 优惠券兑换列表
 */
export const GET_USER_COUPON = '/api/crm/getUserCoupon';

// 接口文档 ：https://onrunning.atlassian.net/wiki/spaces/COC/pages/2052685825/Store+Reservation
/**
 * 获取预约活动信息
 */
export const GET_RESERVATION_INFO = "/api/crm/store/reservation/info";
/**
 * 获取预约商品尺码
 */
export const GET_SUBSCRIBE_SIZE = "/api/crm/product/sizeForSubScribeStore";
/**
 * 获取预约商品信息提交
 */
export const RESERVATION_SUBMIT = "/api/crm/store/reservation/save";
/**
 * 获取预约商品信记录
 */
export const RESERVATION_RECORD = "/api/crm/store/reservation/record";
/**
 * 获取Cloudsurfer活动信息
 */
export const CLUB_CAMPAIGN = "/api/crm/club/campaign";
/**
 * 获取招聘信息
 */
export const JOB_LIST= "/api/crm/job/list";
/**
 * 获取招聘详情
 */
 export const JOB_DETAIL= "/api/crm/job/detail";
 /**
 * job 上传简历文件
 */
  export const RESUME_UPLOAD= '/api/crm/job/resume/upload';
/**
 * 提交招聘职位信息
 */
 export const JOB_APPLY= "/api/crm/job/apply";
 /**
 * 获取门店订单
 */
 export const STORE_ORDER_API= "/api/crm/retail/order";
  /**
 * 获取门店订单详情
 */
  export const STORE_ORDER_DETAIL_API= "/api/crm/retail/order/detail";
  /**
   * 文本RSA非对称加密
   */
 export const TXT_TO_RAS = '/api/member/common/makeEncryption'
 /**
* 打开小程序更新
*/
export const UPDATE_OPEN_APP = "/api/member/openWx";
/**
* 关闭小程序更新
*/
export const UPDATE_CLOSE_APP = "/api/member/closeWx";
/**
* 登出小程序更新
*/
export const LOGOUT_APP = "/api/member/logout";


import campaign from "@/store/campaignApi";

export default {
  CODE2OPENID, GET_PHONE_NUMBER,
  SEND_SMS, REGION_LIST,
  USER_OPENID_LOGIN, USER_MOBILE_LOGIN, USER_CENTER, USER_STATUS, USER_JOIN, USER_INFO_GET, USER_INFO_SET, USER_CHANGE_PWD,
  USER_COLLECTION_LIST, USER_COLLECTION_PIDS, USER_COLLECTION_ADD, USER_COLLECTION_CANCEL, ADDRESS_CONFIG, ADDRESS_LIST, ADDRESS_INFO, ADDRESS_SAVE, ADDRESS_DELETE,
  PLP_LIST, PDP_INFO, PDP_VISITED, BROWSED_HISTORY, SEARCH, SEARCH_HISTORY, CART_INFO, CART_ADD, CART_UPDATE, CART_DELETE, CART_NUMBER,
  ORDER_CONFIRM, ORDER_USE_COUPON_CODE, ORDER_DEL_COUPON_CODE, ORDER_CREATE, ORDER_PAY, ORDER_STATUS_LIST, ORDER_LIST, ORDER_INFO, ORDER_LOGISTICS,
  ORDER_REFUND, ORDER_SERVICE, ORDER_RETURN_SUBMIT, ORDER_CANCEL_SERVICE, ORDER_CANCEL_REFUND, ORDER_REORDER, ORDER_CANCEL, AFTERSALE_LIST, AFTERSALE_DETAIL,
  GET_STORE_BY_SKU, OSS_CONFIG,ORDER_CHECK_COUPON_CODE,STORE_ORDER_API,STORE_ORDER_DETAIL_API,UPDATE_OPEN_APP,UPDATE_CLOSE_APP,LOGOUT_APP,
  CMP_SPLASH_VISITED, HOME_FOLLOW_TIP, DIALOG_GUEST_CONFIRM_UCENTER, DIALOG_GUEST_CONFIRM_CHECKOUT, WORKER_SIGNAL_STOP, ORDER_COMPLETE,MAKE_SHARE,MAKE_SHARE_QRCODE,MAKE_BIND,SUBSCRIBE_ADD,PRODUCT_SCAN,
  JOIN_ACTIVITY,CREATE_TEAM,GET_SHOES_SIZES,GET_TEAM_REGIONS,APPLY_TEAM,GET_TEAM,CHECK_APPLY,GET_APPLY,ADD_PERFORMANCE,GET_PERFORMANCE,IMG_UPLOAD,GET_RANCE,GET_MEMBERS,GET_TEAM_INFO,
  GET_ACTIVITY_STATUS,GET_MEMBER_INFO,SUPPORT_CONFIG,MAKE_SHARE_QRCODE_ON, GET_USER_COUPON,GET_RESERVATION_INFO,GET_SUBSCRIBE_SIZE,
  RESERVATION_SUBMIT,RESERVATION_RECORD,CLUB_CAMPAIGN,TXT_TO_RAS,
  JOB_LIST,JOB_DETAIL,JOB_APPLY,RESUME_UPLOAD,
  ...campaign
};
