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
    canvas:{
      hide:true,
      shareImgSrc:'',
    },
    successPop: {
      hide: true,
      resolve: undefined,
      type: 'success',  // success/error
      content: '恭喜你，答对了！',
      button: '下一题'
    },
    confirmPop: {
      hide: true,
      resolve: undefined,
      reject: undefined,
      type: 'error',  // success/error
      content: '很可惜，答错了！',
      buttonTop: '重新答题',
      buttonDown: '分享'
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

    var that = this
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
        // _this.showErrorPop({
        //   content: '很可惜，正确答案是第' +_this.data.T+'个'
        // }).then(function(){
        //   _this.nextAsk()
        // })
        _this.showConfirmPop({
          content: '很可惜，正确答案是第' + _this.data.T + '个'
          + '。\n' + this.getShareText()
        }).then(function () {
          _this.backToTop()
        }, function () {
          console.log('share')
          _this.toShareFriends()
        })
      }else{
        _this.showConfirmPop({
          content: '很可惜，正确答案是第' + _this.data.T+'个'
          + '。\n' + this.getShareText()
        }).then(function(){
          _this.backToTop()
        },function(){
          console.log('share')
          _this.toShareFriends()
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
  backToTop:function(){
    wx.navigateBack({  //回到首页
      delta: 1,
    })
  },
  toShareFriends:function(){
    var that = this;
    //1. 请求后端API生成小程序码
    // that.getQr();

    //2. canvas绘制文字和图片
    const ctx = wx.createCanvasContext('myCanvas');
    var imgPath = 'superTitle.png'
    var bgImgPath = 'superTitle.png';
    ctx.drawImage(imgPath, 0, 0, 200, 160);

    ctx.setFillStyle('white')
    ctx.fillRect(0, 160, 200, 120);

    // ctx.drawImage(imgPath, 30, 550, 60, 60);
    // ctx.drawImage(bgImgPath, 30, 550, 60, 60);
    // ctx.drawImage(imgPath, 410, 610, 160, 160);

    ctx.setFontSize(18)
    ctx.setFillStyle('#111111')
    ctx.fillText('问答小超人', 20, 175)

    ctx.setFontSize(15)
    ctx.setFillStyle('#6F6F6F')
    ctx.fillText('最强的问题', 20, 200)
    ctx.fillText('等你来挑战', 20, 220)

    ctx.setFontSize(22)
    ctx.fillText('长按扫码查看详情', 20, 260)
    ctx.draw()

    // 3. canvas画布转成图片
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 600,
      height: 800,
      destWidth: 600,
      destHeight: 800,
      canvasId: 'myCanvas',
      success: function (res) {
        console.log('sucess '+res.tempFilePath);
        that.setData({
          canvas:{
            hide: false,
            shareImgSrc: res.tempFilePath
          }
        })

      },
      fail: function (res) {
        console.log('fail '+res)
      }
    })
  },
  saveCanvasToLocal:function(){
    var that=this
    //4. 当用户点击分享到朋友圈时，将图片保存到相册
    wx.saveImageToPhotosAlbum({
      filePath: that.data.canvas.shareImgSrc,
      success(res) {
        wx.showModal({
          title: '存图成功',
          content: '图片成功保存到相册了，去发圈噻~',
          showCancel: false,
          confirmText: '好哒',
          confirmColor: '#72B9C3',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
            }
            that.hideShareImg()
          }
        })
      }
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
    choose_right_count = 0
    choose_error_count = 0
    
    isInPage = false;
    clearInterval(interval)
    console.log('back')
    var current_record = wx.getStorageSync("choose_right_count");
    var total_record = wx.getStorageSync("total_record")
    if(total_record<current_record){
      wx.setStorageSync("total_record", current_record)
    }
  },
  
  /**
   * 12题以前答对弹窗
   * @param opts
   * @returns {Promise}
   */
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
  getShareText:function(){
    if (choose_right_count > 12) {
      return "你距离你的新记录只差那么一点，下次继续加油哦"
    }else if(choose_right_count == 12){
      return "您真棒，你已经完成挑战，请分享给朋友一起玩答题。" 
    }else if(choose_right_count >10){
      return "继续加油，你已超过了95%以上的人。"
    }else {
      return "请不要气馁，下次继续努力。"
    }
  },
  
  /**
   * 12题以前答错弹窗
   * @param opts
   * @returns {Promise}
   */
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
  
  /**
   * success-pop按钮触发函数
   */
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
  },
  
  /**
   * confirm-pop弹窗
   * @param opts
   * @returns {Promise}
   */
  showConfirmPop(opts){
    
    let _this = this;
    return new Promise(function (resolve,reject) {
      let confirmPop = Object.assign(_this.data.confirmPop,opts);
      confirmPop.hide = false;
      confirmPop.resolve = resolve;
      confirmPop.reject = reject;
      _this.setData({
        confirmPop: confirmPop
      });
    });
    
  },
  
  /**
   * confirm-pop上按钮触发函数
   */
  confirmButtonTop(){
    this.data.confirmPop.resolve && this.data.confirmPop.resolve();
    
    this.setData({
      confirmPop: {
        hide: true,
        resolve: undefined,
        reject: undefined,
        type: 'error',  // success/error
        content: '很可惜，答错了！',
        buttonTop: '重新答题',
        buttonDown: '分享'
      }
    });
  },
  
  /**
   * confirm-pop下按钮触发函数
   */
  confirmButtonDown(){
    this.data.confirmPop.reject && this.data.confirmPop.reject();
    
    this.setData({
      confirmPop: {
        hide: true,
        resolve: undefined,
        reject: undefined,
        type: 'error',  // success/error
        content: '很可惜，答错了！',
        buttonTop: '重新答题',
        buttonDown: '分享'
      }
    });
  }
})