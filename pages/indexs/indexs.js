const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js';

Page({
  data: {
    move: true,
    photosLength:true
  },
  onLoad: function (options) {
    this.setData({
      music_play: app.data.music_play,
      dataUrl: app.data.dataUrl
    })

    if (wx.getStorageSync('pw_id')) {
      this.setData({
        pw_id: wx.getStorageSync('pw_id')
      })
    }

  },
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    // console.log(wx.getStorageSync('bgMusic'),1)
    // console.log(app.data.dataUrl,2)
    if (wx.getStorageSync('bgMusic') != app.data.dataUrl) {
      // console.log('bgMusic');
      // console.log('bgMusic:',wx.getStorageSync('bgMusic'));
      app.data.dataUrl = wx.getStorageSync('bgMusic');
      wx.playBackgroundAudio({ //播放
        dataUrl: wx.getStorageSync('bgMusic')
      })
    }
    if (wx.getStorageSync('pw_id')) {
      this.setData({
        pw_id: wx.getStorageSync('pw_id')
      })
    } else if (that.data.pw_id) {
      that.setData({
        pw_id: that.data.pw_id
      })
    } if (!that.data.pw_id) {
      // 获取照片墙pwid 
      wx.request({
        url: apiurl + "photo/pw?sign=" + sign + '&operator_id=' + app.data.kid,
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片墙pwid:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              pw_id: res.data.data
            })

          } else {
            console.log('无照片墙id')
            // that.setData({
            //   pw_id: 0
            // })
          }
          wx.hideLoading()
        }
      })

    }

    app.getAuth(function () {
      let userInfo = wx.getStorageSync('userInfo');
      let sign = wx.getStorageSync('sign');
      setTimeout(function () {
        that.setData({
          move: false, //动态效果
        })
      }, 200)
      // 请求数据
      wx.request({
        url: apiurl + "photo/photo-wall-detail?sign=" + sign + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片墙信息:", res);
          var status = res.data.status;
          if (status == 1) {
            let photos = res.data.data.photos;
            if (res.data.data.music_info){
              console.log('bgMusic:', res.data.data.music_info.url)
              app.data.dataUrl = res.data.data.music_info.url;
              wx.playBackgroundAudio({ //播放
                dataUrl: res.data.data.music_info.url
              })
            }
            let datas = [];
            for (let i = 0; i < 27; i++) {
              if (photos[i]) {
                datas.push(photos[i]);
              } else {
                datas.push({ 'photo_url': 'https://gcdn.playonwechat.com/photo/bg.jpg', 'position': i + 1 })
              }
            }

            that.setData({
             photos: datas,
             self: res.data.data.self,
              photosLength: true
            })
            // console.log(that.data.photos);

          } else {
            that.setData({
              photosLength: false
            })
            //tips.alert(res.data.msg);
          }
          wx.hideLoading()
        }
      })

    })
  },
  friends() {
    wx.showToast({
      title: '海报生成中...',
      icon: 'loading'
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: apiurl + "photo/share?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: that.data.pw_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("好友拼图照片:", res);
        console.log("海报:", res.data.data);
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            friendsImg: res.data.data
          })
          let friendsImg = res.data.data;
          let friendsImgs = friendsImg.split();
          console.log(friendsImg)
          console.log(friendsImgs)
          wx.previewImage({
            current: friendsImg, // 当前显示图片的http链接
            urls: friendsImgs // 需要预览的图片http链接列表
          })

        } else {
          console.log(res.data.msg);
        }
        wx.hideLoading()
      }
    })
  },
  //事件处理函数
  prewImg: function (e) {
    let that = this;
    let picture = e.currentTarget.dataset.picture;
    let pictures = picture.split();
    if (picture == 'https://gcdn.playonwechat.com/photo/bg.jpg') {
      console.log('no')
    } else {
      wx.previewImage({
        current: picture, // 当前显示图片的http链接
        urls: pictures // 需要预览的图片http链接列表
      })
    }
  },
  bindPlay: function () {
    var that = this;
    let music_play = app.data.music_play;
    console.log('music_play:', music_play);
    if (music_play == true) {
      wx.pauseBackgroundAudio();//暂停
      app.data.music_play = false;
      that.setData({
        music_play: false
      })
    } else {
      wx.playBackgroundAudio({ //播放
        dataUrl: app.data.dataUrl
      })
      app.data.music_play = true;
      that.setData({
        music_play: true
      })
    }
  },
  management() {
    wx.navigateTo({
      url: '../setting/setting?pw_id=' + this.data.pw_id
    })
  },
  upPhoto() {
    wx.getBackgroundAudioPlayerState({
      success: function (res) {
        console.log(res)
        var status = res.status
        var dataUrl = res.dataUrl
        var currentPosition = res.currentPosition
        var duration = res.duration
        var downloadPercent = res.downloadPercent;
      }
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    let photos = that.data.photos;
    let arr = [];//当前上传的位置
    if (that.data.photosLength == false) {
      that.setData({
        position: 1
      })
      wx.setStorageSync('position', 1);
      
    } else { //未拼完
      console.log('未拼完11111');
      for (let i = 0; i < photos.length; i++) {
        if (photos[i].photo_url == 'https://gcdn.playonwechat.com/photo/bg.jpg') {
          arr.push(photos[i].position);
          //console.log('position:', photos[i].position)
          wx.setStorageSync('position', arr[0]);
          that.setData({
            position: arr[0]
          })
        }
      }
    }
    wx.setStorageSync('photosLength', that.data.photosLength)
    wx.setStorageSync('pw_id', that.data.pw_id)
    //console.log('arr:',arr);
    wx.showLoading({
      title: '加载中'
    });
    // 上传 
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("选择相册", res);
        const src = res.tempFilePaths[0]
        console.log('src', src);

        wx.redirectTo({
          url: `../avatarUpload/upload/upload?src=${src}&options=that.data.options&position=that.data.position`
        })
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        tips.loading('上传中');
        tips.loaded(); //消失
        that.setData({
          dialog: true
        })
        console.log(apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid);

      }
    })
    wx.hideLoading()
  },

  // 生成图片墙
  produce() {
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.request({
      url: apiurl + "photo/create-image?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: that.data.pw_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: "GET",
      success: function (res) {
        console.log("生成图片墙:", res);
        var status = res.data.status;
        if (status == 1) {
          console.log('poster:', res.data.data);
          let poster = res.data.data;
          let posters = poster.split();
          wx.previewImage({
            current: poster, // 当前显示图片的http链接
            urls: posters // 需要预览的图片http链接列表
          })
          wx.hideLoading()
        } else {
          tips.alert(res.data.msg);
        }

      }
    })
  }

})