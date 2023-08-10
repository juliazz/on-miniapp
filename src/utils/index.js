import Taro from "@tarojs/taro";
import store from '@/store';
import MD5 from '@/utils/md5';
import types from '../store/types';
import vict from './vict'
import CryptoJS from 'crypto-js';
export const RES_SUCCESS_CODE = 200;
export const RES_FAILURE_CODE = 400;
export const RES_NO_AUTHORITY_CODE = 401;

/**
 * 存储对象
 */
const storage = {
  loadingCount: 0,
  cached: {},
  callback: {}
};
const { envVersion } = Taro.getAccountInfoSync().miniProgram;
let LoginTimes = 5;
let  _debug = ['production', 'prod'].includes(process.env.NODE_ENV) ? false : true;
export const Vict =vict
/**
 * PX 转 RPX
 * @param {number} value4PX 常规像素值
 * @returns                 小程序RPX单位的值
 */
export const px2rpx = value4PX => {
  const winW = Taro.getSystemInfoSync().windowWidth;
  const ratio = 750 / winW;
  return value4PX * ratio;
}

/**
 * RPX 转 PX
 * @param {number} value4RPX 小程序RPX单位的值
 * @returns                  常规像素值
 */
export const rpx2px = value4RPX => {
  const winW = Taro.getSystemInfoSync().windowWidth;
  const ratio = 750 / winW;
  return value4RPX / ratio;
}

/**
 * 检查用户授权项状态
 * @param {Object} option 授权项配置
 */
export const checkSetting = option => {
  if (!option || typeof option != 'object' || !option.scope) return;
  Taro.getSetting({
    complete: (res) => {
			if (!res.authSetting[option.scope]) {
				Taro.authorize({
					scope: option.scope,
					success: () => {
						if (option.success) option.success();
					},
					fail: () => {
						Taro.showModal({
							title: option.title,
							content: option.message,
							success: (smRes) => {
								if (smRes.confirm) {
									Taro.openSetting({
										success: (res) => {
											if (res.authSetting[option.scope]) {
												if (option.success) option.success();
											} else {
												if (option.fail) option.fail();
											}
										}
									})
								} else {
									if (option.fail) option.fail();
								}
							}
						})
					}
				})
			} else {
				if (option.success) option.success();
			}
		}
  })
}

export const showCustomLoading = () => {
  store.commit('setLoadingVisible', true);
}

export const hideCustomLoading = () => {
  store.commit('setLoadingVisible', false);
}

/**
 * 显示 Loading
 */
export const showLoading = () => {
  storage.loadingCount++;
  Taro.showLoading({title: '加载中',});
}

/**
 * 隐藏 Loading
 */
export const hideLoading = () => {
  storage.loadingCount = Math.max(0, --storage.loadingCount);
  if (storage.loadingCount < 1) Taro.hideLoading();
}

/**
 * 设置缓存
 * @param {string} key 缓存数据的 Key
 * @param {*} value    缓存的数据
 */
export const setStorageSync = (key, value) => {
  if (key && value && typeof key == 'string') {
    storage.cached[key] = value;
  }
}

/**
 * 获取缓存
 * @param {string} key 缓存数据的 Key
 * @returns {*}        被缓存的数据
 */
export const getStorageSync = (key) => {
  if (key && typeof key == 'string') {
    return storage.cached[key];
  }
}

/**
 * 移除指定名称的缓存
 * @param {string} key 缓存数据的 Key
 */
export const removeStorageSync = (key) => {
  if (key && typeof key == 'string') {
    delete storage.cached[key];
  }
}

/**
 * 清空内存缓存
 */
export const clearStorageSync = () => {
  storage.cached = {};
}

/**
 * 对象数组排序
 * @param {Array} array   原始数组
 * @param {string} key    对比字段
 * @param {string} method 排序方式, 可选: 'asc', 'desc'
 * @returns               排序完的数据
 */
export const objectArraySort = (array, key, method = 'asc') => {
  if (!Array.isArray(array) || !array.length || !key || !['desc', 'asc'].includes(method)) return array;
  // return array.sort((a, b) => method == 'desc' ? b[key] - a[key] : a[key] - b[key]); // Number
  return array.sort((a, b) => {
    if (method == 'desc') {
      return b[key] > a[key] ? 1 : b[key] < a[key] ? -1 : 0;
    } else {
      return a[key] > b[key] ? 1 : a[key] < b[key] ? -1 : 0;
    }
  });
}

export const guid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' .replace(/[xy]/g,  o => {
    var  r = Math.random()*16|0, v = o ==  'x'  ? r : (r&0x3|0x8);
    return  v.toString(16);
  });
}

/**
 * 空函数
 */
export const fn = () => {}

/**
 * 检测参数是否为空值
 * @param {*} arg
 * @returns
 */
export const isEmpty = arg => {
  return arg === null || arg === undefined || arg === "";
}

/**
 * 添加回调函数
 * @param {string} name    回调函数的标识名称
 * @param {function} fn    回调函数
 * @param {Object} context 回调函数的上下文
 * @param {*} args         回调函数的参数
 * @returns
 */
export const addCallback = (name, fn, context, args) => {
  if (typeof name == "string" && name.length && typeof fn == "function") {
    if (!storage.callback[name]) {
      storage.callback[name] = [];
    } else if (!Array.isArray(storage.callback[name])) {
      console.warn('@addCallback::', name, fn, context, args);
      return false;
    }
    storage.callback[name].push({ fn, context, args });
  }
}

/**
 * 执行回调函数
 * @param {string | function | Array<Object>} target 执行的目标<名称|函数|配置对象>
 * @param {*} context                                回调函数的上下文
 * @param {*} args                                   回调函数的参数
 */
export const runCallback = (target, context = null, args = null) => {
  if (typeof target == "function") {
    return target.apply(context, args);
  } else if (typeof target == "string" && Array.isArray(storage.callback[target]) && storage.callback[target].length) {
    runCallback(storage.callback[target]);
  } else if (Array.isArray(target) && target.length) {
    // # 1.
    while(target.length) {
      const { fn, content, args } = target.shift();
      runCallback(fn, content, args);
    }
    // # 2.
    // const fn = target.shift();
    // typeof fn == "function" && fn();
    // target.length && runCallback(target, context, args);
  }
}

