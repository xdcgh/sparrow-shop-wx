// pages/my/my.js
const app = getApp()
const {userInfo} = app.globalData
const util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isLogin: false,
    version: "0.0.1",
    account: 0
  },
  login() {
    wx.navigateTo({url: "/pages/login/login"})
  },
  aboutAuthor() {
    wx.showModal({
      title: '关于作者',
      content: '我是20届软件工程的毕业生，许达成。此系统是我的毕业设计，希望大家使用愉快！',
      showCancel: false
    })
  },
  rightOfState() {
    wx.showModal({
      title: '版权说明',
      content: '此系统不做任何商业用途，仅学习使用',
      showCancel: false
    })
  },
  moreFunction() {
    wx.showModal({
      title: '更多功能',
      content: '在抓紧开发中，敬请期待！',
      showCancel: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
      isLogin: util.isLogin(),
      account: userInfo.account
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