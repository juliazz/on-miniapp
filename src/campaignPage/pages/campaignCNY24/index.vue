<template>
  <Pager
    :header="headerOptions"
    :loader="true"
    :page-style="pageOptions"
  >
    <view
      class="cny-page-container"
      :class="{
        fix: avator.visible || loginGuideOptions.visible || rulePupOptions.show || recodPupOptions.show || pupOptions.show
      }"
    >
      <view class="cny-page-content">
        <view class="cny-container">
          <view class="cny-content-top">
            <view class="cny-content-top-left">
              <view class="text-1">
                <image :src="cnyImg.cny_text_01" />
              </view>
              <view class="text-2">
                <image
                  :src="cnyImg.cny_text_02"
                  mode="widthFix"
                />
              </view>
            </view>
            <view class="cny-content-top-right">
              <view class="cny-content-top-right-1">
                <view class="cny-user-photo">
                  <image
                    v-if="!!avator.formData.pic"
                    :src="avator.formData.pic"
                    mode="widthFix"
                  />
                  <text
                    v-else
                    class="iconfont icon-cny_avator"
                  />
                </view>
                <view class="lottery-chance"> 
                  <view class="lottery-chance-num">
                    {{ isMember ? qualifyNum : '?' }}
                  </view>
                  <view class="lottery-chance-text">
                    抽奖机会
                  </view>
                </view>
              </view>
              <view
                class="cny-content-top-right-2"
                @tap="getCnyRecordList"
              >
                <text>查看抽奖记录</text>
                <text class="iconfont icon-cny_arrow" />
              </view>
              <view
                class="cny-content-top-right-3"
                @tap="subscribe"
              >
                <text>设置订阅提醒</text>
                <text class="iconfont icon-cny_call_on" />
              </view>
            </view>
          </view>
          <view class="cny-content-f-signature">
            <view class="cny-electronic-screen-wrapper">
              <view class="cny-electronic-screen-content">
                “费”来好运，快来赢取费德勒亲笔签名照
              </view>
              <view
                class="cny-electronic-screen-content"
                style="color: #D2D2D2;"
              >
                “费”来好运，快来赢取费德勒亲笔签名照
              </view>
              <view class="cny-electronic-screen-content">
                “费”来好运，快来赢取费德勒亲笔签名照
              </view>
              <view
                class="cny-electronic-screen-content"
                style="color: #D2D2D2;"
              >
                “费”来好运，快来赢取费德勒亲笔签名照
              </view>
            </view>
          </view>
          <view class="cny-slot-machine">
            <slotMachine
              :start="startDraw"
              :time-length="12"
              :slot-length="30"
              :win-or-not="true"
              :slot-items="slotItems"
              @endDraw="endDraw"
            />
          </view>
          <view
            class="cny-lottery-btn-container"
          >
            <view
              v-if="activityStatus === 0"
              class="cny-btn"
              @tap="gotoBuy"
            >
              <text>购买商品获得好运机会</text> 
              <text class="iconfont icon-btn_log cny-btn-log-icon" />
            </view>
            <view
              v-if="activityStatus === 1"
              class="cny-btn"
            >
              距离抽奖开始还有{{ countDownTime }}
              <text class="iconfont icon-btn_log cny-btn-log-icon" />
            </view>
            <view
              v-if="activityStatus === 2 && !startDraw"
              class="cny-btn"
              @tap="drawLottery"
            >
              <text>开始抽奖</text>
              <text class="iconfont icon-btn_log cny-btn-log-icon" />
            </view>
            <view
              v-if="activityStatus === 2 && startDraw"
              class="cny-btn btn-grey"
            >
              <text>开始抽奖</text>
              <text class="iconfont icon-btn_log cny-btn-log-icon" />
            </view>
            <view
              v-if="activityStatus === 3"
              id="look-winners"
              class="cny-btn"
              @tap="lookWinners"
            >
              <text> 查看中奖名单</text>
              <text class="iconfont icon-btn_log cny-btn-log-icon" />
            </view>
          </view>
          <view class="cny-content-time-line">
            <view class="cny-content-time-line-left">
              <view class="cny-content-bottom-left-text">
                <text>1.1 – 1.10</text><text>获得抽奖机会</text> 
              </view>
              <view class="cny-content-bottom-left-text">
                <text>1.18 10:00–22:00</text><text>开启抽奖活动</text>
              </view>
              <view class="cny-content-bottom-left-text">
                <text>1.19 10:00</text><text>公布获奖名单</text>
              </view>
              <view
                class="cny-content-bottom-left-text-last"
                @tap="rulePupOptions.show=true"
              >
                <text>查看活动细则</text>
                <text class="iconfont icon-cny_bookmark" />
              </view>
            </view>
            <view class="cny-content-time-line-right">
              <view class="cny-content-bottom-right-text">
                费德勒亲笔签名卡片
              </view>
              <image
                :src="cnyImg.cny_prize"
              />
            </view>
          </view>
          <view
            v-if="activityStatus === 3"
            class="cny-winners-list-container"
          >
            <view class="cny-winners-list-title">
              <view class="cny-winners-list-title-left" />
              <view class="cny-winners-list-title-right">
                <image
                  :src="cnyImg.cny_lucky"
                  mode="widthFix"
                />
              </view>
            </view>
            <view class="cny-winners-list-content">
              <view class="cny-winners-list-content-left" />
              <view class="cny-winners-list-content-right">
                <view class="cny-winners-list">
                  <view class="cny-winners-title">
                    中奖名单
                  </view>
                  <view class="cny-winners-items">
                    <view
                      v-for="(item,index) in cnyPrizeList"
                      :key="index"
                      class="cny-winners-item"
                    >
                      {{ item.mobile }}
                    </view>
                  </view>
                </view>
              </view>
            </view>
          </view>
          <view
            v-if="activityStatus < 1"
            class="cny-content--time-line-bottom"
          >
            <view class="cny-content-bottom-bottom-left">
              <text>下滑</text>
              <text style="margin-top: 20rpx;">
                获得好运机会
              </text>
            </view>
            <view class="cny-content-bottom-bottom-right iconfont icon-cny_arrow_big" />
          </view>
          <view
            v-else
            class="cny-content--time-line-bottom"
          >
            <view class="cny-content-bottom-bottom-left more">
              <text>查看</text>
              <text style="margin-top: 20rpx;">
                更多商品
              </text>
            </view>
            <view class="cny-content-bottom-bottom-right gold iconfont icon-cny_arrow_big" />
          </view>
        </view>
        <view>
          <view
            id="cny-cms-content"
            class="cny-cms-content"
          >
            <view class="parting-line-container">
              <view class="line-1" />
              <view class="line-2" />
            </view>
            <loadCms page-key="luckydraw_roger" />
          </view>
          <view class="cny-content-bottom">
            <view class="cny-content-bottom-top">
              <view
                class="come-back"
                @tap="toTop"
              >
                <text>返回顶部</text>
                <text class="iconfont icon-cny_arrow come-back-icon" />
              </view>
            </view>
            <view class="cny-content-bottom-bottom">
              <image
                :src="cnyImg.cny_bottom"
                mode="widthFix"
              />
            </view>
          </view>
        </view>
      </view>
      <view>
        <!-- 弹窗 - 登录方式引导 -->
        <LoginGuideVue
          :options="loginGuideOptions"
          @hide="onHideGuideClose"
          @success="onLoginSuccess"
          @confirm="onGuestConfirm"
        />
        <!-- 授权头像昵称 -->
        <GetNameAvator
          :options="avator"
          @close="closeAvatorPup"
        />
        <view>
          <ActivityPup 
            :show="pupOptions.show"
            :bg-color="'rgba(0,0,0,0)'"
            :custom-style="{width: '100%'}"
            @close="closePup"
          >
            <Poster
              :win-or-not="winOrNot"
              :img-url="winOrNot ? activityInfo.win_prize_image : activityInfo.not_win_prize_image"
              :mobile="`${mobile}`"
              @close="closePup"
            />
          </ActivityPup>
        </view>
        <view class="record-list">
          <ActivityPup 
            :show="recodPupOptions.show"
            :bg-color="'white'"
            :is-bottom="true"
            @close="closePup"
          >
            <view>
              <view class="cny-pup-header">
                <image
                  class="cny-pup-header-icon"
                  mode="widthFix"
                  src="@/assets/images/icons/logo-with-bg.svg"
                />
                <text> 抽奖记录</text>
              </view>
              <view class="cny-record-user-info">
                用户手机号码：{{ cnyRecordList && cnyRecordList.user_info && cnyRecordList.user_info.mobile && desensitizify(cnyRecordList.user_info.mobile) }}
              </view>
              <view
                class="cny-record-item-list"
                style="width: 100%;min-height: 300rpx;overflow: hidden;"
              >
                <!-- <view class="record-item">
                <text>2024.1.23 13:34:34</text>
                <text style="margin-left: 40rpx;">抽奖结果：未中奖</text>
              </view> -->
                <view
                  v-for="(item, index) in cnyRecordList.record_list"
                  :key="index"
                  class="record-item"
                >
                  <text>{{ item.created_at }}</text>
                  <text style="margin-left: 40rpx;">
                    抽奖结果：{{ item.status_desc }}
                  </text>
                </view>
              </view>
            </view>
          </ActivityPup>
        </view>
        <view class="rule-pup">
          <ActivityPup 
            :show="rulePupOptions.show"
            :bg-color="'white'"
            :is-bottom="true"
            :custom-style="{bottom:'-100%'}"
            @close="closePup"
          >
            <view>
              <view class="cny-pup-header">
                <image
                  class="cny-pup-header-icon"
                  mode="widthFix"
                  src="@/assets/images/icons/logo-with-bg.svg"
                />
                <text> 活动细则</text>
              </view>
              <view
                style="width: 100%;height: 60vh;"
                class="rule-content"
              >
                <image
                  :src="ruleImg"
                  mode="widthFix"
                />
              </view>
            </view>
          </ActivityPup>
        </view>
      </view>
    </view>
  </Pager>