/**
 * 防抖 - 延迟执行
 * @param {Function} handle
 * @param {Number} delay
 * @returns
 */
export const debounce = (handle, delay = 1000 / 60) => {
  var timer = null;
  return function () {
    var _this = this, _arg = arguments;
    clearTimeout(timer);
    timer = setTimeout(function () {
      handle.apply(_this, _arg);
    }, delay);
  };
}

/**
 * 节流 - 间隔执行
 * @param {Function} handle 回调函数
 * @param {Number} interval 执行间隔
 * @returns
 */
export const throttle = (handle, interval = 1000 / 60) => {
  var lastTime = 0;
  return function () {
    var nowTime = new Date().getTime();
    if (nowTime - lastTime >= interval) {
      handle.apply(this, arguments);
      lastTime = nowTime;
    }
  };
}

/**
 * 日期对象转换成指定格式的字符串
 * @param {Date}   date 日期对象
 * @param {string} fmt  格式字符串
 * @returns {string}    指定格式的日期字符串
 */
export const dateFormat = (date, fmt = 'yyyy-MM-dd hh:mm:ss') => {
  if (date?.constructor != Date || fmt?.constructor != String) return "";
  var o = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds(), //毫秒
  };
  if (/(y+)/i.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
  return fmt;
};

/**
 * 深度克隆 - 简单版
 * @param {Object} source
 * @returns {Object}
 */
export const deepClone = source => {
  if (!source) return source;
  try {
    return JSON.parse(JSON.stringify(source));
  } catch(err) {
    console.warn(err);
  }
}

/**
 * 一维数组转二维数组
 * @param {Array<Object>} array
 * @param {Number} size
 * @returns
 */
export const arrayTranslater = (array, size = 2, clonable = true) => {
  if (Array.isArray(array) && array.length) {
    let ret = [];
    if (clonable) {
      try {
        const original = deepClone(array);
        while(original.length) ret.push(original.splice(0, size));
      } catch (error) {
        console.warn('@arrayTranslater::', error);
      }
    } else {
      while(array.length) ret.push(array.splice(0, size));
    }
    return ret;
  }
  return array;
}

/**
 * 数组转树形结构
 * @param   {array}  array    待转换的数组
 * @param   {string} id       唯一属性名
 * @param   {string} parentId 父级属性名
 * @param   {string} children 子级属性名
 * @return  {array}           树形结构数据
 */
export function arrayToTree(array, id = 'id', parentId = 'pid', children = 'children') {
  const result = [], hash = {}, data = deepClone(array);
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  });
  data.forEach(item => {
    const hashParent = hash[item[parentId]]
    if (hashParent) {
      !hashParent[children] && (hashParent[children] = [])
      hashParent[children].push(item)
    } else {
      result.push(item)
    }
  });
  return result;
}

/**
 * 从树形结构数组中过滤掉指定的节点
 * @param {Array}   sourceTree   待过滤的数据源数组
 * @param {Object}  filterTarget 需要过滤掉的节点对象
 * @param {String}  filterByKey  节点对象对比的属性名称
 * @param {String}  childrenKey  子级节点数组在父级对象的属性名称
 * @returns {Array}              返回过滤后的数组
 */
export function filterTreeNode(sourceTree, filterTarget, filterByKey = 'id', childrenKey = 'children') {
  if (!sourceTree || !Array.isArray(sourceTree) || !sourceTree.length || !filterTarget || !filterTarget[filterByKey]) return sourceTree;
  //
  let list = [];
  sourceTree.forEach(node => {
    if (node[filterByKey] !== filterTarget[filterByKey] && !Array.isArray(node[childrenKey])) {
      list.push({ ...node });
    } else if (node[filterByKey] !== filterTarget[filterByKey]) {
      list.push({ ...node, [childrenKey]: filterTreeNode(node[childrenKey], filterTarget, filterByKey) });
    }
  });
  return list;
}

/**
 * 根据 `K & V` 查找所对应的层级结构
 * @param {Array<Object>} sourceTree 目标 Tree 结果数据
 * @param {String|Number} value 匹配的属性值
 * @param {String} field 匹配的属性名
 * @param {String} childKey 子级属性名
 * @param {String} parentKey 父级属性名
 * @returns {Array<Object>} 匹配对象在数据源中的层级结构
 */
export const findTreeNodePaths = (sourceTree, value, field = 'id', childKey = 'children', parentKey = 'parent_id') => {
  let nodePaths = [], nodeStack = [], nodeCache = {}, isDFS = true; // 遍历模式: 深度优先(DFS) / 广度优先(BFS).
  if (Array.isArray(sourceTree) && sourceTree.length) {
    let original = deepClone(sourceTree);
    nodeStack.push(...original);
    //
    while (nodeStack.length) {
      const node = { ...nodeStack.shift() };
      if (node[field]) {
        nodeCache[`n_${node[field]}`] = node;
        //
        const nodeChildren = node[childKey];
        delete node[childKey];
        //
        if (Array.isArray(nodeChildren) && nodeChildren.length) {
          isDFS ? nodeStack.splice(0, 0, ...nodeChildren) : nodeStack.push(...nodeChildren);
        }
      } else {
        break;
      }
    }
    //
    let currentNode = nodeCache[`n_${value}`];
    while (currentNode) {
      nodePaths.unshift(currentNode);
      //
      currentNode = nodeCache[`n_${currentNode[parentKey]}`];
    }
  }
  return nodePaths;
}

/**
 * 替换URL中多余的斜杠
 * @param {String} url 待处理的URL
 * @returns {String}   处理后的结果
 */
export const fixSlash = (url) => {
  if (!url || typeof url != 'string') return url;
  return url.replace(/([^:])\/{2,}/g, '$1/');
  // return url.replace(/(?<=[^:])\/{2,}/g, '/');
}

