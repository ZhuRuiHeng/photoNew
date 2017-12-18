// pages/album/album.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'https://gcdn.playonwechat.com/photo/nice1.jpg',
      'https://gcdn.playonwechat.com/photo/nice1.jpg',
      'https://gcdn.playonwechat.com/photo/nice1.jpg'
    ],
    show:false
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
      if (this.data.show){
        this.setData({
          itemBar: 2,
          show: false
        })
      }else{
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
  }

 
})