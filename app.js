//app.js
App({
  
  onLaunch: function(ops) {

   var logs = wx.getStorageSync('logs') || []
   logs.unshift(Date.now())
   wx.setStorageSync('logs', logs)

   if (ops.scene == 1044) {
     this.globalData.shareTicket = ops.shareTicket
   }
  },
  globalData: {
    userInfo: null,
    appid: 'wxa83a7e91ff7620cd',
    secret: 'd3f5e13c6aa942b05f60558b4b62bf2f'
  }
  
});


