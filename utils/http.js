const app = getApp()
const {host} = app.globalData

const _http = (method, url, data) => {
  let header

  if (wx.getStorageSync('sessionId')) {
    header = {
      'content-type': 'application/json',
      'cookie': wx.getStorageSync("sessionId")
    }
  }

  return new Promise((resolve, reject) => {
    wx.request({
      data,
      method,
      url: `${host}${url}`,
      header,
      dataType: "JSON",
      me: wx.getStorageSync('me'),
      success: (response) => {
        let statusCode = response.statusCode

        if (statusCode >= 400) {
          if (statusCode === 401) {
            // 未登录，重定向到登录页面
            wx.navigateTo({url: "/pages/login/login"})
          }
          reject({statusCode, response})
        } else {
          resolve(response)
        }
      },
      fail: (errors) => {
        wx.showToast({title: '请求失败', icon: 'none'})
        reject(errors)
      }
    })
  })
}

const http = {
  get: (url, params) => _http('GET', url, params),
  post: (url, data) => _http('POST', url, data),
  put: (url, data) => _http('PUT', url, data),
  delete: (url, data) => _http('DELETE', url, data),
  patch: (url, data) => _http('PATCH', url, data)
}

module.exports = {
  http
}