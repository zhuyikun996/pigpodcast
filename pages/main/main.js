var consts = require('../../utils/constUtil.js')
var util = require("../../utils/util.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        listArray: [],
        openid: "",
        itemImg: ""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this
            //调用云函数，login，获取 openid
        wx.cloud.callFunction({
                name: 'login',
                success(res) {
                    // console.log("云端openid:" + res.result.openid)
                    that.setData({
                        openid: res.result.openid
                    })
                    wx.setStorageSync("openid", res.result.openid)
                }
            })
            //加载数据库数据：播客列表库 podCastArrayDB，再增加播客，只需要在数据库中增加记录即可，无需改动小程序代码
        const db = wx.cloud.database()
        db.collection('podCastArrayDB').orderBy('index', 'desc').get({
            success(res) {
                that.setData({
                    listArray: res.data,
                })
            }
        })
    },
    //点击播客列表，跳转到某个播客的列表中
    singlePodcastArray: function(e) {
        var index = parseInt(e.currentTarget.dataset.index);
        var podcastshortcut = this.data.listArray[index].podcastshortcut;
        var img = this.data.listArray[index].img
        var podcastname = this.data.listArray[index].podcastname
        var author = this.data.listArray[index].author
        wx.navigateTo({
            url: '../../pages/podCastList/podCastList?podcastshortcut=' + podcastshortcut + "&img=" + img + "&podcastname=" + podcastname + "&author=" + author,
        })

    },
    //点击历史记录
    historyPage: function() {
        wx.navigateTo({
            url: '../../pages/history/history'
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