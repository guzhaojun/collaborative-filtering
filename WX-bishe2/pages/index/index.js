// index.js
// 导入request请求工具类
import {getBaseUrl,requestUtil} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //轮播图数组
    swiperList:[],
    baseUrl:'',
    //商品大类数组
    bigTypeList:[],
    bigTypeList_row1:[],
    hotProductList:[],
    topRecommendOfUserId:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const baseUrl=getBaseUrl();
         this.setData({
           baseUrl
         })
    //发送异步请求获取后端数据
    // wx.request({
    //   url: 'http://localhost:8080/product/findSwiper',
    //   method:"GET",
    //   success:(result)=>{
    //     console.log(result)
    //     this.setData({
    //       swiperList:result.data.message
    //     })
    //     wx.request({
    //       url: 'url',
    //     })
    //   }
    // })
    this.getSwiperList();
    this.getBigTypeList();
    this.getHotProductList();
    this.topRecommendOfUserId();
  },
  //商品大类点击事件跳转商品分类
  handleTypeJump(e){
    const {index}=e.currentTarget.dataset;
    const app=getApp();
    app.globalData.index=index;
    wx.switchTab({
      url: '/pages/category/index'
    })
  },
  
 
  async getSwiperList(){
    // requestUtil({url: '/product/findSwiper',method:"GET"})
    //   .then(result=>{
    //     const baseUrl=getBaseUrl();
    //     this.setData({
    //       swiperList:result.message,
    //       baseUrl
    //     })
    //   })
    const result = await requestUtil({url: '/product/findSwiper',method:"GET"});
    this.setData({
      swiperList:result.message,
    })
  },
  // 获取热卖商品
  async getHotProductList(){
    const result = await requestUtil({url: '/product/findHot',method:"GET"});
    this.setData({
      hotProductList:result.message,
    })
  },

  // 获取热卖商品
  async topRecommendOfUserId(){
    const result = await requestUtil({url: '/collect/topRecommendOfUserId',method:"GET"});
    this.setData({
      topRecommendOfUserId:result.message,
    })
  },


  async getBigTypeList(){
    const result = await requestUtil({url: '/bigType/findAll',method:"GET"});
    const bigTypeList=result.message;
    const bigTypeList_row1=bigTypeList.filter((item,index)=>{
      return index<4;
    })
    this.setData({
      bigTypeList,
      bigTypeList_row1,
    })
  }
})