/**
 * CMS资源路径处理
 * @param {string} filePath 文件路径
 * @returns                 完整路径
 */
export const fixCMSPath = (filePath, resizable = false, enableImageProcessing = true) => {
  let targetPath = filePath;
  if (!filePath) return filePath;
  if (!/^http(s)?:\/\//i.test(filePath)) {
    targetPath = fixSlash(`${$OSS_CDN_HOST}/${filePath}`);
  }
  // 图片处理
  if (isImagePath(targetPath) && enableImageProcessing) {
    if (resizable) {
      let resizeParam = '/resize,w_375,m_lfit';
      if (typeof resizable === 'number' || !isNaN(resizable)) {
        resizeParam = `/resize,w_${resizable},m_lfit`;
      } else if (typeof resizable === 'object' && resizable.size && resizable.mode) {
        resizeParam = `/resize,${resizable.size},${resizable.mode}`;
      } else if (typeof resizable === 'string' && /^\/resize/.test(resizable)) {
        resizeParam = resizable;
      }
      return `${targetPath}?x-oss-process=image/format,webp${resizeParam}/interlace,1`;
    }
    return `${targetPath}?x-oss-process=image/format,webp/interlace,1`;
  }
  return targetPath;
}

/**
 * CMS 配置中的数值处理
 * 因设计稿为375像素, 需转成小程序的750rpx固定尺寸
 * 盒子倍数*2，图片倍数*3
 */
export const fixCMSNumber = (number, ratio = 2) => {
  return isNaN(number) ? number : number * ratio;
}

/**
 * 转换 CMS 配置的商品数据格式
 * @param {Array|Object} source
 * @returns
 */
export const fixCMSPdtInfo = source => {
  if (Array.isArray(source) && source.length) {
    let ret = [];
    source.forEach(o => {
      ret.push(fixCMSPdtInfo(o));
    });
    return ret;
  } else if (source.color) {
    const {
      default_image, display_assets, price, original_price, gender_cn, tag: tags, style_slug, product_slug,
      style: { style_product_type, style_display_name, style_display_name_cn2, style_description_cn, style_short_description_cn },
      lang: { color_name_cn }
    } = source.color;
    //
    return {
      style_slug,
      style_product_type,
      style_display_name,
      style_display_name_cn2,
      style_description_cn,
      style_short_description_cn,
      colors: {
        assets: display_assets,
        default_image,
        gender_cn,
        color_name_cn,
        price,
        original_price,
        tags,
        style_slug,
        product_slug
      },
      spu: `${style_slug}${product_slug}`
    };
  } else {
    return null;
  }
}

/**
 * 获取商品颜色的缩略图
 * @param {Object} color 商品颜色级别数据
 * @returns 图片路径
 */
export const fixColorThumbnail = color => {
  if (!color || typeof color != 'object' || !color.product_slug) return console.warn('@fixColorThumbnail::', color), '';
  let thumbnail = '';
  if (color.default_image?.[0]?.local_url) {
    thumbnail = color.default_image[0].local_url;
  } else if (Array.isArray(color.assets) && color.assets.length) {
    thumbnail = color.assets.find(o => !o.is_video).local_url;
  } else if (typeof color.default_image == 'string' && isImagePath(color.default_image)) {
    thumbnail = color.default_image;
  }
  return thumbnail;
}

/**
 * 判断是否为图片链接
 * @param {String} filePath
 * @returns
 */
export const isImagePath = filePath => {
  if (!filePath || typeof filePath !== 'string') return false;
  return /\.(png|jpg|gif|jpeg|webp)$/i.test(filePath);
}

/**
 * 获取统一格式的错误消息
 * @param {string} msg 错误消息
 * @returns {Object}   错误消息对象
 */
export const getErrorInfo = msg => ({ code: RES_FAILURE_CODE, msg });

/**
 * JSON 转 URI 参数
 * @param {Object} args 待转换的 JSON 数据
 * @param {Array<String>} includes 需要包含的 Key
 * @param {Array<String>} excludes 需要排除的 Key
 * @returns {String} URI 参数字符串
 */
export const encodeObject2URIParams = (args, includes = [], excludes = []) => {
  if (!args || typeof args !== 'object' || !Object.keys(args).length) return "";
  let dataKeys = Object.keys(args);
  if (Array.isArray(excludes) && excludes.length) dataKeys = dataKeys.filter(key => !excludes.includes(key));
  if (Array.isArray(includes) && includes.length) dataKeys = dataKeys.filter(key => includes.includes(key));
  return dataKeys.map(key => (`${encodeURIComponent(key)}=${encodeURIComponent(args[key])}`)).join('&');
}

/**
 * URI 参数字符串转 JSON
 * @param {String} str 待转换的 URI 参数字符串
 * @returns {Object} JSON 对象
 */
export const decodeURIParams2Object = str => {
  if (!str || typeof str !== 'string') return {};
  let ret = {};
  decodeURIComponent(str).replace(/([^?=&]+)=([^?=&]+)/g, (matched, group1, group2, index, original) => {
    ret[decodeURIComponent(group1)] = decodeURIComponent(group2);
  });
  return ret;
}

/**
 * 从目标字符串中获取指定属性名的值
 * @param {String} source 目标字符串
 * @param {String} target 匹配的属性名
 * @returns {String} 匹配到的属性值
 */
export const getQueryString = (source, target) => {
  var reg = new RegExp("(^|&)" + target + "=([^&]*)(&|$)", "i");
  var ret = source.match(reg);
  if (ret) return decodeURIComponent(ret[2]); return '';
}

/**
 * 参数签名
 * @description API签名秘钥(vfr4VFR$)
 * @param {Object} args
 * @returns
 */
export const signHandler = (args, objSigned = false) => {
  let keys = [], str = '';
  for (let key in args) {
    if (['string', 'number', 'boolean', 'undefined'].includes(typeof args[key])) keys.push(key);
    if (objSigned && ['object'].includes(typeof args[key])) keys.push(key);
  }
  keys = keys.sort((a, b) => a.localeCompare(b)).map(key => {
    if (objSigned && ['object'].includes(typeof args[key])) {
      return `${key}${JSON.stringify(args[key])}`
    } else {
      return `${key}${args[key]}`
    }
  });
  str = keys.join('');
  str = `vfr4VFR$${str}vfr4VFR$`;
  return MD5(str).toUpperCase();
}