</template>
<script>
import Taro from "@tarojs/taro";
import Pager from "@/components/common/Pager.vue";
import LoginGuideVue from "../../../components/common/LoginGuide.vue";
import GetNameAvator from '../../../components/common/GetNameAvator'
import slotMachine from '../../components/slotMachine.vue'
import loadCms from '../../components/loadCms.vue'
import ActivityPup from '../../components/cnyPup.vue'
import Poster from '../../components/poster.vue'

import {
  showCustomLoading,
  hideCustomLoading,
  fixCMSPath,
  getUCenterInfo,
  desensitizify
} from "@/utils";
import {
  getCnyInfo,
  cnyRecordSubcribe,
  cnyIsSubcribe,
  cnyDraw, getCnyQualify,
  getCnyRecordList,
  getCnyPrizeList,
  shuffleAndFixIndexToPosition
} from "../../utils";
export default {
  name: "Club",
  components: {
    Pager, slotMachine,
    LoginGuideVue, GetNameAvator,
    loadCms, ActivityPup,
    Poster,
},
  data() {
    return {
      pageOptions: {
        backgroundColor: "#B22526",
      },
      avator:{
        visible: false,
        position: "bottom",
        theme: "white", // 主题  black | white
        needWxAuth: true, //是否使用微信授权
        afterHandler: "",
        afterHandlerData: {},
        from:'Ucenter', //个人中心 Ucenter
        formLabel:{
          name:'姓名',
          pic:'头像'
        },
        formData: {
          name:'',
          pic: '',
        },
      },
      /**
       * LoginGuide 配置选项
       */
      loginGuideOptions: {
        visible: false,
        hideAsGuest: false,
        enableGuest: false,
        btnText4Guest: "使用游客身份浏览",
        afterHandler: "",
        afterHandlerData: {},
      },
      templateIds:['_f3R5iifkIaOpkzWB4Y5 SVcYX7bHwU3DyxxPKoi76wQ'],
      startDraw: false,
      winOrNot: true,
      slotLength: 30,
      rawSlotItems:[],
      slotItems:[['http://oss.on-running.cn/crm/roger-lucky-draw/01.png'], ['http://oss.on-running.cn/crm/roger-lucky-draw/01.png'], ['http://oss.on-running.cn/crm/roger-lucky-draw/01.png'], ['http://oss.on-running.cn/crm/roger-lucky-draw/01.png']],
      qualifyNum: 0,
      activityInfo:{},
      activityStatus: 0,
      pupOptions:{
        show: false
      },
      recodPupOptions:{
        show: false
      },
      rulePupOptions:{
        show: false
      },
      isMember: 0,
      ruleImg: '',
      cnyPrizeList:[],
      cnyRecordList: {},
      mobile:'',
      countDownTime: ''
    };
  },
  computed: {
    headerOptions() {
      let option = {
        backgroundColor: "#B22526",
        style: "black",
        enableBack2Home: true,
      };
      const title = "";
      option.title = title;
      return option;
    },
    cnyImg(){
      return {
        cny_bottom: 'https://oss.on-running.cn/crm/roger-lucky-draw/cny_bottom.svg',
        cny_lucky: 'https://oss.on-running.cn/crm/roger-lucky-draw/cny_lucky.svg',
        cny_prize: fixCMSPath('https://oss.on-running.cn/crm/roger-lucky-draw/cny_prize.jpg', 280),
        cny_text_01: 'https://oss.on-running.cn/crm/roger-lucky-draw/cny_text_04.svg',
        cny_text_02: 'https://oss.on-running.cn/crm/roger-lucky-draw/cny_text_06.svg',
        cny_text_03: 'https://oss.on-running.cn/crm/roger-lucky-draw/cny_text_05.svg',
      }
    }
  },
  async mounted() {
    await this.$store.state.loginPromise;
    this.isMember = Taro.getStorageSync('lw_loginStatus')
    if(!this.isMember){
      this.loginGuideOptions.visible = true
    }else{
      await getUCenterInfo()
      const userInfo = Taro.getStorageSync('userInfo')
      if(!userInfo || !userInfo.avatarUrl){
        this.avator.visible = true
      }else{
        this.avator.formData = {
          name: userInfo.nickName,
          pic: userInfo.avatarUrl,
        }
        this.mobile = userInfo.mobile
      }
    }
    this.getCnyInfo()
  },
  async onLoad() {
    let {shopCode = "" } =
      Taro.getCurrentInstance().router.params;
    showCustomLoading();
    // this.codeUrl='http://on-running.oss-cn-shanghai.aliyuncs.com/cms_stage/images/74670e5b0201a9285b4801ab865b6109.jpg'
    this.codeUrl=shopCode
    hideCustomLoading();
    Taro.hideShareMenu();

    Taro.loadFontFace({
      family: 'fusion-pixel-10px-monospaced-zh_hans',
      source: 'url("https://oss.on-running.cn/static/wxmp/fusion-pixel-10px-monospaced-zh_hans.woff2")',
    })
  },
  methods: {
    fixCMSPath,
    /**
     * 图片预览
     */
     onPreviewImage() {
      const code = this.fixCMSPath(this.codeUrl, 1125)
      const imageSet = [code];
      if (code) {
        Taro.previewImage({ current: code, urls: imageSet });
      } else {
        console.warn('@onPreviewImage::','二维码路径不存在');
      }
    },
    onHideGuideClose(){
      this.loginGuideOptions.visible = false
    },
    onLoginSuccess(){
      const userInfo = Taro.getStorageSync('userInfo')
      if(!userInfo || !userInfo.avatarUrl){
        this.avator.visible = true
      }else{
        this.avator.formData = {
          name: userInfo.nickName,
          pic: userInfo.avatarUrl,
        }
        this.mobile = userInfo.mobile
      }
    },
    onGuestConfirm(){

    },
    closeAvatorPup(){
      this.avator.visible = false
    },
    subscribe(){
      Taro.requestSubscribeMessage({
        tmplIds: this.templateIds,
        success: async (sres) => {
          const arr = []
          let subscribeSuc = false
          this.tempIds.map((item)=>{
            if(sres[item.id] === 'accept'){
              arr.push(item.index)
              item.isSub = true
              if(!subscribeSuc){
                Taro.showToast({ title: "订阅成功", icon: 'none'});
                subscribeSuc = true
              }
            }
            return item
          })
          // await recordSubcribe({type: arr})
          // this.$emit('recordsub')
        },
        complete(sres){
          if(sres.errMsg.includes('requestSubscribeMessage:fail')){
            Taro.showToast({ title: "订阅失败", icon: 'none'});
          }
        }
      })
    },
    // 抽奖
    async drawLottery(){
      const res = await cnyDraw()
      if(res.code === 200 && res.data && res.data.flag){
        this.winOrNot = res.data.flag
      }
      this.slotItems = [
          this.adaptSlotItems(this.rawSlotItems),
          this.adaptSlotItems(this.rawSlotItems),
          this.adaptSlotItems(this.rawSlotItems)
        ]
      this.startDraw = true
      this.getQualify()
    },
    // 结束滚动展示中奖结果
    endDraw(){
      this.startDraw = false
      this.pupOptions.show = true
    },
    async getCnyInfo(){
     const res = await getCnyInfo();
     if(res.code === 200){
      console.log(res)
      const activityInfo = res.data?.activity_info
      this.activityInfo = activityInfo
      this.countDown(activityInfo)
      this.activityStatus = activityInfo.status
      // 中奖列表
      if(activityInfo.status === 3){
        this.getCnyPrizeList()
      }
      this.ruleImg = activityInfo.lucky_draw_rule
      this.rawSlotItems = activityInfo.image_list.map((item)=>{
        item.image_url = this.fixCMSPath(item.image_url, 1125)
        return item
      })
      this.slotItems = [
        this.adaptSlotItems(this.rawSlotItems),
        this.adaptSlotItems(this.rawSlotItems),
        this.adaptSlotItems(this.rawSlotItems)
      ]
      console.log(this.slotItems)
     }
    },
    async getQualify(){
      const res = await getCnyQualify()
      if(res.code === 200){
        this.qualifyNum = res.data.left_qualify_num
      }
    },
    // shuffleArrayWithFixedItemAndNoAdjacentDuplicates
    adaptSlotItems(rawSlotItems){
        if(!rawSlotItems || rawSlotItems.length === 0){
          return []
        }
        let winItem = null
        winItem = rawSlotItems.filter((item, index)=>{
          item.index = index
          return item.is_prize_image
        })[0]
        console.log('winItem----------', winItem)
        let slotItems = []
        while(slotItems.length < this.slotLength){
          let slotItemsArr = []
          if(winItem && this.winOrNot){
            slotItemsArr = shuffleAndFixIndexToPosition(rawSlotItems, winItem.index, rawSlotItems.length - 2)
          }else{
            slotItemsArr = shuffleAndFixIndexToPosition(rawSlotItems)
          }
          slotItems = slotItems.concat(slotItemsArr)
        }
        const firstSlotItemsArr = shuffleAndFixIndexToPosition(rawSlotItems, winItem.index, 0)
        slotItems = slotItems.slice(slotItems.length - this.slotLength, slotItems.length)
        slotItems.splice(0,firstSlotItemsArr.length, ...firstSlotItemsArr)
        return slotItems.map((item)=>{
          return item.image_url
        })
    },
    closePup(){
      this.pupOptions.show = false
      this.recodPupOptions.show = false
      this.rulePupOptions.show = false
    },
    toTop(){
      wx.pageScrollTo({
        scrollTop: 0,
        duration: 300
      })
    },
    async  getCnyPrizeList(){
     const res = await getCnyPrizeList()
     if(res.code === 200){
      this.cnyPrizeList = res.data
     }
    },
    async getCnyRecordList(){
    const res = await getCnyRecordList()
     if(res.code === 200){
      this.cnyRecordList = res.data
      this.recodPupOptions.show=true
     }
    },
    desensitizify(data){
      if(data){
        return desensitizify('mobile', data)
      }
    },
    gotoBuy(){
      wx.pageScrollTo({
        selector: '#cny-cms-content',
        duration: 300,
        offsetTop: -100
      })
    },
    lookWinners(){
      wx.pageScrollTo({
        selector: '#look-winners',
        duration: 300,
        offsetTop: 100
      })
    },
    countDown(activityInfo){
      if(!activityInfo){
        return ''
      }
      const {date_type, left_time} = activityInfo
      if(date_type === 0){
        this.countDownTime = ` ${left_time} 天`
        return
      }
      if(date_type === 1){
        this.countDownTime = ` ${left_time} 小时`
        return setTimeout(()=>{
          this.countDown(activityInfo)
        }, 1800000)
      }
      if(date_type === 2){
        this.countDownTime = ` ${left_time} 分钟`
        return setTimeout(()=>{
          this.countDown(activityInfo)
        }, 60000)
      }
      if(date_type === 3){
        this.countDownTime = ` ${left_time}  秒`
        return setTimeout(()=>{
          this.countDown(activityInfo)
        }, 500)
      }
    }
  }
};
</script>

