//toOrder.js
//获取应用实例
const {http} = require("../../../utils/http")

Page({
  data: {
    address: null,
  },

  onShow() {
    http.get("/address/default").then(response => {
      this.setData({
        address: JSON.parse(response.data)["data"]
      })
    })
  },

  selectAddress() {
    wx.navigateTo({
      url: "/pages/address/select/index"
    })
  },

  addAddress() {
    wx.navigateTo({
      url: "/pages/address/add/index"
    })
  },
})
