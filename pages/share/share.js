const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js';

Page({
  data: {
    move: true,
    music_play:true
  },
  onLoad: function (options) {
    let pw_id = options.pw_id;
    console.log('pw_id:',wx.getSystemInfo('pw_id'));
    console.log("indxsoptions:", options);
    if (pw_id) {
      this.setData({
        pw_id: pw_id
      })
    }
  },
  onShow: function () {
    console.log('onshow');
    let that = this;
    let music_play = app.data.music_play;
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      music_play: music_play
    })
    that.setData({
        pw_id: that.data.pw_id
    })
    app.getAuth(function () {
      let userInfo = wx.getStorageSync('userInfo');
      let sign = wx.getStorageSync('sign');
      
      
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
            let self = res.data.data.self;
            if (self == true) {
              wx.switchTab({
                url: '../indexs/indexs'
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
              photos: datas
            })
            // console.log(that.data.photos);
            wx.hideLoading()
          } else {
            tips.alert(res.data.msg);
            setTimeout(function(){
                if (res.data.msg == '照片墙不存在') {
                  wx.switchTab({
                    url: '../indexs/indexs'
                  })
                }
            },1000)
            
          }
        }
      })
      setTimeout(function () {
        that.setData({
          move: false, //动态效果
        })
      }, 200)
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
  upPhoto() {
  let that = this;
    let sign = wx.getStorageSync('sign');
    let photos = that.data.photos;
    let length = photos.length;
    let arr = [];//当前上传的位置
    // 背景音乐
    console.log("length:", length);
    if (length = 27) {  //不足27张，已拼完有删除掉的
      for (let i = 0; i < length; i++) {
        //console.log(photos[i].photo_url);
        if (photos[i].photo_url == 'https://gcdn.playonwechat.com/photo/bg.jpg') {
          arr.push(photos[i].position);
          //console.log('position:', photos[i].position);
          wx.setStorageSync('position', arr[0]);
          that.setData({
            position: arr[0]
          })
        }
      }
    } else { //未拼完
      console.log('未拼完');
      for (let i = 0; i < length; i++) {
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
        var src = res.tempFilePaths;
        console.log('src', src)
        wx.redirectTo({
          url: `../avatarUpload/upload1/upload1?src=${src}`
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
  mySelf() {
    let that = this;
    wx.removeStorage({
      key: 'pw_id',
      success: function (res) {
        console.log('移除成功pw_id：',res.data)
        console.log('mySelf');
        wx.switchTab({
          url: '../indexs/indexs',
        })
      }
    })
    
    
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
