var mtjwxsdk=function(e){"use strict";var t,n,r="1.10.20",a="https://hmma.baidu.com/mini.gif",o={app:["onShow","onHide","onError"],page:["onShow","onHide","onPageScroll"],share:["onShareAppMessage"],behavior:["tap"]},i="mtj_uuid",c="mtj_user",u="mtj_user_property",s="mtj_track_status",f="mtj_remote_config",l="mtj_ab_experiment_list",p="mtj_ab_active_experiment_ids",h={},d={type:1},g={aso:{}},y={},m=function(e){if(!1!==h.trackStatus){var n=e.data.et?{mtj_ii:e.data.uuid||"",mtj_et:e.data.et,mtj_en:e.data.en}:{};return t.request({url:e.url,data:e.data,header:Object.assign({"content-type":"application/json"},n,e.header),method:e.method||"POST",dataType:e.dataType||"json",success:function(t){e.success&&e.success(t)},fail:function(t){e.fail&&e.fail(t)}})}},v=function(){return"undefined"!=typeof crypto&&crypto.getRandomValues?crypto.getRandomValues(new Uint32Array(1))[0]:Math.floor(4294967295*Math.random())},b=function(e,t){return"[object "+t+"]"==={}.toString.call(e)},j=function(e,t,n){var r=(e=e.replace(new RegExp(t+"=[^&]*","g"),"").replace(/(\?|&)&/g,"$1").replace(/(\?|&)$/g,"")).indexOf("?")>0?"&":"?";return e+r+t+"="+encodeURIComponent(n)},S=function e(t){return b(t,"Object")||b(t,"Array")?(Object.keys(t).forEach((function(n){var r=t[n];b(r,"Object")||b(r,"Array")?t[n]=e(r):t[n]=""+r})),t):t},O=function(e){return b(e,"String")&&/^[a-z][a-z0-9_]{0,31}$/.test(e)},k=function(e){return b(e,"String")&&/^[a-z0-9_]{1,32}$/.test(e)},_=function(e){return b(e,"String")||b(e,"Number")},w=function(e){return b(e,"String")&&/^\d{11}$/.test(e)},I=function(e){return b(e,"String")&&28===e.length},T=0,x=function(e){return new Promise((function(t,n){return e.data=e.data||{},h.blacklist&&(h.blacklist.indexOf("all")>-1&&e.data.et||h.blacklist.indexOf("behavior")>-1&&"behavior"===e.data.et)?t():(e.data.v=r,e.data.rqc=++T,a=e.data,JSON.stringify(a).length<=204800?(e.success=function(e){return t(e)},e.fail=function(e){return n(e)},void m(e)):(T--,n(new Error("invalid data"))));var a}))},P=function(e,t){var n=b(t,"Object")?JSON.stringify(t):""+t;x({url:a,dataType:"string",data:Object.assign({},d,{et:"error",en:e,ep:{ex:n},rid:v()})})},A=function(e){e.rid=v(),e.aso=e.aso||{};var t={url:a,dataType:"string",data:Object.assign({},d,e)};x(t),(y.circleToken||y.circleByThreeFingers)&&("page"===e.et&&"show"===e.en||"behavior"===e.et&&"tap"===e.en)&&(t.url="https://hmma.baidu.com/mini.gif?circle=1",t.data.token=y.circleToken,x(t).catch((function(e){return console.error(e)})))};function E(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=e&&("undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"]);if(null==n)return;var r,a,o=[],i=!0,c=!1;try{for(n=n.call(e);!(i=(r=n.next()).done)&&(o.push(r.value),!t||o.length!==t);i=!0);}catch(e){c=!0,a=e}finally{try{i||null==n.return||n.return()}finally{if(c)throw a}}return o}(e,t)||function(e,t){if(!e)return;if("string"==typeof e)return N(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);"Object"===n&&e.constructor&&(n=e.constructor.name);if("Map"===n||"Set"===n)return Array.from(e);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return N(e,t)}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function N(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var U=function(e){try{return t.getStorageSync(e)}catch(e){P("getStorageSync",e)}},q=function(e,n){try{t.setStorageSync(e,n)}catch(e){P("setStorageSync",e)}},B=function(e){try{t.removeStorageSync(e)}catch(e){P("removeStorageSync",e)}},C=function(){return Promise.resolve().then((function(){var e=U(i);return b(e,"String")&&32===e.length||(e=([1e7]+1e3+4e3+8e3+1e11).replace(/[018]/g,(function(e){return(e^("undefined"!=typeof crypto&&crypto.getRandomValues?crypto.getRandomValues(new Uint8Array(1))[0]:Math.floor(255*Math.random()))&15>>e/4).toString(16)})),q(i,e),h.hasABTest&&(B(l),B(p))),e}))},D=function(e){return new Promise((function(n){if(!e)return n();t.getShareInfo({shareTicket:e,success:function(e){delete e.errMsg,n(e)},fail:function(){n({})}})}))},M=function(){return n||(d.sid=v(),d.rqc=0,n=Promise.all([C(),new Promise((function(e){t.getSystemInfo({success:function(t){delete t.errMsg,e(t)},fail:function(){e({})}})})),new Promise((function(e){t.getNetworkType({success:function(t){delete t.errMsg,e(t)},fail:function(){e({})}})})),Promise.resolve().then((function(){var e=U(c),n=b(e,"Object")?e:{};return new Promise((function(e){t.getSetting({success:function(r){r.authSetting&&r.authSetting["scope.userInfo"]?t.getUserInfo({success:function(t){delete t.userInfo.errMsg,e(Object.assign(n,t.userInfo))},fail:function(){e(n)}}):e(n)},fail:function(){e(n)}})}))})),new Promise((function(e){if(!h.getLocation)return e({});t.getLocation({type:"wgs84",success:function(t){delete t.errMsg,e(t)},fail:function(){e({})}})})),Promise.resolve().then((function(){var e=U(u);return b(e,"Object")?e:{}}))]).then((function(e){var t=E(e,6),n=t[0],a=t[1],o=t[2],i=t[3],c=t[4],u=t[5];d.uuid=n,g.system=S(a),g.network=S(o),Object.keys(i).length>0&&(g.user=S(i)),Object.keys(c).length>0&&(g.location=S(c)),Object.keys(u).length>0&&(g.userProperty=JSON.stringify(u)),"devtools"===g.system.platform&&h.latestVersion&&function(e,t){for(var n=e.split("."),r=t.split("."),a=0;a<3;a++){var o=+n[a]||0,i=+r[a]||0;if(o>i)return 1;if(i>o)return-1}return 0}(r,h.latestVersion)<0&&console.warn("百度移动统计微信小程序SDK已更新，为不影响您的正常使用，请到SDK下载中心 https://mtj.baidu.com/web/sdk/index 下载最新版本")})))},F={onShow:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=(g.aso.query||[]).filter((function(e){return 0===e.key.indexOf("mtj_")}));return g.aso.scene=""+(e.scene||""),e.referrerInfo&&e.referrerInfo.appId?g.aso.referrerInfo=e.referrerInfo:delete g.aso.referrerInfo,g.aso.path=e.path||"",g.aso.query=Object.keys(e.query||{}).map((function(t){return{key:t,value:e.query[t]}})),t.length>0&&!/(^|,)mtj_/.test(Object.keys(e.query||{}).join(","))&&(g.aso.query=g.aso.query.concat(t)),(e.query||{}).mtj_ctoken&&!h.disableCircling&&(y.circleToken=e.query.mtj_ctoken),M().then((function(){return D(e.shareTicket)})).then((function(e){e?g.aso.shareInfo=e:delete g.aso.shareInfo,A(Object.assign({et:"app",en:"show"},g))})).catch((function(e){P("app.onShow",e)}))},onHide:function(){A({et:"app",en:"hide"})},onError:function(e){var t=b(e,"Object")?JSON.stringify(S(e)):""+e;A({et:"app",en:"error",ep:{ex:t}})}},J=-1,V=-1,R=0,L={onShow:function(){var e=getCurrentPages(),t=e[e.length-1];return d.path=t.route,d.query=Object.keys(t.options).map((function(e){return{key:e,value:t.options[e]}})).filter((function(e){return"mtj_qrid"!==e.key&&"mtj_lkid"!==e.key&&"mtj_shuuid"!==e.key})),d.path===y.lastPagePath&&JSON.stringify(d.query)===y.lastPageQuery||(y.lastPagePath=d.path,y.lastPageQuery=JSON.stringify(d.query),y.pageScrollTop=0),M().then((function(){A(Object.assign({et:"page",en:"show"},g))})).catch((function(e){P("page.onShow",e)}))},onHide:function(){var e,n,r,a,o,i=S({scrollTop:y.pageScrollTop,height:null===(e=g.system)||void 0===e||null===(n=e.safeArea)||void 0===n?void 0:n.height,width:null===(r=g.system)||void 0===r||null===(a=r.safeArea)||void 0===a?void 0:a.width}),c=Object.keys(i).map((function(e){return{key:e,value:i[e]}}));if(A({et:"page",en:"hide",ep:{data:c}}),h.getComponentScroll)try{o=JSON.parse(JSON.stringify(d)),t.createSelectorQuery().selectAll(".mtj-scroll").fields({id:!0,size:!0,scrollOffset:!0}).exec((function(e){Object.keys(e[0]).length>0&&A(Object.assign({et:"page",en:"scroll",ep:S(e[0])},o))}))}catch(e){P("page.trackComponentScrollEvent",e)}},onPageScroll:function(e){(!y.pageScrollTop||e.scrollTop>y.pageScrollTop)&&(y.pageScrollTop=e.scrollTop)},onShareAppMessage:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n={from:e.from,path:t.path};if(!n.path){var r=d.query.map((function(e){return e.key+"="+e.value})).join("&");n.path=d.path+(r?"?"+r:"")}t.title&&(n.title=""+t.title),e.target&&(n.target=JSON.stringify(e.target)),A(Object.assign({et:"share",en:"action",ep:n},g));var a=g.aso.query.filter((function(e){return"mtj_shuuid"===e.key})),o=a[0]?a[0].value.split("_"):[];d.uuid!==o[o.length-1]&&o.push(d.uuid);var i=o.slice(Math.max(0,o.length-3)).join("_");return t.path=j(n.path,"mtj_shuuid",i),t},onAction:function(e,t){if(e&&e.type&&e.currentTarget){var n="#"+(e.currentTarget.id||t);if("tap"!==e.type){if("touchmove"===e.type&&-1===J&&e.touches instanceof Array&&3===e.touches.length){if(R+=1,clearTimeout(V),3===R)return y.circleByThreeFingers=!0,y.circleToken=void 0,void A(Object.assign({et:"page",en:"show"},g));J=setTimeout((function(){J=-1,V=setTimeout((function(){R=0}),500)}),1e3)}}else{var r=[{key:"xpath",value:n}];A(Object.assign({et:"behavior",en:"tap",ep:{data:r}},g))}}}},$={trackEvent:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if(!O(e))return Promise.reject(new Error("事件名称不合法"));var n=Object.keys(t).filter((function(e){return k(e)&&_(t[e])})).map((function(e){return{key:""+e,value:""+t[e],type:b(t[e],"String")?"string":"number"}}));return M().then((function(){A(Object.assign({et:"event",en:""+e,ep:{data:n}},g))})).catch((function(e){P("trackEvent",e)}))},setTrackStatus:function(e){b(e,"Boolean")&&(h.trackStatus=e,q(s,e))},setUserInfo:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.tel,n=e.openId;return M().then((function(){var e=U(c),r=b(e,"Object")?e:{};w(t)&&(r.tel=g.user.tel=t.substr(t.length-11)),I(n)&&(r.openId=g.user.openId=n),(r.tel||r.openId)&&q(c,r),b(t,"Undefined")||w(t)||console.error("手机号 ".concat(t," 不合法")),b(n,"Undefined")||I(n)||console.error("openid ".concat(n," 不合法"))})).catch((function(e){P("setUserInfo",e)}))},setUserId:function(e){return Promise.resolve().then((function(){if(!(b(e,"String")||b(e,"Number")&&Number.isFinite(e)))return Promise.reject(new Error("userId只能是字符串或数字"));var t=""+e,n=U(u),r=b(n,"Object")?n:{};if(!r.uid_||r.uid_[0]!==t){r.uid_=[t,"1"],q(u,r),g.userProperty=JSON.stringify(r);var a=[{key:"uid",value:t}];return M().then((function(){A(Object.assign({et:"api",en:"setUserId",ep:{data:a}},g))})).catch((function(e){P("setUserId",e)}))}}))},setUserProperty:function(e){return Promise.resolve().then((function(){var t=U(u),n=b(t,"Object")?t:{};if(b(e,"Null"))Object.keys(n).forEach((function(e){"_"!==e.charAt(0)&&"_"!==e.charAt(e.length-1)&&delete n[e]}));else if(!b(e,"Object"))return Promise.reject(new Error("userProperty必须是对象"));var r=Object.keys(n).filter((function(e){return"_"!==e.charAt(0)&&"_"!==e.charAt(e.length-1)})).length;Object.keys(e||{}).forEach((function(t){var a=e[t];""===t||"_"===t.charAt(0)||"_"===t.charAt(t.length-1)&&"ab_"!==t&&"ab_filter_"!==t||(b(a,"Null")?n[t]&&(delete n[t],r--):!(b(a,"String")||b(a,"Number")&&Number.isFinite(a))||t.length>256||(""+a).length>256||!n[t]&&r>=100||(n[t]||r++,n[t]=[a,"1"]))})),q(u,n),g.userProperty=JSON.stringify(n)}))}},K={data:[],init:function(){var e=this,t=d.uuid;t?this.startFetch(t):C().then((function(t){d.uuid=t,e.startFetch(t)}))},startFetch:function(e){console.log("---您的设备ID---",e),this.fetchTest()},getExpDataByParamName:function(e){var t=U(l);if(this.setLocalData(t),!t||!b(t,"Array"))return{};var n=t.find((function(t){return t&&b(t.params,"Object")&&!b(t.params[e],"Undefined")}));return n&&n.params?{expValue:n.params[e],expId:n.e}:{}},fetchTest:function(e,t,n){var r=this,a=d.uuid,o=d.key;m({url:"https://hm.baidu.com/v1/diversion/",data:{cid:a,tid:o},method:"GET",success:function(a){b(a,"Object")&&200===a.statusCode&&b(a.data,"Object")&&0===a.data.status?r.handleFetchResponse(a.data,e,t,n):n&&n(t)},fail:function(){console.error("请求分流实验失败"),n&&n(t)}})},handleFetchResponse:function(e,t,n,r){var a=[];if(b(e,"Object")&&b(e.data,"Object")&&b(e.data.expr,"Array")&&(a=e.data.expr),this.updateStorage(a),this.setLocalData(a),r){var o=this.getExpDataByParamName(t),i=o.expValue,c=o.expId;b(i,"Null")||b(i,"Undefined")?r(n):this.handleInTest(i,c,r)}},handleInTest:function(e,t,n){n(e),this.updateUserProperty(t)},updateStorage:function(e){q(l,e)},setLocalData:function(e){this.data=e||[]},updateUserProperty:function(e){var t=this,n=this.getActiveExpIds(e)||[],r={ab_:null,ab_filter_:null},a={},o=[];if(n.forEach((function(e){var n=t.getExpDataFromId(e);b(n,"Object")&&(a[n.e]=n.g,o.push(n.h||0))})),o.length){var i=0;o.forEach((function(e){i=function(e,t){var n="00000000000000000000000000000000";function r(e){var t=(n+n+Number(e).toString(2)).slice(-64);return[parseInt(t.slice(0,32),2),parseInt(t.slice(-32),2)]}function a(e){return(n+e.toString(2)).slice(-32)}var o=r(e),i=r(t);return parseInt(a((o[0]|i[0])>>>0)+a((o[1]|i[1])>>>0),2)}(i,e)})),r={ab_:JSON.stringify(a),ab_filter_:i}}$.setUserProperty(r)},getExpDataFromId:function(e){return U(l).find((function(t){return String(t.e)===String(e)}))},setActiveExperimentIds:function(e){q(p,e)},getActiveExpIds:function(e){var t=this,n=U(p)||[];return b(e,"Undefined")||-1!==n.indexOf(e)||n.push(e),n=(n=n.filter((function(e){return!!t.getExpDataFromId(e)}))).filter((function(e,t){return n.indexOf(e)===t})),this.setActiveExperimentIds(n),n}},z=function(e){if(h.hasABTest)if(b(e,"Object")){var t=e.paramName;if(null!=t){var n=e.defaultValue;if(b(n,"Undefined"))console.error("请设置参数默认值");else{var r=e.callback;if(b(r,"Function")){var a=K.getExpDataByParamName(t),o=a.expValue,i=a.expId;b(o,"Null")||b(o,"Undefined")?K.fetchTest(t,n,r):K.handleInTest(o,i,r)}else console.error("callback必须为函数")}}else console.error("请设置实验参数名称")}else console.error("传递参数请设置为对象")},H=function(e,t,n){var r=t[e];t[e]=function(t){if(n.call(this,t,e),r)return r.apply(this,arguments)}},Q=App,G=function(e){o.app.forEach((function(t){H(t,e,F[t])})),e.mtj=$,e.mtj.pageEvent=L,e.mtj.fetchABTest=z,Q(e)},W=Page,X=function(e){o.page.forEach((function(t){H(t,e,L[t])})),o.share.forEach((function(t){!function(e,t,n){var r=t[e];t[e]=function(e){var t=r&&r.apply(this,arguments);return n.call(this,e,t)}}(t,e,L[t])})),Object.keys(e).forEach((function(t){"function"==typeof e[t]&&-1===o.page.indexOf(t)&&-1===o.share.indexOf(t)&&H(t,e,L.onAction)})),W(e)},Y=Behavior,Z=function(e){return o.page.forEach((function(t){H(t,e.methods,L[t])})),Y(e)};Z.prototype.constructor=Behavior;var ee=Component,te=function(e){return o.page.forEach((function(t){H(t,e.methods,L[t])})),ee(e)},ne=function(){var e,n;e=wx,t=e;try{n=require("./mtj-wx-sdk.config")}catch(e){return void console.error("请把mtj-wx-sdk.config.js文件拷贝到utils目录中")}n&&n.appKey?(d.key=n.appKey,h.getLocation=n.getLocation||!1,h.getComponentScroll=n.getComponentScroll||!1,h.disableCircling=n.disableCircling||!1,h.trackStatus=!(!1===U(s)),h.hasABTest=n.hasABTest||!1,h.hasABTest&&K.init(),function(){var e=U(f);if(e){Object.keys(e).forEach((function(t){h[t]=e[t]}));var t=e.updateTimestamp||0;if(+new Date-t<864e5)return Promise.resolve()}x({url:"https://hmma.baidu.com/mini.conf",method:"POST",header:{"content-type":"application/x-www-form-urlencoded"},data:{type:"wx",key:d.key}}).then((function(e){if(e&&e.data){var t=e.data;Object.keys(t).forEach((function(e){h[e]=t[e]})),t.updateTimestamp=+new Date,q(f,t)}else P("remoteConfig",e)})).catch((function(e){P("sendRequest",e)}))}(),n.hasPlugin||(App=G,Page=X),module.exports={App:G,Page:X,Behavior:Z,Component:te}):console.error("请设置mtj-wx-sdk.config.js文件中的appKey字段")};return ne(),e.init=ne,Object.defineProperty(e,"__esModule",{value:!0}),e}({});
