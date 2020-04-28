const {http} = require("../../utils/http")

Page({
  data: {
    storeList: [],
    areaId: "441928",
    areaName: "寮步镇"
  },

  onLoad() {
    // 发起请求，先把寮步镇的所有的店铺请求回来
    // 展示出店铺

    http.get(`/shop/area/${this.data.areaId}`).then(response => {
      this.setData({
        storeList: JSON.parse(response.data)["data"]
      })
    })
  },

  selectShop(event) {
    const id = event.detail

    http.get(`/shop/id/${id}`).then(response => {
      console.dir(response)
    })
  }
})
