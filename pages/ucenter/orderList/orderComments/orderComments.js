var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,                             // tab切换  
    windowHeight: 0,                           //获取屏幕高度  
    cliHeight: 0,                              //获取高度  
    orderlist: [], //订单商品列表
    imglist: [],//评论图片暂存
    atd: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderddId = 678


    // 订单详情
    var url = app.apiUrl + '/Market/OrderddDetail';
    var params = { orderddId: orderddId }
    app.request.requestGetApi(url, params, this,  // 订单信息回调
      function (res) {
        if (res.status == 200) {
          if (res.result != '') {
            that.setData({
              orderlist: res.result.shopping
            })
          }
        }
        else {
          console.log(res.msg);
        }
      }, this.failOrder)
    that.setData({
      orderddId: orderddId
    })
  },
  // 上传评论内容
  bingtext: function (e) {
    var that = this;
    var content = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var orderddId = that.data.orderddId;
    if (content != "") {
      var url = app.apiUrl + '/Interaction/CommentSend';
      var params = { id: id, content: content }
      app.request.requestPostApi(url, params, this,  // 订单信息回调
        function (res) {
          if (res.status == 200) {
            console.log("成功")
          }
          else if (res.status == 400) {
            console.log("发布成功")
          }
          else if (res.status == 401) {
            console.log("缺失参数")
          } else if (res.status == 402) {
            console.log("会话已经禁用")
          }
          else {
            console.log(res.msg);
          }
        }, this.failOrder)
    }
    else {
      wx.showToast({
        title: "请填写评价内容！"
      })
    }
    that.setData({
      content: content
    })
  },

  //本地上传图片（临时存储）
  uploadbd: function (e) {
    var that = this;
    var imglist = that.data.imglist;
    var id = e.currentTarget.dataset.id;
    var orderddId = that.data.orderddId;
    var atd = that.data.atd;

    wx.chooseImage({
      count: 1,
      success: function (res) {
        var imgSrc = res.tempFilePaths[0]; // 图片的本地文件路径列表
        wx.showToast({
          title: '正在上传',
          icon: 'loading',
        });
        wx.uploadFile({
          url: app.apiUrl + '/Media/Upload', // url接口
          filePath: imgSrc, // 上传文件的路径
          name: 'fileData', // 文件对应的key
          success: function (res) {
            var result = JSON.parse(res.data);
            var artimg = app.apiUrl + result.attach;
            var attachId = result.attachmentid; // 调用项目中的返回的接口
            wx.showToast({
              title: '上传成功',
              icon: 'success',
              duration: 1000
            });

            imglist.push({ atd, attachId, id, artimg });
            var arts = '"attachids":"';
            for (var i = 0; i < imglist.length; i++) {
              if (imglist[i].id == id) {
                arts += imglist[i].attachId + ","
                if (i == imglist.length - 1) {
                  arts += "}"
                }
              }

            }
            console.log(arts);
            console.log(imglist);
            var paramsx = {
              id: id,
            };



            var paramsx = JSON.stringify(paramsx) + arts;
            console.log(paramsx)
            paramsx = paramsx.replace('"}', '",');
            console.log(paramsx)
            paramsx = paramsx.replace(',}', '"}');
            console.log(paramsx)

            params = JSON.parse(paramsx);

            var url = app.apiUrl + '/Interaction/CommentSend';
            var params = params;
            app.request.requestPostApi(url, params, this, function (res) {
              if (res.status == 200) {
                console.log("成功")
              }
              else if (res.status == 400) {
                console.log("发布成功")
              }
              else if (res.status == 401) {
                console.log("缺失参数")
              } else if (res.status == 402) {
                console.log("会话已经禁用")
              }
              else {
                console.log(res.msg);
              }
            }, that.failFun);


            that.setData({
              imglist: imglist,
              atd: atd + 1,
            });
          },
          fail: function (errMsg) {
            console.log('图片上传失败', errMsg)
          }
        })
      }
    })

  },

  // 删除图片（本地图片临时列表）
  deletecom: function (e) {
    var that = this;
    var delid = e.currentTarget.dataset.delid;
    var imglist = that.data.imglist;
    imglist.splice(delid, 1);
    console.log(imglist)
    that.setData({
      imglist: imglist,
    });
  },

  // 确认修改
  commentBtn: function (e) {
    var that = this;
    var content = that.data.content;
    var imglist=that.data.imglist;
    if (content != "" && imglist!=""){
      wx.showModal({
        content: '是否提交评价？提交后不可再次编辑。',
        success: function (res) {
          if (res.confirm) {
            wx.navigateTo({
              url: '/pages/ucenter/orderList/commentsResult/commentsResult',
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else{
      wx.showModal({
        content: '您未填写评价内容！',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确认')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
   
  },

})

