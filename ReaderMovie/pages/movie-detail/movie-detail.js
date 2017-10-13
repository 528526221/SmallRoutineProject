var util = require("../../utils/util.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // options.movieId =  1292213;
    wx.showNavigationBarLoading();
    var url = getApp().globalData.doubanBase + "/v2/movie/subject/" + options.movieId;
    util.httpGet(url,function(data){
      wx.setNavigationBarTitle({
        title: data.title,
      })
      that.setData(data);
      that.setData({
        star: {
          stars: data.rating.stars,
          average: data.rating.average
        }});
      that.setData({
        movieCastNames: util.convertToCastString(data.casts)
      });
      wx.hideNavigationBarLoading();

    });
    
  },
  /**
   * 查看大图
   */
  viewBigImage: function(event){
    console.log(event);
    var src = event.currentTarget.dataset.src;
    wx.previewImage({
      current: src,
      urls: [src],
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    });
  },
  


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})