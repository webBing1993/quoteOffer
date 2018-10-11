// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    _tabIndex: 1,      // tabbar初始化状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo)
    this.setData({
      nickName: userInfo.nickName,
      avatarUrl: userInfo.avatarUrl
    });
    // 隐藏转发按钮
    wx.hideShareMenu();

  },

  /**
     * 更新数据
     */
  changeData: function (data) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 点击切换
   */
  tabIndex: function (event) {
    if (event.currentTarget.dataset.tab == 0) {
      wx.navigateBack({
        delta: 1
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 跳转
   */
  jump: function (e) {

    wx.navigateTo({
      url: e.currentTarget.dataset.href,
    })
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