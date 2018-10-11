// pages/indexDetail/index.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   * name  模块名称
   * terrace  功能平台
   * shape   产品形式
   * crowd   适用人群
   * case    经典案例
   * content   功能简介
   * src  经典案例内容图片
   */
  data: {
    name: "",
    terrace: "",
    shape: "",
    crowd: "",
    case: "",
    content: "",
    src: "",
    srcList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var data = {
      id: options.id
    };
    utils.requestFun("home/project/getModelDetail", data, 'POST', function (msg) {
      var lists = [];
      lists.push(msg.data.src);
      console.log(msg.data);

      that.setData({
        name: msg.data.name,
        terrace: msg.data.functions,
        shape: msg.data.type,
        crowd: msg.data.crowd,
        case: msg.data.cases,
        content: msg.data.content,
        src: msg.data.src,
        srcList: lists
      })
    });
    // 隐藏转发按钮
    wx.hideShareMenu()
  },

  /**
   * 图片放大
   */
  bigImg: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgList = event.currentTarget.dataset.list;//获取data-list
      // 图片预览
      wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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