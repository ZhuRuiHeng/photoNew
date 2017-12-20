const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    url:'https://friend-guess.playonwechat.com/assets/images/result/40741d60add2279916d8783b3d6667f9.jpg?1513410944?0.5924372259162527'
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    console.log(app.data.apiurl + "photo/photo-circle?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid)
    
    
      wx.request({
        url: app.data.apiurl + "photo/photo-circle?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("圈子列表:", res);
          var status = res.data.status;
          if (status == 1) {
            // if (wx.getStorageSync('allList')) {
            //   that.setData({
            //     allList: wx.getStorageSync('allList')
            //   })
            // }
            that.setData({
              allList: res.data.data
            })
          } else {
            wx.reLaunch({
              url: '../indexs/indexs',
            })
            that.setData({
              allList: false
            })
            tips.alert(res.data.msg);
          }
          wx.hideLoading()
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
  // 评论
  pinglunTap(e){
    console.log(e);
      wx.navigateTo({
        url: '../inform/inform?pw_id=' + e.currentTarget.dataset.pw_id + '&type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.name
      })
  },
  // 详情
  informSquare(e){
    let that = this;
    wx.navigateTo({
      url: '../inform/inform?pw_id=' + e.currentTarget.dataset.pw_id + '&type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.name
    })
  },
  // 点赞
  zanTap(e){
    let that = this;
    let zanIndex = e.currentTarget.dataset.index;
    let allList = that.data.allList;
    wx.request({
      url: app.data.apiurl + "photo/thumb?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data:{
        type: e.currentTarget.dataset.type,
        object_id: e.currentTarget.dataset.object_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("点赞:", res);
        var status = res.data.status;
        if (status == 1) {
          for (let i = 0; i < allList.length;i++){
            if (i == zanIndex){
              let thumb_count = parseInt(allList[zanIndex].thumb_count);
              //console.log(typeof (thumb_count));
              allList[zanIndex].thumb_count = thumb_count + 1
            }
          }
          that.setData({
            allList
          })
          tips.success('点赞成功！')
        } else {
          tips.alert(res.data.msg);
        }
        
      }
    })
  },
  share(e){
    this.setData({
      shareId: e.currentTarget.dataset.pw_id
    })
  },
    //设置分享
  onShareAppMessage: function (e) {
    console.log(e);
    var that = this;
      return {
        title: '朋友照片墙',
        imageUrl: e.target.dataset.thumb,
        path: '/pages/inform/inform?pw_id=' + e.target.dataset.pw_id + '&type=' + e.target.dataset.type + '&name=' + e.target.dataset.name,
        success: function (res) {
          console.log(res);
          // 转发成功
        },
        fail: function (res) {
          console.log(res);
          // 转发失败
        }
      }
  },
  shanchu(e){
    console.log(e);
      let that = this;
      let allList = that.data.allList;
      let pw_id = e.currentTarget.dataset.pw_id;
      let photoIndex = e.currentTarget.dataset.index;
      for (let i = 0; i < allList.length;i++){
        if (pw_id == allList[i].pw_id){
          allList.splice(photoIndex, 1);
          wx.setStorageSync('allList', allList);
          that.setData({
            allList
          })
        }
      }
  }
})