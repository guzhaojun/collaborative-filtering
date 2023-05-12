// pages/size/index.js
import {getBaseUrl,requestUtil} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({
 
  onShareAppMessage() {
    return {
      title: 'radio',
      path: 'page/component/pages/radio/radio'
    }
  },
  /**
   * 页面的初始数据
   */
  data: {
    items: [
      {value: '36', name: '36'},
      {value: '37', name: '37'},
      {value: '38', name: '38'},
      {value: '39', name: '39'},
      {value: '40', name: '40'},
      {value: '41', name: '41'},
    ]
  },

  
  radioChange(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
    wx.setStorageSync('size', e.detail.value);
    const items = this.data.items
    for (let i = 0, len = items.length; i < len; ++i) {
      items[i].checked = items[i].value === e.detail.value
    }

    this.setData({
      items
    })
  },
  async handleConfirm(){
    wx.navigateTo({
      url: '/pages/product_detail/index',
    })
  },
  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})