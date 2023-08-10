import Taro from "@tarojs/taro";
import store from '@/store/index';
export default  {
  toastMsg (title, duration = 2000, image, icon='none', ) { Taro.showToast({ title, icon, image: !!image? image: '', duration }); },
  // 封装倒计时方法
	seconds_counting (opt) {
		let { page, model, count, onStart, onCount, onEnd } = opt, { name, placeholder } = model;
		if (model.active) { return }
		count = count || 60;
		typeof onStart === 'function' ? onStart(count, model) : page[`${name}`]['text'] = `${count}s` , page[`${name}`]['active'] =true;
		if(timer){clearInterval(timer);}
		let timer = setInterval(_=>{
			if (count === 0) {
				clearInterval(timer);
				page[`${name}`]['text']= placeholder, page[`${name}`]['active']= false;
				typeof onEnd === 'function' && onEnd(model);
			}
			else { count--; typeof onCount === 'function' ? onCount(count, model) : page[`${name}`]['text']=this.format_D_H_M_S(count,'day',true); }
		}, 1000);
		return timer;
  },
  // 封装倒计时方法
    format_D_H_M_S (ms, type, isFormat) {
		var sec = ms ;
		type = type || 'day';
		var
			dUnit = 3600 * 24,
			d = type === 'day' ? parseInt(sec  / dUnit) : '',
			_diff = sec - ((d || 0) * dUnit);

		var	h = type === 'day' ? parseInt(_diff / 3600) : parseInt(sec / 3600);
		var	m = parseInt(_diff % 3600 / 60);
		var	s = parseInt(_diff % 60);
		h = isFormat? this.formatNumber(h) : h;
		m = isFormat? this.formatNumber(m) : m;

		s = isFormat? this.formatNumber(s) : s;
		var rst = type === 'day' ? {d, h, m, s} : { h, m, s };
		return rst
	},
  conversionTime(s){
  // s 为传入方法的秒数s
      let m  =  Math.floor(s/60);
      //计算秒
      //算法：取得秒%60的余数，既得到秒数
      s  =  s % 60;
      //将变量转换为字符串
      m+= '';
      s+= '';
      //如果只有一位数，前面增加一个0
      m = (m.length==1)? '0'+m : m ;
      s = (s.length==1)? '0'+s : s;
      return m +`'`+ s + '"';
  },

  // 封装倒计时方法
   timeStamp( second_time ){

		var time = parseInt(second_time) + "秒";
		if( parseInt(second_time )> 60){

			var second = parseInt(second_time) % 60;
			var min = parseInt(second_time / 60);
			time = min + "分" + second + "秒";

			if( min > 60 ){
				min = parseInt(second_time / 60) % 60;
				var hour = parseInt( parseInt(second_time / 60) /60 );
				time = hour + "小时" + min + "分" + second + "秒";

				if( hour > 24 ){
					hour = parseInt( parseInt(second_time / 60) /60 ) % 24;
					var day = parseInt( parseInt( parseInt(second_time / 60) /60 ) / 24 );
					time = day + "天" + hour + "小时" + min + "分" + second + "秒";
				}
			}


		}

	return time;
	},
	//滚动到指定组件
	scrollToComponView(selector,hasHeader,duration=300) {
	let selector_ = `#${selector}`;
		const { px } = store.state.headerHeight;
		Taro.nextTick(() => {
			setTimeout(()=>{
			Taro.createSelectorQuery()
				.select(selector_)
				.boundingClientRect()
				.exec((rect) => {

				const {top}  = rect&&rect.length&&rect[0] || {}
				top&&Taro.pageScrollTo({
				selector:selector_,
				scrollTop: top - (hasHeader ? px : 0),
					duration
				});
				});
			},500)
		})
	},
  getTime(times,isMS){
  /* par
    isMS //是否是毫秒
    */
  // 兼容ios系统
  if(!times && typeof(times) === 'string'){ return}
    let transTimes = times.replace(/-/g,'/');
    transTimes = isMS ? new Date(transTimes).getTime() : new Date(transTimes).getTime() / 1000
    return  transTimes
  },
	formatNumber(n) { return n < 10 ? '0' + n : n },

  JsonTrim(obj) {
		let timeReg = /(time)|(Time)|(date)|(Date)$/
    for (let key in obj) {
      if (typeof obj[key] === 'string') {
        obj[key] = obj[key].replace(/&nbsp;/g, ' ').trim()
      }
      if (timeReg.test(key)) { obj[key]=obj[key].replace(/#/g, ' ') }
    }
    return obj
	},
	formatCmsConfig(obj){
		const newobj={}
		for (let key in obj) {
			let newKey=obj[key]&&obj[key].mode&&obj[key].mode
			delete obj[key].mode
			newobj[newKey] = obj[key]
		}
		return newobj
	},
  //去除cms空字符配置项
  exceptEmpty(list,key='word'){
    const words= list.filter((item)=>{
        return item[key]!==""
    })
    return words
  },
  /*4.用正则表达式实现html解码（反转义）*/
  htmlDecodeByRegExp (str){
    var temp = "";
    if(str.length == 0) return "";
    temp = str.replace(/&amp;/g,"&");
    temp = temp.replace(/&lt;/g,"<");
    temp = temp.replace(/&gt;/g,">");
    temp = temp.replace(/&nbsp;/g," ");
    temp = temp.replace(/&#39;/g,"\'");
    temp = temp.replace(/&quot;/g,"\"");
    return temp;
  },
	getAuthSettings (name) {
    return new Promise(resolve=>{
      Taro.getSetting({
        success: (res)=>{
          const { authSetting } = res
          if (typeof name === 'string') {resolve(authSetting[`scope.${name}`])}
          else {
            let json = {}
            name.forEach(ele=>{ json[ele] = authSetting[`scope.${ele}`] })
            resolve(json)
          }
        }
      })
    })
	},

	painter: {
	  getImageData(canvasId, {x, y, width, height}, component) {
      return new Promise(resolve=>{
        Taro.canvasGetImageData({
          canvasId, x, y, width, height,
          success(res) { resolve(res) },
          fail(){ resolve(null) },
        }, component)
      })
    },
    putImageData(canvasId, {x, y, width, height, data}, component) {
      console.log(11113, canvasId);
      return new Promise(resolve=>{
        Taro.canvasPutImageData({
          canvasId, data, x, y, width, height,
          success(res) {
            console.log(1125, res);
            resolve(res)
          },
          fail(){ resolve(null) },
          complete(res){
            console.log(1126, res);
          }
        }, component)
      })
    },
		getImageInfo(path) {
			return new Promise((reslove, reject) => {
				Taro.getImageInfo({
					src: path,
					success: res => {
						res.path = res.path.indexOf('://') > -1 ? res.path : '/' + res.path;
						reslove(res);
					},
					fail: failed => {
						console.log(failed)
						reslove(null);
					 },
				})
			})
		},

    // 规定剪裁区域
    sectionClip ({ mode='rect', ctx, w, h, x, y, radius, bg, onDraw }) {
      ctx.save()
      ctx.beginPath()

      if (bg) { ctx.setFillStyle(bg) }

      // 切圆形
			if (mode === 'circular') { this.circularClip({ ctx, w, h, x, y, r: radius }) }

      // 切矩形
			if (mode === 'rect') { ctx.rect(x, y, w, h) }

      if (bg) { ctx.fill() }

      ctx.closePath()
      ctx.clip() // 确定裁剪区域
      onDraw && onDraw({ctx, w, h, x, y, radius})
      ctx.restore() //释放裁剪区域
    },

    // 切圆形
    circularClip ({ ctx, w, h, x, y, r }) {
      r = r ? r : 10 //圆角半径
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5) //画圆角矩形 start
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.lineTo(x + w, y + r)
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
      ctx.lineTo(x + w, y + h - r)
      ctx.lineTo(x + w - r, y + h)
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
      ctx.lineTo(x + r, y + h)
      ctx.lineTo(x, y + h - r)
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
      ctx.lineTo(x, y + r)
      ctx.lineTo(x + r, y)
		},
		// 画矩形边框
		squarelineBox({ctx, w, h, x, y, onDraw}){
			ctx.setStrokeStyle('#fff')
			console.log(x, y, w, h)
			ctx.setLineWidth(1)
			ctx.rect(x, y, w, h)
			ctx.stroke()
			onDraw && onDraw({ctx, w, h, x, y})

		},

    // 高斯模糊
    gaussBlur: function gaussBlur(imgData) {
			var pixes = imgData.data;
			var width = imgData.width;
			var height = imgData.height;
			var gaussMatrix = [],
				gaussSum = 0,
				x, y,
				r, g, b, a,
				i, j, k, len;

			var radius = 10;
			var sigma = 5;

			a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
			b = -1 / (2 * sigma * sigma);
			//生成高斯矩阵
			for (i = 0, x = -radius; x <= radius; x++, i++){
				g = a * Math.exp(b * x * x);
				gaussMatrix[i] = g;
				gaussSum += g;

			}
			//归一化, 保证高斯矩阵的值在[0,1]之间
			for (i = 0, len = gaussMatrix.length; i < len; i++) {
				gaussMatrix[i] /= gaussSum;
			}
			//x 方向一维高斯运算
			for (y = 0; y < height; y++) {
				for (x = 0; x < width; x++) {
					r = g = b = a = 0;
					gaussSum = 0;
					for(j = -radius; j <= radius; j++){
						k = x + j;
						if(k >= 0 && k < width){//确保 k 没超出 x 的范围
							//r,g,b,a 四个一组
							i = (y * width + k) * 4;
							r += pixes[i] * gaussMatrix[j + radius];
							g += pixes[i + 1] * gaussMatrix[j + radius];
							b += pixes[i + 2] * gaussMatrix[j + radius];
							// a += pixes[i + 3] * gaussMatrix[j];
							gaussSum += gaussMatrix[j + radius];
						}
					}
					i = (y * width + x) * 4;
					// 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
					// console.log(gaussSum)
					pixes[i] = r / gaussSum;
					pixes[i + 1] = g / gaussSum;
					pixes[i + 2] = b / gaussSum;
					// pixes[i + 3] = a ;
				}
			}
			//y 方向一维高斯运算
			for (x = 0; x < width; x++) {
				for (y = 0; y < height; y++) {
					r = g = b = a = 0;
					gaussSum = 0;
					for(j = -radius; j <= radius; j++){
						k = y + j;
						if(k >= 0 && k < height){//确保 k 没超出 y 的范围
							i = (k * width + x) * 4;
							r += pixes[i] * gaussMatrix[j + radius];
							g += pixes[i + 1] * gaussMatrix[j + radius];
							b += pixes[i + 2] * gaussMatrix[j + radius];
							// a += pixes[i + 3] * gaussMatrix[j];
							gaussSum += gaussMatrix[j + radius];
						}
					}
					i = (y * width + x) * 4;
					pixes[i] = r / gaussSum;
					pixes[i + 1] = g / gaussSum;
					pixes[i + 2] = b / gaussSum;
				}
			}
			return imgData;
		}

	},
}
