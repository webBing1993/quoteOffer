let page = 0;         // 初次加载长度
let hadLastPage = false;  // 判断是否到最后一页
let utils = require('../../utils/util.js');

var initdata = function (that) {
  var list = that.data.offerList
  for (var i = 0; i < list.length; i++) {
    list[i].txtStyle = "";
    list[i].isMove = false;
  }
  that.setData({ 
    offerList: list
  })
}

Page({
  data: {
    offerList: [

    ],
    delBtnWidth: 100,      // 删除按钮宽度单位（rpx）
  },


  // 手指刚放到屏幕触发
  touchS: function (e) {
    console.log("touchS" + e);
    // initdata(this);
    // 判断是否只有一个触摸点
    if (e.touches.length == 1) {
      this.setData({
        // 记录触摸起始位置的X坐标
        startX: e.touches[0].clientX
      });
    };
    return false;
  },

  // 触摸时触发，手指在屏幕上每移动一次，触发一次
  touchM: function (e) {
    var that = this;
    initdata(that);
    if (e.touches.length == 1) {
      // 记录触摸点位置的X坐标
      var moveX = e.touches[0].clientX;
      // 计算手指起始点的X坐标与当前触摸点的X坐标的差值
      var disX = that.data.startX - moveX;
      // delBtnWidth 为右侧按钮区域的宽度
      var delBtnWidth = that.data.delBtnWidth;
      var txtStyle = "";
      if (disX == 0 || disX < 0) {      // 如果移动距离小于等于0，文本层位置不变
        txtStyle = "left:0px";
      } else if (disX > 0) {            // 移动距离大于0，文本层left值等于手指移动距离
        txtStyle = "left:-" + disX + "px";
        if (disX >= delBtnWidth) {
          // 控制手指移动距离最大值为删除按钮的宽度
          txtStyle = "left:-" + delBtnWidth + "px";
        }
      }
      // 获取手指触摸的是哪一个item
      var index = e.currentTarget.dataset.index;
      var list = that.data.offerList;
      // 将拼接好的样式设置到当前item中
      list[index].txtStyle = txtStyle;

      list[index].isMove = true;
      // 更新列表的状态
      this.setData({
        offerList: list
      });
    }
  },
  touchE: function (e) {
    console.log( e);
    var that = this
    if (e.changedTouches.length == 1) {
      // 手指移动结束后触摸点位置的X坐标
      var endX = e.changedTouches[0].clientX;
      // 触摸开始与结束，手指移动的距离
      var disX = that.data.startX - endX;
      var delBtnWidth = that.data.delBtnWidth;
      // 如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      // 获取手指触摸的是哪一项
      var index = e.currentTarget.dataset.index;
      var list = that.data.offerList;
      list[index].txtStyle = txtStyle;
      // 更新列表的状态
      that.setData({
        offerList: list
      });
    }
  },

  /**
   * 跳转详情页
   */
  navigatorTo: function (event) {
    wx.navigateTo({
      url: '/pages/build/index?id=' + event.currentTarget.dataset.index
    })
  },

  /**
   * 删除操作
   */
  del: function (e) {
    var that = this;
    var data = {
      id: e.currentTarget.dataset.index
    };
    wx.showModal({
      title: '',
      content: '确定选择删除么？',
      confirmColor: '#C71B1B',
      cancelColor: '#666666',
      success: function (res) {
        if (res.confirm) {
          utils.requestFun("home/project/delProject", data, 'POST', function (msg) {
            console.log(msg)

            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 1500
            })
            var lists = that.data.offerList;
            var list1 = [];
            for (let i = 0; i < lists.length; i++) {
              if (lists[i].id != e.currentTarget.dataset.index) {
                list1.push(lists[i])
              }
            }
            page--;
            that.setData({
              offerList: list1
            })
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 修改操作
   */
  ref: function (e) {
    wx.navigateTo({
      url: '/pages/revise/index?id=' + e.currentTarget.dataset.index,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    page = 0;
    this.loadList();
    // 隐藏转发按钮
    wx.hideShareMenu();
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
      hadLastPage = false;
      page = 0; 
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function (event) {
    console.log("上拉事件")
    this.loadList();
  }, 

  /** 
   * 数据请求封装
   */
  loadList: function (event) {
    console.log(hadLastPage);


    if (hadLastPage != false) {
      wx.showToast({
        title: '到底啦',
      });
      return;
    }
    var that = this;
    // 显示加载图标  
    wx.showLoading({
      title: '玩命加载中',
    })

    let data = {
        length: page,
        openId: wx.getStorageSync('openid')
    };

    

    utils.requestFun("home/project/getProjectList", data, 'POST', function (msg) {

      if (msg.data.length != 0) {
        var lists = that.data.offerList;
        for (let i = 0; i < msg.data.length; i++) {
          msg.data[i].create_time = utils.timestampToTime(msg.data[i].create_time);
          msg.data[i].isMove = false;
          lists.push(msg.data[i]);
        }

        // len 
        page = page + msg.data.length;

        // 设置数据  
        that.setData({
          offerList: lists
        })
      } else {
        hadLastPage = true;
      }
      wx.hideLoading();
    })
  },

  /**
   * 更新数据
   */
  changeData: function (index) {
    var data = [];
    this.setData({
      offerList: data
    })
    page = 0;
    this.loadList();
  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }

})