export const getSignedParams = args => {
  if (!args || typeof args != 'object') return args;
  return {
    ...args,
    sign: signHandler(args),
    // sign2: signHandler(args, true)
  }
}

// let ajaxCache = {};

/**
 * 请求
 * @param {string | Object} args 请求地址或配置对象
 * @returns {Promise}            返回一个 Promise 对象
 */
export const ajax = args => {
  if (!args || !['string', 'object'].includes(typeof args)) return Promise.reject(getErrorInfo('配置或参数错误！'));
  const env = Taro.getEnv();
  let _host = $API_HOST, _url, _data = {}, _method = "POST", _headers = {
    'Content-Type': 'application/json',
    'Platform': env === 'WEAPP' ? 'WXMP' : env
  }, _json = false, _authorize = true, _success = fn, _failure = fn, _complete = fn;
  let _showLoading = true;
  if (typeof args == 'string') {
    _url = args;
  } else if (typeof args == "object" && Object.keys(args).length) {
    const { host, url, method, data, headers, json, authorize, success, failure, complete, showLoading, debug } = args;
    host && (_host = host);
    url && (_url = url);
    typeof data == 'object' && Object.keys(data) && (_data = getSignedParams(data));
    ['GET', 'POST'].includes(method) && (_method = method);
    typeof headers == 'object' && Object.keys(headers) && (_headers = headers);
    typeof success == 'function' && (_success = success);
    typeof failure == 'function' && (_failure = failure);
    typeof complete == 'function' && (_complete = headers);
    // typeof showLoading !== 'undefined' && (_showLoading = !!showLoading);
    typeof debug !== 'undefined' && (_debug == !!debug); //false 正式环境  true  测试环境
    json !== undefined && (_json = !!json);
    authorize !== undefined && (_authorize = !!authorize);
  }
  if (!_url) return Promise.reject(getErrorInfo('缺少必要参数：请求地址'));
  //
  // const xhrKey = _data.sign2 || _url;
  // if (ajaxCache[xhrKey]) return console.warn('<Ajax>已取消重复请求'), Promise.reject(errorHandler({msg:'请勿频繁操作'},false,'@loadSource::'));
  // delete _data.sign2
  //
  // const token = Taro.getStorageSync('lw_token');
  // if (token) _headers.token = token;
  _headers['Version'] = envVersion === 'release' ? 'publish' : 'preview';
  const onToken = Taro.getStorageSync('token');
  if (onToken) _headers['On-Token'] = onToken;
  //
  store.commit('setReqHeader', _headers);

  // _showLoading && showLoading();
  //
  return new Promise((resolve, reject) => {
    // ajaxCache[xhrKey] = true;
    console.log('request-Url---->',_url)
    _data&&JSON.stringify(_data)!=="{}"&&console.log('request-Data------------>',_data)
    Taro.request({
      url: fixSlash(`${_host}${_url}`),
      data: _data,
      method: _method,
      header: _headers,
      success: async(res) => {
        console.log('request-Res---->',res)
        const { statusCode, data } = res;
        if (_json) {
          if (statusCode === RES_SUCCESS_CODE) {
            _debug && console.log(`[Success]<${_url}>::`, res);
            _success(res);
            resolve(res);
          } else {
            _debug && console.log(`[Failure]<${_url}>::`, res);
            _failure(res);
            reject(res);
          }
        } else {
          if (statusCode === RES_SUCCESS_CODE) {
            // 鉴权处理
            const { code } = data;
            if (code === RES_NO_AUTHORITY_CODE && _authorize) {
              // Taro.removeStorageSync('lw_token');
              Taro.removeStorageSync('lw_loginStatus');
              _debug && console.log(`[Unauthorized]<${_url}>::`, data);
              //
              // console.log('LoginTimes',LoginTimes)
              if(LoginTimes>0){
                const {data} = await doSilentLogin(true).catch(err => {
                  reject(err);
                });
                data && resolve(ajax(args));
              }else{
                // Taro.showToast({ title: data.message || '身份已过期，请重新登录', icon: 'none' });
                // 鉴权失败跳转至 UCenter 页面
                let returnUrl = '';
                // const { path, params } = Taro.getCurrentInstance().router;
                // returnUrl = `${path}?${encodeObject2URIParams(params, [], ['$taroTimestamp'])}`;
                const { route, $taroParams, $taroPath } = Taro.getCurrentInstance().page;
                returnUrl = `${route}?${encodeObject2URIParams($taroParams, [], ['$taroTimestamp'])}`;
                if (route !== 'pages/ucenter/index') {
                  returnUrl = `?returnUrl=${$taroPath}`;

                  // Taro.reLaunch({
                  //   url: `/pages/ucenter/index?${returnUrl}`
                  // });
                } else {
                  // console.warn('[ajax#Unauthorized]::UCenter 页面触发');
                }
              }
            } else {
              _debug && console.log(`[Success]<${_url}>::`, data);
              _success(data);
              resolve(data);
            }
          } else {
            _debug && console.warn(`[Failure]<${_url}>::`, res);
            _failure(res);
            reject(res);
          }
        }
      },
      fail: err => {
        _failure(err);
        _debug && console.warn(`[Failure]<${_url}>::`, err);
        reject(err);
      },
      complete: ret => {
        // delete ajaxCache[xhrKey];
        // _showLoading && hideLoading();
        _complete(ret);
      }
    });
  });
}

/**
 * 加载 CMS 页面的配置(JSON)文件
 * @param {string} type 页面类型
 * @param {string} code 页面代码
 * @returns {Promise}   返回一个 Promise 对象
 */
