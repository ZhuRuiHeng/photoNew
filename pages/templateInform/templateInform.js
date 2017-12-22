const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show:false, 
      checkboxs: 1, //0不展示  1展示
      finish:false, //是否拼完
      num: Math.random(),
      music_play: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    let that = this;
    that.setData({
      temp_id: options.temp_id,
      pw_id: options.pw_id
    })
    wx.setStorageSync('temp_id', options.temp_id)
    console.log(wx.getStorageSync('temp_id'));
    
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
    // if (wx.getStorageSync('temp_id')){
    //     that.setData({
    //       temp_id: wx.getStorageSync('temp_id')
    //     })
    // }
        wx.request({
          url: app.data.apiurl + "photo/template-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
          data:{
            temp_id: that.data.temp_id
          },
          header: {
            'content-type': 'application/json'
          },
          method: "GET",
          success: function (res) {
            console.log("模板详情:", res);
            var status = res.data.status;
            console.log(JSON.parse(res.data.status));
            
            if (status == 1) {
              that.setData({
                photoInform: res.data.data,
                source_effect: res.data.data.source_effect
              })
              
            } else {
              //tips.alert(res.data.msg);
            }
          },
          
        })
        //照片墙信息temp_id
        wx.request({
          url: app.data.apiurl + "photo/photo-wall-detail?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
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
              that.setData({
                thumb: res.data.data.pic +'?'+ that.data.num,
                temp_id: res.data.data.temp_id
              })
              if (!wx.getStorageSync('bgMusic')) {
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
              } else {
                console.log(wx.getStorageSync('bgMusic'), res.data.data.music_info.url, 222)
                app.data.dataUrl = res.data.data.music_info.url;
                wx.playBackgroundAudio({ //播放
                  dataUrl: res.data.data.music_info.url
                })
                that.setData({
                  music_play: true
                })
              }
              wx.request({
                url: app.data.apiurl + "photo/template-info?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
                data: {
                  temp_id: that.data.temp_id
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  console.log("模板详情:", res);
                  var status = res.data.status;
                  console.log(JSON.parse(res.data.status));

                  if (status == 1) {
                    that.setData({
                      photoInform: res.data.data,
                      source_effect: res.data.data.source_effect
                    })

                  } else {
                    //tips.alert(res.data.msg);
                  }
                },

              })
            } else {
              console.log(res.data.msg);
            }
            wx.hideLoading()
          }
        })
        // 判断照片墙是否已满
        wx.request({
            url: app.data.apiurl + "photo/is-full?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
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
  },
  management() {
    wx.navigateTo({
      url: '../setting/setting?pw_id=' + this.data.pw_id
    })
  },
  // 导航跳转
  navUrl(e) {
    // console.log(e);
    // console.log(e.currentTarget.dataset.itembar);
    if (e.currentTarget.dataset.itembar == 2) {
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
      wx.reLaunch({
        url: e.currentTarget.dataset.url,
      })
    }
  },
  // 分享好友
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
        console.log("海报:", res.data);
        var status = res.data.status;
        // if (status == 1) {
          that.setData({
            friendsImg: res.data
          })
          let friendsImg = res.data.data;
          console.log("friendsImg:", res.data.data);
          let friendsImgs = friendsImg.split();
          console.log(friendsImg)
          console.log(friendsImgs)
          wx.previewImage({
            current: friendsImg, // 当前显示图片的http链接
            urls: friendsImgs // 需要预览的图片http链接列表
          })

        // } else {
        //   console.log(res.data.msg);
        // }
        wx.hideLoading()
      }
    })
  },
  // 音乐
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
  // 是否同意展示
  Change: function (e) {
    console.log(e);
    let that = this;
    console.log('checkbox发生change事件，携带value值为：', e.currentTarget.dataset.check);
    if (e.currentTarget.dataset.check == 1) {
      that.setData({
        checkboxs: 1
      })
    } else {
      that.setData({
        checkboxs: 0
      })
    }
  },
  // 传过来可以上传几张照片
  upPhoto: function (e) {
    
    let that = this;
    console.log(e, that.data.temp_id);
    let sign = wx.getStorageSync('sign');
    // wx.showToast({
    //   title: '此模板可以上传' + that.data.photoInform.counts.length+'张照片',
    //   mask: true,
    //   duration: 3000
    // })
    if (that.data.temp_id==1){
      wx.showLoading({
        title: '加载中'
      });
      // 请求位置
      wx.request({
        url: app.data.apiurl + "photo/can-up-position-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片可上传位置:", res);
          console.log(res.data.data, 111);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              position: res.data.data[0]
            })
            let position = res.data.data[0];
            let source_effect = that.data.source_effect;
            console.log(position);
            console.log(source_effect);
            var arr = []
            for (var i in source_effect) {
              arr.push(source_effect[i]); //属性
              //arr.push(object[i]); //值
            }
            // for (let i = 0; i < arr.length; i++) {
            let weizhi = source_effect[position][0];
            console.log('weizhi', weizhi);
            weizhi.split('x');
            let shuju = weizhi.split('x');
            console.log('shuju:', shuju);
            that.setData({
              width: shuju[0],
              height: shuju[1]
            })
            wx.setStorageSync('weizhi', weizhi);
            wx.setStorageSync('width', shuju[0]);
            wx.setStorageSync('height', shuju[1]);
            wx.setStorageSync('position', position);
            // }
            // that

            // 占位置给后台start - up - picture
            wx.request({
              url: app.data.apiurl + "photo/start-up-picture?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
              data: {
                pw_id: that.data.pw_id,
                position: that.data.position
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("位置后台:", res);
                var status = res.data.status;
                if (status == 1) {
                  console.log('传递成功')
                } else {
                  console.log(res.data.msg);
                }
                wx.hideLoading()
              }
            })
            // 上传 
            wx.chooseImage({
              count: 1, // 默认9
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                console.log("选择相册", res);
                const src = res.tempFilePaths[0]
                console.log('src', src);
                wx.setStorageSync('temp_id', that.data.temp_id);
                wx.setStorageSync('pw_id', that.data.pw_id);
                wx.redirectTo({
                  url: `../avatarUpload/upload/upload?src=${src}`
                })
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                tips.loading('上传中');
                tips.loaded(); //消失
                console.log(apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid);

              }
            })

          } else {
            console.log(res.data.msg);
          }
          wx.hideLoading()
        }
      })
      
    }else{
      wx.setStorageSync('temp_id', that.data.temp_id);
      wx.setStorageSync('pw_id', that.data.pw_id);
      // 请求位置
      wx.request({
        url: app.data.apiurl + "photo/can-up-position-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("照片可上传位置:", res);
          console.log(res.data.data,111);
          var status = res.data.status;
          if (status == 1) {
            that.setData({
              position: res.data.data[0]
            })
            let position = res.data.data[0];
            let source_effect = that.data.source_effect;
            console.log(position);
            console.log(source_effect);
            var arr = []
            for (var i in source_effect) {
              arr.push(source_effect[i]); //属性
              //arr.push(object[i]); //值
            }
            // for (let i = 0; i < arr.length; i++) {
              let weizhi = source_effect[position][0];
              console.log('weizhi', weizhi);
              weizhi.split('x');
              let shuju = weizhi.split('x');
              that.setData({
                width: shuju[0],
                height: shuju[1]
              })
              wx.setStorageSync('weizhi', weizhi);
              wx.setStorageSync('width', shuju[0]);
              wx.setStorageSync('height', shuju[1]);
              wx.setStorageSync('position', position);
            // }
           // that
            
            // 占位置给后台start - up - picture
            wx.request({
              url: app.data.apiurl + "photo/start-up-picture?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
              data: {
                pw_id: that.data.pw_id,
                position: that.data.position
              },
              header: {
                'content-type': 'application/json'
              },
              method: "GET",
              success: function (res) {
                console.log("位置后台:", res);
                var status = res.data.status;
                if (status == 1) {
                  console.log('传递成功')
                } else {
                  console.log(res.data.msg);
                }
                wx.hideLoading()
              }
            })
          // 上传 
            wx.chooseImage({
              count: 1, // 默认9that.data.photoInform.counts.length
              sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
              sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
              success: function (res) {
                console.log("选择相册", res);
                const src = res.tempFilePaths[0]
                console.log('src', src);
                wx.setStorageSync('pw_id', that.data.pw_id);
                wx.setStorageSync('temp_id', that.data.temp_id);
                // wx.redirectTo({
                //   url: `../wx-cropper1/wx-cropper1?src=${src}&width=${that.data.width}&height=${that.data.height}`
                // })
                wx.redirectTo({
                  url: `../avatarUpload/upload2/upload2?src=${src}&position=${that.data.position}&width=${that.data.width}&height=${that.data.height}`
                })
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                tips.loading('上传中');
                tips.loaded(); //消失

              }
            })

          } else {
            console.log(res.data.msg);
          }
          wx.hideLoading()
        }
      })
  }
    wx.hideLoading()
  },
  savePhoto(e){
      let that = this;
      wx.request({
        url: app.data.apiurl + "photo/create-image?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
        data: {
          pw_id: that.data.pw_id,
          is_show: that.data.checkboxs
        },
        header: {
          'content-type': 'application/json'
        },
        method: "GET",
        success: function (res) {
          console.log("图片照片墙:", res);
          var status = res.data.status;
          if (status == 1) {
            let url = res.data.data;
            console.log(url);
            wx.previewImage({
              current: url, // 当前显示图片的http链接
              urls: [url] // 需要预览的图片http链接列表
            })
            
          } else {
            console.log(res.data.msg);
            tips.alert(res.data.msg)
          }
          wx.hideLoading()
        }
      })
  },
  
})