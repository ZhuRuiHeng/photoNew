const app = getApp()
import tips from '../../utils/tips.js'
const apiurl = 'https://friend-guess.playonwechat.com/';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    now:'image',
    show:false,
    page:1,
    // navList:[
    //   { cate_id: "5", cate_name: "简约" },
    //   { cate_id: "6", cate_name: "圣诞节" },
    //   { cate_id: "7", cate_name: "圣诞节" },
    //   { cate_id: "8", cate_name: "圣诞节" },
    //   { cate_id: "9", cate_name: "圣诞节" },
    //   { cate_id: "10", cate_name: "圣诞节" },
    //   { cate_id: "11", cate_name: "圣诞节" },
    //   { cate_id: "12", cate_name: "圣诞节" },
    //   { cate_id: "13", cate_name: "圣诞节" }
    // ]
  },
  onShow: function () {
    wx.setStorageSync('music_play',true); 
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    app.getAuth(function () {
      wx.request({
        url: app.data.apiurl2 + "photo/template-category?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data:{
          type:'image'
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("分类:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              navList: res.data.data,
              cate_id: res.data.data[0].cate_id
            })
            // 默认第一个
            wx.request({
              url: app.data.apiurl2 + "photo/template-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
              data: {
                type: 'image',
                cate_id: that.data.navList[0].cate_id
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("模板:", res);
                var status = res.data.status;
                if (status == 1) {
                  that.setData({
                    photoList: res.data.data
                  })
                } else {
                  tips.alert(res.data.msg);
                }
              }
            })
          } else {
            tips.alert(res.data.msg);
          }
        }
      })
    })
  },
  navbar(e) {
    console.log('type:',e.currentTarget.dataset.now)
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    that.setData({
      cate_id: e.currentTarget.dataset.cate_id
    })
    wx.request({
      url: app.data.apiurl2 + "photo/template-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        type: e.currentTarget.dataset.now,
        cate_id: e.currentTarget.dataset.cate_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("模板:", res);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            photoList: res.data.data
          })
        } else {
          tips.alert(res.data.msg);
          that.setData({
            photoList: false
          })
        }
      }
    })
  },
  templateInform(e){
    console.log(e);
    let that = this;
    wx.request({
      url: apiurl + "photo/create-new-wall?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        name: '朋友照片墙',
        temp_id: e.currentTarget.dataset.temp_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("新建相册:", res);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            show:false
          })
          wx.navigateTo({
            url: '../templateInform/templateInform?temp_id=' + e.currentTarget.dataset.temp_id + '&pw_id=' + res.data.data
          })
        } else {
          tips.alert(res.data.msg);
        }

      }
    })
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
  //设置分享
  onShareAppMessage: function (e) {
    console.log(e);
    let that = this;
    return {
      title: '快来制作我们的照片墙吧！',
      path: '/pages/templatePhoto/templatePhoto',
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