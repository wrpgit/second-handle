import Vue from 'vue'
import Vuex from 'vuex'
import io from '@hyoga/uni-socket.io';
Vue.use(Vuex);
const store = new Vuex.Store({
  state: {
    login: false,
    // isInit: false,
		csrf: '',
    userInfo: null,
    schoolList: [],
    navbar: [],
    uploadToken: '',
    appSocket: null,
    // baseUrl: 'https://www.wrpxcx.com'
		// baseUrl: 'http://192.168.23.1:7001'
		baseUrl: '',
  },  
  mutations: {  
    init(state, data) {
      // state.isInit = true;  
      state.schoolList = data.school;
      state.navbar = data.navbar;
      state.csrf = data.csrf;
      state.uploadToken = data.uploadToken;

    },
    login(state, userInfo) {
      state.userInfo = userInfo;
      uni.setStorage({
        key: 'userInfo',
        data: userInfo
      })
    },
    loginOut(state) {
      state.userInfo = null;
      //移除缓存
      //...
    },

    initSocket(state) {
      state.appSocket = io('wss://www.wrpxcx.com', {
      // state.appSocket = io('ws://192.168.23.1:7001', {
        query: {},
        transports: [ 'websocket', 'polling' ],
        timeout: 5000,
      });

      state.appSocket.on('connect', () => {
        // ws连接已建立，此时可以进行socket.io的事件监听或者数据发送操作
        // 连接建立后，本插件的功能已完成，接下来的操作参考socket.io官方客户端文档即可
        // console.log('ws 已连接');
      })
      state.appSocket.on('disconnect', () => {
        console.log('连接断开');
      })
      state.appSocket.on('error', (msg) => {
        console.log('ws error', msg);
      });
    }
  }
})
export default store;