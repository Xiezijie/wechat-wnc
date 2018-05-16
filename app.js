
const request = require('./res/request.js');
const secure = require('./res/md5.js');
import wxValidate from './res/wxValidate.js';
App({

  
  ///程序初始化调用
  onShow: function () {
    var that = this;
    var userInfo = wx.getStorageSync("userInfo");
    console.log(userInfo);
    if (userInfo) {
      that.globalData.userInfo = userInfo;
    } else {
      that.onSbdLogin();
    }

  },
  onSbdLogin: function () {
    var that = this;
    //调用登录接口
    var header = {
      "accept": "application/json",
      "content-type": "application/x-www-form-urlencoded;charset=UTF-8"
    };
    //登录
    wx.login({
      success: function (res) {
        if (res.code) {
          wx.getUserInfo({
            withCredentials: true,
            success: function (resUser) {
              that.globalData.userInfo = resUser.userInfo;
              console.log(that.globalData.userInfo);
              typeof cb == "function" && cb(that.globalData.userInfo);
              wx.request({
                url: that.apiUrl + '/Consumer/WeixinLogin',
                header: header,
                data: {
                  code: res.code
                },
                method: "POST",
                success: function (response) {
                  if (response.data.status == 200) {
                    console.log(response.data.result.openid);
                    if (response.data.result.openid != undefined) {

                      //登录系统
                      wx.request({
                        url: that.apiUrl + "/Consumer/Login",
                        header: header,
                        data: {
                          fromType: 4,
                          fromOpenId: response.data.result.openid
                        },
                        method: "POST",
                        success: function (res) {
                          var result = res.data;
                          if (result.status == 200) {
                            //设置全局accessToken
                            if (result.hasOwnProperty("result")) {
                              if (result.result.hasOwnProperty("accessToken")) {
                                wx.setStorageSync("token", result.result.accessToken);
                              }
                            }
                          }
                          else if (result.status == 4014) {
                            var registerOptions = {
                              from_type: 4,
                              from_open_id: response.data.result.openid,
                              fullname: that.globalData.userInfo.nickName,
                              attachUrl: that.globalData.userInfo.avatarUrl
                            }
                            wx.request({
                              url: that.apiUrl + "/Consumer/Register",
                              header: header,
                              method: "POST",
                              data: registerOptions,
                              success: function (res) {
                                var result = res.data;
                                if (result.status == 4040 || result.status == 200) {
                                  wx.request({
                                    url: that.apiUrl + "/Consumer/Login",
                                    header: header,
                                    data: {
                                      fromType: 4,
                                      fromOpenId: response.data.openid
                                    },
                                    method: "POST",
                                    success: function (res) {
                                      var result = res.data;
                                      if (result.status == 200) {
                                        if (result.hasOwnProperty("result")) {
                                          if (result.result.hasOwnProperty("accessToken")) {
                                            wx.setStorageSync("token", result.result.accessToken);
                                          }
                                        }
                                      }
                                    }
                                  })
                                }
                              }

                            });
                          }
                        }
                      });
                    } else {
                      console.log("获取用户信息失败" + resUser.errMsg);
                    }

                  } else {
                    console.log("获取OPENID失败" + resUser.errMsg);
                  }
                }
              })

            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg);
        }
      }
    })
  },

  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
    }
  },
  request: request,
  /**
   * 定义的接口域名
   */
  apiUrl: 'http://wnc.chsparta.com',

  globalData: {
    userInfo: null
  },
  wxValidate: (rules, messages) => new wxValidate(rules, messages),

  //时间戳转换函数
  toDate: function (number,status){
    var n = number * 1000;
    var date = new Date(n);
    var Y = date.getFullYear() + '-';
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + " ";
    var h = " " + date.getHours() + ":";
    var m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
    if (status == "time") {
      return (Y + M + D + h + m)
    } else {
      return (Y + M + D)
    }
  },
})