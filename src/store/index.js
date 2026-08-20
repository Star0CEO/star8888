import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)
let userInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
let token = sessionStorage.getItem("token") || '';

let appInfo = JSON.parse(localStorage.getItem('appInfo')) || {};
let messageNum = token ? localStorage.getItem("messageNum") || 0 : 0;

export default new Vuex.Store({
  //state存放状态,
  state: {
    userInfo,
    token,
    messageNum,
    appInfo,
    bannerList: [],
    realbetList: [],
    jokerList: [],
    gamingList: [],
    sportList: [],
    lotteryList: [],
    conciseList: [],
    fishingList: [],
    lhcList: [],
    jscList: [],
    jwcList: [],
    qkcList: [],
  },
  //getter为state的计算属性
  getters: {
    // 安全的余额 getter
    safeBalance: state => {
      return state.userInfo && state.userInfo.balance !== undefined && state.userInfo.balance !== null 
        ? state.userInfo.balance 
        : '0.00';
    },
    // 安全的用户名 getter
    safeUsername: state => {
      return state.userInfo && state.userInfo.username 
        ? state.userInfo.username 
        : '';
    }
  },
  //mutations可更改状态的逻辑，同步操作
  mutations: {
    changGameList(state) {
      let bannerList = localStorage.getItem('bannerList') ? JSON.parse(localStorage.getItem('bannerList')) : [];
      state.bannerList = bannerList;
      let realbetList = localStorage.getItem('realbetList') ? JSON.parse(localStorage.getItem('realbetList')) : [];
      state.realbetList = realbetList;
      let jokerList = localStorage.getItem('jokerList') ? JSON.parse(localStorage.getItem('jokerList')) : [];
      state.jokerList = jokerList;
      let gamingList = localStorage.getItem('gamingList') ? JSON.parse(localStorage.getItem('gamingList')) : [];
      state.gamingList = gamingList;
      let sportList = localStorage.getItem('sportList') ? JSON.parse(localStorage.getItem('sportList')) : [];
      state.sportList = sportList;
      let lotteryList = localStorage.getItem('lotteryList') ? JSON.parse(localStorage.getItem('lotteryList')) : [];
      state.lotteryList = lotteryList;
      let conciseList = localStorage.getItem('conciseList') ? JSON.parse(localStorage.getItem('conciseList')) : [];
      state.conciseList = conciseList;
      let fishingList = localStorage.getItem('fishingList') ? JSON.parse(localStorage.getItem('fishingList')) : [];
      state.fishingList = fishingList;
      let lhcList = localStorage.getItem('lhcList') ? JSON.parse(localStorage.getItem('lhcList')) : [];
      state.lhcList = lhcList;
      let jscList = localStorage.getItem('jscList') ? JSON.parse(localStorage.getItem('jscList')) : [];
      state.jscList = jscList;
      let jwcList = localStorage.getItem('jwcList') ? JSON.parse(localStorage.getItem('jwcList')) : [];
      state.jwcList = jwcList;
      let qkcList = localStorage.getItem('qkcList') ? JSON.parse(localStorage.getItem('qkcList')) : [];
      state.qkcList = qkcList;

    },
    changUserInfo(state) {
      let userInfo = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : {};
      state.userInfo = userInfo;
    },
    changToken(state) {
      state.token = sessionStorage.getItem('token') || '';
    }
    , changMessageNum(state) {
      let show = localStorage.getItem('show');
      state.messageNum = show ? 0 : localStorage.getItem('messageNum');
    }
    , changappInfo(state) {
      let appInfo = JSON.parse(localStorage.getItem('appInfo'))
      state.appInfo = appInfo;
    },
  },
  //提交mutation，异步操作
  actions: {

  },
  // 将store模块化
  modules: {
  }
})
