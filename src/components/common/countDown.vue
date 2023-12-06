<template>
  <view :endTime="endTime" :endText="endText">
    <slot>
      {{content}}
    </slot>
  </view>
</template>
<script>
  export default {
    data() {
      return {
        content: '',
      }
    },
    props: {
      endTime: {
        type: String,
        default: ''
      },
      endText: {
        type: String,
        default: '已结束'
      },
      type:{
        type: String,
        default: '0'
      }
    },
    watch: {
      endTime() {
        this.countdowm(this.endTime)
      }
    },
    mounted() {
      this.countdowm(this.endTime)
    },
    methods: {
      countdowm(timestamp) {
        let _time = timestamp.replace(/-/g,'/')
        let self = this;
        let timer = setInterval( () => {
          let nowTime = new Date();
          // let endTime = new Date(timestamp * 1000);
          let endTime = new Date(_time)
          let t = endTime.getTime() - nowTime.getTime();
          if (t > 0) {
            let day = Math.floor(t / 86400000);
            let hour = Math.floor((t / 3600000) % 24);
            let min = Math.floor((t / 60000) % 60);
            let sec = Math.floor((t / 1000) % 60);
            hour = hour < 10 ? "0" + hour : hour;
            min = min < 10 ? "0" + min : min;
            sec = sec < 10 ? "0" + sec : sec;
            let format = '';
            if (day > 0) {
              format = this.type == 1 ? `${day}:${hour}:${min}:${sec}` : `${day}天 ${hour}小时 ${min}分 ${sec}秒`;
            }
            if (day <= 0 && hour > 0) {
              format = this.type == 1 ? `${hour}:${min}:${sec}` : `${hour}小时 ${min}分 ${sec}秒`;
            }
            if (day <= 0 && hour <= 0) {
              format = this.type == 1 ? `${min}:${sec}` : `${min}分 ${sec}秒`;
            }
            self.content = format;
          } else {
            clearInterval(timer);
            self.content = self.endText;
            this.countEnd()
          }
        }, 1000);
      },
      countEnd(){
        this.$emit('countEnd');
      }

    }
  }

</script>
