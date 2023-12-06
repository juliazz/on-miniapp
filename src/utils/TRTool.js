const pageTypeList = [{
    pageType: 'homepage',
    pagePath: '/pages/index/index'
}, {
    pageType: 'landingpage',
    pagePath: ['/pages/landing/index','/onRunClubPackage/pages/raceRegister/index', '/onRunClubPackage/pages/landing/index']
}, {
    pageType: 'pdp',
    pagePath: '/subpages/pdp/index',
}, {
    pageType: 'myaccount',
    pagePath: '/pages/ucenter/index',
}, {
    pageType: 'plp',
    pagePath: '/subpages/plp/index',
}, {
    pageType: 'search',
    pagePath: '/subpages/search/index',
},
{
    pageType: 'cart',
    pagePath: '/pages/cart/index',
}]
const defaultFn = {
    formatUrl(url) {
        const reg = /^\//
        return reg.test(url) ? url : '/' + url
    },
    /* 获取元素ID */
    getElemID(elem) {
        if(elem&&typeof elem !=="string") return null
        const id = elem.split('*').length&&elem.split('*')[1]
        const subId = id&&id.split('^').length&&id.split('^')[1]
        return {cmsId:id,subId}
    },

    
    /* 获取页面类型 */
    getPageType(pagePath) {
        const fullPath = defaultFn.formatUrl(pagePath);
        const pageType = pageTypeList.find(item => {
            return Array.isArray(item.pagePath) ? item.pagePath.includes(fullPath) :item.pagePath === fullPath
        });
        return pageType ? pageType.pageType : null;
    },
    /* 获取页面分类
        options:页面参数
     */
    getPageCategory(options, pageType) {
        let cat1, cat2, cat3
        if(!options) return {}
        let newOptions = options
        for(let key in newOptions){
            if(typeof options[key] === 'string'){
                options[key] = decodeURIComponent(options[key])
            }
        }
        switch (pageType) {
            case "homepage":
                cat1 = "homepage";
                break;
            case "landingpage":
                const  {key,frame}=options;
                cat1 = key||frame ? key||frame : null;
                break;
            case "pdp":
                const  {style_slug}=options;
                cat1 = style_slug;
                break;
            case "plp":
                const  {n1,n1Title,n2,n2Title,n3,n3Title}=options;
                n1&&(cat1 = `${n1}_${n1Title}`);
                n2&&(cat2 = `${n2}_${n2Title}`);
                n3&&(cat3 = `${n3}_${n3Title}`);
                break;
            case "search":
                cat1 = "search";
                break;
            case "cart":
                cat1 = "cart";
                break;
            default:
                break;
        }
        return {cat1, cat2, cat3};
    }
}

export default defaultFn
