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
    }),
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
            function toDate(number) {
              var n = number * 1000;
              var date = new Date(n);
              console.log("date", date)
              var y = date.getFullYear();
              var m = date.getMonth() + 1;
              m = m < 10 ? ('0' + m) : m;
              var d = date.getDate();
              d = d < 10 ? ('0' + d) : d;
              var h = date.getHours();
              h = h < 10 ? ('0' + h) : h;
              var minute = date.getMinutes();
              var second = date.getSeconds();
              minute = minute < 10 ? ('0' + minute) : minute;
              second = second < 10 ? ('0' + second) : second;
              //return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
              return y + '.' + m + '.' + d;
            }
            that.setData({
              oldWiner: false,
              WinerInform: false,
              winnerOpen: false,
              activeInform: res.data.data,
              start_time: toDate(res.data.data.start_time),
              end_time: toDate(res.data.data.end_time),
            })

            if (wx.getStorageSync('activity') == true) {
              console.log(111);
              that.setData({
                activity: false,
                rules: true
              })
            } else {
              console.log(222);
              wx.setStorageSync('activity', true)
              that.setData({
                activity: true,
                rules: true
              })
              if (that.data.activeInform.rules) {
                WxParse.wxParse('newrules', 'html', that.data.activeInform.rules, that, 5)
              }
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
  },
 // 参与活动
  activeIn(e) {
    this.setData({
      activity: false
    })
    wx.navigateTo({
      url: '../templatePhoto/templatePhoto'
    })
  },

})