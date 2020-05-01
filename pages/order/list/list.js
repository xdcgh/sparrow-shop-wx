// pages/order/list/list.js
const {http} = require("../../../utils/http")

Page({

  data: {
    orderList: []
  },
  cancelOrder(event) {

  },

  onShow() {
    http.get("/order").then(response => {
      this.setData({
        orderList: JSON.parse(response.data)["data"]
      })
    })
  },

  callShopOwen(event) {
    wx.makePhoneCall({
      phoneNumber: event.target.dataset.phone
    })
  }
})