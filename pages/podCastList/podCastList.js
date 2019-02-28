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
        podcastshortcut: "", //播客名缩写 eg：dywx
        clearHistoryTips: "清除历史记录",
        podcastName: "", //播客名字
        podcastAuthor: "", //播客作者
        index: 0, //默认拉取第1页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
            // console.log(dbSuffix);
            //加载数据库数据：某个播客的所有集数
        var podcastshortcut = options.podcastshortcut; //主页传过来的podcastshortcut
        var dbName = "podCastArrayDB_" + podcastshortcut; //每个播客的数据库采用“podCastArrayDB_+博客名缩写”的形式
        var author = options.author; //主页传过来的author
        var podcastname = options.podcastname; //podcastname
        var img = options.img; //主页传过来的img
        that.setData({
                historyHidden: true,
                dbName: dbName,
                img: img, //设置图片
                historyTag: 0,
                podcastshortcut: podcastshortcut,
                podcastAuthor: author,
                podcastName: podcastname,
            })
            // 拉取播客数据库数据 dbName = podCastArrayDB_podcastshortcut (eg:podCastArrayDB_dywx)
        that.loadPodCast(dbName, that.data.index); //第1次拉取db中的数据
    },
    //跳转到播放页面
    podcastDetail: function(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var podcast = this.data.itemArray[index];
        var id = "";
        var dbName = "";
        id = podcast._id
        dbName = this.data.dbName
            // console.log(id);
        wx.navigateTo({
            url: '../../pages/playPage/playPage?id=' + id + "&dbName=" + dbName + "&podcastshortcut=" + this.data.podcastshortcut,
        })
    },
    /**|
     * 拉取播客数据库数据
     */
    loadPodCast: function(dbName, i) {
        var that = this;
        const db = wx.cloud.database()
        var resArray = that.data.itemArray
        db.collection(dbName).skip(20 * i).get({
            success(res) {
                if (res.data.length > 0) {
                    for (let j = 0; j < res.data.length; j++) {
                        resArray.push(res.data[j])
                    }
                    that.setData({
                        itemArray: resArray,
                    })
                } else {
                    wx.showToast({
                        title: '客官，实在是没有余粮了，就这么多了',
                        icon: 'none',
                        duration: 2000
                    })
                }

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
        console.log("页面上拉触底事件的处理函数")
        var that = this
        var index = that.data.index
        that.setData({
            index: index + 1
        })
        var dbName = that.data.dbName
        that.loadPodCast(dbName, that.data.index); //第1次拉取db中的数据

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})