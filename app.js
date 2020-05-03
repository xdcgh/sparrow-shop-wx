//app.js
App({
  globalData: {
    // host: 'http://192.168.31.15:8080/api/wx',
    host: 'http://xdc.myds.me:9080/api/wx',
    userInfo: wx.getStorageSync("me")
  },
  onLaunch(options) {
    // wx.setEnableDebug({
    //   enableDebug: true
    // })
  }
})