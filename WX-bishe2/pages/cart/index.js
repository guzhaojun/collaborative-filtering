// 导入request请求工具类
import {getBaseUrl,requestUtil} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    baseUrl:'',

    allChecked:false,
    size:"0",
    totalPrice:0,
    totalNum:0,
    cart:[],

  },


  handleChooseAddress(){
    // wx.chooseAddress({
    //   success:(result)=>{
    //     console.log(result)
    //     wx.setStorageSync('address', result)
    //   },
    // })
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  geng(){
    wx.navigateTo({
      url: '/pages/address/address',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:function(options) {
    const baseUrl = getBaseUrl();
    this.setData({
      baseUrl
    })
    requestUtil({url:"/cart", method: "GET"}).then(res => {
      if (res.code == 0) {
        //第二个接口请求的地方
      //   var sizeList = [{
      //   productId: 7,
      //   size: "38",
      // },{
      //   productId: 36,
      //   size: "36",
      // },{
      //   productId: 4,
      //   size: "39",
      // }]
        // let list = sizeList.reduce((pre,cur)=>{
        //   let target=pre.find(ee=>ee.productId == cur.id)
        //   if(target){
        //     Object.assign(target,cur)
        //   }
        //   return pre
        // },res.carts)
       this.setData({
         cart:res.carts
       })
       this.setCart();
      } 
    });

    requestUtil({url:"/cart/totalPrice", method: "GET"}).then(res => {
      if (res.code == 0) {
        this.setData({
          totalPrice:res.totalPrice
        })
      } 
    });
    console.log(this.data.totalPrice)

    requestUtil({url:"/cart/totalNum", method: "GET"}).then(res => {
      if (res.code == 0) {
        this.setData({
          totalNum:res.totalNum
        })
      } 
    });
    console.log(this.data.totalNum)

   
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
    this.onLoad()
    const address = wx.getStorageSync('address');
    this.setData({
      address
    })
  },
  //商品选中事件处理
  handleItemChange(e){
    const {id}=e.currentTarget.dataset;
    let {cart}=this.data;
    let index =cart.findIndex(v=>v.id===id);
    cart[index].checked=!cart[index].checked;
    this.setCart(cart)
  },

  async handledel(e){
    let id = e.currentTarget.dataset.id
    console.log(id);

    // this.QueryParams2.id = id;
    let _this = this;
    // console.log(this.QueryParams2);

    wx.showModal({
      title: '提示',
      content: '确认删除吗',
      complete: (res) => {
      
    
        if (res.confirm) {
          requestUtil({url:"/cart/goods/" +id, method: "DELETE"}).then(res => {
            wx.showToast({
              title:"删除成功",
              icon:'success',
              mask:true
            })

             
          });

          this.onLoad();
        }
      }
    })
  },

  //商品数量的编辑功能
  handleItemNumEdit(e){
    var that =this
    const {id,operation}=e.currentTarget.dataset;
    let {cart}=this.data;
    let index =cart.findIndex(v=>v.id===id);
    if(cart[index].stock===1 && operation === -1){
      wx.showModal({
        title: '提示',
        content: '确认删除吗',
        complete: (res) => {
          if (res.confirm) {
            requestUtil({url:"/cart/goods/" +cart[index].id, method: "DELETE"}).then(res => {
              wx.showToast({
                title:"删除成功",
                icon:'success',
                mask:true
              })
            });
            that.onLoad();
          }
        }
      })
    }
    
    // else if(operation === 1){
    //   cart[index].stock+=operation;
    //   this.setCart(cart);
    //   let data = {productId:cart[index].id,num:1};
    //   requestUtil({url:"/cart", method: "POST",data:data}).then(res => {
    //     if (res.code === 0) {
    //     } 
    //   });
    //   this.onLoad()
    // }else if (operation === -1){
    //   cart[index].stock+=operation;
    //   this.setCart(cart);
    //   let data = {productId:cart[index].id,num:-1};
    //   requestUtil({url:"/cart", method: "POST",data:data}).then(res => {
    //     if (res.code === 0) {
    //     } 
    //   });
    //   this.onLoad()
    // }
  },

  //商品全选事件处理
  handleItemAllCheck(){
    let {cart,allChecked}=this.data;
    allChecked=!allChecked;
    cart.forEach(v=>v.checked=allChecked);
    this.setCart(cart);
  },
  //点击结算
  handlePay(){
    const {address,totalNum}=this.data;
    if(!address){
      wx.showToast({
        title: '您还没有选择收货地址',
        icon:'none'
      })
      return;
    }
    // if(totalNum===0){
    //   wx.showToast({
    //     title: '您还没有选购商品',
    //     icon:'none'
    //   })
    //   return;
    // }
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  },

  //设置购物车状态 重新计算底部工具栏 全选 总价 数量 重新设置缓存
  setCart(cart){
    cart =this.data.cart;
    console.log("购物车信息： "+ JSON.stringify(cart))
    let allChecked=true;
    let totalPrice=this.data.totalPrice;
    let totalNum=this.data.totalNum;
    if(cart){
      cart.forEach(v=>{
        if(v.checked){
          totalPrice+=v.price*v.num;
          totalNum+=v.num;
        }else{
          allChecked=false;
        }
      })
    allChecked=cart.length!=0?allChecked:false;
    }
    this.setData({
      cart,
      allChecked,
      totalNum,
      totalPrice
    })

    //cart设置到缓存中
    wx.setStorageSync('cart', cart);
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {
    this.onLoad();

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