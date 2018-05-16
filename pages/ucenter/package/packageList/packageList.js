var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,                             // tab切换  
    windowHeight: 0,                           //获取屏幕高度  
    cliHeight: 0,                              //获取高度  
    packageList: [],                             //全部列表
    packageLists: [],                             //未使用列表
    packageListf: [],                            //已失效列表
    start: 1,                       //当前页数
    perpage: 6,   //一页数量
    hidden: true,
    hidden1: true,
    hidden2: true,
    currentTab: 0,
    loadMore: true,                //是否能够加载数据
    loadMore1: true,                //是否能够加载数据
    loadMore2: true,                //是否能够加载数据
    num: 0,
  },

  // 接收传递的订单状态链接参数
  onLoad: function (options) {
    var that = this;
    if (options.hasOwnProperty('currentTab')) {
      //重置数据
      that.setData({
        currentTab: options.currentTab
      })
    }
  },

  onShow: function () {
    var that = this;
    //重置数据
    that.setData({
      hidden: true,
      start: 1,
      perpage: 6,
    })
    var perpage = that.data.perpage;
    var start = that.data.start;
    var n = that.data.currentTab
    if (n == 0) {
      var type = 9;
    }
    else if (n == 1) {
      var type = 4;
    } else if (n == 2) {
      var type = 0;
    } 
    //获取用户信息
    this.getinfo(type, start, perpage);

    //获取屏幕高度  
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          cliHeight: res.windowHeight - 56 //48为额外的内容
        })
      }
    });
  },

  // 请求各状态订单数据
  getinfo: function (_type, _start, _perpage) {
    var that = this;
    var url = app.apiUrl + '/Market/OrderddList';
    if (_type == 9) {
      var paramsx = { orderType:1,start: _start, perpage: _perpage };
      app.request.requestGetApi(url, paramsx, this, this.successFun, this.failFun)  //全部数据请求
    }
    else if (_type == 4) {
      var params = { orderType: 1,type: _type, start: _start, perpage: _perpage };
      app.request.requestGetApi(url, params, this, this.successFun_dzf, this.failFun)  //待支付数据请求
    }
    else if (_type == 0) {
      var params = { orderType: 1, type: _type, start: _start, perpage: _perpage };
      app.request.requestGetApi(url, params, this, this.successFun_dsh, this.failFun)  //待付款数据请求
    }
   
  },

  /******** 全部数据 ********/
  successFun: function (res) {
    var that = this;
    var perpage = that.data.perpage;
    var packageList = res.result;
    console.log(packageList);
    if (res.status == 200) {
      if (res.result != null) {
        //时间戳的处理  
        for (var i = 0; i < res.result.length; i++) {
          res.result[i].start_time = toDate(res.result[i].start_time)
          res.result[i].stop_time = toDate(res.result[i].stop_time)
        }
      }
      if (res.total <= perpage) {
        that.setData({
          packageList: res.result,
          loadMore: false,
          hidden: false,
          page: 1
        })
      } else {
        that.setData({
          packageList: res.result,
          loadMore: true,
          hidden: true,
          page: 1
        })
      }
    } else {
      console.log(res);
    }
  },

  /******** 未使用数据 ********/
  successFun_dzf: function (res) {
    var that = this;
    var perpage = that.data.perpage;
    var packageLists = res.result;
    if (res.status == 200) {
      if (res.result != null) {
        //时间戳的处理  
        for (var i = 0; i < res.result.length; i++) {
          res.result[i].start_time = toDate(res.result[i].start_time)
          res.result[i].stop_time = toDate(res.result[i].stop_time)
        }
      }
      if (res.total <= perpage) {
        that.setData({
          packageLists: res.result,
          loadMore1: false,
          hidden1: false,
          page: 1
        })
      } else {
        that.setData({
          packageLists: res.result,
          loadMore1: true,
          hidden1: true,
          page: 1
        })
      }
    } else {
      console.log(res);
    }
  },

  /******** 已失效数据 *******/
  successFun_dsh: function (res) {
    var that = this;
    var perpage = that.data.perpage;

    if (res.status == 200) {
      if (res.result != null) {
        //时间戳的处理  
        for (var i = 0; i < res.result.length; i++) {
          res.result[i].start_time = toDate(res.result[i].start_time)
          res.result[i].stop_time = toDate(res.result[i].stop_time)
        }
      }
      if (res.total <= perpage) {
        that.setData({
          packageListf: res.result,
          loadMore2: false,
          hidden2: false,
        })
      } else {
        that.setData({
          packageListf: res.result,
          loadMore2: true,
          hidden2: true,
        })
      }
    } else {
      console.log(res);
    }
  },


  //滑动切换tab 
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });

    // //请求数据
    // that.setData({ start: 1 });
    // var perpage = that.data.perpage;
    // var start = that.data.start;
    // var n = e.detail.current;
    // switch (n) {
    //   case 0: var type = 9; break;
    //   case 1: var type = 4; break;
    //   case 2: var type = 2; break;
    //   case 3: var type = 0; break;
    // }
    // this.getinfo(type, start, perpage);
  },
  //点击tab切换
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }

    //请求数据
    that.setData({ start: 1 });
    var perpage = that.data.perpage;
    var start = that.data.start;
    var n = e.target.dataset.current;
    if (n == 0) {
      var type = 9;
    }
    else if (n == 1) {
      var type = 4;
    } else if (n == 2) {
      var type = 0;
    }
    console.log(type)
    that.getinfo(type, start, perpage);
  },

  //加载更多
  loadMore: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;            //获取数据类型
    var loadMore = that.data.loadMore;                  //是否进行加载的开关
    that.setData({ num: type });
    var str = "loadMore";

    that.FunMore(type, loadMore, str);
  },

  loadMore1: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;            //获取数据类型
    var loadMore1 = that.data.loadMore1;                  //是否进行加载的开关
    that.setData({ num: type });
    var str = "loadMore1";

    that.FunMore(type, loadMore1, str);
  },
  loadMore2: function (e) {
    var that = this;
    var type = e.currentTarget.dataset.type;            //获取数据类型
    var loadMore2 = that.data.loadMore2;                  //是否进行加载的开关
    that.setData({ num: type });
    var str = "loadMore2";

    that.FunMore(type, loadMore2, str);
  },
 
  //加载更多（基本函数）
  FunMore: function (type, flag, str) {
    var that = this;
    var start = that.data.start;                        //开始页数
    var perpage = that.data.perpage;                    //数据条数
    console.log(flag);
    if (flag) {
      var start = start + 1;
      var page = that.data.page + 1;
      if (str == "loadMore") {
        that.setData({
          start: start,
          loadMore: false,
        });
      } else if (str == "loadMore1") {
        that.setData({
          start: start,
          loadMore1: false,
        });
      } else{
        that.setData({
          start: start,
          loadMore2: false,
        });
      } 
      wx.showToast({
        title: '加载更多',
        icon: 'loading',
        duration: 500
      })

      console.log('第' + start + '页');
      var url = app.apiUrl + '/Market/OrderddList';
      var params = { orderType: 1, type: type, start: start, perpage: perpage };
      app.request.requestGetApi(url, params, this, this.successFun_more, this.failFun)  //路径，参数，this，成功函数，失败函数
    }
  },


  /******* 加载更多接口 ******/
  successFun_more: function (res, num) {
    var that = this;
    var num = that.data.num;
    console.log("num========" + num);
    if (res.status == 200) {
      if (res.result != null) {
        //时间戳的处理  
        for (var i = 0; i < res.result.length; i++) {
          res.result[i].start_time = toDate(res.result[i].start_time)
          res.result[i].stop_time = toDate(res.result[i].stop_time)
        }
      }
      if (res.result.length < that.data.perpage) {
        if (num == 9) {
          that.setData({
            loadMore: false,
            packageList: that.data.packageList.concat(res.result),
            hidden: false
          })
        } else if (num == 4) {
          that.setData({
            loadMore1: false,
            packageLists: that.data.packageListf.concat(res.result),
            hidden1: false
          })
        } else if (num == 0) {
          that.setData({
            loadMore2: false,
            packageListf: that.data.packageLists.concat(res.result),
            hidden2: false
          })
        } 
      } else {
        if (num == 9) {
          that.setData({
            loadMore: true,
            packageList: that.data.packageList.concat(res.result),
            hidden: true
          })
        } else if (num == 4) {
          that.setData({
            loadMore1: true,
            packageLists: that.data.packageListf.concat(res.result),
            hidden1: true
          })
        } else if (num == 0) {
          that.setData({
            loadMore2: true,
            packageListf: that.data.packageLists.concat(res.result),
            hidden2: true
          })
        }
      }
    } else {
      console.log(res);
    }
  },



  //进入礼包详情
  btnSubm: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.reLaunch({
      url: '/pages/products/giftDetails/giftDetails?productId=' + id,
    })

  },
  


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