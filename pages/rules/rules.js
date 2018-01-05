const app = getApp();
import tips from '../../utils/tips.js';
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    let that = this;
    app.getAuth(function () {
        // 活动规则
        wx.request({
          url: app.data.apiurl2 + "photo/activity-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("活动海报:", res);
            var status = res.data.status;
            if (status == 1) {
              that.setData({
                activeInform: res.data.data,
                thumb: res.data.data.thumb
              })
              wx.hideLoading()
            } else {
              tips.alert(res.data.msg);
            }
          }
        })
    })
  },
  chart(){
    //console.log(this.data.thumb);
    wx.navigateToMiniProgram({
      appId: 'wx22c7c27ae08bb935',
      path: 'pages/photoWall/photoWall?poster=' + this.data.thumb,
      envVersion: 'release',
      success(res) {
        // 打开成功
        console.log(res);
      }
    })
  },
 // 参与活动
  activeIn(e) {
    wx.switchTab({
      url: '../templatePhoto/templatePhoto'
    })
  },

})