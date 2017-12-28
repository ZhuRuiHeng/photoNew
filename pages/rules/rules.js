const app = getApp();
import tips from '../../utils/tips.js';
var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    let that = this;
    // 活动规则
    wx.request({
      url: app.data.apiurl2 + "photo/activity-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("活动信息:", res);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            activeInform: res.data.data
          })
          if (that.data.activeInform.rules) {
            WxParse.wxParse('newrules', 'html', that.data.activeInform.rules, that, 5)
          }


        } else {
          tips.alert(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  },
  inActive(){
    wx.redirectTo({
      url: '../templatePhoto/templatePhoto'
    })
  }


})