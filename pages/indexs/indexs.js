const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
let sign = wx.getStorageSync('sign');
import tips from '../../utils/tips.js';
Page({
  data: {
    move: true,
    photosLength:true,
    music_play:true,
    itemBar:1,
    show: false,
    finish:false,
    checkboxs: 1 //0不展示  1展示
  },
  onLoad: function (options) {
    this.setData({
      //music_play: app.data.music_play,
      dataUrl: app.data.dataUrl
    })
    if (options.pw_id) {
      this.setData({
        pw_id: wx.getStorageSync('pw_id')
      })
    }else if (wx.getStorageSync('pw_id')) {
      this.setData({
        pw_id: wx.getStorageSync('pw_id')
      })
    }

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
  onShow: function () {
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    console.log(wx.getStorageSync('bgMusic'), app.data.dataUrl, 111)
    if (wx.getStorageSync('bgMusic') == app.data.dataUrl) {
    }else{
      console.log('bgMusic:', wx.getStorageSync('bgMusic'), app.data.dataUrl, 333);
      app.data.dataUrl = wx.getStorageSync('bgMusic');
      wx.playBackgroundAudio({ //播放
        dataUrl: wx.getStorageSync('bgMusic'),
        title: wx.getStorageSync('nameMusic'),
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
    } 
    

    app.getAuth(function () {
      let userInfo = wx.getStorageSync('userInfo');
      let sign = wx.getStorageSync('sign');
      setTimeout(function () {
        that.setData({
          move: false, //动态效果
        })
      }, 200)
      // 如果没有pw_id
      if (!that.data.pw_id) {
        // 获取照片墙pwid 
        wx.request({
          url: app.data.apiurl + "photo/pw?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
          data: {
            type: 'image'
          },
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
              console.log('bgMusicnew:', res.data.data.music_info.url);
              console.log(wx.getStorageSync('bgMusic'), res.data.data.music_info.url,'比较')
              console.log(wx.getStorageSync('bgMusic') == res.data.data.music_info.url,'是否相同')
              if (!wx.getStorageSync('bgMusic')){
                console.log('没有缓存音乐')
                wx.setStorageSync('bgMusic', res.data.data.music_info.url);
                app.data.dataUrl = res.data.data.music_info.url;
                wx.playBackgroundAudio({ //播放
                  dataUrl: res.data.data.music_info.url,
                  title: res.data.data.music_info.name,
                })
                that.setData({
                  music_play: true
                })
              }
              if (wx.getStorageSync('bgMusic') == res.data.data.music_info.url) {
                console.log('缓存音乐与当前音乐相同')
                // wx.pauseBackgroundAudio()
                // wx.playBackgroundAudio({ //播放
                //   dataUrl: wx.getStorageSync('bgMusic')
                // })
              }else{
                console.log(wx.getStorageSync('bgMusic'), res.data.data.music_info.url, 222)
                app.data.dataUrl = res.data.data.music_info.url;
                wx.playBackgroundAudio({ //播放
                  dataUrl: res.data.data.music_info.url
                })
                that.setData({
                  music_play: true
                })
              }
             
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
      // 判断照片墙是否已满
      wx.request({
        url: app.data.apiurl + "photo/is-full?sign=" + sign + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片墙是否已满:", res);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              finish: res.data.data.flag
            })
          } else {
            console.log(res.data.msg);
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
  // 是否同意展示
  Change: function (e) {
    console.log(e);
    let that = this;
    console.log('checkbox发生change事件，携带value值为：', e.currentTarget.dataset.check);
    if (e.currentTarget.dataset.check==1){
      that.setData({
        checkboxs: 1
      })
    }else{
      that.setData({
        checkboxs: 0
      })
    }
    
    // wx.request({
    //   url: apiurl + "photo/share?sign=" + sign + '&operator_id=' + app.data.kid,
    //   data: {
    //     pw_id: that.data.pw_id
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "GET",
    //   success: function (res) {
    //     console.log("好友拼图照片:", res);
    //     console.log("海报:", res.data.data);
    //     var status = res.data.status;
    //     if (status == 1) {
    //       that.setData({
    //         friendsImg: res.data.data
    //       })
    //       let friendsImg = res.data.data;
    //       let friendsImgs = friendsImg.split();
    //       console.log(friendsImg)
    //       console.log(friendsImgs)
    //       wx.previewImage({
    //         current: friendsImg, // 当前显示图片的http链接
    //         urls: friendsImgs // 需要预览的图片http链接列表
    //       })

    //     } else {
    //       console.log(res.data.msg);
    //     }
    //     wx.hideLoading()
    //   }
    // })
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
      url: app.data.apiurl + "photo/create-image?sign=" + sign + '&operator_id=' + app.data.kid,
      data: {
        pw_id: that.data.pw_id,
        is_show:that.data.checkboxs //0不展示  1展示
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