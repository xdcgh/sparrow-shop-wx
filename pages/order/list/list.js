// pages/order/list/list.js
const {http} = require("../../../utils/http")

Page({

  data: {
    orderList: []
  },
  cancelOrder(event) {
    wx.showModal({
      title: '提示',
      content: '确定要申请退款吗？',
      success: (res) => {
        if (res.confirm) {

          http.post("/order/update",{
            id: event.target.dataset.orderId,
            status: "退款中"
          })

          wx.showToast({
            title: '申请成功！',
            icon: 'success',
            duration: 1500,

            complete: () => {
              setTimeout(() => {
                this.onShow()
              }, 1500)
            }
          })
        }
      }
    })
  },

  onShow() {
    http.get("/order").then(response => {
      this.setData({
        orderList: JSON.parse(response.data)["data"]
      })
    })

    wx.stopPullDownRefresh()
  },

  callShopOwen(event) {
    wx.makePhoneCall({
      phoneNumber: event.target.dataset.phone
    })
  },
  onPullDownRefresh() {
    this.onShow()
  },
  confirmOrder(event) {
    wx.showModal({
      title: '提示',
      content: '确定收货吗？',
      success: (res) => {
        if (res.confirm) {

          http.post("/order/update",{
            id: event.target.dataset.orderId,
            status: "已完成"
          })

          wx.showToast({
            title: '订单已确认！',
            icon: 'success',
            duration: 1500,

            complete: () => {
              setTimeout(() => {
                this.onShow()
              }, 1500)
            }
          })
        }
      }
    })
  }
})
