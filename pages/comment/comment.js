// pages/comment/comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var did = options.did;
    var aid = options.aid;
    this.setData({
      did,
      aid
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },


  // 获取评论内容
  getText(e){
    var text = e.detail.value;
    this.setData({
      text
    })
  },


  // 发表
  publishText(){
    var that = this;
    var sign = wx.getStorageSync("sign");
    var operator_id = wx.getStorageSync("operator_id");
    var did = that.data.did;
    var aid = that.data.aid;
    console.log(aid);
    var content = that.data.text;

    if (content){
      wx.request({
        url: "https://gallery.playonwechat.com/api/save-comment?sign=" + sign + "&operator_id=" + operator_id,
        method: "POST",
        data: {
          did,
          content
        },
        success: function (res) {
          console.log(res);
          if(res.data.status){
            wx.navigateTo({
              url: '../albumDetail/albumDetail?aid=' + aid,
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: '内容不得为空',
      })
    }
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})