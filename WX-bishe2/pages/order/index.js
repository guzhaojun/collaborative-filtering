// 导入request请求工具类
import {
    getBaseUrl,
    requestUtil,
    requestUpdateUtil
} from '../../utils/requestUtil.js';
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

    /**
     * 页面的初始数据
     */
    data: {
      baseUrl:'',
        tabs: [{
                id: 0,
                value: "全部订单",
                isActive: true
            },
            {
                id: 1,
                value: "待收货",
                isActive: false
            },
            {
                id: 2,
                value: "已收货",
                isActive: false
            },
            {
                id: 3,
                value: "退款/退货",
                isActive: false
            },
            {
              id: 4,
              value: "待付款",
              isActive: false
          },
            
        ]
    },
    //接口参数
    QueryParams: {
        type: 0,
        page: 1, //第几页
        pageSize: 10 //每页记录数
    },

    //总页数
    totalPage: 1,

    //根据标题索引激活选中的标签
    changeTitleByIndex(index) {
        let {
            tabs
        } = this.data;
        tabs.forEach((v, i) => i == index ? v.isActive = true : v.isActive = false);
        this.setData({
            tabs
        })
    },
    //tab点击事件处理
    handleTabsItemChange(e) {
        // const {index}=e.currentTarget.dataset;
        const {
            index
        } = e.detail;
        //切换标题
        this.changeTitleByIndex(index);

        //获取订单列表
        this.QueryParams.type = index;
        this.QueryParams.page = 1;
        this.setData({
            orders: []
        })
        this.getOrders();
    },

    //获取订单
    async getOrders() {
        const res = await requestUtil({
            url: '/my/order/list',
            data: this.QueryParams
        });
        this.totalPage = res.totalPage;
        if(this.data.page == 1) {
          this.setData({
            orders:[]
          })
        }
        console.log(this.data.orders,'this.data.ordersthis.data.ordersthis.data.orders')
        this.setData({
            orders: [...this.data.orders, ...res.orderList]
        })
    },


    UpdateStatusParams: {
        id: 154,
        status: 2
    },
    //修改订单
    async updateStatusOrders() {
        const res = await requestUpdateUtil({
            url: '/my/order/updateStatus',
            data: this.UpdateStatusParams
        });
        // this.totalPage = res.totalPage;
        // this.setData({
        //     orders: [...this.data.orders, ...res.orderList]
        // })
    },

    //确认收获
    handlePay(e) {
        var index = e.target.dataset.index //点击列表选择的下标 请求用
        console.log("点击了确认收货   " + index)
        this.UpdateStatusParams.id = index;
        this.updateStatusOrders();
      this.onShow();
    },



    UpdateStatusSaleParams: {
        id: 154,
        status: 5
    },

     //修改订单
     async updateStatusSaleOrders() {
        const res = await requestUpdateUtil({
            url: '/my/order/updateStatus',
            data: this.UpdateStatusSaleParams
        });
        // this.totalPage = res.totalPage;
        // this.setData({
        //     orders: [...this.data.orders, ...res.orderList]
        // })
    },
    //退货退款
    sales(e) {
        var index = e.target.dataset.index //点击列表选择的下标 请求用
        var that= this;
        wx.showModal({
            title: '提示',
            showCancel: false,
            content: '确定退货吗？',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击了确定')
                    that.UpdateStatusSaleParams.id = index;
                    that.updateStatusSaleOrders();
                    this.onShow();
                }
            },
        })
    },
    //待付款
    UpdateTuiStatusParams: {
      id: 154,
      status: 1
  },
    //付款  
    fukuan(e){
       var index = e.target.dataset.index //点击列表选择的下标 请求用
      console.log("点击了付款   " + index)
      this.UpdateTuiStatusParams.id = index;
      this.updateTuiStatusOrders()
      this.onShow();
    },
    //修改订单
    async updateTuiStatusOrders() {
      const res = await requestUpdateUtil({
          url: '/my/order/updateStatus',
          data: this.UpdateTuiStatusParams
      });
      // this.totalPage = res.totalPage;
      // this.setData({
      //     orders: [...this.data.orders, ...res.orderList]
      // })
  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      const baseUrl = getBaseUrl();
      this.setData({
        baseUrl
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
    onShow: function () {
        let pages = getCurrentPages();
        let currentPage = pages[pages.length - 1];
        const {
            type
        } = currentPage.options;
        this.changeTitleByIndex(type);
        this.QueryParams.type = type;
        this.QueryParams.page = 1;

        this.setData({
          orders:[]
        })
        console.log(this.data.orders,'this.data.orders')
        this.getOrders();
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
    onPullDownRefresh: function () {
        this.QueryParams.page = 1;
        this.setData({
            orders: []
        })
        this.getOrders();
        //手动关闭等待效果
        wx.stopPullDownRefresh({

        })
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log("触底了")
        if (this.QueryParams.page >= this.totalPage) {
            //没有下一页数据
            wx.showToast({
                title: '没有下一页数据了',
            })
        } else {
            this.QueryParams.page++;
            this.getOrders();
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
