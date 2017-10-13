// pages/more-movie/more-movie.js
var util = require("../../utils/util.js");
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    start: 0,
    count: 12,
    movies: [],
    canLoadMore: false,
    isRefresh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.title = options.category;
    wx.setNavigationBarTitle({
      title: this.data.title,
    });
    wx.showLoading({
      title: '',
    });

    this.loadData(this.data.start, this.data.count);
  },

  /**
   * 从网络上获取列表数据
   */
  loadData: function (start, count) {
    wx.showNavigationBarLoading();
    that = this;
    var app = getApp();
    var url;
    if (this.data.title == "正在热映") {
      url = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=" + start + "&count=" + count;
    } else if (this.data.title == "即将上映") {
      url = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=" + start + "&count=" + count;
    } else {
      url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=" + start + "&count=" + count;
    }
    util.httpGet(url, function (data) {
      that.data.canLoadMore = true;
      if (that.data.isRefresh) {
        that.data.isRefresh = false;
        wx.stopPullDownRefresh();
      }
      

      if (data.code == 112) {
        console.log(data.msg);
      } else {
        console.log(data.subjects);
        that.data.start += data.subjects.length;

        var tempMovies = [];
        //for in 循环不同于Java 遍历出来的每项是下标 非元素本身
        for (var ids in data.subjects) {
          var subject = data.subjects[ids];
          var title = subject.title;
          if (title.length >= 6) {
            title = title.substring(0, 6) + "...";
          }
          var temp = {
            title: title,
            star: {
              stars: subject.rating.stars,
              average: subject.rating.average
            },
            coverageUrl: subject.images.large,
            movieId: subject.id
          };
          tempMovies.push(temp);
        }
        //将本次请求的数组合并到列表的数组中去
        var movies = that.data.movies.concat(tempMovies);
        that.setData({ movies: movies });
      }

      wx.hideNavigationBarLoading();
      wx.hideLoading();
    });
  },
  /**
   * 下拉刷新
   */
  scrollToRefresh: function (event) {
    if (!this.data.isRefresh) {
      this.data.isRefresh = true;
      this.data.start = 0;
      this.data.movies.splice(0, this.data.movies.length);
      this.loadData(this.data.start, this.data.count);
      console.log("下拉刷新数据");
    } else {
      console.log("还在刷新中。。。");
    }
  },
  /**
   * 上拉加载
   */
  scrollToLoadMore: function (event) {

    if (that.data.canLoadMore) {
      that.data.canLoadMore = false;
      this.loadData(this.data.start, this.data.count);
      console.log("上拉加载数据" + that.data.start);
    } else {
      console.log("还在加载中。。。" + that.data.start);
    }
  },
  /**
  * 电影单个影片点击
  */
  onMovieTap: function (event) {
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + event.currentTarget.dataset.movie.movieId,
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
   * 该事件在模拟器中会自动stop，真机中不会；
   * 由于之前的下拉和上拉是通过scroll-view绑定监听事件来完成的，
   * 而那些事件会出现多次调用的情况，因此定义了两个变量 canLoadMore 和 isRefresh 来作为标志位判断，
   * 后面采用了view自身的onPullDownRefresh以后，该标志位可以视情况去掉（未测试）
   */
  onPullDownRefresh: function () {
    this.scrollToRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.scrollToLoadMore();

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})