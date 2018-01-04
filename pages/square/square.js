const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    userInfo: wx.getStorageSync('userInfo'),
    url:'https://friend-guess.playonwechat.com/assets/images/result/40741d60add2279916d8783b3d6667f9.jpg?1513410944?0.5924372259162527',
    page:1,
    type:'new',
    activity:false,
    rules:false,
    oldWiner:false,
    music_play: wx.getStorageSync('music_play'),
    dataUrl: ''
  },
  onLoad: function (options) {
    //wx.removeStorageSync('activity')
  },
  onShow: function () {
    console.log(wx.getStorageSync('activity'));
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    that.setData({
      show: false,
      type: 'new'
    })
    if (that.data.type =='activity'){
       allList: false
    }
    app.getAuth(function () {
        wx.request({
            url: app.data.apiurl2 + "photo/photo-circle?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
            data:{
              type: 'new'
            },
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
                // wx.reLaunch({
                //   url: '../templatePhoto/templatePhoto' 
                // })
                that.setData({
                  allList: false
                })
                tips.alert(res.data.msg);
              }
              wx.hideLoading()
            }
        })
        // music
        wx.request({
          url: app.data.apiurl3 + "photo/get-music?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("music:", res);
            var status = res.data.status;
            if (status == 1) {
              app.data.dataUrl = res.data.data.url;
              if (wx.getStorageSync("music_play")==false){
                  that.setData({
                    music_play:false
                  })
              }else{
                wx.playBackgroundAudio({ //播放音乐
                  dataUrl: res.data.data.url
                })
              }
              wx.setStorageSync('dataUrl', res.data.data.url);
              that.setData({
                dataUrl: res.data.data.url
              })
            } else {
              console.log(res.data.msg);
            }
            wx.hideLoading()
          }
        })
        // 活动规则
        wx.request({
          url: app.data.apiurl2 + "photo/activity-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("活动信息:", res);
            var status = res.data.status;
            if (status == 1) {
              function toDate(number) {
                var n = number * 1000;
                var date = new Date(n);
                console.log("date", date)
                var y = date.getFullYear();
                var m = date.getMonth() + 1;
                m = m < 10 ? ('0' + m) : m;
                var d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                var h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                var minute = date.getMinutes();
                var second = date.getSeconds();
                minute = minute < 10 ? ('0' + minute) : minute;
                second = second < 10 ? ('0' + second) : second;
                //return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
                return y + '.' + m + '.' + d;
              }
              that.setData({
                oldWiner:false,
                WinerInform: false,
                winnerOpen: false,
                activeInform: res.data.data,
                start_time: toDate(res.data.data.start_time),
                end_time: toDate(res.data.data.end_time),
              })

              if (wx.getStorageSync('activity') == true) {
                  console.log(111);
                  that.setData({
                    activity: false,
                    rules: true
                  })
              } else {
                console.log(222);
                wx.setStorageSync('activity', true)
                that.setData({
                  activity: true,
                  rules: true
                })
                if (that.data.activeInform.rules) {
                  WxParse.wxParse('newrules', 'html', that.data.activeInform.rules, that, 5)
                }
              }
            }else {
              //tips.alert(res.data.msg);
              that.setData({
                activity:false
              })
              // 存缓存
              wx.setStorageSync('activity', true)
              //往期开奖
              wx.request({
                url: app.data.apiurl2 + "photo/last-activity-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  console.log("往期开奖:", res);
                  var status = res.data.status;
                  if (status == 1) {
                    that.setData({
                      oldWiner: true,
                      WinerInform: res.data.data.activity_info,
                      winnerOpen: res.data.data.winner,
                    })
                  } else {
                    //tips.alert(res.data.msg);
                  }
                  wx.hideLoading()
                }
              })
            }
            wx.hideLoading()
          }
        })
    })
  },
  bindPlay(){
    var that = this;
    let music_play = that.data.music_play;
    if(music_play == true) {
      console.log('music1');
      wx.pauseBackgroundAudio();//暂停
      app.data.music_play = false;
      wx.setStorageSync('music_play', false)
      that.setData({
        music_play: false
      })
    } else {
      console.log('music2');
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
  newList(e){
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    console.log("activity:", wx.getStorageSync('activity'));
    that.setData({
      type: e.currentTarget.dataset.type,
      page: 1
    })
    // if (e.currentTarget.dataset.type == 'activity' ){
    //   console.log("activity:", wx.getStorageSync('activity'))
    //   console.log(wx.getStorageSync('activity'));
    //   if (wx.getStorageSync('activity')==true){
    //     console.log(111);
    //     that.setData({
    //       activity: false,
    //       rules: true
    //     })
    //   }else{
    //     console.log(222);
    //     wx.setStorageSync('activity', true)
    //     that.setData({
    //       activity: true,
    //       rules: true
    //     })
    //     if (that.data.activeInform.rules) {
    //       WxParse.wxParse('newrules', 'html', that.data.activeInform.rules, that, 5)
    //     }
    //   }
    // }else{
    //   that.setData({
    //     activity: false,
    //     rules: false
    //   })
    // }
    // list
    wx.request({
      url: app.data.apiurl2 + "photo/photo-circle?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data:{
        type:e.currentTarget.dataset.type
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("圈子列表:", res);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            allList: res.data.data,
            type: e.currentTarget.dataset.type
          })
        } else {
          // wx.reLaunch({
          //   url: '../templatePhoto/templatePhoto'
          // })
          that.setData({
            allList: false
          })
          tips.alert(res.data.msg);
        }
        wx.hideLoading()
      }
    })
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
    wx.request({
      url: app.data.apiurl1 + "api/save-form?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        form_id: form_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
      }
    })
    wx.navigateTo({
      url: '../inform/inform?pw_id=' + e.currentTarget.dataset.pw_id + '&type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.name + '&temp_id=' + e.currentTarget.dataset.temp_id,
    })
  },
  informSquare1(e){
    wx.navigateTo({
      url: '../inform/inform?pw_id=' + e.currentTarget.dataset.pw_id + '&type=' + e.currentTarget.dataset.type + '&name=' + e.currentTarget.dataset.name + '&temp_id=' + e.currentTarget.dataset.temp_id,
    })
  },
  // 点赞
  zanTap(e){
    let that = this;
    let zanIndex = e.currentTarget.dataset.index;
    let allList = that.data.allList;
    wx.request({
      url: app.data.apiurl2 + "photo/thumb?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
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
          if (res.data.data.flag==true){
            for (let i = 0; i < allList.length; i++) {
              if (i == zanIndex) {
                let thumb_count = parseInt(allList[zanIndex].thumb_count);
                //console.log(typeof (thumb_count));
                allList[zanIndex].thumb_count = thumb_count + 1
              }
            }
            tips.success('点赞成功！')
          }else{
              tips.alert('点过赞了哦！')
          }
          that.setData({
            allList
          })
          
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
  // 关闭弹窗
  activeClose(){
    this.setData({
      activity:false
    })
  },
  // 参与活动
  activeIn(e){
      this.setData({
        activity: false
      })
      wx.switchTab({
        url: '../templatePhoto/templatePhoto'
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
      url: app.data.apiurl2 + "photo/photo-circle?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
      data: {
        page: reqPage,
        limit: 20,
        type: that.data.type
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
  // 往期开奖
  oldWiner1(){
    wx.navigateTo({
      url: '../oldWiner/oldWiner'
    })
  },
  // 规则
  newRules1(e){
      wx.navigateTo({
        url: '../rules/rules'
      })
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