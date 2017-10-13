var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  openIndex: function(){
    wx.switchTab({
      url: '../dwnews/dwnews',
    });

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
   
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
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        var userInfo = res.userInfo;

        if (res.userInfo.country != "") {
          userInfo.haveCountry = true;
        } else {
          userInfo.haveCountry = false;

        }
        if (res.userInfo.city != "") {
          userInfo.haveCity = true;
        } else {
          userInfo.haveCity = false;

        }
        that.setData({
          userInfo: userInfo
        });

      },
      fail: function (res) {
        wx.showModal({
          title: '授权失败',
          content: '需要打开用户信息权限',
          confirmText: '去打开',
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                },
                fail: function (res) { },
                complete: function (res) { },
              });
            }
          },
          fail: function (res) { },
          complete: function (res) { },
        });
      },
      complete: function (res) { },
    });
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