export const loadCMSConfig = (type, code) => {
  // splash: 开屏; index: 首页; category: 分类页; plp: 列表页; pdp: 详情页; landing: 活动页; recmd: 推荐位;
  // uc_ad: 个人中心广告位; store: 门店信息; keyword: 热搜; size_charts: 尺码表; size_mapping: 尺码范围
  if (!['splash', 'index', 'category', 'plp', 'pdp', 'landing', 'recmd', 'uc_ad', 'club','store', 'keyword', 'size_charts', 'size_mapping', 'legal','announcement','user_center','electronic_invoice'].includes(type)) {
    return Promise.reject(getErrorInfo('缺少必要参数或参数错误：页面类型'));
  }
  // const { envVersion } = Taro.getAccountInfoSync().miniProgram;
  // const host = envVersion === 'release' ? $OSS_CDN_HOST : $OSS_HOST;
  const host = $OSS_CDN_HOST;
  const env = envVersion === 'release' ? 'publish' : 'preview';
  // const env = 'publish';
  const channel = 'wcmp'; // wcmp: 微信小程序; pcweb: PC官网; mobweb: H5官网
  //
  const envJSON = _debug ? '_stage' :''
  let _filePath = '', showLoading = false;
  switch(type) {
    case "splash":
      _filePath = `/json${envJSON}/${env}/splash.json`;
      showLoading = false;
      break;
    case "index":
      _filePath = `/json${envJSON}/${env}/${channel}_homepage.json`;
      break;
    case "category":
      _filePath = `/json${envJSON}/${env}/${channel}_product_category_tree.json`;
      break;
    case "plp":
      if (!code) return Promise.reject(getErrorInfo('缺少必要参数：页面代码'));
      _filePath = `/json${envJSON}/${env}/${channel}_category_${code}.json`;
      break;
    case "pdp":
      if (!code) return Promise.reject(getErrorInfo('缺少必要参数：页面代码'));
      _filePath = `/json${envJSON}/${env}/${channel}_pdp_${code}.json`;
      break;
    case "landing":
      if (!code) return Promise.reject(getErrorInfo('缺少必要参数：页面代码'));
      _filePath = `/json${envJSON}/${env}/${channel}_landingpage_${code}.json`;
      break;
    case "club":
      if (!code) return Promise.reject(getErrorInfo('缺少必要参数：页面代码'));
      _filePath = `/json${envJSON}/${env}/${channel}_landingpage_${code}.json`;
      break;
    case "recmd":
      _filePath = `/json${envJSON}/${env}/${channel}_recommendation.json`;
      showLoading = false;
      break;
    case "uc_ad":
      _filePath = `/json${envJSON}/${env}/${channel}_myaccount.json`;
      showLoading = false;
      break;
    case "store":
      _filePath = `/json${envJSON}/${env}/store.json`;
      break;
    case "keyword":
      _filePath = `/json${envJSON}/${env}/search_keyword.json`;
      break;
    case "size_charts":
      _filePath = `/json${envJSON}/${env}/size_charts.json`;
      break;
    case "size_mapping":
      _filePath = `/json${envJSON}/${env}/size_mapping.json`;
      break;
    case "legal":
      _filePath = `/json${envJSON}/${env}/legal_content.json`;
      break;
    case "announcement":
      _filePath = `/json${envJSON}/${env}/announcement.json`;
      break;
    case "user_center":
      _filePath = `/json${envJSON}/${env}/user_center.json`;
      break;
    case "electronic_invoice":
      _filePath = `/json${envJSON}/${env}/electronic_invoice.json`
    default:
      break;
  }
  //
  if (!_filePath) return Promise.reject(getErrorInfo('参数错误：请求路径不能为空'));
  //
  return new Promise((resolve, reject) => {
    ajax({ host, url: _filePath, method: 'GET', json: true, showLoading }).then(res => {
      const { statusCode, data } = res;
      if (statusCode === 200) {
        if (Array.isArray(data.components) && data.components.length) {
          // 组件名转驼峰
          fixComponentName(data.components);
          //
          // let enableSplash = data.components.find(o => o.component_type === 'Splash');
          // if (!enableSplash) store.commit('setVisible4HTS', true);
        } else if (data.component_type) {
          fixComponentName(data);
        }
        //
        resolve(data);
      } else {
        reject(res);
      }
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * CMS组件名称处理
 * @param {Object} target CMS组件配置对象或数组
 * @returns               处理完的组件配置对象或数组
 */
export const fixComponentName = target => {
  if (!target || typeof target != 'object') return target;
  if (Array.isArray(target) && target.length) {
    target.forEach(fixComponentName);
  } else if (target.component_type) {
    target.component_type = target.component_type.replace(/^(\w)/, (all, letter) => letter.toUpperCase()).replace(/(\s+\w)/g, (all, letter) => letter.toUpperCase().trim());
    target.component_type = target.component_type.replace(/^Slider$/i, 'MediaSlider');
    target.component_type = target.component_type.replace(/^Gallery$/i, 'BlockGallery');
    // 处理内嵌子组件
    if (target.content && Array.isArray(target.content.items) && target.content.items.length) {
      fixComponentName(target.content.items);
    }
  } else {
    // console.warn('@utils.fixComponentName::', target);
  }
  return target;
}

/*\
* 脱敏处理函数
* @params {String} fieldName 字段标识
* @params {String} fieldValue 字段值
* @params {Boolean} forceCancel 是否强制不处理脱敏
* @return {String} 处理后的值
\*/
export const desensitizify = (fieldName, fieldValue, forceCancel) => {
  if (!fieldName || ['name', 'mobile', 'email', 'address', 'password'].indexOf(fieldName) == -1 || forceCancel || !fieldValue) return fieldValue;
  if (fieldName == 'name') {
    // return fieldValue.replace(/(?<=.)./g, '*'); // 保留姓氏，名字一字一星
    return fieldValue.replace(/^(.).*/, '$1**'); // 保留姓氏，名字为两星
  } else if (fieldName == 'mobile') {
    return fieldValue.replace(/(\d{3})\d*(\d{4})/, '$1****$2');
  } else if (fieldName == 'email') {
    return fieldValue.replace(/(^.{1,3}).*(@\w+\.\w+)/, '$1***$2');
  } else if (fieldName == 'address' || fieldName == 'password') {
    return "*********";
  }
  return fieldValue;
}

/**
 * Error 处理
 * @param {Object} err
 * @param {Boolean} showToast
 * @param {String} label
 * @returns
 */
export const errorHandler = (err, showToast = false, label) => {
  if (!err) return false;
  showToast && Taro.showToast({ title: err.msg || err.message || err.errMsg || err.errMessage || err.errorMsg || err.errorMessage || '网络不给力', icon: 'none' });
  console.warn(label, err);
};

/**
 * Error 处理
 * @param {Object} msg // to c 页面提示信息
 * @param {Boolean} showToast
 * @param {String} label //请求接口名
 * @param {Object} err
 * @returns
 */
export const errorHandlerFront = (forntmsg, showToast = false, label,err) => {
  if (!err) return false;
  showToast && Taro.showToast({ title:forntmsg.msg|| '网络不给力', icon: 'none' });
  console.warn(label, err);
};

/**
 * 获取 OpenID & Token - OnRunning Frontend API
 * @returns {Promise}
 */
export const getOnToken = async(resetFlag = false) => {
  const loginRes = await Taro.login();
  return new Promise((resolve, reject) => {
    let _expireTime = Taro.getStorageSync('expireTime')
    if(_expireTime && !resetFlag){
      let _now = new Date().getTime()
      let _expire = _expireTime*1000
      // console.log(_now,_expire)
      if(_now - _expire < 0){
        let token = Taro.getStorageSync('token')
        resolve({ token });
        return;
      }
    }
    ajax({
      host: $ON_API_HOST,
      url: types.CODE2OPENID,
      method: 'POST',
      data: {
        code: loginRes.code,
        device_name: Taro.getSystemInfoSync().model
      },
      showLoading: false
    }).then(res => {
      const { code, token, expire_at } = res;
      if (code === 200) {
        Taro.setStorageSync('token', token);
        Taro.setStorageSync('expireTime', expire_at);
        resolve({ token });
      } else {
        console.warn('@getONToken::', res);
        reject(res);
      }
    }).catch(err => {
      console.warn('@getONToken::', err);
      reject(err);
    });
  });
}

/**
 * 静默登录
 * @returns {Promise}
 */
export const doSilentLogin = async(resetFlag,callback) => {
  const {scene} = store.state.APPLaunchOption
  console.log('sense----场景值',scene)
  if(scene==1154)return
  await getOnToken(resetFlag).catch(err => console.warn('@doSilentLogin::', err));
  LoginTimes -= 1
  return new Promise((resolve, reject) => {
    ajax({ url: types.USER_OPENID_LOGIN, showLoading: false }).then(res => {
      const { code, data ,wxUserStatus} = res;
      if (code === RES_SUCCESS_CODE) {
        LoginTimes = 5
        Taro.setStorageSync('lw_loginStatus', wxUserStatus);
        typeof callback === 'function' && callback()
        resolve({data,wxUserStatus});
      } else {
        console.warn('@doSilentLogin::', res);
        reject(res);
      }
    }).catch(err => {
      console.warn('@doSilentLogin::', err);
      reject(err);
    });
  });
};
/**
 * 加载用户心中数据
 */
export const  getUCenterInfo =()=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.USER_CENTER,
      method: "POST",
      authorize: false,
      showLoading:false
    }).then(res => {
      const { code, data ,wxUserStatus} = res;
      if (code === RES_SUCCESS_CODE) {
        if (typeof data.info === 'object') {
          let userInfo = Object.assign({ ...data.info },{wxUserStatus});
          const {mobile} =userInfo
          let isUserMember=wxUserStatus && userInfo.isMember
          Taro.setStorageSync('userInfo', userInfo);
          Taro.setStorageSync('mobile', mobile);
          Taro.setStorageSync('isUserMember', isUserMember);
          const userInfo_ = Object.assign({ ...userInfo},{isUserMember});
          reslove(userInfo_);
        }
      } else if (code === RES_NO_AUTHORITY_CODE) {
        //
        reslove()
      } else {
        reject()
        errorHandler(res, false, '@getUCenterInfo::');
      }
    }).catch(err => {
      reject()
      errorHandler(err, false, '@getUCenterInfo::');
    })

  })
};
/**
 * 获取手机号
 * @param {String} code
 * @returns {Promise}
 */
