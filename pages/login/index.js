// pages/login/index.js
var app = getApp();
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    // wx.removeStorageSync('openid');

    utils.requestFun("home/project/generate", '', 'get', function (msg) {
      wx.setStorageSync('initData', msg.data);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 隐藏转发按钮
    wx.hideShareMenu()
  },


  /**
   * 获取用户信息
   */
  userInfoHandler: function (e) {
    // 显示加载图标  
    wx.showLoading({
      title: '',
    })
    // wx.clearStorage();    // 清除缓存
    var S = this;
    console.log(e)
    wx.getUserInfo({
      lang: "zh_CN",
      success: function (res) {
        console.log(res);

        wx.setStorageSync("userInfo", res.userInfo);

        wx.login({
          success: function (e) {
            var data = {
              appid: app.globalData.appid,
              secret: app.globalData.secret,
              js_code: e.code,
              grant_type: 'authorization_code'
            }

            utils.requestFun("home/user/getOpenId", data, 'get', function (msg) {

              wx.setStorageSync("openid", msg.data.openid);

              console.log(msg);
              let data1 = {
                openId: msg.data.openid,
                nickname: res.userInfo.nickName,
                avatarUrl: res.userInfo.avatarUrl,
                gender: res.userInfo.gender
              }
              
              if (msg.errCode == 0) {
                utils.requestFun("home/user/initUserInfo", data1, "POST", function (m) {
                  // console.log(m);
                  wx.setStorageSync("initUserInfo", m.data);
                  console.log(wx.getStorageSync('newId'));
                  if (wx.getStorageSync('newId') != '') {
                    wx.removeStorageSync('newId');
                    wx.redirectTo({
                      url: '/pages/build/index?id=' + wx.getStorageSync('id')
                    });
                  } else {
                    if (wx.getStorageSync("password") == '123456') {
                      wx.redirectTo({
                        url: '/pages/index/index',
                      })
                    } else {

                      wx.redirectTo({
                        url: '/pages/entry/index',
                      })
                    }
                  }
                })
              }

            });
          }
        });
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
    wx.hideLoading();
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