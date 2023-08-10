<template>
  <view
    class="product_slider-wrapper"
    :style="appearanceStyles"
    :id="`_${identifier}_${config.id}`"
    v-if="config && config.content"
  >
    <view class="product_slider-container">
      <view class="category_banner" v-if="config.content.top_banner">
        <image
          class="category_banner-inner"
          mode="widthFix"
          :webp="true"
          :src="fixCMSPath(config.content.top_banner, 1125)"
          @tap.stop="doViewCategory(config.content.top_banner_link)"
          @load="
            onLoaded(
              {
                type: 'image',
                src: fixCMSPath(config.content.top_banner, 1125),
              },
              $event
            )
          "
          @error="
            onLoadedError(
              {
                type: 'image',
                src: fixCMSPath(config.content.top_banner, 1125),
              },
              $event
            )
          "
        />
      </view>
      <view
        class="category_content"
        v-if="
          (!config.content.top_banner_style &&
            (config.content.title || config.content.sub_title)) ||
          (Array.isArray(list) && list.length)
        "
      >
        <!-- 非悬浮模式 & (副)标题存在 -->
        <view
          class="category_header"

          v-if="
            !config.content.top_banner_style &&
            (config.content.title || config.content.sub_title)
          "
        >
          <view class="category_title" v-if="config.content.title">
            <view class="category_title-text" :style="titleStyles">{{
              config.content.title
            }}</view>
            <!-- <image
              class="category_title-icon"
              mode="widthFix"
              src="@/assets/images/icons/arrow.svg"
              @tap.stop="doViewCategory(config.content.top_banner_link)"
            /> -->
            <view class="icon-font icon-gengduo1 category_title-icon" v-if="config.content.top_banner_link" :style="category_banner_Styles" @tap.stop="doViewCategory(config.content.top_banner_link)"></view>
          </view>
          <view class="category_subtitle" v-if="config.content.sub_title"
          :style="category_banner_Styles">{{
            config.content.sub_title
          }}</view>
        </view>
        <!-- 数据 -->
        <view
          v-if="Array.isArray(list) && list.length"
          :class="[
            'items_container',
            config.content.display_style == 'slider'
              ? 'category-slider_mode'
              : '',
            config.content.top_banner_style === 1
              ? 'items_container-float'
              : '',
          ]"
        >
          <!-- Slider 模式 -->
          <view
            class="category_slider"
            v-if="config.content.display_style == 'slider'"
          >
            <swiper
              class="category_swiper"
              :circular="true"
              next-margin="375rpx"
              @change="onSwiperChange"
              :current="activeIndex"
            >
              <swiper-item
                :class="['category_swiper-item']"
                v-for="(item, index) in list"
                :key="index"
              >
                <view :class="['category_item', index == 0 ? 'p32' : '']">
                  <view
                    class="pdt_item pdt_item-banner"
                    v-if="item.__type__ == 'banner'"
                  >
                    <image
                      class="pdt_item-banner--image"
                      mode="aspectFill"
                      :webp="true"
                      :src="fixCMSPath(item.image, 456)"
                      @tap.stop="
                        actionHandler(
                          item.link ? { type: 'link', data: item.link } : null
                        )
                      "
                      @load="
                        onLoaded(
                          { type: 'image', src: fixCMSPath(item.image, 456) },
                          $event
                        )
                      "
                      @error="
                        onLoadedError(
                          { type: 'image', src: fixCMSPath(item.image, 456) },
                          $event
                        )
                      "
                    />
                  </view>
                  <view
                    class="pdt_item"
                    :style="{
                      backgroundColor: config.content.card_color || '#FFF',
                    }"
                    v-else
                  >
                    <BaseItem
                      :source="item"
                      :enableFavorite="true"
                      :tagBgColor="config.content.tag_color || '#FFF'"
                      iconBgColor="#fff"
                      :enableLazyLoad="enableLazyLoad"
                    />
                  </view>
                </view>
              </swiper-item>
            </swiper>
          </view>
          <!-- Grid 模式: 兼容 Slider 模式 -->
          <view
            v-else
            :class="[
              'category_list',
              `category_list-${config.content.display_style}`,
            ]"
          >
            <view class="category_list-inner">
              <block v-for="(item, index) in list" :key="index">
                <view
                  class="pdt_item pdt_item-banner"
                  v-if="item.__type__ == 'banner'"
                >
                  <image
                    class="pdt_item-banner--image"
                    mode="widthFix"
                    :webp="true"
                    :src="fixCMSPath(item.image, 456)"
                    @tap.stop="
                      actionHandler(
                        item.link ? { type: 'link', data: item.link } : null
                      )
                    "
                    @load="
                      onLoaded(
                        { type: 'image', src: fixCMSPath(item.image, 456) },
                        $event
                      )
                    "
                    @error="
                      onLoadedError(
                        { type: 'image', src: fixCMSPath(item.image, 456) },
                        $event
                      )
                    "
                  />
                </view>
                <view
                  class="pdt_item"
                  :style="{
                    backgroundColor: config.content.card_color || '#FFF',
                  }"
                  v-else
                >
                  <BaseItem
                    :source="item"
                    :enableFavorite="true"
                    :tagBgColor="config.content.tag_color || '#FFF'"
                    :enableLazyLoad="enableLazyLoad"
                  />
                </view>
              </block>
            </view>
          </view>
          <!-- 滚动条 -->
          <view :class="['category_scrollbar', config.content.slider_bar_style == 'white' ? 'theme-white' : '']" v-if="list.length > 1" >
            <view
              class="category_scrollbar-inner"
              :style="scrollbarInnerStyles"
            ></view>
            <!-- 当使用 ScrollView 标签实现 Slider 模式时启用 -->
            <!-- <view class="category_scrollbar-inner" :style="{ left: `${scrollbarX}rpx` }"></view> -->
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
  loadCMSConfig,
  errorHandler,
  fixCMSPath,
  fixCMSNumber,
  deepClone,
  objectArraySort,
  findTreeNodePaths,
} from "@/utils";
import mixins from "@/utils/mixins";
import types from "@/store/types";
import Taro from "@tarojs/taro";

