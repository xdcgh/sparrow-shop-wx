const {http} = require('../../utils/http')

Page({
  data: {},
  login(event) {
    wx.login({
      success: (response) => this.onGetCode({
        ...response,
        ...event.detail.userInfo
      }),
      fail: (error) => this.onError(error)
    })
  },
  onGetCode({code,nickName,avatarUrl}) {
    http.post('/api/wx/login', {
      code,
      nickName,
      avatar: avatarUrl
    }).then(response => {
      wx.setStorageSync('me', JSON.parse(response.data))

      wx.reLaunch({
        url: "/pages/index/index"
      })
    })
  }
})