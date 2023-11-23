export default defineAppConfig({
  pages: [
    "pages/index/index",
    "pages/club/index",
    "pages/category/index",
    "pages/ucenter/index",
    "pages/cart/index",
    "pages/web-view/index",
    "pages/test/index",
    "pages/landing/index",
  ],
  subpackages:[
  {
    root: "campaignPage",
    pages: [
      "pages/shopOrderCode/index",
    ]
  },
  {
    root:"subpages",
    pages:[
      "posCheckout/index",
      "posPay/index"
      
    ]
  },
],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "昂跑",
    navigationBarTextStyle: "black",
    backgroundColor:"#fff"
  },
  permission: {
    "scope.userLocation": {
      "desc": "你的位置信息将用于小程序位置接口的效果展示"
    }
  },
  requiredPrivateInfos:[
    "startLocationUpdateBackground",
    "chooseAddress",
    "getLocation",
    "startLocationUpdate",
    "onLocationChange"
  ],
  requiredBackgroundModes : ["location"],
  plugins:{
   
  },

  "lazyCodeLoading": "requiredComponents",
  tabBar:{
    color:"#555",
    selectedColor:"#FFC83A",
    backgroundColor:'#FFF',
    position:"bottom",
    // custom:true,
    list:[{
      pagePath:"pages/index/index",
      text:"主页",
      iconPath:"assets/images/icons/tabbar/home.png",
      selectedIconPath:"assets/images/icons/tabbar/home-active.png"
    },
    {
      pagePath:"pages/category/index",
      text:"分类",
      iconPath:"assets/images/icons/tabbar/category.png",
      selectedIconPath:"assets/images/icons/tabbar/category-active.png"
    },{
      pagePath:"pages/club/index",
      text:"社区",
      iconPath:"assets/images/icons/tabbar/club.png",
      selectedIconPath:"assets/images/icons/tabbar/club-active.png"
    },{
      pagePath:"pages/cart/index",
      text:"购物",
      iconPath:"assets/images/icons/tabbar/cart.png",
      selectedIconPath:"assets/images/icons/tabbar/cart-active.png"
    },{
      pagePath:"pages/ucenter/index",
      text:"我的",
      iconPath:"assets/images/icons/tabbar/ucenter.png",
      selectedIconPath:"assets/images/icons/tabbar/ucenter-active.png"
    }]
  },
  workers: 'workers'
});
