export default defineAppConfig({
  pages: [
    'pages/home/index',
    'pages/order/index',
    'pages/dispatch/index',
    'pages/works/index',
    'pages/mine/index',
    'pages/sketch-detail/index',
    'pages/order-detail/index',
    'pages/embroiderer-detail/index',
    'pages/create-order/index',
    'pages/silk-inventory/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#FFFFFF',
    navigationBarTitleText: '锦绣坊',
    navigationBarTextStyle: 'black',
    backgroundColor: '#FDF8F3'
  },
  tabBar: {
    color: '#A08060',
    selectedColor: '#C41E3A',
    backgroundColor: '#FFFFFF',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/order/index',
        text: '订单'
      },
      {
        pagePath: 'pages/dispatch/index',
        text: '派单'
      },
      {
        pagePath: 'pages/works/index',
        text: '作品'
      },
      {
        pagePath: 'pages/mine/index',
        text: '我的'
      }
    ]
  }
})
