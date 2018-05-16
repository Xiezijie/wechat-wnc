// pages/ucenter/certifiedMember/applicationResult/applicationResult.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flags:'',
    fullname:"",
    mobile:'',
    companys:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var fullname = options.fullname;
    var mobile = options.mobile;
    var companys = options.companys;
    var flags = options.flags;
    console.log(options);
    that.setData({
      fullname: options.fullname,
      mobile: options.mobile,
      companys: options.companys,
      flags: flags,
    })
  },

  // 返回个人中心
  navBack: function () {
    wx.reLaunch({
      url: '/pages/ucenter/ucenter/ucenter',
    })
  },
  // 返回主页
  back: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  }
})