// pages/recharge/recharge.js
const util = require('../../utils/util.js')
const {http} = require('../../utils/http.js')

Page({

  rechargeAccount: 0,

  data: {
    account: 0
  },
  watchAmount(event) {
    this.rechargeAccount = event.detail.value
  },
  toRecharge() {
    this.toChangeAccount("recharge", "充值")
  },

  toWithdraw() {
    this.toChangeAccount("withdraw", "提现")
  },

  toChangeAccount(api, string) {
    if (this.rechargeAccount == 0) {
      wx.showToast({
        title: '请输入大于 0 的金额',
        icon: 'none',
        duration: 2000
      })

      return
    }

    // 提现的金额大于账户余额，就给提示，不给提现
    if (string === "提现" && this.rechargeAccount > this.data.account) {
      wx.showToast({
        title: `你的提现金额大于账户的￥${this.data.account}哦`,
        icon: 'none',
        duration: 2000
      })

      return
    }

    wx.showModal({
      title: '提示',
      content: `确定要${string}￥${this.rechargeAccount}元吗？`,
      success: (res) => {
        if (res.confirm) {
          http.post(`/${api}`, {
            rechargeAccount: this.rechargeAccount
          }).then(response => {
            wx.setStorageSync('me', JSON.parse(response.data).data)

            wx.showToast({
              title: `${string}成功`,
              icon: 'success',
              duration: 2000,
              complete: () => {
                setTimeout(function () {
                  wx.navigateBack()
                }, 2000)
              }
            })
          })
        }
      }
    })
  },
  onShow: function () {
    this.setData({
      account: util.getAccount()
    })
  },
})