// pages/store/shop.js
const {http} = require("../../utils/http")

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 高度模块
    listHeight: 300,
    heightArr: [],

    // 转跳索引模块
    activeIndex: 0,
    viewTo: "",

    // 商铺和生鲜展示模块
    shop: null,
    typeFreshLists: [],

    // 购物车模块
    showCart: false,
    cart: [],
    totalMoney: 0
  },

  cartReduce(e) {
    const fresh = this.data.cart[e.target.dataset.index]

    this.reduceFresh(fresh.groupIndex, fresh.freshIndex)
  },

  cartAdd(e) {
    // 拿到当前操作的生鲜，里面有记录 类型 和 生鲜 的索引值
    const fresh = this.data.cart[e.target.dataset.index]

    this.addFresh(fresh.groupIndex, fresh.freshIndex)
  },

  listCart() {
    if (this.data.cart.length > 0) {
      this.setData({
        showCart: !this.data.showCart
      })
    }
  },

  selectFreshType(e) {
    this.setData({
      activeIndex: e.target.dataset.index,
      viewTo: e.target.dataset.typeid
    })
  },

  addFresh: function (groupIndex, freshIndex) {
    let fresh = this.data.typeFreshLists[groupIndex]["freshList"][freshIndex]

    this.setData({
      // 生鲜自己的数量加一
      ["typeFreshLists[" + groupIndex + "].freshList[" + freshIndex + "].count"]: fresh.count + 1,
      // 该生鲜的类别数量加一
      ["typeFreshLists[" + groupIndex + "].currentCount"]: this.data.typeFreshLists[groupIndex]["currentCount"] + 1
    })


    // 添加到购物车
    let cart = this.data.cart
    let hasCart = false

    let i
    for (i = 0; i < cart.length; i++) {
      if (cart[i]["id"] === fresh.id) {
        hasCart = true
        break
      }
    }

    if (hasCart) {
      // 向当前生鲜数量加一
      cart[i]["count"]++
    } else {
      cart.push({
        ...fresh,
        // 为后面购物车数量加一，能索引到当前生鲜
        groupIndex,
        freshIndex
      })
    }

    this.setData({
      cart,
      // 购物车总结，加上当前生鲜单价
      totalMoney: this.data.totalMoney + fresh.price
    })
  }, add(e) {
    let groupIndex = e.target.dataset.groupIndex
    let freshIndex = e.target.dataset.freshIndex

    this.addFresh(groupIndex, freshIndex)
  },

  reduceFresh: function (groupIndex, freshIndex) {
    let fresh = this.data.typeFreshLists[groupIndex]["freshList"][freshIndex]

    this.setData({
      // 生鲜自己的数量加一
      ["typeFreshLists[" + groupIndex + "].freshList[" + freshIndex + "].count"]: fresh.count - 1,
      // 该生鲜的类别数量加一
      ["typeFreshLists[" + groupIndex + "].currentCount"]: this.data.typeFreshLists[groupIndex]["currentCount"] - 1
    })

    // 更新购物车
    let cart = this.data.cart
    let i

    for (i = 0; i < cart.length; i++) {
      if (cart[i]["id"] === fresh.id) {
        if (cart[i].count === 1) {
          cart.splice(i, 1)
        } else {
          cart[i].count--
        }
        break
      }
    }

    this.setData({
      cart: cart,
      totalMoney: this.data.totalMoney - fresh.price
    })
  }, reduce(e) {
    let groupIndex = e.target.dataset.groupIndex
    let freshIndex = e.target.dataset.freshIndex

    this.reduceFresh(groupIndex, freshIndex)
  },

  onLoad(event) {
    const shopId = event.id

    http.get(`/fresh/shop/${shopId}`).then(response => {
      this.setData({
        ...JSON.parse(response.data)["data"]
      })

    })
  },

  onReady: function () {
    this.calculateListHeight()
  },

  // 设置生鲜商品列表的高度
  calculateListHeight() {
    let windowHeight = wx.getSystemInfoSync().windowHeight
    let query = wx.createSelectorQuery()

    query.select(".head").boundingClientRect()
    query.exec(res => {
      this.setData({
        listHeight: windowHeight - res[0].height
      })

      this.calculateHeight()
    })
  },

  // 实时算出每组的高度
  calculateHeight() {
    let heightArr = []
    let height = 0

    heightArr.push(height)

    const query = wx.createSelectorQuery()

    query.selectAll(".title-group").boundingClientRect()
    query.exec(res => {
      for (let i = 0; i < res[0].length; i++) {
        height += parseInt(res[0][i].height)
        heightArr.push(height)
      }
      this.setData({
        heightArr
      })
    })
  },

  scroll(e) {
    let scrollTop = e.detail.scrollTop
    for (let i = 0; i < this.data.heightArr.length; i++) {
      if (
        scrollTop >= this.data.heightArr[i] &&
        scrollTop < this.data.heightArr[i + 1] &&
        this.data.activeIndex !== i
      ) {
        this.setData({
          activeIndex: i
        })
        if (i < 3) {
          this.setData({
            viewToLeft: '1left'
          })
        } else {
          this.setData({
            viewToLeft: (i - 2) + 'left'
          })
        }
        return
      }
    }
  },
})