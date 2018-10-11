// pages/info/index.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',               // 姓名
    company: '',            // 公司名 
    positionAll: [],
    position: 0,            // 职位
    mobile: '',              // 电话
    placeholder: "",
    placeholder1: "",
    placeholder2: "",
    isClick: false          // 判断是否开始填写，控制保存按钮
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 隐藏转发按钮
    wx.hideShareMenu()
    var data = wx.getStorageSync("initUserInfo");
    console.log(data);
    if (data.company == null) {
      data.company = "杭州之图网络科技有限公司"
    }
    this.setData({
      name: data.name,
      company: data.company,
      position: data.position,
      positionAll: data.positionAll,
      mobile: data.mobile,
      placeholder: "请填写你的姓名",
      placeholder1: "请填写你的公司名称",
      placeholder2: "请填写你的电话",
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
   * 姓名
   */
  namefouce: function (e) {
    this.setData({
      isClick: true,
      placeholder: " "
    })
  },
  name: function (e) {
    var placeholder = e.detail.value;
    if (placeholder == " " || placeholder == "") {
      placeholder = '请填写你的姓名'
    }
    this.setData({
      name: e.detail.value,
      placeholder: placeholder
    })
  },

  /**
   * 公司名
   */
  companyfouce: function (e) {
    this.setData({
      placeholder1: " ",
      isClick: true
    })
  },
  company: function (e) {
    var placeholder = e.detail.value;
    if (placeholder == " " || placeholder == "") {
      placeholder = '请填写你的公司名称'
    }
    this.setData({
      company: e.detail.value,
      placeholder1: placeholder
    })
  },
  
  /**
   * 选择职位
   */
  position: function (e) {
    var that = this;
    wx.showActionSheet({
      itemList: that.data.positionAll,
      success: function (res) {
        that.setData({
          position: res.tapIndex,
          isClick: true
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  /**
   * 电话
   */
  phonefouce: function (e) {
    this.setData({
      placeholder2: " " ,
      isClick: true
    })
  },

  phoneVal: function (e) {
    this.setData({
      mobile: e.detail.vaue
    })
  },
  phone: function (e) {
    var phone = e.detail.value;
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    var placeholder = e.detail.value;
    if (placeholder == " " || placeholder == "") {
      placeholder = '请填写你的电话号码'
    }

    if (reg.test(phone) == true) {
      this.data.mobile = e.detail.value;
    } else {
      wx.showModal({
        title: '',
        content: "请输入正确的手机号",
        showCancel: false,
      })
    } 
    this.setData({
      placeholder2: placeholder
    }) 
  },
  
  /**
   * 保存个人信息
   */
  save: function (e) {
    var that = this;

    if (that.data.name == '' || that.data.name == " ") {
      wx.showModal({
        title: '',
        content: '姓名不能为空',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: '#C71B1B',
        success: function () {

        }
      })
    } else if (that.data.company == '' || that.data.company == " ") {
      wx.showModal({
        title: '',
        content: '公司名称不能为空',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: '#C71B1B',
        success: function () {

        }
      })
    } else if (that.data.mobile == '' || that.data.mobile == " ") {
      wx.showModal({
        title: '',
        content: '电话号码不能为空',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: '#C71B1B',
        success: function () {

        }
      })
    }else {
      var data = {};
      data.company = that.data.company;
      data.mobile = that.data.mobile;
      data.name = that.data.name;
      data.position = that.data.position;
      data.openId = wx.getStorageSync("openid");
      console.log(data)
      utils.requestFun("home/user/saveUserInfo", data, 'POST', function (msg) {
        that.setData({
          isClick: false
        })
        data.positionAll = that.data.positionAll;
        wx.setStorageSync("initUserInfo", data);
        var pages = getCurrentPages();
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 2];
          var data1 = true;
          //关键在这里,这里面是触发上个界面
          prePage.changeData(data1)// 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数
          wx.navigateBack({
            delta: 1
          });
        }
      })
    }

    
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