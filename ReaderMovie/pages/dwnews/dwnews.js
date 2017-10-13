// pages/dwnews/dwnews.js
var util = require('../../utils/util.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsPage:1,
    news:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    // http://box.dwstatic.com/apiNewsList.php?action=l&newsTag=headlineNews&p=1%20HTTP/1.
    // http://box.dwstatic.com/apiNewsList.php?action=l&newsTag=headlineNews&p=2
   
    this.loadData(this.data.newsPage);
    wx.showLoading({
      title: '',
    });
  },

  /**
   * 请求数据
   */
  loadData: function(newsPage){
    wx.showNavigationBarLoading();
    var url = getApp().globalData.dwBase + "/apiNewsList.php" + "?action=l&newsTag=headlineNews" + "&p=" + this.data.newsPage;

    util.httpGet(url, function (data) {
      console.log(data);
      var tempNews = data.data;
      for(var ids in tempNews){
        tempNews[ids].time = util.convertToDate(tempNews[ids].time);
      }
      that.setData({ news: that.data.news.concat(tempNews) });
      wx.hideNavigationBarLoading();
      wx.hideLoading();
      wx.stopPullDownRefresh();
      
    });
  },
  /**
   * 单个资讯点击
   */
  onNewsItemTap: function(event){
    wx.showToast({
      title: event.currentTarget.dataset.newsTitle,
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
    this.data.newsPage = 1;
    this.data.news.splice(0,this.data.news.length);
    this.loadData(this.data.newsPage);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.data.newsPage += 1;
    this.loadData(this.data.newsPage);
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})