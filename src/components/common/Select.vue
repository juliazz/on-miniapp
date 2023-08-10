<template>
<view>
    <view class="select-component" v-if="isShow">
        <view class="select-mask " :catch-move="true"></view>
        <view class="select-content select_ani">
            <view class="select_header" :catch-move="true">
                <view class="select_btn" @tap="cancel">取消</view>
                <view class="select_btn select_btn_active" @tap="confirm">确定</view>
            </view>
            <view class="select_option">
                <picker-view indicatorClass="indicatorClass" class="picker_view" :value="valueArray" @change="onChange">
                    <picker-view-column>
                        <view v-for="(item, index) in provinceList" :key="index">{{item.name}}</view>
                    </picker-view-column>
                    <picker-view-column v-if="cityList">
                        <view v-for="(item, index) in cityList" :key="index">{{item.name}}</view>
                    </picker-view-column>
                    <picker-view-column v-if="areaList && mode === 'area'">
                        <view v-for="(item, index) in areaList" :key="index">{{item.name}}</view>
                    </picker-view-column>
                </picker-view>
            </view>
        </view>
    </view>
</view>
</template>

<script>
export default {
    name: 'selectComponent',
    props: {
        /**
         * list:省市联动数组
         * @type { Array } list
         * @default []
         */
        list: { type: Array, default: [] },
        /**
         * provinceIndex:选中省份对应 list中下标
         * @type { Number } list
         * @default 0
         */
        provinceIndex: { type: Number, default: 0 },
        /**
         * cityIndex:选中城市对应 province 中下标
         * @type { Number } list
         * @default 0
         */
        cityIndex: { type: Number, default: 0 },
        /**
         * areaIndex:选中地区对应 city 中下标
         * @type { Number } list
         * @default 0
         */
        areaIndex: { type: Number, default: 0 },
        /**
         * isShow:是否显示 picker
         * @type { Boolean } isShow
         * @default false
         */
        isShow: { type: Boolean, default: false },
        /**
         * 选择类型
         * @params { String } mode
         * @default： city
         * @options   city => 省市
         *            area => 省市区
         */
        mode: { type: String, default: 'city' }
    },
    data() {
        return {
            provinceActiveIndex: 0,
            cityActiveIndex: 0,
            areaActiveIndex: 0,
            provinceList: [],
            cityList: [],
            areaList: [],
            valueArray: [] //回显数组
        }
    },
    watch: {
        list: {
            immediate: true,
            handler() {
                const { list,provinceIndex,cityIndex} = this._props
                this.provinceList.push(...list)
                this.cityList.push(...this._props.list[provinceIndex]['sub'])
                this.areaList.push(...this._props.list[provinceIndex]['sub'][cityIndex]['sub'])
            }
        }
    },
    created() {
        this.init()
    },
    methods: {
        // 组件初始化
        init() {
            const { provinceIndex, cityIndex, areaIndex } = this._props
            this.valueArray = [provinceIndex, cityIndex, areaIndex]
        },
        /**
         * onChange：picker改变触发
         * @param { Object } e
         */
        onChange: function (e) {
            const val = e.detail.value
            try {
                if (this.provinceActiveIndex !== val[0]) {
                    this.provinceActiveIndex = val[0]
                    this.cityActiveIndex = 0
                    this.areaActiveIndex = 0
                    this.cityList = []
                    this.cityList.push(...this._props.list[this.provinceActiveIndex]['sub'])
                    if (this._props.mode === 'area') {
                        this.areaList = []
                        this.areaList.push(...this._props.list[this.provinceActiveIndex]['sub'][this.cityActiveIndex]['sub'])
                    }
                }
                setTimeout(() => {
                    if (this.cityActiveIndex != val[1]) {
                        this.cityActiveIndex = val[1]
                        this.areaActiveIndex = 0
                        if (this._props.mode === 'area') {
                            this.areaList = []
                            this.areaList.push(...this._props.list[this.provinceActiveIndex]['sub'][this.cityActiveIndex]['sub'])
                        }
                    } else {
                        if (this._props.mode === 'area') this.areaActiveIndex = val[2]
                    }
                    this.valueArray = []
                    this.valueArray.push(this.provinceActiveIndex, this.cityActiveIndex, this.areaActiveIndex)
                }, 1);
            } catch (e) {
                console.warn(e)
            }
        },
        /**
         * confirm:确认监听事件
         * @return { Object }
         * @item {
         *          province:"省",
         *          provinceIndex:省份对应下标
         *          city:"市"
         *          cityIndex:城市对应下标
         *          area:地区(mode为area返回)
         *          aeraIndex:地区对应下标(mode为area返回)
         *       }
         */
        confirm() {
          let _obj = {
              province: this._props.list[this.provinceActiveIndex],
              provinceIndex: this.provinceActiveIndex,
              city: this._props.list[this.provinceActiveIndex]['sub'][this.cityActiveIndex],
              cityIndex: this.cityActiveIndex
          }
          this._props.mode === 'area' && Object.assign(_obj, {
              area: this._props.list[this.provinceActiveIndex]['sub'][this.cityActiveIndex]['sub'][this.areaActiveIndex],
              aeraIndex: this.areaActiveIndex
          })
          this.$emit('onConfirm', _obj)
        },
        /**
         * cancel:取消监听事件
         * @return { Object }
         *
         */
        cancel() {
            this.$emit('onCancel', { code: 1, errorMessage: "用户取消了" })
        }
    }
}
</script>

<style lang="scss">
.select-component {
    .select-mask {
        height: 100vh;
        width: 100vw;
        background-color: rgba($color: #000000, $alpha: .7);
        left: 0;
        bottom: 0;
        position: fixed;
        z-index: 99;
    }
    .select_ani{
        animation: 1s linear box_tranlate;
        animation-fill-mode:forwards;
        animation-iteration-count:1
    }
    .select-content {
        position: fixed;
        left: 0;
        width: 100vw;
        height: 600px;
        background-color: white;
        top: 100vh;
        z-index: 100;

        .select_header {
            height: 80px;
            width: 100%;
            box-sizing: border-box;
            border-bottom: 1Px solid #ddd;
            display: flex;
            justify-content: space-between;

            .select_btn {
                height: auto;
                width: 200px;
                padding: 0;
                margin: 0;
                background-color: white;
                color: #999;
                text-align: center;
                line-height: 80px;
            }

            .select_btn_active {
                color: #000000;
            }
        }

        .picker_view {
            margin-top: 40px;
            width: 100%;
            height: 400px;
            text-align: center;
            line-height: 60rpx;
            background-color: #ddd;

        }

        .indicatorClass {
            font-size: 28px;
            color: #000000;
        }
    }
}
@keyframes box_tranlate {
    0%{
        transform: translateY(0);
        opacity: 0;
    }
    100%{
        transform: translateY(-600px);
        opacity: 1;
    }

}
</style>
