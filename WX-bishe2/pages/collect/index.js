// pages/collect/index.js
// 导入request请求工具类
import {getBaseUrl,requestUtil} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({


  /**
   * 页面的初始数据
   */
  data: {
 
    baseUrl:'',
    collects:[]
  },

    //接口参数
    QueryParams:{
      page:1,//第几页
      pageSize:10//每页记录数
    },
  
    QueryParams2:{
      id:1
    },
    //总页数
    totalPage:1,


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl,
      collects:[]
    })
    this.getData();
  },


  async getData(){
    const result = await requestUtil({url: '/collect/list',data:this.QueryParams});
    console.log(result);
    this.collects=result.collectList;
    this.totalPage=result.totalPage;
    this.setData({
      collects:[...this.data.collects,...result.collectList]
    })

    console.log( this.collects);
  },

  async handledel(e){
    console.log(e.currentTarget.dataset.id);
    let id = e.currentTarget.dataset.id
    this.QueryParams2.id = id;
    let _this = this;
    console.log(this.QueryParams2);

    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      complete: (res) => {
        if (res.cancel) {
          // wx.navigateTo({
          //   url: '/pages/collect/index'
          // })
        }
    
        if (res.confirm) {
           const res = requestUtil({url: '/collect/del',data:_this.QueryParams2});
            console.log(res);
            wx.showToast({
              title:"删除成功",
              icon:'success',
              mask:true
            })

              _this.onLoad();
        }
      }
    })
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