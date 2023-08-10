<template>
  <view
    class="tab_slider-wrapper"
    :id="`_${identifier}_${config.id}`"
    v-if="config && config.content&&runningList&&runningList.length"
  >
    <view class="bg-box">
      <image class="bgimg" :src="fixCMSPath(bgURL,1125)" @load="bgLoaded($event)" mode="widthFix"></image>
    </view>
    <view class="tab_slider-container" id="tab_slider-container">
      <view class="content-box">
        <view class="city-header-list flex_hsb_vc">
          <view v-for="(node, index) in runningList" :key="index">
            <view
              :class="['tab-header', index == activeIndex ? 'activeTab':'' ]"
              :style="cityTitleColor(index)"
              @tap="changeActiveCity"
              :data-index="index"
            >
              {{ node.city_name }}
              <text  :class="['icon-font', 'icon-Union',index == activeIndex ? 'activeIcon':'' ]" ></text>
            </view>
          </view>
        </view>
        <view class="active-city-content">
          <view
            class="city-content empty"
            v-if="activeCity && activeCity.all_end"
          >
            <image
              class="end-image"
              :src="fixCMSPath(activeCity.campaign_end_image||'', 1125)"
              mode="widthFix"
              @tap="
                actionHandler({
                  type: 'link',
                  data: '/pages/landing/index?key=cloudsurfer_szrecap',
                })
              "
            >
            </image>
          </view>
          <view class="city-content" v-else>
            <view class="city-scroll-content flex_hsb_vc">
              <view
                class="city-scroll-item"
                v-for="(campaign, idx) in activeCity.campaign"
                :key="idx"
                v-if="activeCity.campaign && activeCity.campaign.length"
                @tap="campaign.status?
                actionHandler({
                  type: 'link',
                  data:campaign.campaign_url,
                }):''"
              >
              <image class="city-activity-img"  mode="center" :src="fixCMSPath(campaign.cover_image, 600)"></image>
              <view class="text-area abs">
                <view class="city-name">
                  <text :class="['name']" :style="cityTitleColor(activeIndex)"> {{ activeStatus(campaign.status) }}</text>
                  </view>
                  <view class="adress">{{ campaign.campaign_name }}</view>
                  <view class="activity-status flex_hsb_vc" >
                    <text class="status">
                      {{ campaign.campaign_address }}
                    </text>
                    <text class="icon-font icon-gengduo1" v-if="campaign.status" ></text>
                  </view>
                </view>
              </view>
              <view class="city-scroll-item" v-else> 暂无活动,敬请期待 </view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import BaseItem from "@/components/common/BaseItem.vue";
import {
  RES_SUCCESS_CODE,
  ajax,
  fixCMSPath,
  showCustomLoading,
  hideCustomLoading,
} from "@/utils";
import mixins from "@/utils/mixins";
import types from "@/store/types";
import Taro from "@tarojs/taro";
export default {
  name: "TabSlider",
  mixins: [mixins],
  inject: {
    page:{default: {}}
  },
  components: { BaseItem },
  props: {
    /**
     * 唯一 ID
     */
    identifier: { type: String, required: true },
    /**
     * 组件配置
     */
    config: { type: Object, required: true },
    /**
     * 是否启用 `LazyLoad`
     */
    enableLazyLoad: { type: Boolean, default: false },
  },
  data() {
    return {
      initialled: false,
      runningList: [],
      status: [
        //0:敬请期待 1:报名开始 2:报名结束 4:活动结束
        "敬请期待",
        "报名开始",
        "报名结束",
        "活动结束",
      ],
      landingUrlList: [
        "/pages/landing/index?key=suffer_sh",
        "/pages/landing/index?key=suffer_sz"
      ],
      bgURL:'http://on-running.oss-cn-shanghai.aliyuncs.com/static/wxmp/suffer_tabSlider_bg.png?v=5',
      scrollbarX: 0,
      activeIndex: 0,
    };
  },
  computed: {

    /**
     * 主标题样式
     */
     cityTitleColor() {
      return function (val) {
        let styles = {};
        switch (val){
          case 0:
          styles.backgroundColor = '#0099FF'
          break;
          case 1:
          styles.backgroundColor = '#FC6E00'
          break;
        }
        return styles;
      };
    },
    /**
     * silder card  文字颜色
     */
    category_banner_Styles() {
      let styles = {};
      const { text_color } = this.config.content;
      text_color && (styles.color = text_color);
      return styles;
    },
    /**
     * 当前show的城市
     */
    activeCity() {
      const { activeIndex, landingUrlList } = this;

      const city = Object.assign(
        { ...this.runningList[activeIndex] },

        {
          allEndLink: landingUrlList[activeIndex],
        }
      );
      return city;
    },
    /**
     * 当前活动状态
     */
    activeStatus() {
      return function (val) {
        const { status } = this;
        return status[val];
      };
    },

    /**
     * 产品分类树状数据
     */
    categories() {
      return this.$store.state.categoryTree;
    },
  },
  async created() {
    // this.loadSource();
    // this.initComponent();
  },
  async mounted() {
    await this.getSufferCampain();
    // if(scene==1154)return
  },
  methods: {
    fixCMSPath,
    bgLoaded(evt){
      return new Promise((resolve,reject)=>{
        console.log(evt);
        const { detail: { width, height } } = evt.mpEvent;
        if(evt && height){
          const { channel } = this.page.initParams;
          if (channel == "channelArticle") {
            this.scrollToTabSlider();
          }
          resolve()
        }else{
          reject()
        }
      })
    },
    scrollToTabSlider() {
      const selector = `#tab_slider-container`;
      const { px } = this.$store.state.headerHeight;
      Taro.nextTick(() => {
        setTimeout(()=>{
          Taro.createSelectorQuery()
            .select(selector)
            .boundingClientRect()
            .exec((rect) => {
              this.clientRect = rect[0];
              console.log("获取的组件高度", this.clientRect);
              Taro.pageScrollTo({
                selector,
                offsetTop: - (96 + px),
                duration: 300,
              });
            });
        },500)
      })
    },
    /**
     * 加载onrunclub后台活动数据
     */
    getSufferCampain() {
      return new Promise((resolve, reject) => {
        ajax({
          url: types.CLUB_CAMPAIGN,
          method: "GET",
          host: $ON_API_HOST,
        })
          .then((res) => {
            resolve();
            const { data, code, msg } = res || {};
            if (code !== 200) {
              return errorHandlerFront(
                { msg: `网络错误，[${code}]~` },
                true,
                "@GET_RESERVATION_INFO-info::",
                msg
              );
            }
            this.runningList = data;
          })
          .catch((err) => {
            reject();
            console.log(err);
          });
      });
    },
    changeActiveCity(eve) {
      const { index } = eve.currentTarget.dataset;
      this.activeIndex = index;
    },

    /**
     * 初始化组件
     */
    initComponent() {
      let count = this.list.length;
      if (this.config.content.top_banner) count += 1;
      this.$emit("ready", { name: "ProductSlider", images: count });
    },
    /**
     * 轮播
     */
    onSwiperChange(evt) {
      this.activeIndex = evt.detail.current;
    },

  },
};
</script>

