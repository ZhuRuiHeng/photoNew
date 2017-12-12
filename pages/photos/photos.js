const app = getApp()
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js'
Page({
  data: {

  },
  onLoad: function (options) {

  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    // 请求 
    wx.request({
      url: apiurl + "photo/photo-list?sign=" + sign + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("照片墙列表:", res);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            photosList: res.data.data
          })

        } else {

        }
        wx.hideLoading()
      }
    })
  },
  // 新增相册
  newPhotos(){
    
  }

})