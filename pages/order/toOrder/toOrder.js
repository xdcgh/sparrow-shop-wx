//toOrder.js
//获取应用实例
const {http} = require("../../../utils/http")

Page({
  data: {
    address: null,
  },

  submit() {
    // 先判断是否有地址信息，没有则提示要新建地址
    if (!this.data.address) {
      wx.showToast({
        title: '请先添加地址',
        icon: 'none',
        duration: 2000
      })

      return
    }

    // 判断用户金额是否够支付，不够则提示支付失败，当前余额为 xxx
    const userMoney = wx.getStorageSync('me').account

    if (userMoney < this.data.totalMoney) {
      wx.showModal({
        title: '余额不足',
        content: `当前账户余额为: ${userMoney}元`,
        showCancel: false
      })

      return
    }

    // 组装数据吧
    http.post("/order", {
      shop: this.data.shop,
      address: this.data.address,
      totalMoney: this.data.totalMoney,
      freshList: this.data.freshList
    }).then(() => {
      wx.showToast({
        title: '下单成功！',
        icon: 'success',
        duration: 2000,

        complete: () => {
          setTimeout(() => {

            wx.removeStorageSync(`shopData${this.data.shop.id}`)

            wx.switchTab({
              url: "/pages/order/list/list"
            })
          }, 2000)
        }
      })
    }, () => {
      wx.showToast({
        title: '服务出问题了，稍后再试！',
        icon: 'success',
        duration: 2000,
      })
    })
  },

  onLoad(event) {
    // 从本地，初始化生鲜
    this.readLocalData(event.id)
  },

  readLocalData(shopId) {
    const shopData = JSON.parse(wx.getStorageSync(`shopData${shopId}`))
    this.setData({
      shop: shopData.shop,
      totalMoney: shopData.totalMoney,
      freshList: shopData.cart
    })
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
