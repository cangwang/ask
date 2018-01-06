//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '开始答题',
    help:'关于答题',
    title:'答题小超人',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    totalRecord:0
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  navigateToAsk:function(){
    wx.navigateTo({
      url: '../ask/ask',
    })
  },
  navigateToHelp: function () {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  onLoad: function () {
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '答题小超人',
      desc: '最具人气的答题小程序!',
      path: ''
    }
  },
  onShow:function(){
    var total_record = wx.getStorageSync("total_record")
    if(total_record >0){
      console.log('toatl_record:' + total_record)
      this.setData({
        totalRecord: total_record
      })
    }
  }
  // getUserInfo: function(e) {
  //   console.log(e)
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // }
})