export const getPhoneNumber = code => {
  if (!code) return Promise.reject({ code: 0, message: '缺少必要参数: Code.' });
  return new Promise((resolve, reject) => {
    ajax({
      host: $ON_API_HOST,
      url: types.GET_PHONE_NUMBER,
      method: 'POST',
      data: { code }
    }).then(res => {
      const { code, phoneNumber } = res;
      if (code === RES_SUCCESS_CODE) {
        resolve(phoneNumber);
      } else {
        console.warn('@getPhoneNumber::', res);
        reject(res);
      }
    }).catch(err => {
      console.warn('@getPhoneNumber::', err);
      reject(err);
    });
  });
}

/**
 * Form 校验规则
 */
export const VTypes = {
  required: /^.+$/,
  mobile: /^1[3456789]\d{9}$/,
  email: /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/i,
  name:/^.{2,18}$/,
  /**
   * 必须包含大小写字母和数字
   */
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,16}$/
}

/**
 * 表单校验
 * @param {Object} formValues
 * @param {Object} formRules
 * @returns
 * @example
 * validator(
 *   { name: '', age: 16, sex: 0, email: '', extra: '' },
 *   {
 *     name: [{ rule: 'required', message: '请输入' }],
 *     age: [{ rule: 'range', min: 18, max: 99, message: '年龄不在限定范围之内' }]
 *     sex: [{ rule: 'option', options: [1, 2], message: '性别不在限定范围之内' }]
 *     email: [{ rule: 'pattern', pattern: 'email', message: '邮箱地址不符合规则' }]
 *     extra: [{ rule: 'regexp', regexp: /^.+$/, message: '请输入' }]
 *   }
 * )
 */
