//index.js
//获取应用实例
const app = getApp()
var isInPage = true;

Page({
  data: {
    countDownSecond: 10,  //倒计时间
    currentAsk:0,   //现在问题
    Q:'',  //问题
    A1:'', //答案1
    A2:'', //答案2
    A3:'', //答案3
    T:''  //正确答案
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    // wx.request({
    //   url: 'pages/ask/question.json',
    //   success:function(res){
    //     if(res.code == 200){
    //       var data = res.data.data
    //       console.log(data)
    //     }
    //   }
    // })
    var dta = wx.getStorageSync('question').data[this.data.currentAsk]
    this.setData({
      Q: dta.question,
      A1: dta.answer1,
      A2: dta.answer2,
      A3: dta.answer3,
      T: dta.true_ans
    })
  },
  onReady:function(){
    this.countDown()
  },
  onUnload:function(){
    isInPage = false;
    console.log('back')
  },
  chooseAnswer:function(event){
    wx.setStorageSync("currentNum", this.data.currentAsk)
    console.log(event.currentTarget.dataset.choice)
    if (event.currentTarget.dataset.choice == this.T){ //答案正确
      wx.setStorageSync("count", this.data.currentAsk)
    }
  },
  nextAsk: function () {
    var num = this.data.currentAsk + 1
    var dta = wx.getStorageSync('question').data[num]
    this.setData({
      countDownSecond: 10,
      Q: dta.question,
      A1: dta.answer1,
      A2: dta.answer2,
      A3: dta.answer3,
      T: dta.true_ans,
      currentAsk:num
    })
    this.countDown()
  },
  countDown:function(){
    var second = 10;
    var interval = setInterval(function () {
      console.log(second)
      this.setData({
        countDownSecond: second
      })
      second--
      if (second < 0) { //倒计时结束
        clearInterval(interval);
        if (isInPage) {  //判断在当前页面
          wx.showToast({
            title: '倒计结束',
            complete: function (res) {
              second = 10
            },
          })
          this.nextAsk() //跳转到下一题
        }
      }
    }.bind(this), 1000)
  },
  onShareAppMessage: function () {
    return {
      title: '答题小超人',
      desc: '最具人气的答题小程序!',
      path: ''
    }
  },
  // showSuccess(){
  //   wx.showModal({
  //     title: '',
  //     content: '恭喜你答对了！',
  //     showCancel: false,
  //     success: function(res) {
  //       if (res.confirm) {
  //         console.log('用户点击确定')
  //       } else if (res.cancel) {
  //         console.log('用户点击取消')
  //       }
  //     }
  //   })
  // }
})
