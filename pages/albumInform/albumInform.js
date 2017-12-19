const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    checkboxs: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },
  navUrl(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.itembar);
    if (e.currentTarget.dataset.itembar == 2) {
      console.log(111);
      if (this.data.show) {
        this.setData({
          itemBar: 2,
          show: false
        })
      } else {
        this.setData({
          itemBar: 2,
          show: true
        })

      }

    } else {
      console.log(222);
      wx.reLaunch({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  // 是否同意展示
  Change: function (e) {
    console.log(e);
    let that = this;
    console.log('checkbox发生change事件，携带value值为：', e.currentTarget.dataset.check);
    if (e.currentTarget.dataset.check == 1) {
      that.setData({
        checkboxs: false
      })
    } else {
      that.setData({
        checkboxs: true
      })
    }

    // wx.request({
    //   url: apiurl + "photo/share?sign=" + sign + '&operator_id=' + app.data.kid,
    //   data: {
    //     pw_id: that.data.pw_id
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "GET",
    //   success: function (res) {
    //     console.log("好友拼图照片:", res);
    //     console.log("海报:", res.data.data);
    //     var status = res.data.status;
    //     if (status == 1) {
    //       that.setData({
    //         friendsImg: res.data.data
    //       })
    //       let friendsImg = res.data.data;
    //       let friendsImgs = friendsImg.split();
    //       console.log(friendsImg)
    //       console.log(friendsImgs)
    //       wx.previewImage({
    //         current: friendsImg, // 当前显示图片的http链接
    //         urls: friendsImgs // 需要预览的图片http链接列表
    //       })

    //     } else {
    //       console.log(res.data.msg);
    //     }
    //     wx.hideLoading()
    //   }
    // })
  },
})