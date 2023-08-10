/**
 * 设备工具类
 * 可以获取一些与设备相关的信息
 * 该类获取到的所有设备信息单位均为 rpx
 */
 class DeviceUtil {
  /**
   * 构造函数
   * @param systemInfo 设备信息
   */
  constructor(systemInfo) {
    this.systemInfo = systemInfo;
  }

  /**
   * px 转 rpx
   * @param px 像素值
   */
  px2rpx(px) {
    const windowWidth = this.systemInfo.windowWidth;
    return 750 / windowWidth * px;
  }

  /**
   * rpx 转 px
   * @param rpx
   */
  rpx2px(rpx) {
    const windowWidth = this.systemInfo.windowWidth;
    return windowWidth / 750 * rpx;
  }

  /**
   * 获取导航栏高度（单位rpx）
   */
  getNavigationBarHeight() {
    const titleBarHeight = this.getTitleBarHeight();
    const statusBarHeight = this.getStatusBarHeight();
    return titleBarHeight + statusBarHeight;
  }

  /**
   * 获取状态栏高度（单位rpx）
   */
  getStatusBarHeight() {
    return this.px2rpx(this.systemInfo.statusBarHeight);
  }

  /**
   * 获取标题栏高度（单位rpx）
   */
  getTitleBarHeight() {
    const statusBarHeight = this.systemInfo.statusBarHeight;
    const capsuleButtonInfo = wx.getMenuButtonBoundingClientRect();
    const gap = capsuleButtonInfo.top - statusBarHeight;
    return this.px2rpx(gap * 2 + capsuleButtonInfo.height);
  }

  getWindowHeight() {
    return this.px2rpx(this.systemInfo.windowHeight);
  }

  getWindowHeightPX() {
    return this.systemInfo.windowHeight;
  }
  //根据原图宽高比计算图片高度
  /* par{}
      width 原图宽
      height 原图高,
     boxWidth
   */
  getCalcWidth({ width , height},boxWidth) {
    if(!width||!height){ return }
    const ratio =  height / width // 得原图宽高比
    const  calcHeight = Math.ceil(boxWidth*ratio )
    return calcHeight;
  }

}

const deviceUtil = new DeviceUtil(wx.getSystemInfoSync());
export default deviceUtil;
