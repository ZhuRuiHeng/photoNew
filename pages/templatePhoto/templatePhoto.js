const app = getApp()
import tips from '../../utils/tips.js'
const apiurl = 'https://friend-guess.playonwechat.com/';
Page({
  data: {
    now:'image',
    show:false,
    page:1,
    dataUrl: wx.getStorageSync('dataUrl'),
    music_play:app.data.music_play,
    TemplateList:[
      {
        icon:'../img/1.png',
        title:'最新',
        bg:'#ff7ea2',
        cate_id:'22',
        width: '58rpx',
        type: 'image'
      }, {
        icon: '../img/2.png',
        title: '节日活动',
        bg: '#578ffe',
        cate_id: '13',
        width: '70rpx',
        type: 'image'
      }, {
        icon: '../img/3.png',
        title: '头像',
        bg: '#fcadb2',
        cate_id: '23',
        width: '60rpx',
        type: 'image'
      }, {
        icon: '../img/4.png',
        title: '拼图',
        bg: '#ffbf43',
        cate_id: '15',
        width: '56rpx',
        type: 'image'
      }, {
        icon: '../img/5.png',
        title: '素材库',
        bg: '#80d9eb',
        cate_id: '24',
        width: '62rpx',
        type: 'image'
      }, {
        icon: '../img/6.png',
        title: '视频',
        bg: '#8c9ffd',
        cate_id: '25',
        width: '60rpx',
        type: 'video'
      }
    ],
    nowTitle:'最新',
    nowImage: 0,
    type:'image'
  },
  onShow: function () {
    console.log('music_play:',app.data.music_play);
    console.log('music_play:', wx.getStorageSync('music_play'))
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
              cate_id: res.data.data[0].cate_id,
              music_play: wx.getStorageSync('music_play')
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
  bindPlay() {
    var that = this;
    let music_play = that.data.music_play;
    if (music_play == true) {
      console.log(1);
      wx.pauseBackgroundAudio();//暂停
      app.data.music_play = false;
      wx.setStorageSync('music_play', false)
      that.setData({
        music_play: false
      })
    } else {
      console.log(2);
      wx.playBackgroundAudio({ //播放
        dataUrl: app.data.dataUrl
      })
      app.data.music_play = true;
      wx.setStorageSync('music_play', true)
      that.setData({
        music_play: true
      })
    }
  },
  navbar(e) {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    let index = e.currentTarget.dataset.index;
    let TemplateList = that.data.TemplateList;
    for (let i = 0; i < TemplateList.length;i++){
      if (index == i){
        that.setData({
          nowTitle: TemplateList[i].title,
          nowImage: index
        })
      }
      
    }
    console.log("index:", index);
    that.setData({
      cate_id: e.currentTarget.dataset.cate_id,
      type: e.currentTarget.dataset.type
    })
    wx.request({
      url: app.data.apiurl2 + "photo/template-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        type: e.currentTarget.dataset.type,
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
        temp_id: e.currentTarget.dataset.temp_id,
        type: that.data.type
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
          if (that.data.type=='image'){
            wx.navigateTo({
              url: '../templateInform/templateInform?temp_id=' + e.currentTarget.dataset.temp_id + '&pw_id=' + res.data.data
            })
          } else if (that.data.type == 'h5'){
            wx.navigateTo({
              url: '../albumInform/albumInform?temp_id=' + e.currentTarget.dataset.temp_id + '&pw_id=' + res.data.data
            })
          }
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