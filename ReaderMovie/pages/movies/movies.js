var util = require('../../utils/util.js')
var that;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //这个地方为什么要初始化？原因类似于Android的Adapter，请求是异步的过程，如果一开始数据没有初始化的话，那么在wxml中进行的数据绑定就会出错
    //Android中我们适配器的构造方法中一般都会对List进行一次new ArrayList进行初始化，这样数据绑定才是正常的
    inTheaters: {},
    comingSoon: {},
    top250: {},
    containerShow: true,
    searchPanelShow:false,
    searchResult:"",//搜索的key
    start: 0,
    count: 12,
    movies: []//搜索到的电影列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    wx.showLoading({
      title: '',
    });
    var app = getApp();
    //正在热映
    var inTheatersUrl = app.globalData.doubanBase+"/v2/movie/in_theaters"+"?start=0&count=3";
    //即将上映
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    //top250
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersUrl, "inTheaters","正在热映");
    this.getMovieListData(comingSoonUrl, "comingSoon", "即将上映");
    this.getMovieListData(top250Url, "top250", "top250","top250");
    // this.searchMovieData("最热",this.data.start,this.data.count);

  },
  

  /**
   * 获取电影列表
   * @param 请求地址
   * @param 请求的key
   * @param 模块的title
   */
  getMovieListData: function (url, settedKey, subTitle){
    wx.showNavigationBarLoading();
    util.httpGet(url,function(data){
      that.progressDoubanData(data, settedKey, subTitle);
      wx.hideLoading();
    });
  },
  /**
   * 搜索电影资源
   */
  searchMovieData: function(query,start,count){
    wx.showNavigationBarLoading();
    var url = getApp().globalData.doubanBase + "/v2/movie/search" + "?q=" + query + "&start=" + start + "&count=" + count;
    util.httpGet(url,function(data){
      console.log(data);
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
      wx.hideNavigationBarLoading();
    });

  },

  /**
   * 对豆瓣返回的数据进行一些处理
   */
  progressDoubanData: function (data, settedKey, subTitle){
    var assembleData = {};//组装的数据对象
    var movies = [];
    //for in 循环不同于Java 遍历出来的每项是下标 非元素本身
    for (var ids in data.subjects){
      var subject = data.subjects[ids];
      var title = subject.title;
      if(title.length >=6){
        title = title.substring(0,6)+"...";
      }
      var temp = {
        title:title,
        star:{
          stars: subject.rating.stars,
          average: subject.rating.average
        },
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    assembleData[settedKey] = {
      movies: movies,
      subTitle: subTitle
    };
    // 警报：setData方法的属性名称不能为变量!!! 对象属性赋值时属性不能用.要用[]。
    
    this.setData(assembleData);
   wx.hideNavigationBarLoading();

  },

  /**
   * 电影单个影片点击
   */
  onMovieTap: function(event){
    wx.navigateTo({
      url: '../movie-detail/movie-detail?movieId=' + event.currentTarget.dataset.movie.movieId,
    });
  },

  /**
   * 查看更多
   */
  onMoreTap: function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: '../more-movie/more-movie?category='+category,
    })
  },

  /**
   * 搜索框获得焦点
   */
  onBindFocus: function(event){
    this.setData({
      containerShow: false,
      searchPanelShow: true
      });
  },
  /**
   * 搜索框失去焦点
   */
  onBindBlur: function (event) {
    // this.setData({
    //   containerShow: true,
    //   searchPanelShow: false
    // });
  },

  /**
   * 搜索框键盘点击了完成 重置起始id 清空电影列表 
   */
  onBindConfirm: function(event){
    console.log(event.detail.value);
    this.data.searchResult = event.detail.value;
    this.data.start = 0;
    this.data.movies.splice(0, this.data.movies.length);
    this.searchMovieData(this.data.searchResult,this.data.start,this.data.count);
  },
  /**
   * 点击清除图标 隐藏搜索结果界面 显示默认界面 重置搜索key
   */
  onCancelIconTap: function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult:""
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
    console.log("到底了。。。");
    if (this.data.searchPanelShow){
      this.searchMovieData(this.data.searchResult,this.data.start, this.data.count);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})