// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    salaries: [{
      name: '1800',
      value: '0',
      checked: false
    },
    {
      name: '2500',
      value: '1',
      checked: false
    },
    {
      name: '3000',
      value: '2',
      checked: true
    },
    {
      name: '3500',
      value: '3',
      checked: false
    },
    {
      name: '5000',
      value: '4',
      checked: false
    },
      {
        name: '3500',
        value: '3',
        checked: false
      },
      {
        name: '5000',
        value: '4',
        checked: false
      },
      {
        name: '3500',
        value: '3',
        checked: false
      },
      {
        name: '5000',
        value: '4',
        checked: false
      }
    ]
  },
  serviceValChange: function (e) {
    var salaries = this.data.salaries;
    var checkArr = e.detail.value
    //多选的时候把wxml文件中的radio，包括radio-group改成checkbox即可的逻辑
    for (var i = 0; i < salaries.length; i++) {
      if (checkArr.indexOf(i + "") != -1) {
        salaries[i].checked = true;
      } else {
        salaries[i].checked = false;
      }
    }
    this.setData({
      salaries: salaries
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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