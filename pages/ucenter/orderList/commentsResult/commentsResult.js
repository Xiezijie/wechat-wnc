// pages/shopping/payResult/payResult.js
Page({
  data: {
    status: 0,            //判断支付是否成功
  },

  onLoad: function (options) {
    console.log(options);
    var that = this;
    if (options.hasOwnProperty('status') || options.status == undefined) {
      var status = options.status
      that.setData({
        status: status,
      })
    } else {
      wx.navigateBack();
      console.log('没有传递status，或者传值不正确');
    }
  },

  //点击 去订单支付 按钮
  order: function () {
    wx.reLaunch({
      url: '/pages/ucenter/orderList/orderList/orderList',
    })
  },

  //点击 返回主页 按钮
  back: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
})