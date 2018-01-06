//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    help: '此答题游戏是一个有关于益智类答题游戏',
    article:"作者：CangWang && Heng",
    userInfo: {},
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    
  },
  onShareAppMessage: function () {
    return {
      title: '答题小超人',
      desc: '最具人气的答题小程序!',
      path: ''
    }
  }
})
