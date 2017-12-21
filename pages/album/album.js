const app = getApp();
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      {
        img: 'https://gcdn.playonwechat.com/photo/o_1c10c739b1pqu13g0bmu4lj12ua81.jpg',
        checked:true
      },
      {
        img: 'https://gcdn.playonwechat.com/photo/o_1c10c739b1pqu13g0bmu4lj12ua81.jpg',
        checked: false
      },
      {
        img: 'https://gcdn.playonwechat.com/photo/nice1.jpg',
        checked: false
      }
    ],
    show:false,
    checkboxs: true
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
    wx.showToast({
      title: '加载中',
      icon: 'loading'
    })
    let that = this;
    // wx.request({
    //   url: app.data.apiurl + "photo/template-list?sign=" + wx.getStorageSync('sign') + '&operator_id=' + app.data.kid,
    //   data: {
    //     type: 'h5'
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: "GET",
    //   success: function (res) {
    //     console.log("模板:", res);
    //     var status = res.data.status;
    //     if (status == 1) {
    //       that.setData({
    //         //photoList: res.data.data
    //       })
    //     } else {
    //       tips.alert(res.data.msg);
    //     }

    //   }
    // })
  },
  albumInform(e){
      wx.navigateTo({
        url: '../albumInform/albumInform'
      })
      console.log(e);
      let that = this;
      let checked = e.currentTarget.dataset.checked;
      let index = e.currentTarget.dataset.index;
      let imgUrls = that.data.imgUrls;
      for (let i = 0; i < imgUrls.length;i++){
        imgUrls[i].checked=false;
        if(index==i){
          console.log(i);
          imgUrls[index].checked = true;
        }
      }
      that.setData({
        imgUrls
      })
  },
  navUrl(e) {
    console.log(e);
    console.log(e.currentTarget.dataset.itembar);
    if (e.currentTarget.dataset.itembar == 2) {
      console.log(111);
      if (this.data.show){
        this.setData({
          itemBar: 2,
          show: false
        })
      }else{
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
        checkboxs: false
      })
    } else {
      that.setData({
        checkboxs: true
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

 
})