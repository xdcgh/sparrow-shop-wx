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
    selAreaIndex: 0,

    wxAddress: null,

    address: null
  },
  readFromWx() {
    let that = this
    wx.chooseAddress({
      success(res) {
        let provinceName = res.provinceName
        let cityName = res.cityName
        let AreaName = res.countyName

        console.log(res)

        // 匹配省级
        for (let i = 0; i < cityData.length; i++) {
          if (provinceName === cityData[i].name) {
            // 拿到省列表的第 i 个，并按照event事件传回去
            let eventJ = {detail: {value: i}}

            that.bindPickerProvinceChange(eventJ)

            // 匹配市级
            for (let j = 0; j < cityData[i].cityList.length; j++) {
              if (cityName === cityData[i].cityList[j].name) {
                eventJ = {detail: {value: j}}

                that.bindPickerCityChange(eventJ)

                console.log(cityData[i].cityList[j].districtList)
                // 匹配地区
                for (let k = 0; k < cityData[i].cityList[j].districtList.length; k++) {
                  if (AreaName === cityData[i].cityList[j].districtList[k].name) {

                    eventJ = {detail: {value: k}}
                    that.bindPickerAreaChange(eventJ)
                  }
                }
              }
            }
          }
        }

        that.setData({
          wxAddress: res,
        })
      }
    })
  },

  bindCancel: function () {
    wx.navigateBack()
  },
  bindSave: function (e) {
    const name = e.detail.value["name"]
    const detail = e.detail.value["detail"]
    const phone = e.detail.value["phone"]

    // 数据清洗
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

    // 判断当前行为是更新还是创建
    if (this.data.address.id !== null) {
      // 说明是更新
      http.post("/address/update", {
        id: this.data.address.id,
        name,
        phone,
        detail,
        areaId: this.areaId,
      }).then(() => {
        wx.showToast({
          title: '更新成功',
          icon: 'success',
          duration: 2000,
          complete: () => {
            setTimeout(function () {
              wx.navigateBack()
            }, 2000)
          }
        })
      }, response => {
        wx.showModal({
          title: '提示',
          content: JSON.parse(response.response.data)["message"],
          showCancel: false
        })
      })
    } else {
      // 说明是创建
      http.post("/address", {
        name,
        phone,
        detail,
        areaId: this.areaId,
      }).then(() => {
        wx.showToast({
          title: '添加成功',
          icon: 'success',
          duration: 2000,
          complete: () => {
            setTimeout(function () {
              wx.navigateBack()
            }, 2000)
          }
        })
      }, response => {
        wx.showModal({
          title: '提示',
          content: JSON.parse(response.response.data)["message"],
          showCancel: false
        })
      })
    }



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

    http.get(`/address/${e.id}`).then(response => {
      const address = JSON.parse(response.data)["data"]

      // 如 areaId = 441912
      // provinceId = 440000
      // cityId = 441900
      const provinceId = address.areaId.toString().substring(0, 2) + "0000"
      const cityId = address.areaId.toString().substring(0, 4) + "00"

      // 通过 id 匹配省级
      for (let i = 0; i < cityData.length; i++) {
        if (provinceId == cityData[i].id) {
          // 拿到省列表的第 i 个，并按照event事件传回去
          let eventJ = {detail: {value: i}}

          this.bindPickerProvinceChange(eventJ)

          // 匹配市级
          for (let j = 0; j < cityData[i].cityList.length; j++) {
            if (cityId == cityData[i].cityList[j].id) {
              eventJ = {detail: {value: j}}

              this.bindPickerCityChange(eventJ)

              console.log(cityData[i].cityList[j].districtList)
              // 匹配地区
              for (let k = 0; k < cityData[i].cityList[j].districtList.length; k++) {
                if (address.areaId == cityData[i].cityList[j].districtList[k].id) {

                  eventJ = {detail: {value: k}}
                  this.bindPickerAreaChange(eventJ)
                }
              }
            }
          }
        }
      }

      this.setData({
        address
      })
    })
  },

  deleteAddress: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '提示',
      content: '确定要删除该收货地址吗？',
      success: function (res) {
        if (res.confirm) {
          http.delete(`/address/${id}`).then(() => {
            wx.showToast({
              title: '删除成功',
              icon: 'success',
              duration: 2000,
              complete: () => {
                setTimeout(function () {
                  wx.navigateBack()
                }, 2000)
              }
            })
          }, response => {
            wx.showModal({
              title: '提示',
              content: JSON.parse(response.response.data)["message"],
              showCancel: false
            })
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

})
