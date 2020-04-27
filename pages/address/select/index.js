const {http} = require("../../../utils/http")

Page({
  data: {
    addressList:[]
  },

  selectTap: function (e) {
    let id = e.currentTarget.dataset.id;

    http.post(`/address/${id}`).then(() => {
      wx.navigateBack()
    })
  },

  addAddress : function () {
    wx.navigateTo({
      url:"/pages/address/add/index"
    })
  },

  editAddress: function (e) {
    // wx.navigateTo({
    //   url: "/pages/address-add/index?id=" + e.currentTarget.dataset.id
    // })
  },

  onLoad: function () {

  },
  onShow : function () {
    this.initAddressList();
  },
  initAddressList: function () {
    http.get("/address").then(response => {
      this.setData({
        addressList: JSON.parse(response.data).data
      })
    })
  }

})
