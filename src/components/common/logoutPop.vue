<template>
    <view class="logout-tips" v-if="isShow">
        <view class="logout-mask"></view>
        <view class="logout-content">
            <view class="lg-close">
                <image mode="aspectFit" @tap.stop="onConfirm" src="@/assets/images/icons/lg-close.svg"/>
            </view>
            <text class="lg-title">提示</text>
            <text class="lg-desc">长时间未操作，请重新登录</text>
            <view class="lg-confirm" @tap.stop="onConfirm">确定</view>
        </view>
    </view>
</template>
  
<script>


import Taro from '@tarojs/taro'
// import { ajax, fixCMSPath, deepClone, fixCMSPdtInfo, numFormat, loadCMSConfig } from '@/utils'
// import types from '@/store/types';

export default {
    name: 'LogoutPop',
    components: {},
    props: {
        isShow: { type: Boolean, default: false },
    },
    methods: {
        onConfirm() {
            this.$store.commit("setLogoutPopVisile",false);
            const pages = getCurrentPages()
            const currentPage = pages[pages.length - 1]
            const url = currentPage.route
            console.log(":::::Taro.getLaunchOptionsSync().path::",url)
            if(!url.includes("pages/ucenter/index")){
                Taro.reLaunch({ url:"/pages/ucenter/index"})
            }
        }
    }
}

</script>
  
  <!-- style 标签不能添加 scoped 属性, 因此请注意样式名不要重复 -->
<style lang='scss'>
    .logout-mask{
        height: 100vh;
        width:100%;
        background-color: rgba($color: #000000, $alpha: .7);
        position: fixed;
        left:0;
        top:0;
        z-index:997;
    }
    .logout-content{
        height:442px; 
        width:622px;
        position: fixed;
        left:50%;
        top:50%;
        z-index: 998;
        transform: translate(-50%,-50%);
        background: #FFFFFF;
        box-shadow: 0px 0px 3px rgba(0, 0, 0, 0.05), 0px 12px 24px rgba(0, 0, 0, 0.1);
        border-radius: 24px;
        display: flex; flex-direction: column; align-items: center;
        .lg-close{
            position: absolute;
            right:32px; top:32px;
            image {
                height:48px;
                width:48px;   
            }
        }
        .lg-title{
            margin-top:80px;
            font-weight: 500;
            font-size: 40px;
            line-height: 120%;
            color:#000000;
        }
        .lg-desc{
            margin-top:32px;
            font-weight: 400;
            font-size: 28px;
            line-height: 150%;
            color:#333;
        }
        .lg-confirm{
            height:96px; width: 400px;border-radius: 80px;margin-top:64px;
            background: #000000;color:#ffffff; line-height:96px; text-align:center; font-size:32px;
        }
    }
</style>
  