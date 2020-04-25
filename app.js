//app.js
App({
  globalData: {
    host: 'http://192.168.31.15:8080/api/wx',
    userInfo: wx.getStorageSync("me")
  }
})