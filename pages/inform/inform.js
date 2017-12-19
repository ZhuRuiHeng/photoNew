const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  data: {
    userInfo: wx.getStorageSync('userInfo'),
    url: 'https://friend-guess.playonwechat.com/assets/images/result/40741d60add2279916d8783b3d6667f9.jpg?1513410944?0.5924372259162527'
  },
  onLoad: function (options) {
      this.setData({
        pw_id: options.pw_id,
        type: options.type,
        name: options.name
      })
  },
  onReady: function () {
  
  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    app.getAuth(function () {
      wx.request({
        url: app.data.apiurl + "photo/comment-detail?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data:{
          pw_id: that.data.pw_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片墙详情:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              info: res.data.data.info,
              comment_list: res.data.data.comment_list
            })
          } else {
            that.setData({
              allList: false
            })
            tips.alert(res.data.msg);
          }
          wx.hideLoading()
        }
      })

    })
  },
  writeTap(){
    wx.navigateTo({
      url: '../comment/comment?pw_id=' + this.data.pw_id
    })
  },
  // 制作照片
  production(e){
      let that = this;
      let type = e.currentTarget.dataset.type;
      if (type=='image'){
          wx.navigateTo({
            url: '../indexs/indexs/',
          })
      }else{
        wx.navigateTo({
          url: '../album/album/',
        })
      }
  },
  // 点赞
  zanTap(e) {
    console.log(e);
    let that = this;
    wx.request({
      url: app.data.apiurl + "photo/thumb?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        type: e.currentTarget.dataset.type,
        object_id: e.currentTarget.dataset.object_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("圈子列表:", res);
        var status = res.data.status;
        if (status == 1) {
          tips.success('点赞成功！')
        } else {
          tips.alert(res.data.msg);
        }

      }
    })
  },

})