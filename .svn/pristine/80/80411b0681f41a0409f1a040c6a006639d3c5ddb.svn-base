// pages/ticket/ticketResult/ticketResult.js
var app = getApp();
Page({
  data: {
    flag: 1,
    flagList: [],
  },

  onLoad: function (options) {
    var that = this;
    var flag = options.flag;
    var code = options.code;
    var url = app.apiUrl + "/Coupon/TicketShow";
    var params = {
      code: code,
      flag: flag,
    }
    that.setData({
      flag: flag,
      code, code,
    })
    console.log("传递的flag", flag);
    console.log("传递的code", code);
    // 调用网络接口
    app.request.requestGetApi(url, params, this, function (res) {
      var res = JSON.parse(decodeURIComponent(JSON.stringify(res)));     //解决乱码问题
      var code = res.result;
      var flag = res.result;
      var flagList = res.result;
      if (res.status == 200 &&res.result != null) {
        //转化时间戳处理
        flagList.product.start_date = toDate(flagList.product.start_date);
        flagList.product.stop_date = toDate(flagList.product.stop_date);
        that.setData({
          flagList: res.result,
        })
      } else {
        console.log(res);
      }
      console.log(that.data.flagList)
    }, this.Funfail)
  },

  //点击 返回首页 按钮
  back: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },

  //点击 钱包余额 按钮
  wallet: function () {
    wx.reLaunch({
      url: '/pages/ucenter/wallet/wallet',
    })
  },

  //点击 我的礼包 按钮
  pakege: function () {
    wx.reLaunch({
      url: '/pages/ucenter/package/packageList/packageList',
    })
  },

  //点击 重新填写 按钮
  navBack: function () {
    wx.navigateBack()
  }
})

//时间戳转换时间  
function toDate(number) {
  var n = number * 1000;
  var date = new Date(n);
  var Y = date.getFullYear() + '/';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/';
  var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
  return (Y + M + D)
}  