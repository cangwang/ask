//answer.js
//获取应用实例
const app = getApp()

Page({
  data: {
    countDownSecond: 10, 
    status:false,
    choice:-1,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  naviagationToAnswer:function(){
    wx.navigateTo({
      url: '../answer/answer',
    })
  },
  onLoad: function () {

  },
  onReady:function(){
    var second = 10;
    var interval = setInterval(function(){
      console.log(second)
      this.setData({
        countDownSecond:second
      })
      second--
      if(second <0){
        clearInterval(interval);  
        wx.showToast({
          title: '倒计结束',
          complete: function(res) {
            second = 10;
          },
        })
      }
    }.bind(this),1000)
  },
})
