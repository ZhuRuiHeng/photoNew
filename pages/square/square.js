const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    url:'https://friend-guess.playonwechat.com/assets/images/result/40741d60add2279916d8783b3d6667f9.jpg?1513410944?0.5924372259162527',
    page:1
  },
  onLoad: function (options) {
  
  },
  onShow: function () {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    app.getAuth(function () {
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
                that.setData({
                  allList: res.data.data
                })
              } else {
                wx.reLaunch({
                  url: '../templatePhoto/templatePhoto' 
                })
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
    //console.log(e);
      wx.navigateTo({
        url: '../inform/inform?pw_id=' + e.currentTarget.dataset.pw_id + '&type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.name + '&temp_id=' + e.currentTarget.dataset.temp_id,
      })
  },
  // 详情
  informSquare(e){
    //console.log(e);
    let form_id = e.detail.formId;
    let that = this;
    wx.navigateTo({
      url: '../inform/inform?pw_id=' + e.currentTarget.dataset.pw_id + '&type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.name + '&temp_id=' + e.currentTarget.dataset.temp_id + '&form_id=' + form_id,
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
        path: '/pages/inform/inform?pw_id=' + e.target.dataset.pw_id + '&type=' + e.target.dataset.type + '&name=' + e.target.dataset.name + '&temp_id=' + e.target.dataset.temp_id,
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
  // 下拉分页
  onReachBottom: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    console.log("下拉分页")
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    var that = this;
    var oldGoodsList = that.data.allList;
    console.log("oldGoodsList:" + oldGoodsList);
    var allList = [];
    var oldPage = that.data.page;
    var reqPage = oldPage + 1;
    console.log(that.data.page);
    wx.request({
      url: app.data.apiurl + "photo/photo-circle?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        page: reqPage,
        limit: 10
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log('新res', res);
        var allList = res.data.data;
        if (res.data.msg==0){
          tips.alert('没有更多数据了')
        }
        if (res.data.data.length == 0 ) 
        tips.alert('没有更多数据了')
        var page = oldPage + 1;
        var newContent = oldGoodsList.concat(allList);

        that.setData({
          allList: newContent,
          page: reqPage
        });
        wx.hideLoading();
        if (newContent == undefined) {
          wx.showToast({
            title: '没有更多数据',
            duration: 800
          })
        }
        console.log("newContent:" + that.data.newContent);

      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh() //停止下拉刷新
      }
    });
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