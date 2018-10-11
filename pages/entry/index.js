// pages/entry/index.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(wx.getStorageSync('openid'));
    // 隐藏转发按钮
    wx.hideShareMenu()
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

  /**
   * 输入密码
   */
  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },


  /**
   * 登录
   */
  login: function () {
    var that = this;
    var data = {};
    if (this.data.password == '123456') {

      wx.setStorageSync("password", 123456);

      if (wx.getStorageSync('newId') != '') {
        wx.removeStorageSync('newId');
        wx.redirectTo({
          url: '/pages/build/index?id=' + wx.getStorageSync('id')
        });
        
      }else {
        wx.redirectTo({
          url: '/pages/index/index',
        });
      }
      
    } else {
      wx.showModal({
        title: '',
        content: '密码错误',
        showCancel: false,
        confirmText: "确定",
        confirmColor: '#C71B1B',
        success: function () {
          that.setData({
            password: ''
          })
        }
      })
    }
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // wx.removeStorageSync("data_expiration");
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})