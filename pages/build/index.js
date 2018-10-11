// pages/build/index.js
var utils = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    items: [
      
    ],
    items1: [

    ],
    items2: [

    ],
    items3: [

    ],
    items4: [

    ],
    items5: {},
    items7: {},
    total: 0,
    totalNum: 0,
    isSelf: true,       // 判定是否为本人
    isSure: false,      // 判断是否确定
    sureIs: false,      // 报价单弹窗
    hasID: true,        // 判断是不是编辑页
    tigClick: true,     // 提示语
    title: ''           // 标题
  },

  /**
   * 加载函数
   */
  onloadData: function () {
    var that = this;
    

    if (wx.getStorageSync('openid') == '') {
      wx.setStorageSync('newId', wx.getStorageSync('id'));
      wx.redirectTo({
        url: '/pages/login/index?newId=' + wx.getStorageSync("id"),
      });
    } else {
      if (wx.getStorageSync("id") != '') {
        var data = {
          id: wx.getStorageSync("id"),
          openId: wx.getStorageSync('openid')
        };
        utils.requestFun("home/project/getProjectDetail", data, 'POST', function (msg) {

          var da = JSON.parse(msg.data.product);
          console.log(da)

          if (msg.data.isSelf == false) {
            var profile = msg.data.profile;
            var prositionsAll = wx.getStorageSync("initUserInfo");
            profile.positionAll = prositionsAll.positionAll;
            // wx.setStorageSync('tigClick', false);
            that.setData({
              items7: profile,
              isSelf: false
            });
          }
          if (da.items1 == undefined) {
            da.items1 = '';
          }
          if (da.items2 == undefined) {
            da.items2 = '';
          }
          if (da.items3 == undefined) {
            da.items3 = '';
          }

          that.setData({
            id: wx.getStorageSync("id"),
            isSelf: msg.data.isSelf,
            items: da.items,
            items1: da.items1,
            items2: da.items2,
            items3: da.items3,
            items4: da.items4,
            items5: da.items5,
            items6: da.items6,
            total: parseFloat(da.total.toFixed(2)),
            totalNum: da.totalNum,
            title: msg.data.title
          });

          // 显示转发按钮
          wx.showShareMenu()

          let items = [];
          let items1 = [];
          let items2 = [];
          let items3 = [];
          let items4 = [];
          for (let i = 0; i < that.data.items.length; i++) {
            console.log(that.data.items[i].num);
            that.data.items[i].heigth = (that.data.items[i].num * (54) + 102) + "rpx";
          }
          if (that.data.items1 != undefined) {
            for (let i = 0; i < that.data.items1.length; i++) {
              that.data.items1[i].heigth = (1 * (24 + 45) + 27) + "rpx";
            }
          }
          if (that.data.items2 != undefined) {
            for (let i = 0; i < that.data.items2.length; i++) {
              that.data.items2[i].heigth = (1 * (24 + 45) + 27) + "rpx";
            }
          }

          if (that.data.items3 != undefined) {
            for (let i = 0; i < that.data.items3.length; i++) {
              that.data.items3[i].heigth = (1 * (24 + 45) + 27) + "rpx";
            }
          }

          items = that.data.items;
          items1 = that.data.items1;
          items2 = that.data.items2;
          items3 = that.data.items3;
          that.setData({
            items: items,
            items1: items1,
            items2: items2,
            items3: items3
          })
        })

      } else {
        let data = wx.getStorageSync('data');

        that.setData({
          isFire: data.isFire,
          hasID: false,
          items: data.items,
          items1: data.items1,
          items2: data.items2,
          items3: data.items3,
          items4: data.items4,
          items5: data.items5,
          items6: data.items6,
          total: data.total,
          totalNum: data.totalNum,
          n: data.n,
          ns: data.ns
        })
        let items = [];
        let items1 = [];
        let items2 = [];
        let items3 = [];
        let items4 = [];
        for (let i = 0; i < that.data.items.length; i++) {
          that.data.items[i].heigth = (that.data.items[i].num * (54) + 102) + "rpx";
        }
        if (that.data.items1 != undefined) {
          for (let i = 0; i < that.data.items1.length; i++) {
            that.data.items1[i].heigth = (1 * (24 + 45) + 27) + "rpx";
          }
        }
        if (that.data.items2 != undefined) {
          for (let i = 0; i < that.data.items2.length; i++) {
            that.data.items2[i].heigth = (1 * (24 + 45) + 27) + "rpx";
          }
        }

        if (that.data.items3 != undefined) {
          for (let i = 0; i < that.data.items3.length; i++) {
            that.data.items3[i].heigth = (1 * (24 + 45) + 27) + "rpx";
          }
        }


        items = that.data.items;
        items1 = that.data.items1;
        items2 = that.data.items2;
        items3 = that.data.items3;
        that.setData({
          items: items,
          items1: items1,
          items2: items2,
          items3: items3
        })

        console.log(that.data.items3)

      }
    }


    if (that.data.isSure == false) {
      // 隐藏转发按钮
      wx.hideShareMenu()
    }

    if (!wx.getStorageSync('tigClick')) {
      that.setData({
        tigClick: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('isClickSure', false);
    wx.setStorageSync("id", options.id);
    this.onloadData();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 跳转到项目详情
   */
  toDetail: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/indexDetail/index?id=' + id,
    });
  },

  /**
   * 取消事件 
   */
  cance: function (e) {
    wx.navigateBack({
      delta: 1
    })
  },

  /**
   * 提示按钮隐藏提示事件
   */
  tigClick: function () {
    wx.setStorageSync('tigClick', true);
    this.setData({
      tigClick: true
    })
  },

  /**
   * 确定事件
   */
  sure: function (e) {
    var data = {};
    var that = this;
    data.openId = wx.getStorageSync("openid");
    that.data.items5.title = that.data.items5.name + that.data.items5.company;
    that.data.title = that.data.items5.name + that.data.items5.company;
    data.product = that.data;
    data.title = that.data.title;
    data.n = data.n;
    data.ns = data.ns;

    utils.requestFun("home/project/saveProject", data, 'POST', function (msg) {
      console.log(msg);
      wx.setStorageSync("id", msg.data);

      // 为了产品页数据的刷新问题
      wx.setStorageSync('isClickSure', true);

      // 隐藏转发按钮
      wx.showShareMenu();

      that.setData({
        isSure: true,
        sureIs: true
      });
      setTimeout(function () {
        that.setData({
          sureIs: false
        })
      },1500)
    })
  },

  /**
   * 删除操作
   */
  del: function (e) {
    var that = this;
    var data = {
      id: wx.getStorageSync('id')
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
            });
            setTimeout(function() {
              wx.navigateBack({
                delta: 1
              })
            },1500)
            //获取页面栈
            var pages = getCurrentPages();
            //上一个页面实例对象
            var prePage = pages[pages.length - 2];
            prePage.changeData(wx.getStorageSync('id'))

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
      url: '/pages/revise/index?id=' + this.data.id,
    })
  },

  /**
   * 打电话
   */
  callPhone: function (e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.phone
    })
  },


  /**
   * 更新数据
   */
  changeData: function (data) {
  
    this.onloadData();
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
    // this.setData({
    //   tigClick: false
    // })
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
    if (this.data.isSure == true) {
      return {
        title: '分享',
        path: '/pages/build/index?id=' + wx.getStorageSync('id'),
        success: function (res) {
         
        }
      }
    }
  }
})