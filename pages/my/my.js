const app = getApp()
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js'
Page({
  data: {
    music: false,
    num: Math.random(),
    userInfo: wx.getStorageSync('userInfo'),
    now:1,
    show:false
  },
  onLoad: function (options) {
    newName: '朋友照片墙'
  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    // 请求 
    wx.request({
      url: apiurl + "photo/photo-list?sign=" + sign + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("照片墙列表:", res);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            photosList: res.data.data
          })
          wx.hideLoading()
        } else {
          tips.alert(res.data.msg)
        }
      }
    })
    //音乐 请求 
    wx.request({
      url: apiurl + "photo/music-list?sign=" + sign + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("音乐列表:", res);
        var status = res.data.status;
        if (status == 1) {
          console.log('音乐列表：', res.data.data);
          that.setData({
            musicsList: res.data.data
          })
          //wx.hideLoading()
        } else {
          tips.alert(res.data.msg)
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
  // 音乐列表
  musicList: function (e) {
    console.log(e);
    this.setData({
      music: true,
      _pw_id: e.currentTarget.dataset.pw_id,
      index: e.currentTarget.dataset.index
    })
  },
  checkMusic(e) {
    wx.showLoading({
      title: '加载中',
    })
    console.log(e);
    let music_id = e.currentTarget.dataset.music_id;
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: apiurl + "photo/edit-music?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        music_id: music_id,
        pw_id: that.data._pw_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {

        var status = res.data.status;
        if (status == 1) {
          console.log("修改背景:", res);
          that.setData({
            music: false,
            newMusicurl: e.currentTarget.dataset.url,
            newMusicname: e.currentTarget.dataset.name,
            newMusicsinger: e.currentTarget.dataset.singer
          })
          tips.success('修改背景音乐成功！');
          let photosList = that.data.photosList;
          console.log(photosList);
          for (let i = 0; i < photosList.length; i++) {
            photosList[that.data.index].music_info.url = e.currentTarget.dataset.url
            photosList[that.data.index].music_info.name = e.currentTarget.dataset.name
            photosList[that.data.index].music_info.singer = e.currentTarget.dataset.singer
            console.log(that.data.index);
          }
          that.setData({
            photosList
          })
          console.log("new:", that.data.photosList)
          // wx.request({
          //   url: apiurl + "photo/photo-list?sign=" + sign + '&operator_id=' + app.data.kid,
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   method: "GET",
          //   success: function (res) {
          //     console.log("照片墙列表:", res);
          //     var status = res.data.status;
          //     if (status == 1) {
          //       that.setData({
          //         photosList:res.data.data
          //       })
          //     } else {
          //       tips.alert(res.data.msg)
          //     }
          //   }
          // })

        } else {
          tips.alert(res.data.msg);
        }

      }
    })
  },
  cancel() {
    this.setData({
      music: false
    })
  },
  navbar(e){
    this.setData({
       now:e.currentTarget.dataset.now
    })
  },
  // 删除
  dels(e) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    console.log(e.currentTarget.dataset.pw_id);
    let photoIndex = e.currentTarget.dataset.photoIndex;
    let photosList = that.data.photosList;
    // 请求 
    wx.request({
      url: apiurl + "photo/del-photo-wall?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: e.currentTarget.dataset.pw_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("删除照片墙:", res);
        var status = res.data.status;
        if (status == 1) {
          tips.success('照片墙删除成功!');
          photosList.splice(photoIndex, 1)
          that.setData({
            photosList
          })
          console.log("delsnew:", that.data.photosList)
          // 重新其请求
          // wx.request({
          //   url: apiurl + "photo/photo-list?sign=" + sign + '&operator_id=' + app.data.kid,
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   method: "GET",
          //   success: function (res) {
          //     console.log("照片墙列表:", res);
          //     var status = res.data.status;
          //     if (status == 1) {
          //       that.setData({
          //         photosList: res.data.data
          //       })
          //     } else {
          //       tips.alert(res.data.msg)
          //     }
          //   }
          // })
        } else {
          tips.alert(res.data.msg)
        }
        wx.hideLoading()
      }
    })
  },
  seeTap(e) {
    console.log(e)
    let pw_id = e.currentTarget.dataset.pw_id;
    let bgMusic = e.currentTarget.dataset.musicurl;
    console.log('musicUrl:', e.currentTarget.dataset.musicurl)
    app.data.dataUrl = e.currentTarget.dataset.musicurl;
    wx.playBackgroundAudio({ //播放
      dataUrl: e.currentTarget.dataset.musicurl
    })
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.setStorageSync('pw_id', pw_id);
    wx.setStorageSync('bgMusic', e.currentTarget.dataset.musicurl);
    wx.setStorageSync('nameMusic', e.currentTarget.dataset.nameMusic);

    wx.switchTab({
      url: '../indexs/indexs',
    })
  },
  // 新增相册
  newPhotos(e) {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    // 请求 
    wx.request({
      url: apiurl + "photo/create-new-wall?sign=" + sign + '&operator_id=' + app.data.kid,
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("新增照片墙:", res);
        var status = res.data.status;
        if (status == 1) {
          wx.setStorageSync('pw_id', res.data.data);
          wx.switchTab({
            url: '../indexs/indexs',
          })

        } else {

        }
        wx.hideLoading()
      }
    })
  },
  // 新增照片名称
  niceName(e) {
    this.setData({
      newName: e.detail.value
    })
  },

  setName(e) {
    let that = this;
    let sign = wx.getStorageSync('sign');
    let id = e.currentTarget.dataset.pw_id;
    // 请求 
    wx.request({
      url: apiurl + "photo/edit-pname?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: id,
        name: e.detail.value
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("编辑照片墙名称:", res);
        var status = res.data.status;
        if (status == 1) {
          tips.success('编辑成功');

        } else {
          tips.alert(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  }

})
 