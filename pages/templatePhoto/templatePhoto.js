// pages/templatePhoto/templatePhoto.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    now:1
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
  navbar(e) {
    this.setData({
      now: e.currentTarget.dataset.now
    })
  },

})