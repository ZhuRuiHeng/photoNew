const app = getApp()
const apiurl = 'https://friend-guess.playonwechat.com/';
import tips from '../../utils/tips.js'
Page({
  data: {

  },
  onLoad: function (options) {
    newName:'朋友照片墙'
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
  },
  seeTap(e){
    let pw_id = e.currentTarget.dataset.pw_id;
    wx.showLoading({
      title: '加载中',
    })
    let that = this;
    let sign = wx.getStorageSync('sign');
    wx.setStorageSync('pw_id', pw_id);
    wx.setStorageSync('bgMusic', 'https://gcdn.playonwechat.com/photo/%E9%99%88%E5%A5%95%E8%BF%85-%E5%8D%81%E5%B9%B4.mp3');
    wx.switchTab({
      url: '../indexs/indexs',
    })
  },
  // 新增相册
  newPhotos(e){
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
  niceName(e){
    this.setData({ 
      newName: e.detail.value
    })
  },
  setName(e){
    let that = this;
    let sign = wx.getStorageSync('sign');
    let id = e.currentTarget.dataset.pw_id;
    // 请求 
    wx.request({
      url: apiurl + "photo/edit-pname?sign=" + sign + '&operator_id=' + app.data.kid,
      data:{
        pw_id:id,
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
  },
  musicList(){
    
  }

})