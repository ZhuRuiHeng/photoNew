const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
      show:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  // 传过来可以上传几个视频
  upVideo(e) {
    wx.showToast({
      title: '此模板可以上传2个视频',
      mask: true,
      duration: 3000
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      maxDuration: 60,
      camera: 'back',
      success: function (res) {
        console.log("视频:", res);
        var tempFilePath = res.tempFilePath; //视频
        var thumbTempFilePath = res.thumbTempFilePath;//图
        var size = (res.size / 1024) / 1024; //大小
        var duration = res.duration;
        if (duration < 3) {
          tips.alert('视频时长不能小于3s!');
          return false;
        }
        if (size > 25) {
          tips.alert('视频压缩不能大于25M!');
          return false;
        }
        that.setData({
          src: res.tempFilePath
        })
        tips.loading('上传中');
        console.log('tempFilePath:', tempFilePath);
        console.log(apiurl + "public/upload-video?sign=" + sign + '&operator_id=' + app.data.kid + '&app_type=reward');
        wx.uploadFile({
          url: apiurl + "public/upload-video?sign=" + sign + '&operator_id=' + app.data.kid + '&app_type=reward',
          filePath: tempFilePath,
          name: 'video',
          header: { 'content-type': 'multipart/form-data' },
          formData: null,
          success: function (res) {
            console.log("视频：", res)
            let data = JSON.parse(res.data);
            if (data.status == 1) {
              that.setData({
                url: data.data,
                dialog: true
              })
              tips.success('上传成功！')
            } else {
              tips.alert(res.data.msg)
            }
            tips.loaded(); //消失
          }
        })
      }
    })
  },
  // 传过来可以上传几张照片
  upPhoto: function (e) {
    wx.showToast({
      title: '此模板可以上传2张照片',
      mask: true,
      duration: 3000
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    // 上传 
    wx.chooseImage({
      count: 6, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        console.log("选择相册", res);
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        tips.loading('上传中');
        tips.loaded(); //消失
        that.setData({
          dialog: true
        })
        console.log(apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid);
        wx.uploadFile({
          url: apiurl + "api/upload-image?sign=" + sign + ' & operator_id=' + app.data.kid,
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
            } else {
              tips.alert(res.data.msg)
            }
          }
        })
      }
    })
    wx.hideLoading()
  },
  savePhoto(e){
      let that = this;
      wx.downloadFile({
        url: 'https://gcdn.playonwechat.com/photo/nice1.jpg', //仅为示例，并非真实的资源
        success: function (res) {
          //console.log(res);
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success(res) {
              console.log(res);
              wx.showToast({
                title: '保存成功，请去相册查看',
                icon: 'success',
                duration: 800
              })
            }
          })
        }
      })
  },
  saveVideo(){
       let that = this;
       wx.setClipboardData({
         data: '视频地址为:dddd' ,
         success: function (res) {
           wx.getClipboardData({
             success: function (res) {
               console.log(res.data) // data
               tips.success('复制成功，快去下载视频')
               that.setData({
                 finish: false
               })
             }
           })
         }
       })
  }
})