<style lang="scss">
$campaign_blue: #0099FF;
.blue-bg{
  background: $campaign_blue;
  padding: 0 2rpx;
}
.orange-bg{
  background: #FC6E00;
  padding: 0 2rpx;
}
.tab_slider-wrapper {
  margin: 0;
  background: #fbf7f6;
  text-align: left;
  overflow: hidden;
  position: relative;
  .bg-box{
    width: 100vw;
    display: flex;
    .bgimg{
      width: 100%;
    }
  }
  .tab_slider-container {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100vw;
    padding: 40rpx 0 0 32rpx;
    .city-header-list {
      padding: 20rpx 0 64rpx;
      justify-content: flex-start;
      .activeTab {
      }
      .tab-header {
        font-family: 'PingFang SC';
        font-style: normal;
        font-weight: 500;
        font-size: 40rpx;
        padding: 0 4rpx;
        margin-right: 32rpx;
        line-height: 1.1;
        display: flex;
        letter-spacing: -0.043em;
        transition: all 0.4s;
        flex-wrap: nowrap;
        align-content: center;
        .icon-font{
          width: 0;
          margin-left: 2rpx;
          text-align: center;
          font-size: 40rpx;
          overflow: hidden;
          transition: all 0.2s;
          &.activeIcon{
            width: 50rpx;
          }
        }
      }
    }
    .city-content {
      width: 100vw;
      &.empty{
        padding-right: 32rpx;
        .end-image{
          width: 100%;
        }
      }
      .city-scroll-content {
        overflow-x: scroll;
        width: 100%;
        justify-content: flex-start;
        .city-scroll-item {
          margin-right: 30rpx;
          position: relative;
          display: flex;
          filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.05)) drop-shadow(0px 4px 8px rgba(0, 0, 0, 0.1));
          &:last-child {
          }
          .city-activity-img{
            height: 672rpx;
            width: 480rpx;
            height: 672rpx;
            border-radius: 16rpx;
            overflow: hidden;
          }
          .abs {
            position: absolute;
            left: 0;
            border-radius: 16rpx;
            bottom: 0;
            width: 100%;
            height: 332rpx;
            text-align: left;
            color: #fff;
            background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.5) 51.56%, rgba(0, 0, 0, 0.7) 100%);
            &.text-area{
              padding:35rpx 26rpx;
              display: flex;
              flex-direction: column;
              justify-content: flex-end;
              font-family: 'PingFang SC';
              font-style: normal;
              font-weight: 500;
            }
            .name{
              line-height: 1.1;
              display: inline-block;
            }
            .city-name{
              font-size: 40rpx;
              letter-spacing: -0.043em;
              color: #000000;
            }
            .adress{
              font-weight: 600;
              font-size: 40px;
              line-height: 130%;
              width: 85%;
              margin: 18rpx 0 10rpx;

            }
            .activity-status{
              font-size: 28rpx;
              line-height: 140%;
              .icon-font{
                margin-top: -22rpx;
                color: #fff;
                font-size: 64rpx;
              }
            }
          }
        }
      }
    }
    .active-city-content {
      height: 672rpx;
    }
  }
}
</style>

