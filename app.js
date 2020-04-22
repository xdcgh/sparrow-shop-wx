//app.js
App({
  globalData: {
    host: 'http://localhost:8080',
    userInfo: wx.getStorageSync("me")
  }
})