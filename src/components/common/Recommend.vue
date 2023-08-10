<template>
  <view class="Recommend-wrapper">
    <view class="recommend_goods" v-if="swipers.length">
      <text class="rec_title">为你推荐</text>
      <view class="rec_list">
        <swiper class="rec_swiper" :current="current" :vertical="false" :circular="true" :autoplay="false"
          @Change="onChange">
          <swiper-item v-for="(item, index) in swipers" :key="index">
            <view class="rec_goods_li">
              <block v-for="(k, j) in item" :key="j">
                <view class="rec_item">
                  <Goods-item :source="k" />
                </view>
              </block>
              <!-- <view class="rec_item">
                <Goods-item :source="item" />
              </view> -->
              <!-- <view class="rec_item">
                <Goods-item :source="{
                  en_name: 'Cloud Waterproof',
                  cn_name: '轻量透气减震跑步鞋',
                  image: 'https://img2.baidu.com/it/u=93281390,1312606572&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
                  price: 19999
                }" tagBgColor="#FFF" />
              </view>
              <view class="rec_item">
                <Goods-item :source="{
                  en_name: 'Cloud Waterproof',
                  cn_name: '轻量透气减震跑步鞋',
                  image: 'https://img2.baidu.com/it/u=93281390,1312606572&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
                  price: 19999
                }" tagBgColor="#FFF" />
              </view> -->
            </view>
          </swiper-item>
        </swiper>
        <view class="swiper_dots" v-if="swipers.length > 1 && dotsShow">
          <view :class="['swiper_dot', current == index ? 'swiper_dot_active' : '']" v-for="(item, index) in swipers"
            :key="index"></view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import Taro from '@tarojs/taro';
import GoodsItem from "@/components/common/BaseItem.vue"
import {arrayTranslater} from "@/utils"
export default {
  components: {
    GoodsItem
  },
  name: 'Recommend',
  props: {
    /**
     * 页面来源，暂时未用到，暂时保留 , type: String
     */
    scope: {
      type: String,
      default: 'cart'
    },
    /**
     *  需要轮播的数组 , type:Array , item { Object }
     */
    list: {
      type: Array,
      default: []
    },
    /**
     *  type:Boolean, default:true
     *  是否需要指示点，且数组大于长度 1 才会展示
     */
    dotsShow: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      current: 0,
      swipers: []
    }
  },
  watch: {
    list: {
      immediate: true,
      handler() {
        this.loadSource();
      }
    }
  },
  created() { },
  methods: {
    // 初始化
    loadSource() {
      console.log(this._props.list)
      this.swipers = arrayTranslater(this._props.list,2, true)
      // let _list = [...this._props.list]
      // this.swipers = this.processingList(_list, 2,_list.length)
      // console.log(this.swipers)
    },
    // 一维数组转二维数组
    processingList(arr = [], num = 0,_len) {
      let newArr = [];
      for (let i = 0, j = 0; i < _len; i += num, j++) {
        console.log(i)
        newArr[j] = arr.splice(0, num);
      }
      return newArr;
    },
    // swiper改变
    onChange(e) {
      this.current = e.detail.current
      console.log(e)
    },
  }
}

</script>

<style lang="scss">
.recommend_goods {
  padding-left: 32px;

  .rec_title {
    color: #000000;
    font-size: 24px;
  }

  .rec_list {
    /* height: 696px; */
    width: 100%;
    box-sizing: border-box;
    margin-top: 32px;
    overflow-x: hidden;

    .rec_swiper {
      width: 768px;
      height: 654rpx;
    }

    .rec_goods_li {
      width: 768px;
      display: flex;
    }

    .rec_item {
      height: 654rpx;
      width: 368px;
      /* background-color: #FAF7F6; */
      box-sizing: border-box;
      // padding: 64px 0 32px 32px;
      margin-right: 16px;

      ._img_bl {
        color: #000000;

        ._img {
          height: 304px;
          width: 304px;
          vertical-align: middle;
        }
      }

      ._goods_en {
        margin-top: 32px;
        line-height: 1.4;
        font-size: 28px;
        font-weight: bold;
      }

      ._goods_name {
        margin-top: 8px;
        font-size: 28px;
        line-height: 1.3;
      }
    }

    .swiper_dots {
      margin-top: 80px;
      display: flex;
      width: calc(100vw - 32rpx);
      justify-content: center;

      .swiper_dot {
        width: 46px;
        height: 2Px;
        background-color: #CCCCCC;
      }

      .swiper_dot_active {
        background-color: #000000;
      }
    }
  }
}
</style>
