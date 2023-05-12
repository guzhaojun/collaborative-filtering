// 导入request请求工具类
import {getBaseUrl,getWxLogin,getUserProfile,requestUtil} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    baseUrl:'',
    cart:[],
    totalPrice:0,
    totalNum:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
  },
  //处理订单支付
  async handleOrderPay(){
    wx.showModal({
      title: '提示',
      content: '是否付款?',
      complete: (res) => {
        if (res.cancel) {
          //付款失败 变成待付款
          this.createOrder1();
        }
        if (res.confirm) {
          const token=wx.getStorageSync('token');//已登录就不需要登录
          if(!token){
            Promise.all([getWxLogin(),getUserProfile()]).then((res)=>{
              console.log(res[0].code);
              console.log(res[1].userInfo.nickName,res[1].userInfo.avatarUrl);
              let loginParam={
                code:res[0].code,
                nickName:res[1].userInfo.nickName,
                avatarUrl:res[1].userInfo.avatarUrl
              }
              console.log(loginParam)
              wx.setStorageSync('userInfo', res[1].userInfo);//同步存储用户信息,个人中心可以获取
              this.wxlogin(loginParam);
            })
          }else{
            console.log("token存在"+token);
            //支付继续，创建订单
            console.log("支付继续走，创建订单");
            this.createOrder();
          }
        }
      }
    })
    // wx.login({
    //   timeout: 5000,
    //   success:(res)=>{
    //     console.log(res)
    //   }
    // })
    // let res = await getWxLogin();
    // console.log(res.code)
    // wx.getUserProfile({
    //   desc: '获取用户信息',
    //   success:(res)=>{
    //     console.log(res.userInfo.nickName,res.userInfo.avatarUrl)
    //   }
    // })

    // let res2 = await getUserProfile();
    // console.log(res2.userInfo.nickName,res2.userInfo.avatarUrl)

    //wx.login和wx.getUserProfile不能同时调用，要用Promise.all
    
  },
  
//请求后端获取用户token,获取openid通过调用code2Session接口
  async wxlogin(loginParam){
    const result = await requestUtil({url:"/user/wxlogin",data:loginParam,method:"post"});
    console.log(result);
    const token = result.token;
    if(result.code==0){
      //存储token到缓存
      wx.setStorageSync('token', token);
      //支付继续，创建订单
      console.log("支付继续走，创建订单");
      this.createOrder();
    }
  },
  //创建订单,把数据发送到后端并返回订单号
  async createOrder1(){
    try{
      const totalPrice=this.data.totalPrice;
      const address=this.data.address[0].address
      const consignee=this.data.address[0].userName;
      const telNumber=this.data.address[0].telNumber;
      let goods=[];
      this.data.cart.forEach(v=>goods.push({
        goodsId:v.id,
        goodsNumber:v.stock,
        goodsPrice:v.price,
        goodsName:v.name,
        goodsPic:v.proPic
      }))
      const orderParam={
        totalPrice,
        address,
        consignee,
        telNumber,
        goods,
        status:4
      }
      console.log(orderParam,'orderParamorderParam')
      const res=await requestUtil({url:"/my/order/create",method:"POST",data:orderParam});
      console.log("orderNo="+res.orderNo);
      //删除缓存中已经支付的商品
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);//filter处理，每次遍历得到v对象，得到未选中的商品
  
      wx.setStorageSync('cart', newCart);
      wx.navigateTo({
        url: '/pages/order/index?type=4',
      })
    }catch(error){
      console.log(error);
      wx.showToast({
        title: '支付失败',
        icon:'none'
      })
    }

   
  },
  //创建订单,把数据发送到后端并返回订单号
  async createOrder(){
    try{
      const totalPrice=this.data.totalPrice;
      const address=this.data.address[0].address
      const consignee=this.data.address[0].userName;
      const telNumber=this.data.address[0].telNumber;
      let goods=[];
      this.data.cart.forEach(v=>goods.push({
        goodsId:v.id,
        goodsNumber:v.stock,
        goodsPrice:v.price,
        goodsName:v.name,
        goodsPic:v.proPic
      }))
      const orderParam={
        totalPrice,
        address,
        consignee,
        telNumber,
        goods
      }
      this.data.cart.forEach(item=>{
        requestUtil({url:"/cart/goods/" +item.id, method: "DELETE"})
      })
      const res=await requestUtil({url:"/my/order/create",method:"POST",data:orderParam});
      console.log("orderNo="+res.orderNo);
      //删除缓存中已经支付的商品
      let newCart=wx.getStorageSync('cart');
      newCart=newCart.filter(v=>!v.checked);//filter处理，每次遍历得到v对象，得到未选中的商品
  
      wx.setStorageSync('cart', newCart);
  
      wx.showToast({
        title: '支付成功',
        icon:'none'
      })
      wx.navigateTo({
        url: '/pages/order/index?type=0',
      })
    }catch(error){
      console.log(error);
      wx.showToast({
        title: '支付失败',
        icon:'none'
      })
    }

   
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow:function() {
    const address = wx.getStorageSync('address');
    let cart=wx.getStorageSync('cart')||[];
    let totalPrice=0;
    let totalNum=0;
    cart.forEach(v=>{
      totalPrice+=v.price*v.stock;
      totalNum+=v.stock;
    })
    this.setData({
      cart,
      totalNum,
      address,
      totalPrice
    })
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