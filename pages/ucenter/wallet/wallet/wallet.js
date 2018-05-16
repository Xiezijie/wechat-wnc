// pages/ucenter/wallet/wallet.js
//获取应用实例
var app = getApp();

Page({
  data: {
    startdate: '2017/12/5',
    enddate: '2017/12/5',
    flag: 1,
    list: [],                 //存储请求回来的数据
  },

  /*********   失败函数调用处理    ********/
  failFun: function (res) {
    console.log("failfun", res);
  },

  onLoad: function (options) {
    var that = this;
    var timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;

    //获取当前时间  
    var n = timestamp * 1000;
    var date = new Date(n);
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    that.setData({
      startdate: Y + "-01-01",
      enddate: Y + "-" + M + "-" + D,
      start: (Y - 10) + "-01-01",
      end: (Y + 10) + "-01-01",
    });

    //请求钱包数据
    that.getWalletInfo('', '');
  },

  //获取 钱包 数据
  getWalletInfo: function (startdate, enddate) {
    var that = this;
    var url = app.apiUrl + '/Market/WalletDetail';
    var params = {
      startdate: startdate,
      enddate: enddate,
    };
    app.request.requestPostApi(url, params, this, function (res) {
      console.log(res);
      var list = res.result;
      if (res.status == 200) {
        if (list.stream != null) {
          //转化时间戳处理
          for (var i = 0; i < list.stream.length; i++) {
            list.stream[i].dateline = toDate(list.stream[i].dateline);
          }
        }
        console.log(list)

        that.setData({
          list: list
        })
      } else {
        console.log(res);
      }
    }, that.failFun)
  },

  //点击日期组件确定事件 
  bindstartDateChange: function (e) {
    this.setData({
      startdate: e.detail.value
    })
  },
  bindendDateChange: function (e) {
    this.setData({
      enddate: e.detail.value
    })
  },

  //点击 筛选 按钮
  dateSubmit: function (e) {
    var that = this;
    var startdate = that.data.startdate;
    var enddate = that.data.enddate;
    console.log(startdate);
    console.log(enddate);

    //请求钱包数据
    that.getWalletInfo(startdate, enddate);
  },

  //点击 点我充值 按钮
  recharge: function(e){
    wx.navigateTo({
      url: '/pages/ucenter/wallet/recharge/recharge',
    })
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