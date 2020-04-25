// pages/recharge/recharge.js
const util = require('../../utils/util.js')
const {http} = require('../../utils/http.js')

Page({

  rechargeAccount: 0,

  /**
   * 页面的初始数据
   */
  data: {
    account: 0
  },
  watchAmount(event) {
    this.rechargeAccount = event.detail.value
  },
  toRecharge() {

    if (this.rechargeAccount == 0) {
      wx.showToast({
        title: '请输入大于 0 的金额',
        icon: 'none',
        duration: 2000
      })

      return
    }

    http.post(`/recharge`, {
      rechargeAccount: this.rechargeAccount
    }).then(response => {
      wx.setStorageSync('me', JSON.parse(response.data).data)

      wx.showToast({
        title: '充值成功',
        icon: 'success',
        duration: 2000,
        complete: () => {
          setTimeout(function() {
            wx.navigateBack()
          }, 2000)
        }
      })

    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '我的账户'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      account: util.getAccount()
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})