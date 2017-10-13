var postData = require('../../data/posts-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 轮播图点击事件
   * target 指的是当前点击的组件
   * currentTarget 指的是事件被捕获的组件
   * 这二者的区别可以让我们在处理事件冒泡时，通过父容器去获取子view的自定义属性
   */
  onSwiperTap: function(event){
    var swiperData = event.currentTarget.dataset.swiperData;
    wx.showToast({
      title: swiperData.title,
    })
  },

  /**
   * 资讯列表点击事件
   */
  onPostTap: function(event){
    var postId = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url: '../post-detail/post-detail?id='+postId,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ post_key: postData.postList });
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