import Taro from "@tarojs/taro";
import { device, Fn, Vict } from '@/utils';
import store from '@/store';
const ta = store.state.globalData.TA;

const formatTime = (t) => {
  let ts = new Date(t).getTime()
  const t1 = new Date(ts += 8 * 3600 * 1000)
  let s = t1.toISOString()
  let r = s.replace(/T/g, ' ').replace(/Z/g, '')
  return r
}

export const handlePageOnShow = (state) => {
  const allPages = Taro.getCurrentPages();
  /* 当前页面数据 */
  const currentPage = allPages[allPages.length-1];
  const currentPath =currentPage.route //当前页path
  const currentParams = currentPage.options; 
  const page_type =Fn.getPageType(currentPath) ||null
  /* 当前页面数据 */

  /* 启动页面数据 */
  const { path,query } = Taro.getEnterOptionsSync(); //启动页
  /* 启动页面数据 */

  console.log('allPages',11,allPages)
  const {cat1,cat2,cat3} = Fn.getPageCategory(currentParams,page_type)
  let referrer_path=null
  let superProperties = {
    current_page_path : currentPath||null, 
    page_type,
    page_cat1:cat1||null,
    page_cat2:cat2||null,
    page_cat3:cat3||null
  };
  //页面栈>1
  if (allPages.length > 1||state.prevPagePro){
      const referrer_page = state.prevPagePro ? state.prevPagePro :allPages[allPages.length-2] //兼容返回回来的上一页
      referrer_path = referrer_page.route
      const referrer_params = referrer_page.options
      const page_type =Fn.getPageType(referrer_path)
      const {cat1,cat2,cat3} = Fn.getPageCategory(referrer_params,page_type)
      superProperties = {
        ...superProperties,
        refer_page_type:page_type||null,
        referrer_path:referrer_path||null,
        refer_page_cat1:cat1||null,
        refer_page_cat2:cat2||null,
        refer_page_cat3:cat3||null
      };
      
    // 当前页非启动页
  } else if (currentPath !== path) {
    referrer_path = path
    const page_type =Fn.getPageType(referrer_path)
    const {cat1,cat2,cat3} = Fn.getPageCategory(query,page_type)
    superProperties = {
      ...superProperties,
      refer_page_type:page_type||null,
      referrer_path:referrer_path||null,
      refer_page_cat1:cat1||null,
      refer_page_cat2:cat2||null,
      refer_page_cat3:cat3||null
    };
  }
  state.prevPagePro = null 
  ta.setSuperProperties(superProperties);//设置公共事件属性
  ta.track({ eventName: 'page_view_start', })
}
/* 
elems 元素列表
lastScrollTop 最后一次滚动距离
cmsData cms数据
 */
export const handleHomeHide = (elems,lastScrollTop,cmsData) => {
  if(!elems || !elems.length){return  false}
  const {screenHeight,windowHeight} = device.systemInfo
  let  contentLists = []
  console.log('device.systemInfo',device.systemInfo)
  console.log(' windowHeight', windowHeight )
  console.log('lastScrollTop + windowHeight',(lastScrollTop + windowHeight ))
  // 筛选出离开可视区域的元素
  let viewElems = elems.filter((ele) => {
    return ele.bottom <= (lastScrollTop + windowHeight )
  }).map((ele) => {
    const {  id ,dataset:{cmsId} } = ele
    // const {cmsId,subId}= Fn.getElemID(id)
    const index = cmsData.findIndex((item) => {
      return item.id == cmsId
    })
    const cmsItem = (index>=0)&&cmsData[index]
    //拿到首层数据
    if(cmsItem){
      const { content:{name}} = cmsItem
      const conItem ={
          module_name:name,
          module_rank:index
      }
      contentLists.push(conItem)
    }
    // if(subId){
    // }
    // subId && (conItem.view_content.mkt_rank = subId)
    //拿到子层数据
    return 
  })
  console.log('viewElems---->',viewElems)
  const lastScreen = Math.ceil(lastScrollTop/ windowHeight)|| 1
  ta.track({ 
    eventName: 'leave_hp',
    properties:{
      view_content:contentLists,
      screen_num:lastScreen
    }
  })
  }

/* add_to_cart */  
export const handleAddCart = (item) => {
  if(!item){return  false}
  
  // const incart_id =
  const par = Object.assign({},item)
  ta.track({ 
    eventName: 'add_to_cart',
    properties:{
      ...par
    }
  })
}
/* add_to_cart */  
export const handleRemoFromCart = (item) => {
  if(!item){return  false}
  const {product_num} =item
  const par = Object.assign({
    product_num:product_num||1
  },item)
  ta.track({ 
    eventName: 'remove_from_cart',
    properties:{
      ...par
    }
  })
}
/* commonMethod
  pars:参数
  eventName:事件名
 */  
export const handleCommon = ({pars,eventName}) => {
  if(!pars){return  false}
  const par = Object.assign({},pars)
  ta.track({ 
    eventName,
    properties:{
      ...par
    }
  })
}

const track_first_login_time = (t) => {
  ta.userSetOnce({ properties: {'first_login_time': t,} })
}

const track_last_login_time = (t) => {
  ta.userSet({ properties: {'last_login_time': t,} })
}

export const track_loginTime = () => {
  const now = new Date()
  const t = formatTime(now)
  const u = Taro.getStorageSync('userInfo')
  const isMember = u.isMember
  if (isMember) {
    track_last_login_time(t);
  } else {
    track_first_login_time(t);
  }
}

// 门店列表 (筛选、搜索门店)
export const track_filter_store = (filteredRegion, storeList) => {
  ta.track({
    eventName: 'filter_store', 
    properties: {
      city_select: filteredRegion,
      if_store_exists: (storeList.length > 0),
      stores_cnt: storeList.length,
    }
  })
}
export const track_search_store = (keyword, storeList) => {
  const data = {
    search_term: keyword,
    stores_cnt: storeList.length,
    search_stores: []
  }
  storeList.forEach((store) => {
    data.search_stores.push(store.store_name)
  })
  ta.track({ eventName: 'search_store', properties: data })
}
