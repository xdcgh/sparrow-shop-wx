const {cityData} = require('../../../utils/city.js')
const {http} = require('../../../utils/http.js')

Page({
  areaId: 0,

  data: {
    defaultProvinceCode: 18,
    defaultCityCode: 16,
    defaultCountyCode: 0,
    provinceList: [],
    cityList: [],
    areaList: [],

    selProvinceName: '请选择',
    selCityName: '请选择',
    selAreaName: '请选择',
    selProvinceIndex: 0,
    selCityIndex: 0,
    selAreaIndex: 0
  },
  bindCancel: function () {
    wx.navigateBack()
  },
  bindSave: function (e) {
    const name = e.detail.value["name"]
    const detail = e.detail.value["detail"]
    const phone = e.detail.value["phone"]

    if (name === "") {
      wx.showModal({
        title: '提示',
        content: '请填写联系人姓名',
        showCancel: false
      })
      return
    }
    if (phone === "") {
      wx.showModal({
        title: '提示',
        content: '请填写手机号码',
        showCancel: false
      })
      return
    }

    if (phone.length !== 11) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号码',
        showCancel: false
      })
      return
    }

    if (this.data.selProvinceName === "请选择" || this.data.selCityName === "请选择" || this.data.selAreaName === "请选择") {
      wx.showModal({
        title: '提示',
        content: '请选择地区',
        showCancel: false
      })
      return
    }
    if (detail === "") {
      wx.showModal({
        title: '提示',
        content: '请填写详细地址',
        showCancel: false
      })
      return
    }


    // 判断该页的提交是更新还是创建
    //
    // let apiAddoRuPDATE = "add"
    // let apiAddid = that.data.id
    // if (apiAddid) {
    //   apiAddoRuPDATE = "update"
    // } else {
    //   apiAddid = 0
    // }

    console.log(name,phone,this.areaId,detail);

    http.post("/address", {
      name,
      phone,
      detail,
      areaId: this.areaId,
    }).then(() => {
      wx.navigateBack()
    },response => {
      wx.showModal({
        title: '提示',
        content: JSON.parse(response.response.data)["message"],
        showCancel: false
      })
    })

  },
  selectCity: function () {

  },
  bindPickerProvinceChange: function (event) {
    let selItem = cityData[event.detail.value]

    this.setData({
      selProvinceName: selItem.name,
      selProvinceIndex: event.detail.value,
      selCityName: '请选择',
      selCityIndex: 0,
      selAreaName: '请选择',
      selAreaIndex: 0
    })
    this.initData(2, selItem)
  },
  bindPickerCityChange: function (event) {
    let selItem = cityData[this.data.selProvinceIndex].cityList[event.detail.value]
    this.setData({
      selCityName: selItem.name,
      selCityIndex: event.detail.value,
      selAreaName: '请选择',
      selAreaIndex: 0
    })
    this.initData(3, selItem)
  },
  bindPickerAreaChange: function (event) {
    let selItem = cityData[this.data.selProvinceIndex].cityList[this.data.selCityIndex].districtList[event.detail.value]
    if (selItem && selItem.name && event.detail.value) {
      this.areaId = selItem.id

      this.setData({
        selAreaName: selItem.name,
        selAreaIndex: event.detail.value
      })
    }
  },

  initData: function (level, obj) {
    // level 1 , 2 , 3 分别初始化 省份，市级，地区 列表
    // obj 为对应的省（市、或地区）的列表对象

    if (level === 1) {
      let provinceList = []
      for (let i = 0; i < cityData.length; i++) {
        provinceList.push(cityData[i].name)
      }
      this.setData({
        provinceList
      })
    } else if (level === 2) {
      let cityList = []
      let tempArray = obj.cityList
      for (let i = 0; i < tempArray.length; i++) {
        cityList.push(tempArray[i].name)
      }
      this.setData({
        cityList
      })
    } else if (level === 3) {
      let areaList = []
      let tempArray = obj.districtList
      for (let i = 0; i < tempArray.length; i++) {
        areaList.push(tempArray[i].name)
      }
      this.setData({
        areaList: areaList
      })
    }
  },


  onLoad: function (e) {
    this.initData(1)
    // let id = e.id
    // if (id) {
    //   // 初始化原数据
    //   wx.showLoading()
    //   wx.request({
    //     url: 'https://api.it120.cc/' + app.globalData.subDomain + '/user/shipping-address/detail',
    //     data: {
    //       token: wx.getStorageSync('token'),
    //       id: id
    //     },
    //     success: function (res) {
    //       wx.hideLoading()
    //       if (res.data.code == 0) {
    //         that.setData({
    //           id: id,
    //           addressData: res.data.data,
    //           selProvinceName: res.data.data.provinceStr,
    //           selCityName: res.data.data.cityStr,
    //           selAreaName: res.data.data.areaStr
    //         })
    //         that.setDBSaveAddressId(res.data.data)
    //         return
    //       } else {
    //         wx.showModal({
    //           title: '提示',
    //           content: '无法获取快递地址数据',
    //           showCancel: false
    //         })
    //       }
    //     }
    //   })
    // }
  },
})
