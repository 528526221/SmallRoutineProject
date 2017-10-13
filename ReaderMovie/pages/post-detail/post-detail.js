var postData = require('../../data/posts-data.js')
var positionId;
var that;
var isPlaying = false;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    collectImg: "/images/icon/collection-anti.png",
    isCollect: false,
    isPlaying:false,
  },

  /**
   * 收藏
   */
  onCollectTap: function (event) {
    var collectInfo = wx.getStorageSync("collect_info");
    if(!collectInfo){
      collectInfo = {};
    }

    var isCollect = collectInfo[positionId];
    this.showModal(collectInfo,isCollect);
  },

  /**
   * 弹出提示框
   */
  showModal: function(collectInfo,isCollect){
    
    wx.showModal({
      title: '收藏',
      content: isCollect ? '确定取消收藏吗' : "确定要收藏吗",
      success: function (res) {
        if (res.confirm) {
          if (isCollect) {
            isCollect = false;
          } else {
            isCollect = true;
          }
          wx.showToast({
            title: isCollect ? '已收藏' : '已取消收藏',
            duration: 1000,
          })
          //更新UI
          that.setData({
            isCollect: isCollect
          });
          //存入缓存
          collectInfo[positionId] = isCollect;
          wx.setStorageSync("collect_info", collectInfo);
        }
      }
    });
  },

  /**
   * 分享
   */
  onShareTap: function (event) {
    wx.clearStorage();
    var shareList = ['分享到微信','分享到朋友圈','分享到QQ'];
    wx.showActionSheet({
      itemList: shareList,
      itemColor:'#405f80',
      success:function(res){
        if(res.cancel){
          console.log("quxiao");
        }else{
          console.log(res.tapIndex+"");
        }

      }
    })
  },

  /**
   * 播放或者暂停音乐
   */
  onPlayMusicTap: function(event){
    var musicUrl = event.currentTarget.dataset.musicUrl;

    wx.getBackgroundAudioPlayerState({
      success: function(res){
        console.log(res);
        if(res.status == 2){
          that.playMusic();

        }else if(res.status == 1){
          console.log("正在播放中");
          //1、正在播放的和即将播放的是同一首歌 那么暂停 2、正在播放的和即将播放的不是同一首，那么播放
          if(res.dataUrl==musicUrl){
            wx.pauseBackgroundAudio();
            isPlaying = false;
            that.setData({ "isPlaying": isPlaying });
          }else{
            that.playMusic();

          }
        }else if(res.status == 0){
          console.log("暂停中");
          that.playMusic();
        }
      },
      fail:function(res){
        console.log("fail:"+res.errMsg);
        that.playMusic();
      },
      complete:function(res){
        console.log("complete:"+res.errMsg);

      }

    });
  },

  /**
   * 播放音乐
   */
  playMusic: function(){
    var music = postData.postList[positionId].music;
    wx.playBackgroundAudio({
      dataUrl: music.url,
      title: music.title,
      coverImgUrl: music.coverImg,
    });
    isPlaying = true;
    that.setData({ "isPlaying": isPlaying })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that = this;
    positionId = options.id;
    var pp = postData.postList[positionId];
    this.setData({ itemData: postData.postList[positionId] });

    //本地读取收藏信息展示
    var collectInfo = wx.getStorageSync("collect_info");
    var isCollect = collectInfo[positionId];
    this.setData({
      isCollect: isCollect
    }); 
    
    wx.getBackgroundAudioPlayerState({
      success:function(res){
        if (res.status == 1 && res.dataUrl == postData.postList[positionId].music.url){
          isPlaying = true;
        }else{
          isPlaying = false;
        }
        that.setData({ "isPlaying": isPlaying })

      },
    });

    /**
     * 监听全局的控制
     */
   

    wx.onBackgroundAudioPause(function(){
      isPlaying = false;
      that.setData({ "isPlaying": isPlaying })
    })

    wx.onBackgroundAudioPlay(function () {
      isPlaying = true;
      that.setData({ "isPlaying": isPlaying })

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