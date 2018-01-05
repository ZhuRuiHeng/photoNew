const app = getApp();
import tips from '../../utils/tips.js';
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    num: Math.random()
  },
  onLoad: function (options) {
      this.setData({
        thumb: options.thumb,
        win1: options.win1
      })
  },
  onShow: function () {
    let that = this;
    app.getAuth(function () {

    })
  },
  chart(){
    if (wx.getStorageSync('win1')==false){
      tips.alert('集齐照片墙才可领取')
    }else{
      wx.navigateToMiniProgram({
          appId: 'wx22c7c27ae08bb935',
          path: 'pages/photoWall/photoWall?poster=http://ovhvevt35.bkt.clouddn.com/photo/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20180105171204.png',
          envVersion: 'release',
          success(res) {
            // 打开成功
            console.log(res);
          }
        })
    }
  },
 // 参与活动
  activeIn(e) {
    wx.setStorageSync('cate_id', 13);
    wx.setStorageSync('nowImage', 1);
    wx.setStorageSync('nowTitle', '节日活动')
    wx.switchTab({
      url: '../templatePhoto/templatePhoto'
    })
  }

})