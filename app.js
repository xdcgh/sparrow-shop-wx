//app.js
App({
  globalData: {
    host: 'http://192.168.31.15:8080',
    userInfo: wx.getStorageSync("me")
  }
})