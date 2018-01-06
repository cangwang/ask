//index.js
//获取应用实例
const app = getApp()
var isInPage = true
var second = 0
var interval;
var choose_right_count =0  //正确数
var choose_error_count =0  //错误数
var ask_count = 12  //题目数

Page({
  data: {
    countDownSecond: 10,  //倒计时间
    currentAsk:0,   //现在问题
    Q:'',  //问题
    A1:'', //答案1
    A2:'', //答案2
    A3:'', //答案3
    T:'',  //正确答案
    successPop: {
      hide: true,
      resolve: undefined,
      type: 'success',
      content: '恭喜你，答对了！',
      button: '下一题'
    }
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
    let _this=this
    // wx.setStorageSync("currentNum", this.data.currentAsk)
    clearInterval(interval);
    if (event.currentTarget.dataset.choice == this.data.T){ //答案正确
      
      wx.setStorageSync("choose_right_count", ++choose_right_count)
      _this.showSuccessPop().then(function () {
        _this.nextAsk()
      })
    }else{
      wx.setStorageSync("choose_error_count", ++choose_error_count)
      if (this.data.currentAsk+1 < ask_count){
        _this.showErrorPop({
          content: '很可惜，正确答案是 '+_this.data.T
        }).then(function(){
          _this.nextAsk()
        })
      }else{
        _this.showErrorPop({
          content: '请分享答题小超人',
          button: '回到首页'
        }).then(function () {
          _this.backToTop()
        })
      }
    }
  },
  nextAsk: function () {
    var num = this.data.currentAsk + 1 //当前题目
    var dta = wx.getStorageSync('question').data[num] //读取问题数据
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
  backToTop(){
    wx.navigateBack({  //回到首页
      delta: 1,
    })
  },
  countDown:function(){
    second = 10;
    interval = setInterval(function () {
      this.setData({
        countDownSecond: second
      })
      second--
      if (second < 0) { //倒计时结束
        clearInterval(interval);
        if (isInPage) {  //判断在当前页面
          wx.showToast({
            icon: 'success',
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
  onUnload:function(){
    isInPage = false;
    clearInterval(interval)
    console.log('back')
    var current_record = wx.getStorageSync("choose_right_count");
    var total_record = wx.getStorageSync("total_record")
    if(total_record<current_record){
      wx.setStorageSync("total_record", current_record)
    }
  },

  showSuccessPop(opts){
    let _this = this;
    return new Promise(function (resolve) {
      let successPop = Object.assign(_this.data.successPop,opts);
      successPop.hide = false;
      successPop.type = 'success';
      successPop.resolve = resolve;
      _this.setData({
        successPop: successPop
      });
    });
    
  },
  
  showErrorPop(opts){
    let _this = this;
    return new Promise(function (resolve) {
      let successPop = Object.assign(_this.data.successPop,opts);
      successPop.hide = false;
      successPop.type = 'error';
      successPop.resolve = resolve;
      _this.setData({
        successPop: successPop
      });
    });

  },
  
  successPopConfirm(){
    
    this.data.successPop.resolve && this.data.successPop.resolve();
    
    this.setData({
      successPop: {
        hide: true,
        resolve: undefined,
        type: 'success',
        content: '恭喜你，答对了！',
        button: '下一题'
      }
    });
  }
})
