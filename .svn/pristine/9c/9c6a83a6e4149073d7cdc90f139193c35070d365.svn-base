/* POST请求API*/
function requestPostApi(url, params, sourceObj, successFun, failFun, completeFun) {
  requestApi(url, params, 'POST', 0, sourceObj, successFun, failFun, completeFun)
}
/* POST提交请求API*/
function requestPostDataApi(url, params, sourceObj, successFun, failFun, completeFun) {
  requestApi(url, params, 'POST', 1, sourceObj, successFun, failFun, completeFun)
}

/* GET请求API */
function requestGetApi(url, params, sourceObj, successFun, failFun, completeFun) {
  requestApi(url, params, 'GET', 0, sourceObj, successFun, failFun, completeFun)
}

/* 请求API */
function requestApi(url, params, method, header, sourceObj, successFun, failFun, completeFun) {
  //构造HTTP头
  //Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.101 Safari/537.36
  wx.showLoading({
    title: '请稍后，正在处理..',
    icon: 'loading',
    mask: true,
  });
  var httpUserAgent = "";
  wx.getSystemInfo({
    success: function (res) {
      //手机品牌 手机型号
      httpUserAgent += res.brand + "/" + res.model;
      //操作系统版本-微信版本号
      httpUserAgent += " (" + res.system + "," + res.version + ")";
      //客户端平台 客户端基础库版本
      httpUserAgent += " " + res.platform + "/" + res.SDKVersion;
    }
  });

  var httUserToken = "1234565697";
  var headerOptions = {
    'HTTP_USER_AGENT': httpUserAgent,
    "HTTP_USER_TOKEN": httUserToken,
    'Accept': 'application/json'
  };

  if (url.indexOf("?") > 0) {
    url += "&accessToken=" + wx.getStorageSync('token');
  } else {
    url += "?accessToken=" + wx.getStorageSync('token');
  }

  if (method == 'POST' && header == 0) {
    headerOptions["Content-Type"] = 'application/x-www-form-urlencoded;charset=UTF-8';
  } else if (method == 'POST' && header == 1) {
    headerOptions["Content-Type"] = 'multipart/form-data;charset=UTF-8';
  }

  wx.request({
    url: url,
    method: method,
    data: params,
    header: headerOptions,
    success: function (res) {
      wx.hideLoading();
      //没有权限
      if (res.data.status == 403) {
      }
      //没有登录
      if (res.data.status == 1010) {
        console.log("没有登录");
        wx.switchTab({
          url: '/pages/index/index',
        })


      }
      typeof successFun == 'function' && successFun(res.data, sourceObj)
    },
    fail: function (res) {
      wx.hideLoading();
      typeof failFun == 'function' && failFun(res.data, sourceObj)
    },
    complete: function (res) {
      typeof completeFun == 'function' && completeFun(res.data, sourceObj)
    },

  })
}

module.exports = {
  requestPostApi,
  requestPostDataApi,
  requestGetApi
}