//index.js
//获取应用实例
const app = getApp()
var isInPage = true;

Page({
  data: {
    countDownSecond: 10,  //倒计时间
    currentAsk:1,   //现在问题
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
    var second = 10;
    var interval = setInterval(function(){
      console.log(second)
      this.setData({
        countDownSecond:second
      })
      second--
      if(second <0){ //倒计时结束
        clearInterval(interval);
        if(isInPage){  //判断在当前页面
          wx.showToast({
            title: '倒计结束',
            complete: function(res) {
              second = 10;
            },
          })
        }
      }
    }.bind(this),1000)
  },
  onUnload:function(){
    isInPage = false;
    console.log('back')
  },
  chooseAnswer:function(choice){
    if(choice == this.T){
      
    }
  },
  resume:function(){
    var dta = wx.getStorageSync('question').data[this.data.currentAsk]
    this.setData({
      Q: dta.question,
      A1: dta.answer1,
      A2: dta.answer2,
      A3: dta.answer3,
      T: dta.true_ans
    })
  }

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
