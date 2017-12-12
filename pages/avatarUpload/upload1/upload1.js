import weCropper from '../../../dist/weCropper.js'
import tips from '../../../utils/tips.js';
const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';



Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },
  onLoad(options){
    console.log("options:", options);
    let pw_id = options.pw_id;
    let position = options.position;
    that.setData({
      pw_id,
      position
    })
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    wx.showToast({
      title: '上传中',
      icon: 'loading'
    })
    let pw_id = wx.getStorageSync('pw_id');
    let position = wx.getStorageSync('position');
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {
        var that = this;
        let sign = wx.getStorageSync('sign');
        console.log(apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid);
        wx.uploadFile({
          url: apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid,
          filePath: avatar,
          name: 'image',
          formData: {
            'user': 'test'
          },
          success: function (res) {
            console.log('上传图片成功', res);
            let data = JSON.parse(res.data);
            let picture = data.data;
            if (data.status == 1) {
              that.setData({
                picture: data.data
              })
              wx.request({
                url: apiurl + "photo/append-photo?sign=" + sign + '&operator_id=' + app.data.kid,
                data: {
                  pw_id: pw_id,
                  picture: that.data.picture,
                  position: position
                },
                header: {
                  'content-type': 'application/json'
                },
                method: "GET",
                success: function (res) {
                  console.log("添加照片:", res);
                  let status = res.data.status;
                  if (status == 1) {
                    console.log('上传成功！')
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
                          console.log(111);
                          that.setData({
                            pw_id: res.data.data
                          })
                          //  获取到裁剪后的图片
                          wx.redirectTo({
                            url: `../../share/share?avatar=${picture}&pw_id=${wx.getStorageSync('pw_id')}`
                          })

                        } else {
                          console.log(res.data.msg);
                          wx.showToast({
                            title: res.data.msg,
                            icon: 'loading'
                          })
                        }
                      }
                    })

                  } else {
                    wx.showToast({
                      title: res.data.msg,
                      icon: 'loading'
                    })
                  }

                }
              })
              // 添加照片
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'loading'
              })
            }
          }
        })
        // wx.uploadFile({
        //   url: 'https://impress.playonwechat.com/site/save-game?sign=' + sign, //仅为示例，非真实的接口地址
        //   filePath: avatar,
        //   name: 'file',
        //   formData: {
        //     'user': 'test'
        //   },
        //   success: function (res) {
        //     console.log("图片", res);
        //     var status = JSON.parse(res.data).status;
        //     console.log(status);
        //     var fileData = JSON.parse(res.data).data.url;
        //     var gid = JSON.parse(res.data).data.gid;
        //     if (status == 1) {
        //       var img_src = fileData;
        //       that.setData({
        //         img_src: img_src
        //       });
        //       console.log(111);
        //       //  获取到裁剪后的图片
        //       wx.switchTab({
        //         url: `../../indexs/indexs?avatar=${fileData}`
        //       })
        //     }
        //   }
        // })

      } else {
        console.log('获取图片失败，请稍后重试')
      }
    })
  },
  uploadTap() {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let src = res.tempFilePaths[0]
        //  获取裁剪图片资源后，给data添加src属性及其值

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad(option) {
    // do something
    const { cropperOpt } = this.data
    const { src } = option
    if (src) {
      Object.assign(cropperOpt, { src })

      new weCropper(cropperOpt)
        .on('ready', function (ctx) {
          console.log(`wecropper is ready for work!`)
        })
        .on('beforeImageLoad', (ctx) => {
          console.log(`before picture loaded, i can do something`)
          console.log(`current canvas context:`, ctx)
          wx.showToast({
            title: '上传中',
            icon: 'loading',
            duration: 20000
          })
        })
        .on('imageLoad', (ctx) => {
          console.log(`picture loaded`)
          console.log(`current canvas context:`, ctx)
          wx.hideToast()
        })
    }
  }
})