export default {
  name: "ProductSlider",
  mixins: [mixins],
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
      list: [],
      scrollbarX: 0,
      activeIndex: 0,
    };
  },
  computed: {
    /**
     * 外观样式
     */
    appearanceStyles() {
      let styles = {};
      const { padding_top, padding_right, padding_bottom, padding_left } =
        this.config;
      const { background_color } = this.config.content;
      padding_top &&
        !isNaN(padding_top) &&
        (styles.paddingTop = `${padding_top}px`);
      padding_right &&
        !isNaN(padding_right) &&
        (styles.paddingRight = `${padding_right}px`);
      padding_bottom &&
        !isNaN(padding_bottom) &&
        (styles.paddingBottom = `${padding_bottom}px`);
      padding_left &&
        !isNaN(padding_left) &&
        (styles.paddingLeft = `${padding_left}px`);
      background_color && (styles.backgroundColor = background_color);
      return styles;
    },
    /**
     * 主标题样式
     */
    titleStyles() {
      let styles = {};
      const { font_size,text_color } = this.config.content;
      font_size &&
        !isNaN(font_size) &&
        (styles.fontSize = `${fixCMSNumber(font_size)}rpx`);
        text_color &&
        (styles.color = `${text_color}`);
      return styles;
    },
      /**
     * silder card  文字颜色
     */
     category_banner_Styles() {
      let styles = {};
      const { text_color } = this.config.content;
        text_color &&
        (styles.color = text_color);
      return styles;
    },
    /**
     * 轮播项数量
     */
    size() {
      return this.list.length;
    },
    /**
     * 轮播项平均宽度
     */
    itemAvgWidth() {
      return `${100 / this.size}`;
    },
    /**
     * 滚动条滑块样式
     */
    scrollbarInnerStyles() {
      let styles = {};
      styles.width = `${this.itemAvgWidth}%`;
      styles.left = `${this.activeIndex * this.itemAvgWidth}%`;
      return styles;
    },
    /**
     * 产品分类树状数据
     */
    categories() {
      return this.$store.state.categoryTree;
    },
  },
  created() {
    if (this.config?.content?.product_category_id) {
      this.loadSource();
    } else {
      this.initComponent();
    }
  },
  methods: {
    fixCMSPath,
    /**
     * 加载分类商品
     */
    loadSource() {
      if (!this.config.content || !this.config.content.product_category_id)
        return console.warn("[ProductSlider]缺少必要参数: CATEGORY_ID"), false;
      ajax({
        url: types.PLP_LIST,
        method: "POST",
        data: {
          category_code: [this.config.content.product_category_id],
          filter: [],
          sort: {
            sort_field: "default",
            sort_direction: "desc",
          },
          page_size: isNaN(this.config.content.display_amount)
            ? 10
            : parseInt(this.config.content.display_amount),
          page: 1,
        },
        showLoading: false,
      })
        .then((res) => {
          const { code, data } = res;
          if (code === RES_SUCCESS_CODE) {
            let list = data.list;
            if (
              Array.isArray(this.config.content.banners) &&
              this.config.content.banners.length
            ) {
              const banners = deepClone(this.config.content.banners);
              objectArraySort(banners, "position", "asc");
              while (banners.length) {
                const item = banners.shift();
                list.splice(item.position, 0, { ...item, __type__: "banner" });
              }
            }
            this.list = list;
            this.initialled = true; // 初始化完成: 数据加载 & 广告位处理<排序 & 插入>
            //
            this.initComponent();
          } else {
            errorHandler(res, true, "@loadSource::");
          }
        })
        .catch((err) => {
          errorHandler(err, true, "@loadSource::");
        });
    },
    /**
     * 加载分类数据
     */
    loadCategories(callback) {
      return new Promise((resolve, reject) => {
        loadCMSConfig("category")
          .then((res) => {
            if (Array.isArray(res) && res[0] && Array.isArray(res[0].childs)) {
              // 一级分类导航排序
              const categories = objectArraySort(res[0].childs, "sort", "asc");
              categories?.forEach((nav1st) => {
                // 二级分类导航排序
                if (Array.isArray(nav1st.childs) && nav1st.childs.length) {
                  nav1st.childs = objectArraySort(nav1st.childs, "sort", "asc");
                  nav1st.childs.forEach((nav2nd) => {
                    // 三级分类导航排序
                    if (Array.isArray(nav2nd.childs) && nav2nd.childs.length) {
                      nav2nd.childs = objectArraySort(
                        nav2nd.childs,
                        "sort",
                        "asc"
                      );
                    }
                  });
                }
              });
              this.$store.commit("setCategoryTree", categories);
              //
              typeof callback === "function" && callback();
              //
              resolve();
            } else {
              console.warn("@Category.loadSource::", res);
              //
              reject();
            }
          })
          .catch((err) => {
            console.warn("@Category.loadSource::", err);
            reject();
          });
      });
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
    /**
     * 跳转PLP
     */
    async doViewCategory(link) {
      if (link) {
        Taro.navigateTo({ url: link });
        return false;
      }
      const target = this.config?.content?.product_category_id;
      if (target) {
        if (!Array.isArray(this.categories) || !this.categories.length) {
          await this.loadCategories();
        }
        const [n1, n2, n3] = findTreeNodePaths(
          this.categories,
          target,
          "id",
          "childs"
        );
        if (n1 && n1.id && n2 && n2.id) {
          let url = `/subpages/plp/index?n1=${n1.id}&n2=${n2.id}${
            n3 && n3.id ? "&n3=" + n3.id : ""
          }`;
          Taro.navigateTo({ url });
        }
      } else {
        console.warn("@doViewCategory::", this.config);
      }
    },
  },
};
</script>

