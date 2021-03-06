// pages/shopping/cart/cart.js
//获取应用实例
var app = getApp();

Page({
  data: {
    flag: true,
    number: 1,              //商品数量
    total_price: [],        //需支付总金额
    discount_price: [],     //总优惠
    list: [],               //存放商品列表
    orderddId: '',          //存放订单id
    allchecked: false,      //单选全选按钮
    shoppingId:[],          //存放购物id
    hidden: true,           //控制提示框隐藏显示
    orderddId: 0,           //订单ID
  },

  /*********   失败函数调用处理    ********/
  failFun: function(res){
    console.log("failfun",res);
  },

  onShow: function (options) {
    var that = this;
    that.productInfo();
  },
  
  //请求商品列表数据
  productInfo: function () {
    var that = this;
    var url = app.apiUrl + '/Market/ShoppingList';
    var params = {};
    app.request.requestPostApi(url, params, this, function (res) {
      console.log(res);
      if (res.status == 200) {
        that.setData({
          total_price: res.total_price,
          discount_price: res.discount_price,
          list: res.result,
          orderddId: res.orderddId
        })
      } else {
        console.log(res);
      }
    }, that.failFun)  //路径，参数，this，成功函数，失败函数
  },

  //点击 全选 按钮
  allSelect: function (e) {
    var that = this;
    var list = that.data.list;
    var flag = e.currentTarget.dataset.flag;
    console.log();
    if (flag) {
      for (var i = 0; i < list.length; i++) {
          list[i].choose = 1
      }

      that.setData({
        list: list,
        allchecked: true
      })
    } else {
      for (var i = 0; i < list.length; i++) {
        list[i].choose = 0
      }

      that.setData({
        list: list,
        allchecked: false
      })
    }

    //购物车金额的计算
    // that.countPrice();
  },

  //点击 删除 按钮（多选删除）
  // del: function () { 
  //   var that = this;
  //   var list = that.data.list;
  //   console.log(list);
  //   var str = '{';
  //   for (var i = 0; i < list.length; i++) {
  //     if (list[i].choose == 1) {
  //       str += '"shoppingId[' + i + ']":"' + list[i].identity + '",'
  //     } 
  //   }
  //   str += '}'
  //   str = str.replace(',}', '}');
  //   var params = JSON.parse(str);

  //   if (str.indexOf('shoppingId') < 0){
  //     that.setData({
  //       hidden:false,
  //       tipFloat: "请选择要删除的商品"
  //     })

  //     setTimeout(function () {
  //       that.setData({
  //         hidden: true,
  //       })
  //     },1500)
  //   } else {
  //     wx.showModal({
  //       title: '',
  //       content: '您确定要取删除选中商品吗',
  //       success: function (res) {
  //         if (res.confirm) {
  //           //获取页面数据
  //           var url = app.apiUrl + '/Market/ShoppingDelete';
  //           //@todo 网络请求API数据
  //           app.request.requestPostApi(url, params, this, function (res) {
  //             console.log(res);
  //             if (res.status == 200) {
  //               //重新请求商品列表数据
  //               that.productInfo();
  //               wx.showToast({
  //                 title: '删除成功',
  //               })
  //             } else {
  //               console.log(res);
  //             }
  //           }, that.failFun)  //路径，参数，this，成功函数，失败函数
  //         }
  //       }
  //     })
  //   }
  // },

  //删除当前商品
  del:function(e){
    var that = this;
    var id = e.currentTarget.dataset.id;
    wx.showModal({
        title: '',
        content: '您确定要删除该商品吗',
        success: function (res) {
          if (res.confirm) {
            //获取页面数据
            var url = app.apiUrl + '/Market/ShoppingDelete';
            var params = {
              shoppingId:id
            };
            app.request.requestPostApi(url, params, this, function (res) {
              console.log(res);
              if (res.status == 200) {
                //重新请求商品列表数据
                that.productInfo();
                wx.showToast({
                  title: '删除成功',
                })
              } else {
                console.log(res);
              }
            }, that.failFun)  //路径，参数，this，成功函数，失败函数
          }
        }
      })
  },

  //单选按钮的切换
  radio: function (e) {
    var that = this;
    var index = parseInt(e.currentTarget.dataset.index) ;
    var flag = e.currentTarget.dataset.flag;
    var id = e.currentTarget.dataset.id;
    var list = that.data.list;
    //当前单选钮的控制
    if (flag) {
      for (var i = 0; i < list.length ;i++){
        if (i == index) {
          list[i].choose= 0
          that.setData({
            list: list,
          })
        }
      }
    } else {
      for (var i = 0; i < list.length; i++) {
        if (i == index) {
          list[i].choose = 1
          that.setData({
            list: list,
          })
        }
      }
    }

    //全选按钮的控制
    var n = 0;
    for (var i = 0; i < list.length; i++) {
      if (list[i].choose == 0){
        n = 0;
        break ;
      } else {
        n = 1;
      }
    }
    if (n) {
      that.setData({
        allchecked: true,
      })
    }else{
      that.setData({
        allchecked: false,
      })
    }

    //购物车金额的计算
    // that.countPrice();
  },

  //点击 "-"
  reduce: function (e) {
    console.log(e);
    var that = this;
    var number = parseInt(e.currentTarget.dataset.index);
    var id = e.currentTarget.dataset.id;
    var num = e.currentTarget.dataset.num;
    if (number > 1) {
      var url = app.apiUrl + '/Market/ShoppingChange';
      var params = { 
        shoppingId: id, 
        'property[quantity]': number - 1,
      };
      app.request.requestPostApi(url, params, this, function (res) {
        console.log(res);
        if (res.status == 200) {
          var list = that.data.list;
          for(var i = 0 ; i <list.length ; i++){
            if (i == num){
              list[i].quantity = number - 1;
            }
          }
          that.setData({
            list: list
          })
          that.countPrice();
        } else {
          console.log(res);
          wx.showToast({
            title: res.msg,
          })
        }
      }, that.failFun)  //路径，参数，this，成功函数，失败函数
    } else {
      var url_del = app.apiUrl + '/Market/ShoppingDelete';
      var params_del = { shoppingId: id };
      //@todo 网络请求API数据
      app.request.requestPostApi(url_del, params_del, this, function (res) {
        console.log(res);
        if (res.status == 200) {
          //重新请求商品列表数据
          that.productInfo();
          // wx.showToast({
          //   title: '删除成功',
          // })
        } else {
          console.log(res);
        }
      }, that.failFun)  //路径，参数，this，成功函数，失败函数  
    }
  },

  //点击 "+"
  add: function (e) {
    var that = this;
    var number = parseInt(e.currentTarget.dataset.index);
    var num = e.currentTarget.dataset.num;
    var id = e.currentTarget.dataset.id;
    console.log(number);
    if (number >= 1) {
      var url = app.apiUrl + '/Market/ShoppingChange';
      var params = {
        shoppingId: id,
        'property[quantity]': number + 1,
      };
      app.request.requestPostApi(url, params, this, function (res) {
        console.log(res);
        if (res.status == 200) {
          var list = that.data.list;
          for (var i = 0; i < list.length; i++) {
            if (i == num) {
              list[i].quantity = number + 1;
            }
          }
          that.setData({
            list: list
          })
          that.countPrice();
        } else {
          console.log(res);
          wx.showToast({
            title: res.msg,
          })
        }
      }, that.failFun)  //路径，参数，this，成功函数，失败函数
    }
  },

  //购物车金额计算
  countPrice: function(){
    var that = this;
    var count = 0;
    var price = 0;
    var list = that.data.list;
    for (var i = 0; i < list.length; i++) {
      if (list[i].choose == 1) {
        count += parseInt(list[i].univalent) * parseInt(list[i].quantity);
        price += parseInt(list[i].product.market_price) - parseInt(list[i].product.univalent) * parseInt(list[i].quantity);
      }
    }

    if (price == 0){
      that.productInfo();
    }
    else {
      that.setData({
        total_price: count,
        discount_price: Math.abs(price)
      })
    }
  },

  //点击 去结算 按钮
  pay: function () {
    var that = this;
    var orderddId = that.data.orderddId;
    console.log(orderddId);
    wx.navigateTo({
      url: '/pages/shopping/order/order?orderddId=' + orderddId,
    })
  },
})