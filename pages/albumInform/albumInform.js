const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    checkboxs: 1,
    finish:false,
    music_play: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("options：",options);
    this.setData({
      pw_id: options.pw_id
    })
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
    let that = this;
    // 判断照片信息
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
            thumb: res.data.data.pic + '?' + that.data.num,
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
  // 是否同意展示
  Change: function (e) {
    console.log(e);
    let that = this;
    console.log('checkbox发生change事件，携带value值为：', e.currentTarget.dataset.check);
    if (e.currentTarget.dataset.check == 1) {
      that.setData({
        checkboxs: 0
      })
    } else {
      that.setData({
        checkboxs: 1
      })
    }
  },
  // 查看照片集
  savePhoto(e){
      let that = this;
     // if (that.data.finish){
          wx.navigateTo({
            url: '../seephoto/seephoto?pw_id=' + that.data.pw_id + '&temp_id=' + that.data.temp_id,
          })
     // }else{
        tips.alert('请先填满照片集！')
     // }
  },
  upPhoto(){
    let that = this;
    // 上传 
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("选择相册", res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        tips.loading('上传中');
        tips.loaded(); //消失
        that.setData({
          dialog: true
        })
        console.log(apiurl + "api/upload-image?sign=" + wx.getStorageSync('sign') + ' & operator_id=' + app.data.kid);
        wx.uploadFile({
          url: apiurl + "api/upload-image?sign=" + wx.getStorageSync('sign') + ' & operator_id=' + app.data.kid,
          filePath: tempFilePaths[0],
          name: 'image',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log('上传图片成功', res);
            let data = JSON.parse(res.data);
            if (data.status == 1) {
              that.setData({
                url: data.data
              })
              wx.request({
                url: app.data.apiurl + "photo/append-photo?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
                data: {
                  pw_id: that.data.pw_id,
                  picture: data.data
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  console.log('上传pw_id：', that.data.pw_id);
                  console.log("添加照片:", res);
                  let status = res.data.status;
                  if (status == 1) {
                    console.log('上传成功！')

                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'loading'
                    })
                  }

                }
              })
            } else {
              tips.alert(res.data.msg)
            }
          }
        })
      }
    })
  }
})