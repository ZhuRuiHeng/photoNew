const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        img: 'https://gcdn.playonwechat.com/photo/o_1c10c739b1pqu13g0bmu4lj12ua81.jpg',
        checked:true
      },
      {
        img: 'https://gcdn.playonwechat.com/photo/o_1c05pta846ov1iskptg16kv1ccq.jpg',
        checked: false
      },
      {
        img: 'https://gcdn.playonwechat.com/photo/nice1.jpg',
        checked: false
      }
    ],
    show:false,
    checkboxs: true,
    now: 'h5'
  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    wx.request({
      url: app.data.apiurl2 + "photo/template-category?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        type: 'h5'
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
              type: 'h5',
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
  },
  navbar(e) {
    console.log('type:', e.currentTarget.dataset.now)
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
  albumInform(e){
      console.log(e);
      let that = this;
      let checked = e.currentTarget.dataset.checked;
      let index = e.currentTarget.dataset.index;
      let temp_id = e.currentTarget.dataset.temp_id;
      let imgUrls = that.data.imgUrls;
      wx.request({
        url: apiurl + "photo/create-new-wall?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          name: '圣诞节祝福卡',
          temp_id: temp_id,
          type: 'h5'
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("创建相册:", res);
          var status = res.data.status;
          if (status == 1) {
            wx.navigateTo({
              url: '../albumInform/albumInform?pw_id=' + res.data.data + '&temp_id=' + temp_id
            })
          } else {
            tips.alert(res.data.msg);
          }
        }
      })
      that.setData({
        imgUrls
      })
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
  },
  //设置分享
  onShareAppMessage: function (e) {
    console.log(e);
    let that = this;
    return {
      title: '快来制作你的照片集吧！',
      path: '/pages/album/album',
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