export const validator = (formValues, formRules) => {
  if (!formValues || !formRules) return console.warn('@validator#参数格式错误::', formValues, formRules), null;
  const fieldNames = Object.keys(formValues);
  const ruleFields = Object.keys(formRules);
  // 返回结果数据结构
  let ret = { errorFields: {}, errorMsgs: [] };
  // 没有字段或没有规则
  if (!fieldNames.length || !ruleFields.length) return ret;
  // 循环校验字段
  while(fieldNames.length) {
    const fieldName = fieldNames.shift();
    const fieldValue = formValues[fieldName];
    const fieldRules = formRules[fieldName];
    if (fieldRules) {
      const validateRet = validateField(fieldValue, fieldRules);
      if (validateRet) {
        const { rules, errorMsgs } = validateRet;
        if (Array.isArray(rules)) {
          ret.errorFields[fieldName] = rules;
        } else {
          ret.errorFields[fieldName] = [rules];
        }
        if (Array.isArray(errorMsgs)) {
          ret.errorMsgs.push(...errorMsgs);
        } else {
          ret.errorMsgs.push(errorMsgs);
        }
      }
    }
  }
  return ret.errorMsgs.length ? ret : null;
}

/**
 * 校验类型
 */
const allowRuleNames = ['required', 'range', 'option', 'pattern', 'regexp', 'type'];

/**
 * 字段校验
 * @param {*} value
 * @param {Array|Object} ruleInfo
 * @returns {Object}
 */
export const validateField = (value, ruleInfo) => {
  if (isEmpty(ruleInfo)) return null;
  if (Array.isArray(ruleInfo) && ruleInfo.length) {
    let ret = { rules: [], errorMsgs: [] };
    //
    ruleInfo.forEach(rule => {
      const validateRet = validateField(value, rule);
      if (validateRet) {
        const { rules, errorMsgs } = validateRet;
        ret.rules.push(rules);
        ret.errorMsgs.push(errorMsgs);
      }
    });
    return ret.rules.length ? ret : null;
  } else {
    let ret = { rules: null, errorMsgs: '' };
    const { rule, min, max, options, pattern, regexp, message, type } = ruleInfo;
    if (allowRuleNames.includes(rule)) {
      switch(rule) {
        case "required":
          if (isEmpty(value) || (typeof value === 'string' && !value.trim())) {
            ret.rules = { ...ruleInfo };
            ret.errorMsgs = message || '该字段为非空项';
            return ret;
          }
          break;
        case "range":
          if (!isEmpty(value) && !isNaN(value) && (value < min || value > max)) {
            ret.rules = { ...ruleInfo };
            ret.errorMsgs = message || '该字段的值不在限定范围内';
            return ret;
          } else if (!isEmpty(value) && (value.length < min || value.length > max)) {
            ret.rules = { ...ruleInfo };
            ret.errorMsgs = message || '该字段的值的字符长度不在限定范围内';
            return ret;
          }
          break;
        case "option":
          if (!isEmpty(value) && Array.isArray(options) && !options.includes(value)) {
            ret.rules = { ...ruleInfo };
            ret.errorMsgs = message || '该字段的值不在可选范围内';
            return ret;
          }
          break;
        case "pattern":
          if (!isEmpty(value) && VTypes[pattern] && !VTypes[pattern].test(value)) {
            ret.rules = { ...ruleInfo };
            ret.errorMsgs = message || '该字段的值不能通过模式校验';
            return ret;
          }
          break;
        case "regexp":
          if (!isEmpty(value) && !regexp?.test(value)) {
            ret.rules = { ...ruleInfo };
            ret.errorMsgs = message || '该字段的值不能通过正则校验';
            return ret;
          }
          break;
        case "type":
          if (!isEmpty(value) && value.constructor !== type) {
            ret.rules = { ...ruleInfo };
            ret.errorMsgs = message || '该字段的值不能通过类型校验';
            return ret;
          }
          break;
      }
    }
    return null;
  }
}

/**
 * 缺少参数弹窗
 * @param {String} msg 提示内容
 * @param {String} returnPath 回退页面
 */
 export const missParams = (msg, returnPath) => {
  Taro.showModal({
    title: '信息提示',
    content: msg || '缺少必要参数',
    showCancel: false,
    success: () => {
      if (returnPath) {
        Taro.redirectTo({ url: returnPath });
      } else {
        Taro.navigateBack();
      }
    }
  });
}
/**
 * 是否为 Tabbar 页面
 */
 export const  isTabbarPage=(target) =>{
  // console.log(1110,Taro.getCurrentInstance().page.route)
  let link=target?target:Taro.getCurrentInstance().page.route
  return [
    '/pages/index/index',
    '/pages/category/index',
    '/pages/club/index',
    '/pages/cart/index',
    '/pages/ucenter/index',
  ].includes(link);
}
// 千分位
export const numFormat = (num,len = 0) => {
  if (isNaN(num)) return num;
  num = Number(num).toFixed(len);
  // return Number(num).toLocaleString("en-US")
  let res=num.toString().replace(/\d+/, function(n){ // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g,function($1){
      return $1+",";
    });
  })
  return res;
}

