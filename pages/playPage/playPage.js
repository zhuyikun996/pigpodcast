// var innerAudioContext = wx.createInnerAudioContext()
var backgroundAudioManager = wx.getBackgroundAudioManager()
var util = require("../../utils/util.js")
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_src: "",
        podCastName: "", //播客名
        episodeName: "",
        podcastshortcut: "",
        btn_src: "../../images/play.png",
        src: "", //音频源
        id: "", //音频id
        firstPlayTag: true, //true:第一次播放  false:不是第一次播放
        playingTag: false, //true:在播放  false:没有在播放 
        currentTimeDB: 0,
        currentTime: "00:00:00",
        totalTime: "00:02:00",
        currentHistoryId: 0, //当前history的索引id
        btn_left: "../../images/left.png",
        btn_right: "../../images/right.png"

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var that = this;
        var id = options.id; //上一个页面传来的播客数据库中的id
        var dbName = options.dbName; //上一个页面传来的播客数据库名
        var podcastshortcut = options.podcastshortcut; //上一个页面传来的podcastshortcut
        that.setData({ //赋值一下变量，用于在onTimeUpdate回调函数中设置正在播放播客的信息
            id: id,
            dbName: dbName,
            podcastshortcut: podcastshortcut
        })
        var historyTag = 0;
        var db = wx.cloud.database()
            //先去历史记录里加载数据
        db.collection('podCastArrayDB_history').where({
            podCastId: id // 当前播客的id
        }).get({
            success(res) {
                if (res.data == "") { //该播客不存在历史记录数据库中,再去相应的播客数据库里捞
                    historyTag = 0
                } else { //该播客存在历史记录数据库中,捞出来相应的数据
                    // console.log("res.data == " + JSON.stringify(res.data))
                    // res.data 包含该记录的数据
                    var img = res.data[0].img
                    var podcastname = res.data[0].podCastName //注意，这个字段在history库里是podCastName
                    var episodeName = res.data[0].episodeName //单集名称
                    var src = res.data[0].src
                    var id = res.data[0].podCastId //注意，这个字段在history库里应该取podCastId
                    if (res.data[0].currenttime != "") {
                        var currenttime = res.data[0].currenttime //在history数据库里有这个字段
                    } else {
                        var currenttime = "00:00:00"
                    }
                    // console.log("currenttime-onload:  " + currenttime)
                    that.setData({
                        podCastName: podcastname,
                        episodeName: episodeName,
                        src: src,
                        id: id,
                        podcastshortcut: podcastshortcut,
                        currentTime: util.myFormatSecondToHHMMSS(currenttime),
                        currentTimeDB: currenttime, //在history数据库里有这个字段
                        img_src: img
                    })
                    historyTag = 1
                }
            }
        })
        if (historyTag == 0) { //该播客不存在历史记录数据库中,再去相应的播客数据库里捞
            var db_playlist = wx.cloud.database()
            db_playlist.collection(dbName).doc(id).get({
                success(res) {
                    // console.log("该播客不存在历史记录数据库中res.data == " + JSON.stringify(res.data))
                    // res.data 包含该记录的数据
                    var img = res.data.img
                    var podcastname = res.data.podcastname
                    var episodeName = res.data.episodeName //单集名称
                        // console.log("episodeName: " + episodeName)
                    var src = res.data.src
                    var id = res.data._id
                    that.setData({
                        podCastName: podcastname,
                        episodeName: episodeName,
                        src: src,
                        id: id,
                        podcastshortcut: podcastshortcut,
                        img_src: img
                    })
                }
            })
        }



        //加载页面时，音频正在播放
        if (wx.getStorageSync(id)) {
            that.setData({
                playingTag: true, //正在播放
                firstPlayTag: false, //不是第一次播放
                btn_src: "../../images/pause.png"
            })
        }
        //没有打开过主页，直接从分享页面进来
        if (wx.getStorageSync("openid") == "") {
            //调用云函数，login，获取 openid
            wx.cloud.callFunction({
                name: 'login',
                success(res) {
                    // console.log("playpag云端openid:" + res.result.openid)
                    that.setData({
                        openid: res.result.openid
                    })
                    wx.setStorageSync("openid", res.result.openid)
                }
            })
        }
        //背景音播放回调
        backgroundAudioManager.onCanplay(() => {
            console.log("可播放状态")
            var totalTime = util.myFormatSecondToHHMMSS(backgroundAudioManager.duration)
            that.setData({
                totalTime: totalTime,
            })
        })
        backgroundAudioManager.onPlay(() => {
            console.log("在播放")
            var totalTime = util.myFormatSecondToHHMMSS(backgroundAudioManager.duration)
            wx.setStorageSync(that.data.id, true) //设置播放标志位为true
            that.setData({
                firstPlayTag: false, //播放过
                totalTime: totalTime,
                btn_src: "../../images/pause.png" //切换播放按钮图片
            })
        })
        backgroundAudioManager.onTimeUpdate(() => {
            // console.log(backgroundAudioManager.currentTime)
            setTimeout(() => {
                var currentTime = util.myFormatSecondToHHMMSS(backgroundAudioManager.currentTime)
                that.setData({
                    currentTime: currentTime,
                    currentTimeDB: backgroundAudioManager.currentTime
                })

            }, 500)
            var id = that.data.id
            var dbName = that.data.dbName
            var podcastshortcut = that.data.podcastshortcut
            var playingdata = { "id": id, "dbName": dbName, "podcastshortcut": podcastshortcut }
            wx.setStorageSync("playing", playingdata) //设置正在播放的播客信息 id dbName podcastshortcut
        })
        backgroundAudioManager.onPause(() => {
            console.log("暂停播放")
            wx.setStorageSync(that.data.id, false) //处于暂停状态
            var time = util.myFormatTime(new Date())
                //上传当前进度
            var curTime = backgroundAudioManager.currentTime
                //由于在点击播放按钮的时候已经把这条播客放入了history库，现在只需要更新time和currenttime
                // console.log("onPause-curTime: " + curTime)
                // console.log("onPause-currentHistoryId: " + that.data.currentHistoryId)
            var dbUpdateTime = wx.cloud.database()
                //更新的id为history的索引值id
            dbUpdateTime.collection("podCastArrayDB_history").doc(that.data.currentHistoryId).update({
                data: {
                    time: time,
                    currenttime: curTime
                },
                success: console.log,
                fail: console.error
            })
            that.setData({
                playingTag: false, //处于暂停状态
                firstPlayTag: false, //firstPlayTag调整为不是第一次播放
                btn_src: "../../images/play.png" //切换播放按钮图片
            })
            wx.setStorageSync("playing", 0) //设置正在播放的播客信息,暂停时，设为0
            console.log("暂停播放:" + wx.getStorageSync("playing"))
        })
        backgroundAudioManager.onStop(() => {
            console.log("停止播放")
            that.setData({
                playingTag: false, //处于暂停状态
                firstPlayTag: false, //firstPlayTag调整为不是第一次播放
                btn_src: "../../images/play.png" //切换播放按钮图片
            })
            wx.setStorageSync("playing", 0) //设置正在播放的播客信息,停止时，设为0
        })
        backgroundAudioManager.onWaiting(() => {
            console.log("缓冲中")
        })
    },
    //点击播放按钮
    playRadio: function() {
        var that = this;
        var playing = that.data.playingTag;
        if (playing) { //当正在播放的时候点击按钮
            backgroundAudioManager.pause();
            wx.setStorageSync(that.data.id, false) //处于暂停状态
            that.setData({
                playingTag: false, //处于暂停状态
                firstPlayTag: false, //firstPlayTag调整为不是第一次播放
                btn_src: "../../images/play.png" //切换播放按钮图片
            })
        } else { //当处于未播放状态时，判断是不是第一次播放
            var firstPlayTag = that.data.firstPlayTag; //第一次播放标志，默认为false，表示一次都没有播放过
            //不是第一次播放，都继续播放，而不是 重新加载从头播放
            if (firstPlayTag == false) {
                backgroundAudioManager.play();
                console.log("playRadio-play")
            } else { //当第一次点击播放按钮，加载音频title和音频源
                backgroundAudioManager.title = that.data.podCastName;
                backgroundAudioManager.src = that.data.src; // 设置了 src 之后会自动播放
                backgroundAudioManager.startTime = that.data.currentTimeDB
                console.log("第一次点击播放按钮")
            }
            that.setData({ //当没有播放任何播客的时候点击按钮
                firstPlayTag: false, //播放过
                playingTag: true, //处于播放状态
                btn_src: "../../images/pause.png" //切换播放按钮图片
            })
            wx.setStorageSync(that.data.id, true) //处于播放状态
            console.log("playRadio-id" + that.data.id)
            that.storeHistory(that.data.id) //将当前播客存放到历史播放中
        }
    },
    //返回首页
    goBackHome: function() {
        wx.navigateTo({
            url: '../../pages/main/main',
        })
    },
    /**
     * 将播放记录存放到历史记录数据库中
     * */
    storeHistory: function(id) {
        var that = this;
        var openid = wx.getStorageSync("openid")
        var time = util.myFormatTime(new Date())
            // console.log("id: " + id)
            // 当前数据库中是否存在这一条播放记录
        var db = wx.cloud.database();
        db.collection('podCastArrayDB_history').where({
            podCastId: id // 当前播客的id
        }).get({
            success(res) {
                if (res.data == "") { //该播客不存在历史记录数据库中,执行add操作
                    console.log("storeHistory：该播客不存在历史记录数据库中")
                    var db = wx.cloud.database()
                        // console.log("that.data.currenttime-store:" + that.data.currentTimeDB)
                    db.collection('podCastArrayDB_history').add({
                        data: {
                            src: that.data.src, //音频源文件地址
                            podCastName: that.data.podCastName, //播客名字：eg，得意忘形播客
                            episodeName: that.data.episodeName, //播客某一集的名字：eg，序言：「无为」与刻意
                            img: that.data.img_src, //播客图片
                            time: time, //播放时间
                            podCastId: that.data.id, //播客id
                            podcastshortcut: that.data.podcastshortcut, //播客名缩写 eg：dywx
                            currenttime: that.data.currentTimeDB //当前播放进度
                        },
                        success(res) {
                            // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
                            // console.log("播放存入历史成功id:" + res._id)
                            that.setData({
                                currentHistoryId: res._id //当前history的索引id
                            })
                        }
                    })
                } else { //该播客存在历史记录数据库中,执行update操作
                    var currentId = res.data[0]._id
                    that.setData({
                        currentHistoryId: currentId //当前history的索引id
                    })
                    console.log("当前播客的在历史记录里的id:" + currentId)
                        // console.log("该播客存在历史记录数据库中,执行update操作")
                    wx.cloud.database().collection('podCastArrayDB_history').doc(currentId).update({
                        // data 传入需要局部更新的数据
                        data: {
                            time: time,
                        },
                        // success: console.log,
                        // fail: console.error
                    })
                    historyTag = 1
                }
            }
        })
    },
    // 倒退15秒
    playBack15: function() {
        var that = this
        if (backgroundAudioManager.currentTime > 15) {
            backgroundAudioManager.seek(backgroundAudioManager.currentTime - 15)
        } else {
            wx.showToast({
                title: '播放时长超过15秒才可以回退哦',
                icon: 'none',
                duration: 2000
            })
        }
    },
    //前进30秒
    playForward30: function() {
        backgroundAudioManager.seek(backgroundAudioManager.currentTime + 30)
    },
    /**
     * 图片加载回调函数
     */
    imageLoad: function(event) {

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {},

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // innerAudioContext.destroy();
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