<style lang="scss">
@font-face {
  font-family: "iconfont"; /* Project id 3549473 */
  src: url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAABK4AAsAAAAAIyQAABJoAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACIHAqvPKZVATYCJAOBJAtUAAQgBYRnB4N+G6cdFeOYFbBxACC+vUCy/z8nJ2MIlGzbNbuRIxNV0dz4TSyRiKgHuTYXtjeMRi6HSPHCsznZukqHL9t3Oak4TNZ/fZo+2NLjy4T5wHJPnKuGlTNG+fCUyLdDBHmwoZRQ0Nj/5vSZSf4/dEFaoGqkNEInFbouiUo9AuBY3leuMiiSJlDho0jbBDcf8ACjsIFn0Fo6sxuc2b3PB0jp6GhgaDnEdyWPqsZXqMq0BwAKuAbA8LTNf2iDFVOMnHCgm9OeWICNgl6YsYnRuARWbrAyaun/a1w1Rq2NHweswkWEkgABBASqS042AaNXT9SydxrW7k/1621YGBY7xx//dr2ufjIITCJLPiGnhHkDCAz8a0AAgf+qGxpjWsdLsBsz42soy8ulW5fGe4gijmX7da2fn0vtpQDgiN5YGLQiPzn6Sa7AuZQo5XSUDJAloAJySYmW6wBBTRL7CecnlJzOKYV46AXFQaJmFstZh1TunCgQp+nGgJq97HowIO9qWnBm8MufvWJn2XivXxjf0SCb3uxsZ9hrWWTzDdMbWUakDhh+sJXBXjkOvohPb/7c0wMrhOAX9LTxNu79feb5taZo5d68H24+dGxBAA4cHcux8eYKE8QpfBRsXqf0vgMYyl3cieJn6Fn62XJiMoxmZhdXH3i+VX0RnkUagjlcIi0sd9HicakxVKvbD+41SIwHzmHqPEBBTl6WF0QZzim3GjVr0iLEBvXq2H/n1ahWpVKFcmVKFCuSUVZRlSdfgUJZRVOlmCh82iLAFnoNB0QIAQVIA5CDNAF5SBuQhXQAHtJlaOL0wABOHwzgiABYiARwkAHAQPGALeIAligRsEZcwArxABuUTFM5GIAFQgFzlAaYoXQ64zIAmKBMwBhlA0YoFzBEeYABygf0UQGghwoBHVQEaKNiQAstApSgxYAyVAqoQHxAFZUBaqgcUEcVgAaqBDRRFT0cVw1AEToAmPJ36yx0AXZxPy8AX8usALl7eI4ZFRU48YLEQeHsD/bMGBKh3jPs5SqtyWH4RboRYhA5ZaxS/hGETPuTPCC0qrqZdg9rUT3TsFRkQZfBqR21fbWiwLB0UFqiWmvbjSS+WCxp0S8ueqaEhF8/S7M+RiTJTfumn+s14/Ot/m4G+emi5Tffd8zLbvWilGH913R699XIK62n5dXjohPXpDdOiU9eR0B626LACEZCpVIRHGlQ890DSjwQlU1EGIWRQyv2ScMQbJkhkgytOkhQIYHo0wI1EI3RrwUfEs3K92rwPgucQvkRNZ5SAMafJOZd+aR9KooJgiYaxo06TzaO7WEIKYylibj8/ejlvp4jlwYR6aB4YKxP1A9LVVMEXo37jimjzk6q7AnFyKhXJvZD+65gQjxl3YGjCWcog1GcCnZIyHXFdlqkULvbP6hS+JuCz0dJvFYqcVjMRIi4UihUSTbjuFKpW9dpyykZVAVZIocUOKWQuLuGkDZ7OndboVYde7OMyoOiQ6Ra1SuW8SU43gVtYzREL7BYpZIqFCIclyiVGtoykFjNJOUFnf05SiWxucavWrwz4hdt3hdZcfcwpAQtRNASpBA2JbQJDJh/T0kn7EnQj3HJJFM8KO0X9UkGigz+KxyI9DLe8KDcktQWXYHvTC+YZHxINDwhnRoVj0ym5ua3Ld3bvpqRSWLSH7epgF1K4mQPC7fGaHAzJX1Y4EidCRZvPyDd1w3sVyn4V4GHp6aPKFWupsjtwxURaRmjKqXweE4vBCqVlmj2K/CQwuIBpYovu36UI0pEUFGJnA3Ob5qbT6stAeYY8zQpVAyBxowBJUoNdW2VLZl52aEcimgLTVt4Mf9u9zLccw+3F31Wm6i+JLEH8UDRye1m4IHo+vjCa2HR0X31WaUJ3J480NQa14DYYVwJ52U2UO25zyk13oHizHb361dtD4PRDvt+ro1MBLwn93UMWNZwGJBEljXCS4OyTqUhLwn0uGWGVPqxs2jkbQdeqi+6lCcqEl90Zxe4dqXHVcYts3FAoMpt20nmdSefCE+EHAc0Upw2lDltluWQZoszTwmm6HEafRnyQIrxalXnmKFXEykInIwZ8fRFiSolMI7TYQBRIP9yLgS1S63lC6dSVJiKcL1oMnEpdUJSx9sZFACMw+PZZ5iI9EmU4sVdE9XC2mqYGEKwKmMWh5O8wuIURNez4ZgHh4R3EMcchHzdYPb74HEJ2m+mGDOBpUbtikZRzEiLOWLUITKYDKNoiqxrBQxBG4S5h1fIMN9rLUpDCqi5eZR8GOJLDgIDsmsZcZzXu6zqjqmktO0ACQ5XOy0PkXJF69xNiOZeDlcHiamUEWaDosN7fvifOUq4VnptJ/RPeJ8A4CEYTJwmlnHXk0l/SJXHBfczpCoAyZdctoIJ/14IlnuSqkzAUh5t9yPMjE2pCNeRI0riNtUGvE9wwKZEJu6VHjK0cLmyvB1A75SVwaCBS9YwE4YOl3zTvxy303rDBjObfOz2hVbI5PKsGIjRD8zporQF9lH67A6nXfYbivqviLbCnYnOHG2EguK4UrlM2g6Wo2RdtRFTSKaygxATOtZ4Uo6Qne711TVg9YKclNTm1S0TWcBtkg6xNWYUR3aSjNHepZZIO4ZNRg54dVjRBsP+T1oXBUatwy4EYUdHywxK2Ygne5XbF95fsH+sr8emgLKP2h8xFPJPDE687B9yDSGpsKmUwXlkW2WuZG7YuUHHsO6eoatOriLH7OnQ6awwjqea+KjgwB+XWwJBvaDBlfsPenHongleRxIDvecDh54cBgC1xCyNG+rVmBU6MgQNoW9J4xKB4CbzxfqGundvPr4DFp+XJlWJWPWgauA+yisrqypzFG8BvJuPePM2CgkraQ6Vl8rDMWiu56Xx5jsReEre/RUTyYICmKvkzlCmDRY0G9QIaqqrBdWgSmY3PPFQ3rNBhmsYU/2vBCmfLg9mDWWJwtKhwcyNrBy6CC4qXp056GcMWcMqMrl1xLKEPwHNTTOZ9IgtOSYoOvzORKWtCM6x2eIASMevhfBByO0eEnAQ5pAXAhiSoTK1AoEQGo+AIBFqF0FQjqqKKECFVB0dpMlkOxAAkT6isYmxsbBsfGzdjcipiY+tGp/ZxvR/G1R4vvxaN6fOPiPJs0JP8CS8PsYgMqpCELDKpEcVtTD/TG1e7mw2WROWuBzUPJl+cmxOUT7I0AgpRhGYFG4WUZKVPttNT+KA1rZots9Rj24UYV79eHZnpgniiJgwOVDjVKaHBzOZZKUnK9mLNl8fDPNZpKSmL2KMwWr1LAqfxm+w+4p8F9i3eHqKB4vpQQUiwLduBW8NZLdajur0D5w+naPNW6NV29LSKJB/PwdoAERAI6GsP5ZwrKgcKi8SH0oks/xgf9iPZbFEV18/AkG2M01/FiAXeHomJnpmJiaFmZ4c9WZwZCdd/2NEM/6LHl0YGzIy2eM2SnfLnps9z5PD8fRC/VNDzRK8Ej3pHK8c9xy3kBE31G2E7pYzN4fiGq1u+BwBeXTIvPo00A10JqsDm4VZTrmNhsSEjMbEi+3sZB5TVUc5cKYZ0xwG40lo6MWqTV4edTj60sSaMJ9g8p5Nl1o33/jCFn3vLLp9twpKOhzboKQcmWuNWX34ZT3RkW+yAqrPhZfZNLqAvlXjCY4pLBqXy6WskVxK5gsi2WoVNHk1wOXm4lvMW8XA8swtMHanGDY+g3nUuKSmvmR9JDzRoWhCLpcrE7QdJowjNAR6SUNo7W0IhFBfQgjU1pandD20ARFNpAgH4QoRDcIpARANkr3yHQDqMHuDoaBhUjBpKHjIILOUvMk9+LH92WZvfaANVpsuvmNA3z2Ldp9NdUWtDs1UHix3rzdfwhs3kX9CoamQtqQAXWm73BXYm6dNT28dWt1jbl4ldTh43aRlhtUysXYNpN12NtE8r5xxuXr2bJs2tGZtQ8xa34CGym8ltczU/zuCGgJ81zL+T2UWYN/mf9gY8zc3lv+e+oBFvRvwT3As9++Y1LtU1gPq+4XhHfoGgURvb93zjyS6iYyhBcRAA/3ExJp2QrZKrJT/l1m/55OF4PkundnUgWb1Pb44lVlb8q3SSNk9A6zA5CyMtb7+9ZXx/q6xs25mHyB+zTbRwpppmf3cZvTYs3po6/QFvW69c9dIf/1FuvZ52NqqnyM1N5POndPrBrAQ8UwcjyTbAACwWjLCAtHtp4azqNQlMqFCJKOJaL2NDggvg2lciUI00AuJIPXByhTC+6cl+MOWVuS9ZnxAWs8mDvCrybELLy6MtGXadbLJEeRJvrfdjhlX6l3swYuK939f7to+p901S+3PjqfwvIv4cbXEfAYvZh43dFF5ML0UTi6nNZIs0jKCy//q87i8GIY/ez7Xy4uba6Sl56ppHGZBZkQEU4IL7NbWzQmbW+0wfFC3XcqP5wN6zpEjalubsKq7N410sO6X9YOCj+az5jOfXXvLaKjwleuZEO1HvRcuFYaVMxYvZpSHzZKsQzMWh5XPVtQDgbAuOD8gNzcgP/iFknrogNzg/BfsyoD6FSuytprdpFEfGlOp07RQUB7P1IrYRtvWC/XGPUVEaJVGMarUVsF5gYF5dRaQF1RnVC0DgYVQrX6H1XYBKP+EwalXVrOWPlo+lrNWucU+5o/vXvfo8rh+97G5zwCU8Nz80d0bHss9btx9ZP48AcqmvnhuOWO13GrGsi8PQGAkfLfA24Zw11g+m+6YNJxgbZ1x/Q0z3j0yKZy+e2euu1PCeCCsY6JvVT11u3KBW3ROmO9B09FPuzJ6ygOFHNQ7bl50MhWmFaRsR+dFeccjqUh7LJRIvxz6yXTYKiXc9TFrSWzM5qXiGDYa7cZy4S0HWC/PxBVkW5uud21yFbg2XjRrTMhjX3/BrILkHgI1VLf1LGw3a6nCA2GBpHS6qankGLeW9Gth7QQGNbMbP0/OupwUO7/94+IREZ7T4MvFYt3CHaeu5BfVw5f2MMg/znTOMp6yfZ+Qg2Idu5jdjEPMLvBKlrAyLm5lJ8lK71R3UGIZHbRiUfrauRvM6+LiGszWz12Dnzx179TJKMYFWxmnaCdw/lyjXawtl0erGSpFkP3fqTc8MC2tJRoYjMvP6pN/+sz/xFY95P59xFRuisjlWXpyeOhl0UVU97gBLkxP9/4A9kpKde3XXf+YTDuUQkexexBkNhkWFR29Ty8jPCJTN03NclrPcpbm3opI4i7d1NTU+DJ49J6X07qd4Vd5EpYT2+Q9uBkJSMmAR/90qPgX/n8gJ/ChmRZs8p6ALJfNTwPL3jeq2un7771NwngZElPayMi9A1KnvhYD4NojCkgKomiDJFpv5DIXtp/n9ZtNh2qK3NHza0Qxife0l9JHbbmKF6sSHKZFlw5hudddfjA94RPENKNekZru/VCBN+aKo+pjKCtoFx4I0aeQIz9apCTm1csoQ6irgpb910VYDbsRuB2tDhx0qgiK+IZJwKz+g+Y3722K0ydJurR3ISNWf3NftKJkO6zZBONj/o74/ymc0h0h/9lvA6p/bHiULij3vRsQsuyUMR0l602gYaMzOg/xK2H3c9cFQ1sUmwh3ejM2MxyCxGamGZiwmmtYPpqnQDscu/MBaoLFI6X14IUArjeYN8vWIBtfiNgaWbyVMYh3suaEd93HBwX3+CjrMT7vYHbwgoYDRCacA9ZOJvFG1W28VfYNO53rA/ZwfYwP2r5whOt/fN5bGuorWHd4YCqCYXT9zpUgnJhm4mh/YZ4JtK72H2otqHa+fVFueo+M2kcvdZ2fzJJLKqN7N7swJBI3qSwxWDuYTc+LRdI53AYZ914rgmF0/S4etwThtHIrfnm/MM8ESiT+8Vo9ignOv8tZKIF4zzJpoY4o6zo/GeOTC7GyxtG9W/BIP/XiJr24xPAjtEMHcXpe+CtLVLY1bxvPKPa4WyTvX8sdDSGNmsmsnkagh25vi93hZMqMOQuWrFibw4YtMjv2HDhy4syFKzfu5vJAQQUNCrzrYA0mep/28X/GakW4G0FXV5XyXmT163Q9DFCVTdeXfNobdyT5UjNPAKJO+Lyx9EwxsdM6+KOiWOxg3J2WzvukL8DLcvqukKH60yqUidCfTOsvvkgAw+3W8y9lhV0qRJeqtJpKdXH2Ggg5gp6Rsq+tt+HAALKT+RR1g2WER2heujCIljxYU2dNqGe0uuZZlA2TQDz+y/leT/5hMNGjwklOE46DO+SPmSQVL6H5o1CHdwR2MqT6tvBZRs5xFn+A6ztJQdAwPLyM8ftsVBgbmpeFs7/Na/7Y3w5vxN8U8amirGp1gTtsghF73AMAAA==') format('woff2');
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-cny_avator:before {
  content: "\e60c";
}

.icon-cny_question_mark:before {
  content: "\e60a";
}

.icon-cny_bookmark:before {
  content: "\e60b";
}

.icon-cny_arrow_big:before {
  content: "\e606";
}

.icon-btn_log:before {
  content: "\e607";
}

.icon-cny_call_on:before {
  content: "\e608";
}

.icon-cny_arrow:before {
  content: "\e609";
}

.icon-refresh1:before {
  content: "\e605";
}

.icon-edit:before {
  content: "\e602";
}

.icon-my:before {
  content: "\e603";
}

.icon-refresh:before {
  content: "\e601";
}

.icon-bianji:before {
  content: "\e671";
}

.icon-Filter1:before {
  content: "\e668";
}

.icon-people1:before {
  content: "\e669";
}

.icon-Filter:before {
  content: "\e66a";
}

.icon-Location_s:before {
  content: "\e66b";
}

.icon-Like_fill:before {
  content: "\e66c";
}

.icon-Like_stroke:before {
  content: "\e66d";
}

.icon-Calendar:before {
  content: "\e66e";
}

.icon-Location:before {
  content: "\e66f";
}

.icon-people:before {
  content: "\e670";
}

.icon-tianjiahaoyou:before {
  content: "\e666";
}

.icon-erweima:before {
  content: "\e665";
}

.icon-a-Arrowright-surfer:before {
  content: "\e664";
}

.icon-location:before {
  content: "\e790";
}

.icon-download:before {
  content: "\e663";
}

.icon-Union:before {
  content: "\e662";
}

.icon-Vector:before {
  content: "\e661";
}

.icon-info:before {
  content: "\e660";
}

.icon-female1:before {
  content: "\e65e";
}

.icon-Close:before {
  content: "\e65c";
}

.icon-a-TrashFlat:before {
  content: "\e65b";
}

.icon-weixin:before {
  content: "\e6a7";
}

.icon-gengduo1:before {
  content: "\e65a";
}

.icon-gengduo:before {
  content: "\e659";
}

.icon-a-:before {
  content: "\e656";
}

.icon-Search:before {
  content: "\e654";
}

.icon-AddOutline-lujing1:before {
  content: "\e652";
}

.icon-a-VectorStroke1:before {
  content: "\e650";
}

.icon-AddOutline-lujing:before {
  content: "\e64d";
}

.icon-a-VectorStroke:before {
  content: "\e64e";
}

.icon-toright:before {
  content: "\e651";
}

.icon-eye-closed:before {
  content: "\e64b";
}


$cny-border: 2px solid #D2D2D2;
.cny-container{
  font-family: 'fusion-pixel-10px-monospaced-zh_hans';
  width: 720rpx;
  box-sizing: border-box;
  margin-left: 15rpx;
  margin-right: 15rpx;
  overflow: hidden;
  position: relative;
  border-left: $cny-border;
  border-right: $cny-border;
}
.cny-content-top{
  display: flex;
  justify-content: space-between;
  border-top: $cny-border;
  margin-top: 80rpx ;
  .cny-content-top-left{
    width: 430rpx;
    display: flex;
    flex-direction: column;
    position: relative;
    .text-1{
      height: 240rpx;
      width: 100%;
      font-size: 100rpx;
      letter-spacing: 2rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #D2D2D2;
      border-right: 2rpx solid #D2D2D2;
      border-bottom: 2rpx solid #D2D2D2;
      padding: 0 10rpx;
    }
    .text-2{
      height: 96rpx;
      width: 100%;
      border-right: 2rpx solid #D2D2D2;
      border-bottom: 2rpx solid #D2D2D2;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 10rpx;
      image{
        width:100%;
      }
    }

  }
  .cny-content-top-right{
    width: 290rpx;
    position: relative;
    .cny-content-top-right-1{
      width: 100%;
      display: flex;
      overflow: hidden;
      .lottery-chance{
        width: 144rpx;
        height:144rpx;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        color: #F0C38C;
        .lottery-chance-num{
          font-size: 72rpx;
        }
        .lottery-chance-text{
          font-size: 24rpx;
        }
      }
      .cny-user-photo{
        width: 144rpx;
        height:144rpx;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        border-right: $cny-border;
        image{
          width: 100%;
          height: 100%;
        }
        .icon-cny_avator{
          font-size: 100rpx;
          color: #D2D2D2;
        }
      }
    }
    .cny-content-top-right-2{
      height: 96rpx;
      border-top: $cny-border;
      border-bottom: $cny-border;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #F0C38C;
      font-size: 24rpx;
      font-weight: 400;
      .icon-cny_arrow{
        font-size: 26rpx;
        margin-left:20rpx;
      }
    }
    .cny-content-top-right-3{
      height: 96rpx;
      border-bottom: $cny-border;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #F0C38C;
      font-size: 24rpx;
      font-weight: 400;
      .icon-cny_call_on{
        font-size: 40rpx;
        margin-left:20rpx;
      }
    }
    
  }
}
.cny-content-time-line{
  width: 100%;
  border-top: $cny-border;
  display: flex;
  overflow: hidden;
  border-bottom: $cny-border;
  .cny-content-time-line-left{
    width: 418rpx;
    height: 280px;
    position: relative;
    overflow: hidden;
    view{
      height: 70rpx;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: $cny-border;
      color: #D2D2D2;
      font-size: 24rpx;
      padding: 0 20rpx;
      &.cny-content-bottom-left-text-last{
        color: #F0C38C;
        border-bottom: none;
        display: flex;
        justify-content: center;
        align-items: center;
        .icon-cny_bookmark{
          font-size: 36rpx;
          margin-left: 20rpx;
        }
      }
    }
  }
  .cny-content-time-line-right{
    width: 302rpx;
    height: 280rpx;
    border-left: $cny-border;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .cny-content-bottom-right-text{
      height: 70rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 24rpx;
      color: #F0C38C;
    }
    image{
      width: 100%;
      height: 210rpx;
    }
  }
}
.cny-content--time-line-bottom{
  display: flex;
  justify-content: space-between;
  width:100%;
  height: 180rpx;
  padding: 20rpx;
  padding-right:0 ;
  align-items: center;
  // border-bottom: $cny-border;
  .cny-content-bottom-bottom-left{
    display: flex;
    flex-direction: column;
    font-size: 48rpx;
    color: #D2D2D2;
    width: 500rpx;
    justify-content: center;
    &.more{
      color: #F0C38C;
    }
  }
  .cny-content-bottom-bottom-right{
    width: 200rpx;
    height: 180rpx;
    overflow: hidden;
    color: #D2D2D2;
    font-size: 180rpx;
    border-left: $cny-border;
    display: flex;
    justify-content: center;
    &.gold{
      color: #F0C38C;
      border-left:none;
      transform: rotate(-90deg);
    }
  }
}
.cny-lottery-btn-container{
  width: 100%;
  height: 200rpx;
  border-top: $cny-border;
  display: flex;
  justify-content: center;
  align-items: center;
  .cny-btn{
    background: linear-gradient(90deg, rgba(240, 35, 35, 0.29) -23.45%, rgba(255, 22, 22, 0) 36.62%, rgba(255, 197, 86, 0.29) 72.43%, rgba(255, 227, 78, 0) 115.86%),
                linear-gradient(90deg, rgba(240, 35, 35, 0.29) -23.45%, rgba(255, 162, 22, 0) 36.62%, rgba(255, 197, 86, 0.29) 73.78%, rgba(255, 227, 78, 0) 115.86%),
                linear-gradient(0deg, #F0C38C, #F0C38C),
                linear-gradient(0deg, #F0DA8C, #F0DA8C);
    width: auto;
    height: 96rpx;
    display: flex;
    padding: 0 20rpx;
    overflow: hidden;
    justify-content: center;
    align-items: center;
    color: #B22526;
    font-size: 40rpx;
    &.btn-grey{
     color: #D2D2D2;
     border: 4px solid #D2D2D2;
     background: none;
     opacity: .5;
     margin: -2px;
     box-sizing: border-box;
    }
    .cny-btn-log-icon{
      width: 66px;
      height: 44rpx;
      margin-left: 10rpx;
      font-size: 40rpx;
    }
  }
}
.cny-content-f-signature{
  height: 160px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #F0C38C;
  font-size: 60rpx;
  border-bottom: $cny-border;
  perspective: 1000rpx; /* 为了开启 3D 效果 */
}
.cny-electronic-screen-wrapper {
    width: max-content; /* 让内容尽可能宽，以便能无限循环滚动 */
    white-space: nowrap; /* 让内容水平排列 */
    position: absolute; /* 绝对定位 */
    left: 0;
    animation: scrollLeft 18s linear infinite; /* 调用动画 */
    overflow: hidden;
    display: flex;
    justify-content: space-between;
}
.cny-electronic-screen-content {
    display: block; /* 内容水平排列 */
    transform-style: preserve-3d; /* 保持 3D 效果 */
    overflow: hidden;
    position: relative;
    padding-right: 100rpx;
    letter-spacing: 2rpx;
}

@keyframes scrollLeft {
    0% {
        transform: translateX(0); /* 开始位置 */
    }
    100% {
        transform: translateX(-50%); /* 结束位置，这里是两份内容的宽度 */
    }
}
.cny-content-bottom-top{
  width: 100%;
  height: 300rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  .come-back{
    background: linear-gradient(0deg, #B22526, #B22526),linear-gradient(0deg, #F0C38C, #F0C38C);
    width: 248rpx;
    height: 96rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #F0C38C;
    font-size: 40rpx;
    border: 4px solid rgba(240, 195, 140, .5);
    .come-back-icon{
       font-size: 20rpx;
       margin-left: 10rpx;
       transform: rotate(-90deg);
    }
  }
}
.cny-content-bottom-bottom{
  height: 180rpx;
  width: 100%;
  overflow: hidden;
  position: relative;
  image{
    width: 100%;
  }
}
.cny-cms-content{
  .product_slider-wrapper{
    background: none !important;
  }
}
.parting-line-container{
  width: 100%;
  overflow: hidden;
  position: relative;
  border-top: $cny-border;
  .line-1{
    height: 30rpx;
    width: 720rpx;
    box-sizing: border-box;
    border-left: $cny-border;
    border-right: $cny-border;
    margin: 0 15rpx;
  }
}
.cny-pup-header{
  display: flex;
  height: 48rpx;
  width:300rpx;
  font-size: 28rpx;
  align-items: center;
  .cny-pup-header-icon{
    width: 48rpx;
    margin-right: 20rpx;
  }

}
.rule-content{
  margin-top:60rpx ;
  overflow: hidden;
  overflow-y: auto;
  position: relative;
  width: 100%;
  image{
    width:100%;

  }
}
.cny-winners-list-container{
  width: 100%;
  overflow: hidden;
  position: relative;
  .cny-winners-list-title{
    width: 100%;
    height: 260rpx;
    border-bottom: $cny-border;
    position: relative;
    display: flex;
    .cny-winners-list-title-left{
      width: 200rpx;
      border-right: $cny-border;
      height: 100%;
    }
    .cny-winners-list-title-right{
      width: 520rpx;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      image{
        width: 400rpx;
      }
    }
  }
  .cny-winners-list-content{
    width: 100%;
    height: 750rpx;
    position: relative;
    border-bottom: $cny-border;
    display: flex;
    .cny-winners-list-content-left{
      width: 200rpx;
      border-right: $cny-border;
      height: 100%;
    }
    .cny-winners-list-content-right{
      width: 520rpx;
      height: 100%;
      .cny-winners-list{
        padding-left: 100rpx;
        padding-top: 100rpx;
        width: 100%;
        overflow: hidden;
        position: relative;
        .cny-winners-title{
          color: #F0C38C;
          font-size: 48rpx;
          font-weight: 400;
        }
        .cny-winners-items{
          margin-top: 40rpx;
          color: #D2D2D2;
          font-size: 26rpx;
        }
      }
    }
  }
}
.cny-record-user-info{
  margin-top: 30rpx;
  margin-bottom: 10rpx;
}
.cny-record-item-list{
  margin-top: 20rpx;
  .record-item{
  border-bottom: 1px solid #D2D2D2;
  height: 88rpx;
  font-size: 28rpx;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
}
.cny-page-container{
  &.fix{
    height: calc(100vh - 174rpx);
    overflow: hidden;
    .cny-page-content{
      pointer-events: none;
    }
  }
}
</style>
