var constUtil = require('../../utils/constUtil.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemArray: [],
    dbName: "",
    img: "",
    historyHidden: true, //true：图片来源来自上一级页面传递 false：图片来源自历史记录数据库
    historyTag: 0, //0：来自主页 1：来自主页播放历史按钮
    podcastshortcut: "" //播客名缩写 eg：dywx
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    // console.log(dbSuffix);
    //加载数据库数据：某个播客的所有集数
    var podcastshortcut = options.podcastshortcut; //主页传过来的podcastshortcut
    var img = options.img; //主页传过来的img
    var historyTag = options.historyTag //主页传过来的history
    // console.log("historyTag: " + historyTag);
    var dbName = "podCastArrayDB_" + podcastshortcut; //每个播客的数据库采用“podCastArrayDB_+博客名缩写”的形式

    if (historyTag == 0) { //页面来自主页
      // console.log("img-: " + img);
      that.setData({
        historyHidden: true,
        dbName: dbName,
        img: img, //设置图片
        historyTag: 0,
        podcastshortcut: podcastshortcut
      })
      // 拉取播客数据库数据 dbName = podCastArrayDB_podcastshortcut (eg:podCastArrayDB_dywx)
      that.loadPodCast(dbName);
    } else { //来自 主页点击“播放历史”的时候
      // console.log("dbName-history: " + dbName);
      that.setData({
        historyHidden: false,
        historyTag: 1,
      })
      //拉取历史记录数据库中的数据 dbName = podCastArrayDB_history
      that.loadHistory(dbName);
    }
  },
  //跳转到播放页面
  podcastDetail: function(e) {
    var index = parseInt(e.currentTarget.dataset.index);
    var podcast = this.data.itemArray[index];
    var id = "";
    var dbName = "";
    var historyTag = this.data.historyTag;
    if (historyTag == 0) { //页面来自主页
      id = podcast._id
      dbName = this.data.dbName
    } else { //来自 主页点击“播放历史”的时候
      id = podcast.podCastId
      dbName = "podCastArrayDB_" + this.data.itemArray[index].podcastshortcut
    }
    // console.log(id);
    wx.navigateTo({
      url: '../../pages/playPage/playPage?id=' + id + "&dbName=" + dbName + "&podcastshortcut=" + this.data.podcastshortcut,
    })
  },
  /**|
   * 拉取播客数据库数据
   */
  loadPodCast: function(dbName) {
    var that = this;
    const db = wx.cloud.database()
    db.collection(dbName).get({
      success(res) {
        that.setData({
          itemArray: res.data,
        })
      }
    })
  },
  /**|
   * 拉取历史记录数据库数据
   */
  loadHistory: function(dbName) {
    var that = this;
    const db = wx.cloud.database()
    db.collection(dbName).orderBy('time', 'desc').get({
      success(res) {
        // console.log(" res.data-his:" + res.data)
        that.setData({
          itemArray: res.data,
        })
      }
    })

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    // var that = this;
    // var dbName = that.data.dbName;
    // if (that.data.historyTag == 0){
    //   that.loadPodCast(dbName)
    // }else{
    //   that.loadHistory(dbName)
    // }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})