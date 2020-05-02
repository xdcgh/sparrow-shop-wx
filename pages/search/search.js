const {http} = require("../../utils/http")

Page({

  data: {
    // 默认搜索 寮步镇的
    areaId: 441928,

    freshList: [],

    keyword: "",
    historyKeyword: [],
    searchStatus: false,
  },

  onLoad(query) {
    this.setData({
      areaId: query.areaId
    })
  },

  onShow() {
    if (wx.getStorageSync("historyKeyword")) {
      this.setData({
        historyKeyword: wx.getStorageSync("historyKeyword")
      })
    }
  },

  inputChange(event) {
    this.setData({
      keyword: event.detail.value,
      searchStatus: false
    })
  },

  inputFocus() {
    // 重置结果
    this.setData({
      searchStatus: false,
      freshList: []
    })
  },

  onKeywordConfirm(event) {
    this.getSearchResult(event.detail.value)
  },

  getSearchResult(keyword) {
    const historyKeyword = this.data.historyKeyword

    // 解决重复关键字存入 历史记录
    if (historyKeyword.indexOf(keyword.toString()) < 0) {
      historyKeyword.push(keyword)

      this.setData({
        historyKeyword
      })
      wx.setStorageSync("historyKeyword", historyKeyword)
    }

    this.setData({
      keyword,
      searchStatus: true
    })

    http.get(`/fresh/search?name=${this.data.keyword}&areaId=${this.data.areaId}`)
      .then(response => {
        this.setData({
          freshList: JSON.parse(response.data)["data"]
        })
      })
  },

  clearKeyword() {
    this.setData({
      keyword: '',
      searchStatus: false
    })
  },

  closeSearch() {
    wx.navigateBack()
  },

  clearHistory() {
    this.setData({
      historyKeyword: []
    })
    wx.removeStorageSync("historyKeyword")
  },

  onKeywordTap(event) {
    this.getSearchResult(event.target.dataset.keyword)
  }
})