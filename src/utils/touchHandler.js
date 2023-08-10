// 手势方法  判断  上下左右滑动
class touchHandler {
  constructor() {
    this.data ={
      disX:null, //滑动距离 x
      disY:null,
      touchX:null, //触摸坐标X
      touchY:null //触摸坐标Y
    }
    }
    updateData(next) {
      this.data = { ...this.data, ...next };
    }
    touchMove(e,cb) {
			const endX = e.changedTouches[0].clientX
			const endY = e.changedTouches[0].clientY
			const { touchX, touchY } = this
			if (!touchX || !touchY) {
        this.updateData({
          touchX: endX || {} ,
          touchY : endY|| {}
        });
				return
			}

			const x = touchX - endX;
			const y = Math.abs(touchY - endY); //上下滑的间距 用于控制页面是否禁止滚动

      this.updateData({
        touchX: endX || {} ,
        disX : x ,
        disY : y
      });
      if(Math.abs(x)>10){ //触发禁止页面滚动
        //长滑动后的回调
        cb&&cb()
      }else{

      }
		}
    touchEnd(e) {
      if (this.disX > 5 &&Math.abs(this.disY<15)) { //左滑
        console.log('左滑了 ',this.disX)


			}else if(this.disX < -5&&Math.abs(this.disY<15)){ //右滑
        console.log('右滑了',this.disX)
      }

			delete this.touchX
			delete this.disX
			delete this.disY
		}

  }



export default  touchHandler;