// 绑定分享关系
export const makeShare = ( args = '', page = '', title = 'On昂跑官方商城', imageUrl = '') => {
  return new Promise(async(resolve, reject) => {
    ajax({
      url: types.MAKE_SHARE,
      data:{
        args:args,
        url:page
      }
    }).then(res => {
      if (RES_SUCCESS_CODE === res.code) {
        let path = `/${page}`
        if(args) path += `?${args}`
        let query;
        if(res.data.sid) {
          query=`${args?'&':''}sid=${res.data.sid}`
          path += `${args?'&':'?'}sid=${res.data.sid}`
        }
        resolve({
          title: title,
          query,
          imageUrl: fixCMSPath(imageUrl) ,
          path: path
        })
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

//获取绑定结果
export const makeBind =async (sid) => {
  const {query} = store.state.APPLaunchOption
  console.log('@onLaunch::-----》page',query)
  return new Promise(async(resolve, reject) => {
    // let onToken = Taro.getStorageSync('token');
    // if (!onToken) {
    //   const ret = await getOnToken().catch(err => reject(err));
    //   onToken = ret.token;
    // }
    // if (onToken) {
      await store.state.loginPromise;
      let page = Taro.getCurrentPages()
      let url = page[page.length - 1].route
      ajax({
        url: types.MAKE_BIND,
        data:{ sid, url }
      }).then(res => {
        if (RES_SUCCESS_CODE === res.code) {
          resolve(res)
        }else{
          Taro.showToast({ title: res.message, icon: 'none', duration: 2000 });
        }
      }).catch(err => {
        Taro.showToast({ title: err.message, icon: 'none', duration: 2000 });
        console.log(err)
        reject(err)
      });
    // } else {
    //   console.warn('Token获取失败');
    //   reject(new Error('Token获取失败'));
    // }
  });
}

/**
 * 打开腾讯客服
 */
export const  openCustomerServiceChat = (corpId)=> {
  Taro.openCustomerServiceChat({
    extInfo: {
      url: `https://work.weixin.qq.com/kf/kfcc92b36a81a1c28e0`
    },
    corpId: corpId, //'ww774132dfa437e922',
    success: res => {
      console.log(res);
    }
  })
}
// 订阅消息
export const getDoSubscribe = (_list) =>{
  return new Promise((resolve, reject) => {
    Taro.getSetting({
      withSubscriptions: true,
      complete: (res) => {
        console.log('getSetting', res)
        if (res.subscriptionsSetting) {
          let _suboo = true
          if (res.subscriptionsSetting.itemSettings) {
            _suboo = false
            let _acceptList = []
            for (let k in res.subscriptionsSetting.itemSettings) {
              if(res.subscriptionsSetting.itemSettings[k] == 'accept' && _list.includes(k)){
                _acceptList.push(k)
              }
              if (_list.indexOf(k) < 0) {
                _suboo = true
              }else{
                resolve(_acceptList)
              }
            }
          }
          if (_suboo) {
            Taro.requestSubscribeMessage({
              tmplIds: _list,
              success: res => {
                if (res.errMsg.indexOf('ok') >= 0) {
                  console.log('res', res)
                  let _acceptList = []
                  _list.forEach(v => {
                    let _key = v
                    if (res[_key] && res[_key] == 'accept') {
                      _acceptList.push(v)
                    }
                  });
                  resolve(_acceptList)
                } else {
                  console.log("@requestSubscribeMessage=noOk", res)
                  Taro.showToast({
                    title: "网络异常，请重试",
                    icon: "none",
                  })
                  resolve()
                }
              },
              fail: (res) => {
                console.log("@requestSubscribeMessage=fail", res)
                Taro.showToast({
                    title: "网络异常，请重试",
                    icon: "none",
                })
                resolve()
              }
            })
          } else {
            resolve()
          }
        } else {
          resolve();
        }
      }
    })
  });
}

const isDef =(v)=>{
	return v !== undefined && v !== null
}

export const isPromise =(val)=>{
	return (
		isDef(val) &&
		typeof val.then === 'function' &&
		typeof val.catch === 'function'
	)
}

let gWorker = null;
/**
 * 创建 Worker
 * @param {String} filePath Worker 的文件路径
 * @param {Function} callback 接受消息的回调函数
 * @returns
 */
export const initWorker = (filePath, callback) => {
  if (!filePath || typeof filePath !== 'string') return console.warn('@initWorker::', filePath), null;
  gWorker?.terminate();
  gWorker = Taro.createWorker(filePath);
  gWorker?.onMessage(res => {
    if (types.WORKER_SIGNAL_STOP === res) {
      gWorker?.terminate();
    } else {
      typeof callback == 'function' && callback(res);
    }
  });
  return gWorker;
}

export const encrypt2 = (data, keyStr = '3edc#EDC4rfv$RFV', ivStr = '1qaz!QAZ2wsx@WSX') => {
  let key = CryptoJS.enc.Utf8.parse(keyStr), iv = CryptoJS.enc.Utf8.parse(ivStr), source = data, format = CryptoJS.format.OpenSSL;
  let encrypted = CryptoJS.AES.encrypt(source, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7
  });
  // 密文使用Hex编码
  return encrypted.toString(format);
}

/**
 * 加载用户心中数据
 */
export const getLoginText =()=>{
  return new Promise((reslove,reject)=>{
    ajax({
      url: types.SUPPORT_CONFIG,
      method: "POST",
      showLoading:false
    }).then(res => {
      const { code, data } = res;
      if (code === RES_SUCCESS_CODE) {
        store.state.loginText = data
      } else {
        reject()
        errorHandler(res, false, '@getUCenterInfo::');
      }
    }).catch(err => {
      reject()
      errorHandler(err, false, '@getUCenterInfo::');
    })
  })
};

export default {
  RES_SUCCESS_CODE, RES_NO_AUTHORITY_CODE,Vict,
  px2rpx, rpx2px, checkSetting, showCustomLoading, hideCustomLoading, showLoading, hideLoading, setStorageSync, getStorageSync, removeStorageSync, clearStorageSync, objectArraySort, guid,
  fn, addCallback, runCallback, debounce, throttle, dateFormat,isTabbarPage, deepClone, arrayTranslater, arrayToTree, filterTreeNode, findTreeNodePaths, fixSlash, fixCMSPath, fixCMSNumber, fixCMSPdtInfo, fixColorThumbnail, isImagePath,
  encodeObject2URIParams, decodeURIParams2Object, getQueryString, signHandler, getSignedParams, ajax, loadCMSConfig, fixComponentName,
  desensitizify, getUCenterInfo, isPromise, initWorker,
  errorHandler,errorHandlerFront, getOnToken, doSilentLogin, getPhoneNumber,
  VTypes, validateField, validator, missParams,numFormat,makeShare,makeBind,openCustomerServiceChat,getDoSubscribe,encrypt2,getLoginText
};

