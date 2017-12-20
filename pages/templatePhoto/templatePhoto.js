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
    page:1
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
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
      let that = this;
      wx.request({
        url: app.data.apiurl + "photo/template-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data:{
          type:'image'
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
             photoList:res.data.data
           })
          } else {
            tips.alert(res.data.msg);
          }

        }
      })
  },
  navbar(e) {
    console.log('type:',e.currentTarget.dataset.now)
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    wx.request({
      url: app.data.apiurl + "photo/template-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        type: e.currentTarget.dataset.now
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
          wx.navigateTo({
            url: '../templateInform/templateInform?temp_id=' + e.currentTarget.dataset.temp_id + '&pw_id=' + res.data.data
          })
        } else {
          tips.alert(res.data.msg);
        }

      }
    })
      
    
    
      
  },
  pwIndexs(){
    wx.reLaunch({
      url: '../indexs/indexs',
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
  // onReachBottom: function () {
  //   wx.showNavigationBarLoading() //在标题栏中显示加载
  //   console.log("下拉分页")
  //   wx.showToast({
  //     title: '加载中',
  //     icon: 'loading'
  //   })
  //   var that = this;
  //   var oldGoodsList = that.data.main_content;
  //   console.log("oldGoodsList:" + oldGoodsList);
  //   var goodsList = [];
  //   var oldPage = that.data.page;
  //   var reqPage = oldPage + 1;
  //   console.log(that.data.page);
  //   wx.request({
  //     url: app.data.apiurl + "photo/template-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
  //     data: {
  //       page: reqPage,
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: "GET",
  //     success: function (res) {
  //       console.log('新res', res);
  //       var goodsList = res.data.data.goodsList;
  //       if (res.data.data.length == 0) return;
  //       var page = oldPage + 1;
  //       var newContent = oldGoodsList.concat(goodsList);

  //       that.setData({
  //         main_content: newContent,
  //         page: reqPage
  //       });
  //       wx.hideLoading();
  //       if (newContent == undefined) {
  //         wx.showToast({
  //           title: '没有更多模板',
  //           duration: 800
  //         })
  //       }
  //       console.log("newContent:" + that.data.newContent);

  //     },
  //     fail: function () {
  //       // fail
  //     },
  //     complete: function () {
  //       // complete
  //       wx.hideNavigationBarLoading() //完成停止加载
  //       wx.stopPullDownRefresh() //停止下拉刷新
  //     }
  //   });
  // },
})