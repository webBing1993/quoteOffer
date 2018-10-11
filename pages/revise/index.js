var app = getApp();
var utils = require('../../utils/util.js');
var total = 0;              // 初始化合计价格的数值
var totalNum = 0;           // 初始化合计个数

// 加法

function floatAdd(arg1, arg2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));

  return (arg1 * m + arg2 * m) / m;
}
// 减法
function floatSub(arg1, arg2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度
  n = (r1 >= r2) ? r1 : r2;

  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

Page({

  /**
   * 页面的初始数据
   * name: id序号
   * checked： 一级的选中状态
   * check： 二级的选中状态
   * value： 标题
   * price： 二级产品价格
   * isClick: 一级的选中状态
   * total： 一级模块中的价格总和
   * num： 二级选中的数量
   */
  data: {
    items: [

    ],
    items1: [
      {       // pc端后台管理

      }
    ],
    items2: [
      {       // 维护费

      }
    ],
    items3: [   // 党群加油站

    ],
    items4: [   // 产品形态

    ],
    items5: {
      name: "",
      company: "",
      phone: "",
      remark: ""
    },

    color: '#ffffff',
    total: 0,
    totalNum: 0,
    isFire: false,     // 初始化判断是否选了党群加油站
    fireSub: true,     // 初始减一次一体机价格
    _tabIndex: 0,      // tabbar初始化状态
    isGoInfo: true,    // 判断是否填写了个人信息
    isProduce: true,   // 判断是否选了产品形式
    title: '',
    hiddenmodalput: true,
    isfouce: false,    // 判断textarea是否聚焦
    indicator: false,
    caseImg: true,     // 模板图片
    imgUrls: [
      {
        src: '../../images/t1.png',
        text: '第一步：选择业务模块'
      },
      {
        src: '../../images/t2.png',
        text: '第二步：选择产品形态'
      },
      {
        src: '../../images/t3.png',
        text: '第三步 添加客户信息及备注'
      },
      {
        src: '../../images/t4.png',
        text: '第四步 确认生成报价单'
      }
    ],
    current: 0,
    placeholder: '请输入客户姓名',
    placeholder1: '请输入客户单位',
    placeholder2: '请输入客户联系方式',
    placeholder3: '请输入备注文本',
    noshow: false,
    noShadow: false,
    modalSure: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync("optionsId", options.id)
    var that = this;
    var data = {
      id: options.id,
      openId: wx.getStorageSync('openid')
    }
    utils.requestFun("home/project/editProject", data, 'POST', function (msg) {

      // 旧数据
      var data1 = msg.data.default;
      console.log(data1);
      // 新数据
      var data2 = JSON.parse(msg.data.data.product);
      console.log(data2);

      if (data2.items1 != undefined) {
        data1.items1 = data2.items1;
      }
      if (data2.items2 != undefined) {
        data1.items2 = data2.items2;
      }

      var isFire = false;
      if (data2.items3 != undefined) {
        data1.items3 = data2.items3;
        isFire = true;
      }else {
        isFire = false;
      }

      if (data2.items4 != undefined) {
        for (var m = 0; m < data1.items4.length; m++) {
          data1.items4[m].checked = false;
          for (var j = 0; j < data2.items4.length; j++) {
            if (data1.items4[m].id == data2.items4[j].id) {
              data1.items4.splice(m, 1, data2.items4[j]);
            }
          }
        }
      }

      if (data2.items5 != undefined) {
        data1.items5 = data2.items5;
      }


      for (var i = 0; i < data1.items.length; i++) {
        for (var m = 0; m < data1.items[i].list.length; m++) {
          for (var j = 0; j < data2.items.length; j++) {
            for (var n = 0; n < data2.items[j].list.length; n++) {
              if (data1.items[i].list[m].id == data2.items[j].list[n].id) {
                data1.items[i].list.splice(m, 1, data2.items[j].list[n]);
                data1.items[i].checked = data2.items[j].checked;
                data1.items[i].isClick = data2.items[j].isClick;
                data1.items[i].num = data2.items[j].num;
                data1.items[i].total = data2.items[j].total;
              }
            }
          }
        }
      }

      totalNum = data2.totalNum;
      total = data2.total.toFixed(2);

      for (let i in data1.items) {
        for (let j in data1.items[i].list) {
          data1.items[i].list[j].price = parseFloat(data1.items[i].list[j].price);
        }
      }

      that.setData({
        items: data1.items,
        items1: data1.items1,
        items2: data1.items2,
        items3: data1.items3,
        items4: data1.items4,
        items5: data1.items5,
        items6: data2.items6,
        total: parseFloat(data2.total.toFixed(2)),
        totalNum: data2.totalNum,
        title: data2.title,
        isFire: isFire,
        n: data2.n,
        ns: data2.ns
      })

    });
    // 隐藏转发按钮
    wx.hideShareMenu()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 一级选择
   */
  checkboxChange: function (e) {

    if (this.data.isFire == true && this.data.fireSub == true) {
      total = floatSub(total, parseFloat(this.data.items3[0].price));
      this.setData({
        fireSub :false
      })
    }

    var items = this.data.items;
    var checkArr = e.currentTarget.dataset.value;
    items[checkArr].checked = !items[checkArr].checked;
    let total_ = 0;      // 每次的金额总和归零计算
    if (items[checkArr].checked == true) {
      // 每次的数额除掉
      totalNum -= items[checkArr].num;
      // 二级样式随之变化
      for (var j = 0; j < items[checkArr].list.length; j++) {
        total_ = parseFloat(floatAdd(total_, items[checkArr].list[j].price));
        if (items[checkArr].list[j].check == false) {
          total = parseFloat(floatAdd(total, items[checkArr].list[j].price));
          items[checkArr].list[j].check = true; 
        }
      }
      items[checkArr].num = items[checkArr].list.length;
      totalNum += items[checkArr].list.length;

      // 触发二级显示
      this.dowmUp(e.currentTarget.dataset.value, true);
    } else {
      for (var j = 0; j < items[checkArr].list.length; j++) {
        items[checkArr].list[j].check = false;
        total_ = 0;
        total = parseFloat(floatSub(total, items[checkArr].list[j].price));
      }
      items[checkArr].num = 0;
      totalNum -= items[checkArr].list.length;

      // 触发二级隐藏
      this.dowmUp(e.currentTarget.dataset.value, false);
    }

    let discount = 0;
    let discount2 = 0;
    let newTotal = 0;
    if (this.data.isFire == true) {
      newTotal = floatAdd(total, parseFloat(this.data.items3[0].price));
    } else {
      newTotal = total;
    }

    if (0 < newTotal && newTotal <= 50000) {
      discount = 15000
    } else if (50000 < newTotal && newTotal <= 150000) {
      discount = 30000
    } else if (newTotal > 150000) {
      discount = 50000
    }
    discount2 = (newTotal * 0.15).toFixed(2);

    items[checkArr].total = total_;

    let items1 = [];
    items1[0] = {
      name: this.data.items1[0].name,
      value: this.data.items1[0].value,
      checked: this.data.items1[0].checked,
      discount: discount,
      price: this.data.items1[0].price
    }

    let items2 = [];
    items2[0] = {
      name: this.data.items2[0].name,
      value: this.data.items2[0].value,
      checked: this.data.items2[0].checked,
      discount: discount2,
      price: this.data.items2[0].price,
      remark: this.data.items2[0].remark
    }

    let items6_ = JSON.parse(JSON.stringify(items));
    let itemsData = this.data.items6;
    for (let i in items6_) {
      for (let j in items6_[i].list) {
        items6_[i].list[j].price = itemsData[i].list[j].price;
      }
    }

    this.setData({
      items: items,
      items6: items6_,
      total: newTotal,
      totalNum: totalNum,
      items1: items1,
      items2: items2
    })
  },

  /**
   * 二级选择
   */
  childChange: function (e) {

    if (this.data.isFire == true && this.data.fireSub == true) {
      total = floatSub(total, parseFloat(this.data.items3[0].price));
      this.setData({
        fireSub: false
      })
    }

    var items = this.data.items;
    var checkArr = e.currentTarget.dataset.value;
    var id = e.currentTarget.dataset.index;
    items[id].list[checkArr].check = !items[id].list[checkArr].check;

    console.log(items[id].list[checkArr])

    if (items[id].list[checkArr].check == false) {
      items[id].checked = false;
      items[id].num--;
      items[id].total = parseFloat(floatSub(items[id].total, parseFloat(items[id].list[checkArr].price)));
      total = parseFloat(floatSub(total, items[id].list[checkArr].price));
      totalNum--;
    } else {
      items[id].num++;
      items[id].total = parseFloat(floatAdd(items[id].total, items[id].list[checkArr].price));


      total = parseFloat(floatAdd(total, items[id].list[checkArr].price));
      totalNum++;
    }
    let discount = 0;
    let discount2 = 0;
    let newTotal = 0;
    if (this.data.isFire == true) {
      newTotal = floatAdd(total, parseFloat(this.data.items3[0].price));
    } else {
      newTotal = total;
    }

    if (0 < newTotal && newTotal <= 50000) {
      discount = 15000
    } else if (50000 < newTotal && newTotal <= 150000) {
      discount = 30000
    } else if (newTotal > 150000) {
      discount = 50000
    }
    discount2 = (newTotal * 0.15).toFixed(2);


    let items1 = [];
    items1[0] = {
      name: this.data.items1[0].name,
      value: this.data.items1[0].value,
      checked: this.data.items1[0].checked,
      discount: discount,
      price: this.data.items1[0].price
    }

    let items2 = [];
    items2[0] = {
      name: this.data.items2[0].name,
      value: this.data.items2[0].value,
      checked: this.data.items2[0].checked,
      discount: discount2,
      price: this.data.items2[0].price,
      remark: this.data.items2[0].remark
    }

    let items6_ = JSON.parse(JSON.stringify(items));
    let itemsData = this.data.items6;
    for (let i in items6_) {
      for (let j in items6_[i].list) {
        items6_[i].list[j].price = itemsData[i].list[j].price;
      }
    }

    this.setData({
      items: items,
      items6: items6_,
      total: newTotal,
      totalNum: totalNum,
      items1: items1,
      items2: items2
    });

  },

  /**
   * 二级显示
   */
  dowmUp: function (e, isTrue) {
    var items = this.data.items;
    var items = this.data.items;
    var checkArr = e;

    items[checkArr].isClick = isTrue;

    let items6_ = JSON.parse(JSON.stringify(items));
    let itemsData = this.data.items6;
    for (let i in items6_) {
      for (let j in items6_[i].list) {
        items6_[i].list[j].price = itemsData[i].list[j].price;
      }
    }

    this.setData({
      items: items,
      items6: items6_
    })
  },

  dowmUp_: function (e) {
    var items = this.data.items;
    var items = this.data.items;
    var checkArr = e.currentTarget.dataset.value;
    items[checkArr].isClick = !items[checkArr].isClick;
    this.setData({
      items: items
    })
  },

  /**
  * 管理和维护
  */
  checkboxChange1: function (e) {
    var items = this.data.items1;
    var checkArr = e.currentTarget.dataset.value;
    console.log(e)
    items[checkArr].checked = !items[checkArr].checked;
    let items6_ = JSON.parse(JSON.stringify(items));
    let itemsData = this.data.items6;
    for (let i in items6_) {
      for (let j in items6_[i].list) {
        items6_[i].list[j].price = itemsData[i].list[j].price;
      }
    }

    this.setData({
      items1: items,
      items6: items6_
    })
  },

  checkboxChange2: function (e) {
    var items = this.data.items2;
    var checkArr = e.currentTarget.dataset.value;
    items[checkArr].checked = !items[checkArr].checked;
    let isFire = true;
    isFire = items[checkArr].checked;
    this.setData({
      items2: items,
      isFire: isFire
    })
  },

  /**
   * 一体机
   */
  checkboxChange3: function (e) {
    var items = this.data.items3;
    var checkArr = e.currentTarget.dataset.value;
    items[checkArr].checked = !items[checkArr].checked;
    let price = parseInt(this.data.items3[0].num - 1) * 15000;
    this.data.items3[0].price = price;

    let newTotal = 0;
    if (items[checkArr].checked == true) {
      newTotal = floatAdd(total, price);
    } else {
      newTotal = total;
    }


    let discount = 0;
    let discount2 = 0;

    if (0 < newTotal && newTotal <= 50000) {
      discount = 15000
    } else if (50000 < newTotal && newTotal <= 150000) {
      discount = 30000
    } else if (newTotal > 150000) {
      discount = 50000
    }

    discount2 = (newTotal * 0.15).toFixed(2);


    let items1 = [];
    items1[0] = {
      name: this.data.items1[0].name,
      value: this.data.items1[0].value,
      checked: this.data.items1[0].checked,
      discount: discount,
      price: this.data.items1[0].price
    }

    let items2 = [];
    items2[0] = {
      name: this.data.items2[0].name,
      value: this.data.items2[0].value,
      checked: this.data.items2[0].checked,
      discount: discount2,
      price: this.data.items2[0].price,
      remark: this.data.items2[0].remark
    }

    this.setData({
      items1: items1,
      items2: items2,
      items3: items,
      isFire: items[checkArr].checked,
      total: newTotal
    })
  },
  // 减法
  minus: function (e) {
    let val = e.currentTarget.dataset.val;
    if (val > 1) {
      val--;
    } else {
      val = 1;
    }
    this.data.items3[0].num = val;
    let price = 0;
    price = parseInt(val - 1) * 15000
    let items3 = [];
    items3[0] = {
      name: this.data.items3[0].name,
      value: this.data.items3[0].value,
      checked: this.data.items3[0].checked,
      discount: this.data.items3[0].discount,
      price: price,
      num: val
    }
    let newTotal = 0;
    if (this.data.isFire == true) {
      newTotal = floatAdd(total, price);
    } else {
      newTotal = total;
    }

    let discount = 0;
    let discount2 = 0;

    if (0 < newTotal && newTotal <= 50000) {
      discount = 15000
    } else if (50000 < newTotal && newTotal <= 150000) {
      discount = 30000
    } else if (newTotal > 150000) {
      discount = 50000
    }
    discount2 = (newTotal * 0.15).toFixed(2);


    let items1 = [];
    items1[0] = {
      name: this.data.items1[0].name,
      value: this.data.items1[0].value,
      checked: this.data.items1[0].checked,
      discount: discount,
      price: this.data.items1[0].price
    }

    let items2 = [];
    items2[0] = {
      name: this.data.items2[0].name,
      value: this.data.items2[0].value,
      checked: this.data.items2[0].checked,
      discount: discount2,
      price: this.data.items2[0].price,
      remark: this.data.items2[0].remark
    }

    this.setData({
      items1: items1,
      items2: items2,
      items3: items3,
      total: newTotal
    })
  },

  // 加法
  add: function (e) {
    let val = e.currentTarget.dataset.val;
    val++;
    this.data.items3[0].num = val;
    let price = 0;
    price = parseInt(val - 1) * 15000;
    let items3 = [];
    items3[0] = {
      name: this.data.items3[0].name,
      value: this.data.items3[0].value,
      checked: this.data.items3[0].checked,
      discount: this.data.items3[0].discount,
      price: price,
      num: val
    }

    let newTotal = 0;

    if (this.data.isFire == true) {
      newTotal = floatAdd(total, price);
    } else {
      newTotal = total;
    }

    let discount = 0;
    let discount2 = 0;

    if (0 < newTotal && newTotal <= 50000) {
      discount = 15000
    } else if (50000 < newTotal && newTotal <= 150000) {
      discount = 30000
    } else if (newTotal > 150000) {
      discount = 50000
    }

    discount2 = (newTotal * 0.15).toFixed(2);


    let items1 = [];
    items1[0] = {
      name: this.data.items1[0].name,
      value: this.data.items1[0].value,
      checked: this.data.items1[0].checked,
      discount: discount,
      price: this.data.items1[0].price
    }

    let items2 = [];
    items2[0] = {
      name: this.data.items2[0].name,
      value: this.data.items2[0].value,
      checked: this.data.items2[0].checked,
      discount: discount2,
      price: this.data.items2[0].price,
      remark: this.data.items2[0].remark
    }

    this.setData({
      items1: items1,
      items2: items2,
      items3: items3,
      total: newTotal
    })
  },

  /**
   * 产品形态
   */
  checkboxChange_: function (e) {
    let that = this;
    var items = that.data.items4;
    let isProduce = false;
    let n = 1;
    let itemsData = JSON.parse(JSON.stringify(that.data.items6));
    let price = parseInt(this.data.items3[0].num - 1) * 15000;
    let total1 = 0;

    for (let i = 0; i < items.length; i++) {
      items[i].checked = false;
    }

    var checkArr = e.currentTarget.dataset.value;
    items[checkArr].checked = !items[checkArr].checked;
    if (items[checkArr].checked == true) {
      n = that.data.ns[checkArr];
      isProduce = true;
    } else {
      isProduce = false;
      n = 1;
    }

    for (let i in itemsData) {
      var total_ = 0;
      for (let j in itemsData[i].list) {
        itemsData[i].list[j].price = parseFloat(itemsData[i].list[j].price) * n;
        if (itemsData[i].list[j].check == true) {
          total_ = floatAdd(total_, itemsData[i].list[j].price);
          total1 = floatAdd(total1, itemsData[i].list[j].price);
        }

      }
      itemsData[i].total = total_;
    }


    let newTotal = 0;
    total = total1;
    if (this.data.isFire == true) {
      newTotal = floatAdd(total, price);
    } else {
      newTotal = total;
    }

    let discount = 0;
    let discount2 = 0;

    if (0 < newTotal && newTotal <= 50000) {
      discount = 15000
    } else if (50000 < newTotal && newTotal <= 150000) {
      discount = 30000
    } else if (newTotal > 150000) {
      discount = 50000
    }
    discount2 = (newTotal * 0.15).toFixed(2);

    let items1 = [];
    items1[0] = {
      name: this.data.items1[0].name,
      value: this.data.items1[0].value,
      checked: this.data.items1[0].checked,
      discount: discount,
      price: this.data.items1[0].price
    }

    let items2 = [];
    items2[0] = {
      name: this.data.items2[0].name,
      value: this.data.items2[0].value,
      checked: this.data.items2[0].checked,
      discount: discount2,
      price: this.data.items2[0].price,
      remark: this.data.items2[0].remark
    }

    that.setData({
      items1: items1,
      items2: items2,
      total: newTotal,
      items: itemsData,
      items4: items,
      isProduce: isProduce,
      n: n
    })
  },

  /**
   * 客户姓名填写
   */
  inputfouce: function (e) {
    this.setData({
      placeholder: " "
    })
  },
  inputName: function (e) {
    console.log(1);
    this.data.items5.name = e.detail.value;
    this.setData({
      placeholder: '请输入客户姓名'
    })
  },

  /**
   * 客户单位
   */
  companyfouce: function (e) {
    this.setData({
      placeholder1: " "
    })
  },
  inputUnit: function (e) {
    this.data.items5.company = e.detail.value;
    this.setData({
      placeholder1: '请输入客户单位'
    })
  },

  /**
   * 电话
   */
  phonefouce: function (e) {
    this.setData({
      placeholder2: " "
    })
  },
  phone: function (e) {
    this.data.items5.phone = e.detail.value;
  },
  inputPhone: function (e) {
    var phone = e.detail.value;
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    if (reg.test(phone) == true) {
      this.data.items5.phone = e.detail.value;
    } else {
      wx.showModal({
        title: '',
        content: "请输入正确的手机号",
        showCancel: false,
      })
    }

    this.setData({
      placeholder2: '请输入客户联系方式'
    })
  },

  /**
   * 备注
   */
  remarkfouce: function (e) {
    wx.setStorageSync('textarea2', e.detail.value);
    this.setData({
      placeholder3: " "
    })
  },
  remark: function (e) {

    wx.setStorageSync('textarea3', e.detail.value);
  },

  /**
   * 聚焦textarea
   */
  isfouce: function (e) {
    wx.setStorageSync('textarea2', this.data.items5.remark);
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    })
  },

  //取消按钮
  cancel: function () {
    var items5 = {};
    items5.name = this.data.items5.name;
    items5.company = this.data.items5.company;
    items5.phone = this.data.items5.phone;
    items5.title = this.data.items5.title;
    items5.remark = wx.getStorageSync('textarea2');
    this.setData({
      hiddenmodalput: true,
      items5: items5
    });

  },
  //确认
  confirm: function () {
    var items5 = {};
    items5.name = this.data.items5.name;
    items5.company = this.data.items5.company;
    items5.phone = this.data.items5.phone;
    items5.title = this.data.items5.title;
    items5.remark = wx.getStorageSync('textarea3');
    this.setData({
      hiddenmodalput: true,
      modalSure: true,
      items5: items5,
      placeholder3: '请输入备注文本'
    })
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
     * 模板图片展示
     */
  caseImg: function (e) {
    this.setData({
      caseImg: false,
      indicator: true,
      current: 0
    })
  },

  /**
   * 模板图片隐藏
   */
  closeImg: function (e) {
    this.setData({
      caseImg: true,
      indicator: false
    })
  },

  /**
   * 点击切换
   */
  tabIndex: function (event) {
    wx.navigateTo({
      url: event.currentTarget.dataset.href,
    });
  },

  /**
   * 阻止事件冒泡
   */
  defaultTap: function (e) {
    return;
  },


  /**
   * 个人信息填写跳转
   */
  goInfo: function (e) {
    wx.navigateTo({
      url: '/pages/info/index',
    });
  },

  /**
   * 生成报价表
   */
  save: function (e) {

    let that = this;
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');

    // 判断产品模块的个数
    if (that.data.totalNum < 4) {
      wx.showModal({
        title: '',
        content: '产品模块至少选择四项方可提交，请继续填写',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: '#C71B1B',
        success: function () {

        }
      })
    }

    // 判断产品形式
    else if (that.data.isProduce == false) {
      wx.showModal({
        title: '',
        content: '产品形式未选择，请继续填写～',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: '#C71B1B',
        success: function () {

        }
      })
    }

    // 客户信息填写
    else if (that.data.items5.name == '' || that.data.items5.company == '' || that.data.items5.phone == '') {
      wx.showModal({
        title: '',
        content: '客户信息为必填项，请继续填写～',
        showCancel: false,
        confirmText: "我知道了",
        confirmColor: '#C71B1B',
        success: function () {

        }
      })
    } else if (reg.test(that.data.items5.phone) != true) {
      wx.showModal({
        title: '',
        content: "请输入正确的手机号",
        showCancel: false,
      })
    }
    else {

      wx.showLoading({
        title: '正在保存中...',
      })

      wx.setStorageSync("tempData", that.data);
      let data = wx.getStorageSync("tempData");

      // 数据保存
      let sessionData = {};
      sessionData.items = [];
      sessionData.items4 = [];
      sessionData.items5 = {};
      sessionData.items6 = [];

      for (var j = 0; j < data.items.length; j++) {
        var second = {};
        //  先确认一级模块
        if (data.items[j].checked) {
          second = data.items[j];
          sessionData.items.push(second);
          continue;
        } else {
          // second.first = false;
        }
        second = data.items[j];
        let list = [];
        for (var k = 0; k < data.items[j].list.length; k++) {


          if (data.items[j].list[k].check == true) {
            // var id = that.data.items[j].list[k].id;
            // second.list[id] = true;
            list.push(data.items[j].list[k]);
            continue;
          }

        }
        second.list = list;

        if (JSON.stringify(second.list) != "[]") {
          sessionData.items.push(second);
        }


      }

      for (var i = 0; i < sessionData.items.length; i++) {
        if (sessionData.items[i].list.length == 0) {
          sessionData.items.splice(i, 1)
        }
      }

      console.log(sessionData.items)


      if (that.data.items3[0].checked == true) {
        sessionData.items3 = that.data.items3;
      }

      if (that.data.items1[0].checked == true) {
        sessionData.items1 = that.data.items1;
      }

      if (that.data.items2[0].checked == true) {
        sessionData.items2 = that.data.items2;
      }

      let obj2 = [];
      for (let i = 0; i < that.data.items4.length; i++) {
        if (that.data.items4[i].checked == true) {
          obj2 = that.data.items4[i];
          sessionData.items4.push(obj2);
        }
      }

      sessionData.items5 = that.data.items5;
      sessionData.items6 = data.items6;
      sessionData.total = that.data.total-0;
      sessionData.totalNum = that.data.totalNum;
      sessionData.isSure = true; // 稍后修改
      sessionData.n = data.n;
      sessionData.ns = data.ns;

      var data1 = {};
      data1.openId = wx.getStorageSync('openid');
      that.data.items5.title = that.data.items5.name + that.data.items5.company;
      that.data.title = that.data.items5.name + that.data.items5.company;
      data1.product = sessionData;
      data1.id = wx.getStorageSync('optionsId');
      data1.title = that.data.title;

      



      console.log(sessionData)

      utils.requestFun("home/project/saveProject", data1, 'POST', function (msg) {
        if (msg.errCode == 0) {
          setTimeout(function () {

            wx.hideLoading();

            var pages = getCurrentPages();
            if (pages.length > 1) {
              //上一个页面实例对象
              var prePage = pages[pages.length - 2];
              //关键在这里,这里面是触发上个界面
              prePage.changeData(data1)// 不同的人里面的值是不同的，这个数据是我的，具体的你们要根据自己的来查看所要传的参数
              wx.navigateBack({
                delta: 1
              });
            }
          }, 1500)
        }
      })
    }
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
  onReachBottom: function (event) {

  },


  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


})