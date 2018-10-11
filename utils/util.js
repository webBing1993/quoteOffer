var md5 = require('./md5.min.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}


/**
 * 时间转换
 */
function timestampToTime(timestamp) {
  var date = new Date(timestamp * 1000); // 时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  return Y + M + D;
}

/**
 * request
 */
function requestFun(url, data, getPost, success) {
  let urlOld = "https://quote.0519ztnet.com/";
  let urlNew = '';
  let header = '';
  var date = '';
  var dat = new Date();
  var year = dat.getFullYear();
  var mo = dat.getMonth() + 1;
  var day = dat.getDate();

  var token = '';
  if (mo < 10) {
    mo = "0" + mo;
  }
  if (day < 10) {
    day = "0" + day
  }

  if (url.indexOf("home") != -1) {
    urlNew = urlOld + url;
    token = md5(url + "*zt$zhengwu%win." + year + "-" + mo + "-" + day);
    
    date = {
      data: JSON.stringify(data),
      token: token
    }

  }else {
    urlNew = url;
    date = data;
  }

  if (getPost == 'POST') {
    header = 'application/x-www-form-urlencoded'
  }else {
    header = 'application/json'
  }

  console.log(date);

  wx.request({
    url: urlNew,
    data: date,
    header: {
      'content-type': header
    },
    method: getPost,
    success: function(res) {
      success(res.data)
    },
    fail: function(res) {
      console.log(res);
    },
    complete: function(res) {},
  })
}



module.exports = {
  timestampToTime: timestampToTime,
  requestFun: requestFun
}
