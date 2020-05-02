const {http} = require("../../utils/http")

Page({
  areaList: [],

  data: {
    storeList: [],

    areaNameList: [],
    areaIndex: 3,
    areaId: "441928",
    areaName: "寮步镇"
  },

  onLoad() {
    // 发起请求，先把寮步镇的所有的店铺请求回来
    // 展示出店铺
    http.get("/address/areaList").then(response => {
      this.areaList = JSON.parse(response.data)["data"]
      const areaNameList = []

      this.areaList.forEach(area => {
        areaNameList.push(area.name)
      })

      this.setData({
        areaNameList
      })
    })

    this.getShopList()
  },

  getShopList() {
    http.get(`/shop/area/${this.data.areaId}`).then(response => {
      this.setData({
        storeList: JSON.parse(response.data)["data"]
      })
    })
  },

  selectShop(event) {
    const id = event.detail

    wx.navigateTo({
      url: "/pages/shop/shop?id=" + id
    })
  },

  bindPickerAreaChange(event) {
    let areaIndex = event.detail.value

    this.setData({
      areaIndex,
      areaName: this.areaList[areaIndex].name,
      areaId: this.areaList[areaIndex].id
    })

    this.getShopList()
  }
})