<style lang="scss">
.product_slider-wrapper {
  padding: 0;
  margin: 0;
  background: #fbf7f6;
  text-align: left;

  .product_slider-container {
    .category_banner {
      .category_banner-inner {
        width: 100%;
        height: auto;
        vertical-align: middle;
      }
    }

    .category_content {
      padding: 0 0 32rpx 0;

      .category_header {
        padding: 48rpx 32rpx 48rpx 32rpx;

        .category_title {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .category_title-text {
            font-size: 52rpx;
            color: #000;
            line-height: 1;
            font-weight: 500;
          }

          .category_title-icon {
            width: 60rpx;
            font-size: 60rpx;
            height: auto;
          }
        }

        .category_subtitle {
          font-size: 32rpx;
          color: #000;
          font-weight: 500;
          line-height: 150%;
        }
      }

      .items_container {
        // Slider Mode
        .category_swiper {
          height: 654rpx;

          .category_swiper-item {
            .category_item {
              /* &.p32{
                  padding-left:32rpx
                } */
              width: 100%;
              height: 100%;
              padding-right: 16rpx;

              .pdt_item {
                width: 100%;
                height: 100%;
                position: relative;

                &.pdt_item-banner {
                  padding: 0;

                  .pdt_item-banner--image {
                    width: 100%;
                    height: 100%;
                  }
                }
              }
            }
          }
        }

        // Grid Mode
        .category_list {
          box-sizing: border-box;

          .category_list-inner {
            display: flex;
            justify-content: flex-start;
            align-items: stretch;
            flex-wrap: wrap;

            .pdt_item {
              box-sizing: border-box;
              width: 368rpx;
              position: relative;

              // height: 654rpx;
              &.pdt_item-banner {
                padding: 0;
                overflow: hidden;

                .pdt_item-banner--image {
                  width: 100%;
                  height: auto;
                  vertical-align: middle;
                }
              }
            }
          }

          // 网格模式
          &.category_list-grid {
            .category_list-inner {
              .pdt_item {
                &:nth-child(2n) {
                  margin-left: 14rpx;
                }

                &:nth-child(n + 3) {
                  margin-top: 14rpx;
                }
              }
            }
          }

          // 单行模式
          &.category_list-slider {
            .category_list-inner {
              display: inline-block;
              white-space: nowrap;
              padding-right: 32rpx;

              .pdt_item {
                display: inline-block;
                vertical-align: top;

                & + .pdt_item {
                  margin-left: 16rpx;
                }
              }
            }
          }
        }

        .category_scrollbar {
          width: 400rpx;
          height: 1Px;
          margin: 64rpx auto 0;
          background: #ccc;
          position: relative;
          display: none;
          transform: translateX(-16rpx);

          .category_scrollbar-inner {
            width: 40rpx;
            height: 2Px;
            background: #000;
            position: absolute;
            bottom: 0;
            left: 0;
            transition: all 0.1s linear;
          }
          &.theme-white {
            background-color: rgba(255, 255, 255, 0.6);

            .category_scrollbar-inner {
              background-color: #FFF;
            }
          }
        }

        // 单行模式: 滚动条处理
        &.category-slider_mode {
          padding: 0 0 80rpx 0;

          .category_header {
            padding: 80rpx 32rpx 80rpx 0;
          }

          .category_scrollbar {
            display: block;
          }
        }

        //
        &-float {
          margin-top: -60rpx;
        }
      }
    }
  }
}
</style>
