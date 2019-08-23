var util = require("../../utils/util.js")

Page({

    /**
     * 页面的初始数据
     */
    data: {
        yesOrNo: "不是",
        prefer: "宜发呆",
        tips0: "把今天",
        tips1: "周五的喜悦分享给你的朋友吧! *创意来源“即刻APP”"
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        let time = util.formatTimeForFriday(new Date());
        let date = util.getWeeks(time);
        const db = wx.cloud.database()
        db.collection('prefer').get({
            success(res) {
                switch (date) {
                    case '周一':
                        that.setData({
                            yesOrNo: "不是",
                            prefer: res.data[0].Monday,
                            tips0: res.data[0].tips0,
                            tips1: res.data[0].tips1
                        })
                        break;
                    case '周二':
                        that.setData({
                            yesOrNo: "不是",
                            prefer: res.data[0].Tuesday
                        })
                        break;
                    case '周三':
                        that.setData({
                            yesOrNo: "不是",
                            prefer: res.data[0].Wednesday
                        })
                        break;
                    case '周四':
                        that.setData({
                            yesOrNo: "不是",
                            prefer: res.data[0].Thursday

                        })
                        break;
                    case '周五':
                        that.setData({
                            yesOrNo: "是",
                            prefer: res.data[0].Friday
                        })
                        break;
                    case '周六':
                        that.setData({
                            yesOrNo: "周六！",
                            prefer: res.data[0].Saturday
                        })
                        break;
                    case '周天':
                        that.setData({
                            yesOrNo: "周天！",
                            prefer: res.data[0].Sunday
                        })
                        break;
                }
                that.setData({
                    tips0: res.data[0].tips0,
                    tips1: res.data[0].tips1
                })
                if (res.data[0].ready) { //ok
                    console.log("ready:true ")
                    setTimeout(function() {
                        wx.reLaunch({
                            url: "../../pages/main/main"
                        })
                    }, 5000)
                } else { //not ok
                    console.log("ready:false ")
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