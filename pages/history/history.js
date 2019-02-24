var constUtil = require('../../utils/constUtil.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        itemArray: [],
        dbName: "",
        img: "",
        podcastshortcut: "", //播客名缩写 eg：dywx
        clearHistoryTips: "清除历史记录",
        podcastName: "", //播客名字
        podcastAuthor: "", //播客作者
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
        var dbName = "podCastArrayDB_history";
        that.loadHistory(dbName);
    },
    //跳转到播放页面
    podcastDetail: function(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var podcast = this.data.itemArray[index];
        var id = "";
        var dbName = "";
        id = podcast.podCastId
        dbName = "podCastArrayDB_" + this.data.itemArray[index].podcastshortcut
        wx.navigateTo({
            url: '../../pages/playPage/playPage?id=' + id + "&dbName=" + dbName + "&podcastshortcut=" + this.data.podcastshortcut,
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
                var len = res.data.length
                if (len == 0) {
                    wx.showToast({
                        title: '还没有历史记录，回首页瞧瞧吧^_^',
                        icon: 'none',
                        duration: 2000
                    })
                    that.setData({
                        clearHistoryTips: "返回首页",
                    })
                }

            }
        })

    },
    /**
     * 清除历史记录
     */
    clearHistory: function() {
        var that = this;
        var db = wx.cloud.database()
        var list = that.data.itemArray
        var len = that.data.itemArray.length
        if (len == 0) { //当没有历史记录的时候，返回首页
            wx.navigateBack(); //返回首页
        } else {
            wx.showModal({
                title: '清空历史记录',
                content: '我看你是想清静一下',
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                        for (var i = 0; i < list.length; i++) {
                            var _id = list[i]._id
                            db.collection('podCastArrayDB_history').doc(_id).remove({
                                success(res) {
                                    console.log("删除历史记录成功")
                                }
                            })
                        }
                        wx.showToast({
                            title: '好啦~现在清静了^_^',
                            icon: 'none',
                            duration: 2000
                        })
                        setTimeout(function() {
                            that.loadHistory("podCastArrayDB_history");
                        }, 1000)
                    } else if (res.cancel) {
                        console.log('用户点击清空历史记录取消')
                    }
                }
            })
        }



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