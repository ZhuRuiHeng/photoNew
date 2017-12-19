// pages/before/before.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    second: 3
  },
  onLoad(options) {
    var that = this;
    console.log("indexoptions：", options);
    var options = options;
    wx.setStorageSync("options", options);
    // 二维码
    if (options.scene) {
      var scenes = options.scene;
      if (options.scene) {
        let scene = decodeURIComponent(options.scene);
        var strs = new Array(); //定义一数组 
        strs = scene.split("_"); //字符分割 
        console.log(strs);
        console.log("pw_id:", strs[2]);
        var pw_id = strs[2];
        if (pw_id =='undefined'){
            
        }else{
          that.setData({
            pw_id: pw_id
          })
          wx.setStorageSync(pw_id, 'strs[2]')
        }
        
      }
    }else if (options.pw_id) {  //有参
      let pw_id = options.pw_id;
      that.setData({
        pw_id: pw_id
      })
      wx.setStorageSync('pw_id', pw_id);
    } 
    // else { //没有参
    //   console.log('没有参')
    //   wx.setStorageSync('pw_id', '0');
    // }
   
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const that = this;
    let time = that.data.time;
    var second = that.data.second;
    wx.request({
      url: "https://unify.playonweixin.com/site/get-advertisements?operator_id=11",
      success: function (res) {
        console.log(res);
        if (res.data.status) {
          var advers = res.data.adver.advers;
          var head_adver = res.data.adver.head_adver;
          var broadcasting = res.data.adver.broadcasting;
          wx.setStorageSync("advers", advers);
          wx.setStorageSync("broadcasting", broadcasting);
          that.setData({
            head_adver
          })

          var inter = setInterval(function () {
            if (second <= 1) {
              clearInterval(inter);
              if (that.data.pw_id){
                wx.redirectTo({
                  url: '../share/share?pw_id=' + that.data.pw_id,
                })
              }else{
                // wx.redirectTo({
                //   url: '../indexs/indexs',
                // })
                wx.redirectTo({
                  url: '../square/square',
                })
              }
            }
            second--;
            console.log(second);
            that.setData({
              second,
              inter
            })
          }, 1000)
        }
      }
    })
  },


  // jumpAd() {
  //   var inter = this.data.inter;
  //   clearInterval(inter);
  //   wx.switchTab({
  //     url: '../indexs/indexs',
  //   })
  // },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      path: '/pages/index/index',
      success: function (res) {
        console.log(res);
        // 转发成功
      },
      fail: function (res) {
        console.log(res);
        // 转发失败
      }
    }
  }
})
