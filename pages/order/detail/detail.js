const {http} = require("../../../utils/http")
const {formatTime} = require("../../../utils/util")

Page({

  data: {
    order: {}
  },

  onLoad(event) {
    http.get(`/order/${event.id}`).then(response => {
      const order = JSON.parse(response.data)["data"]

      order.createdAt = formatTime(new Date(order.createdAt))

      this.setData({
        order
      })
    })
  },

  callShopOwen(event) {
    wx.makePhoneCall({
      phoneNumber: event.target.dataset.phone
    })
  }
})