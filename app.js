//app.js
App({
  globalData: {
    // host: 'http://192.168.31.15:8080/api/wx',
    // host: 'http://xdc.myds.me:8080/api/wx',
    // host: 'http://xdc.myds.me:9080/api/wx',
    host: 'https://panbyte.cn:9443/api/wx',
    userInfo: wx.getStorageSync("me"),
    version: "1.3.3"
  }
})
