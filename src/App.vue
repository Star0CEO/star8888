<template>
  <div id="app">
    <div v-if="$store.state.appInfo.site_state == 1">
      <div class="meLoading" v-if="loading">
        <van-loading size="24px" vertical color="#0094ff" text-color="#0094ff">加载中...</van-loading>
      </div>
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" :key="$route.name" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" :key="$route.name" />
    </div>
    <div v-if="$store.state.appInfo.site_state == 0" style="box-sizing: border-box; padding: 30px; fong-size: 26px">{{ $store.state.appInfo.repair_tips }}</div>
    <!-- 登录弹窗 -->
    <div class="login-modal-wrapper" v-if="showLogin">
      <div class="login-modal-overlay" @click="showLogin = false"></div>
      <div class="login-modal-content">
        <login @close="showLogin = false" @success="handleLoginSuccess"></login>
      </div>
    </div>
    <!-- 注册弹窗 -->
    <div class="login-modal-wrapper" v-if="showRegister">
      <div class="login-modal-overlay" @click="showRegister = false"></div>
      <div class="login-modal-content">
        <login @close="showRegister = false" :initial-type="1" @success="handleLoginSuccess"></login>
      </div>
    </div>
  </div>
</template>

<script>
import login from './components/login.vue';

export default {
  name: 'App',
  components: {
    login,
  },
  data() {
    return {
      daoTime: null,
      loading: false,
      pid: '',
      showLogin: false,
      showRegister: false,
      redirectPath: '',
    };
  },
  created() {
    let that = this;
    var query = that.$route.query;

    that.getApp();
    that.getGameList();

    if (sessionStorage.getItem('token')) {
      that.openDaoTime();
      // 暂时不调用 getUserInfo()，因为 /api/user 接口返回 500 错误
      // that.getUserInfo();
    }
    if (query.pid) {
      that.pid = query.pid;
      that.showRegister = true;
    }
    that.getVisitUrl();
  },
  methods: {
    getVisitUrl() {
      let that = this;
      that.$apiFun
        .get('/api/getVisitUrl', {})
        .then(res => {
          if (res.code == 200) {
            let url = that.pid ? res.data.url + 'register?pid=' + that.pid : res.data.url;
            window.open(url, '_self');
          }
        })
        .catch(res => {
          // console.log(res)
        });
    },
    // 获取游戏列表
    getGameList() {
      let that = this;

      that.$apiFun.get('/api/game/list', { category: '' }).then(res => {
        if (res.code == 200) {
          let list = res.data;
          let realbetList = [];
          let jokerList = [];
          let gamingList = [];
          let sportList = [];
          let lotteryList = [];
          let conciseList = [];
          let fishingList = [];
          let lhcList = [];
          let jscList = [];
          let jwcList = [];
          let qkcList = [];
          list.forEach(el => {
            if (el.category_id == 'realbet' && el.app_state == 1) {
              realbetList.push(el);
            }
            if (el.category_id == 'joker' && el.app_state == 1) {
              jokerList.push(el);
            }
            if (el.category_id == 'gaming' && el.app_state == 1) {
              gamingList.push(el);
            }
            if (el.category_id == 'sport' && el.app_state == 1) {
              sportList.push(el);
            }
            if (el.category_id == 'lottery' && el.app_state == 1) {
              lotteryList.push(el);
            }
            if (el.category_id == 'concise' && el.app_state == 1) {
              conciseList.push(el);
            }
            if (el.category_id == 'fishing' && el.app_state == 1) {
              fishingList.push(el);
            }
            if (el.category_id == 'lhc' && el.app_state == 1) {
              lhcList.push(el);
            }
            if (el.category_id == 'jsc' && el.app_state == 1) {
              jscList.push(el);
            }
            if (el.category_id == 'jwc' && el.app_state == 1) {
              jwcList.push(el);
            }
            if (el.category_id == 'qkc' && el.app_state == 1) {
              qkcList.push(el);
            }

            localStorage.setItem('realbetList', JSON.stringify(realbetList));
            localStorage.setItem('jokerList', JSON.stringify(jokerList));
            localStorage.setItem('gamingList', JSON.stringify(gamingList));
            localStorage.setItem('sportList', JSON.stringify(sportList));
            localStorage.setItem('lotteryList', JSON.stringify(lotteryList));
            localStorage.setItem('conciseList', JSON.stringify(conciseList));
            localStorage.setItem('fishingList', JSON.stringify(fishingList));
            localStorage.setItem('lhcList', JSON.stringify(lhcList));
            localStorage.setItem('jscList', JSON.stringify(jscList));
            localStorage.setItem('jwcList', JSON.stringify(jwcList));
            localStorage.setItem('qkcList', JSON.stringify(qkcList));
            that.$store.commit('changGameList');
          });
        }
      });
    },
    // 获取app
    getApp() {
      let that = this;
      that.$apiFun.post('/api/app', {}).then(res => {
        if (res.code == 200) {
          localStorage.setItem('appInfo', JSON.stringify(res.data));
          that.$store.commit('changappInfo');
          document.getElementsByTagName('title')[0].innerText = that.$store.state.appInfo.title;
        }
      });
    },
    // 退出登录
    outLogin() {
      let that = this;

      that.$dialog
        .confirm({
          title: '提示',
          message: '您确定要退出登录吗?',
        })
        .then(() => {
          that.showLoading();

          that.$apiFun
            .post('/api/logoff', {})
            .then(res => {
              localStorage.clear();
              sessionStorage.clear();
              that.$store.commit('changUserInfo');
              that.$store.commit('changToken');
              that.closeDaoTime();
              that.hideLoading();
              that.showLogin = true;
            })
            .catch(() => {
              localStorage.clear();
              sessionStorage.clear();
              // that.$cookies.remove('token' )/
              that.$store.commit('changUserInfo');
              that.$store.commit('changToken');
              that.closeDaoTime();
              that.hideLoading();
              that.showLogin = true;
            });
        })
        .catch(() => {});
    },
    // 打开游戏
    openGamePage(name, type, code, gameName) {
      let that = this;
      let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
      if (!token) {
        that.showLogin = true;
        return;
      }
      let url = `/gamePage?name=${name}&type=${type}&code=${code}`;
      if (gameName) {
        url += `&game_name=${encodeURIComponent(gameName)}`;
      }
      that.goNav(url);
    },
    doCopy(msg) {
      let cInput = document.createElement('input');
      cInput.style.opacity = '0';
      cInput.value = msg;
      document.body.appendChild(cInput);
      // 选取文本框内容
      cInput.select();
      document.execCommand('copy');
      this.showTost(1, '复制成功！');
    },
    goNav(url) {
      let that = this;

      if (url == '/mine') {
        if (!that.$store.state.token) {
          that.showLogin = true;
        }
      }
      if (url == '/hongbao' || url == '/transfer') {
        if (!that.$store.state.token) {
          that.showLogin = true;
          return;
        }
        if (url == '/hongbao' && that.$store.state.appInfo.redpacket_switch == 0) {
          that.showTost(0, '红包已关闭');
          return;
        }
      }
      if (url == this.$route.fullPath) {
        that.showTost(0, '已在当前页面！');
        return;
      }

      this.$router.push({ path: url });
    },
    closeDaoTime() {
      let that = this;
      if (that.daoTime != null) {
        clearInterval(that.daoTime);
      }
      that.daoTime = null;
    },
    // 不刷新页面更新用户余额
    getBalance() {
      let that = this;
      that.$apiFun
        .post('/api/balance', {})
        .then(res => {
          if (res.code == 200) {
            let userInfo = JSON.parse(localStorage.getItem('userInfo'));
            userInfo.balance = res.data.balance;
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
            that.$store.commit('changUserInfo');
          }
          if (res.code == 401) {
            localStorage.clear();
            sessionStorage.clear();
            that.$store.commit('changUserInfo');
            that.$store.commit('changToken');
            that.closeDaoTime();
            that.showLogin = true;
          }
        })
        .catch(res => {});
    },
    openDaoTime() {
      let that = this;
      that.daoTime = setInterval(() => {
        that.getBalance();
      }, 4300);
    },
    // 不刷新页面跟新用户信息
    getUserInfo() {
      let that = this;
      that.$apiFun.post('/api/user', {}).then(res => {
        if (res.code === 200) {
          // 获取当前已有的 userInfo，保留 balance 字段
          let existingUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
          let userInfo = res.data;
          let str = userInfo.current_vip;
          let index = str.indexOf('P');
          let vip = str.substr(index + 1, str.length); //04
          userInfo.vip = vip;
          
          // 如果已有的 userInfo 中有 balance，保留它
          if (existingUserInfo.balance !== undefined && existingUserInfo.balance !== null) {
            userInfo.balance = existingUserInfo.balance;
          }
          
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          that.userInfo = userInfo;
          that.$store.commit('changUserInfo');
        }
      }).catch(err => {
        console.log('getUserInfo 接口调用失败:', err);
      });
    },
    // 刷新页面更新信息
    getUserInfoShowLoding() {
      let that = this;
      that.showLoading();
      that.$apiFun.post('/api/user', {}).then(res => {
        if (res.code === 200) {
          // 获取当前已有的 userInfo，保留 balance 字段
          let existingUserInfo = JSON.parse(localStorage.getItem('userInfo')) || {};
          let userInfo = res.data;
          let str = userInfo.current_vip;
          let index = str.indexOf('P');
          let vip = str.substr(index + 1, str.length); //04
          userInfo.vip = vip;
          
          // 如果已有的 userInfo 中有 balance，保留它
          if (existingUserInfo.balance !== undefined && existingUserInfo.balance !== null) {
            userInfo.balance = existingUserInfo.balance;
          }
          
          localStorage.setItem('userInfo', JSON.stringify(userInfo));
          that.userInfo = userInfo;
          that.$store.commit('changUserInfo');
          that.hideLoading();
        }
      }).catch(err => {
        console.log('getUserInfoShowLoding 接口调用失败:', err);
        that.hideLoading();
      });
    },
    // 获取代理
    getAgentLoginUrl() {
      let that = this;
      that.$parent.goNav(`/gamePage?dailiD=1`);
    },
    openKefu() {
      let that = this;
      that.goNav(`/kefu`);
    },
    showTost(type, title) {
      let str = type ? 'success' : 'danger';
      this.$notify({ type: str, message: title });
    },
    showLoading() {
      this.loading = true;
    },
    hideLoading() {
      this.loading = false;
    },
    // 处理登录成功后的重定向
    handleLoginSuccess() {
      if (this.redirectPath) {
        this.$router.push({ path: this.redirectPath });
        this.redirectPath = '';
      }
    },
  },
  mounted() {
    // 监听路由守卫触发的登录弹窗事件
    window.addEventListener('showLoginModal', (event) => {
      this.showLogin = true;
      // 保存重定向地址，登录成功后跳转
      this.redirectPath = event.detail.redirect;
    });
  },
  beforeDestroy() {
    let that = this;
    if (that.daoTime) {
      clearInterval(that.daoTime);
    }
    that.daoTime = null;
  },
};
</script>

<style>
/* @import '../static/css/registermember.css';
 @import '../static/css/registermember.css';
 @import '../static/css/registermember.css';
 @import '../static/css/registermember.css'; */

.meLoading {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
}
.van-dialog__confirm,
.van-dialog__confirm:active {
  color: #069b71;
}

.step .van-tab--active {
  color: #fff;
  background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjM2IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDB2MzZoMjQwLjgzN0wyNTAgMThsLTkuMTYzLTE4eiIgZmlsbD0iIzA2OUI3MSIgZmlsbC1ydWxlPSJldmVub2RkIi8+PC9zdmc+) no-repeat 100% / cover;
}

.step .van-tabs--line .van-tabs__wrap {
  height: 27px;
}
.metransRecord .van-tabs__nav--card .van-tab.van-tab--active {
  color: #fff;
  background-color: #069b71;
  border-radius: 22px;
}
.metransRecord .van-tabs__nav--card {
  border: none;
}
.metransRecord .van-tabs__nav--card .van-tab {
  border: none;
}
.metransRecord .van-tabs__nav--card .van-tab {
  color: #000;
}

/* 页眉 */

.pageTop {
  background-color: #ede9e7;
  text-align: center;
  font-size: 19px;
  /* font-weight: 700; */
  height: 40px;
  line-height: 40px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 200;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-clip: border-box;
  background-attachment: unset;
  background-image: url(/static/css/top_area_bg-w1ddLS2U.png);
  background-position: bottom;
  height: 1.20773rem;
  color: #fdfdfd;
}

.acts .van-tabs__line {
  background-color: #cf886b !important;
}
.acts .van-tab--active {
color: #005ce0;
    border-color: #005ce0;
}

.van-nav-bar .van-icon {
  color: #000;
}
.van-nav-bar {
  background-color: #ede9e7;
}
.van-nav-bar__arrow {
  font-size: 24px;
}
.van-nav-bar__title {
  font-weight: 700;
}

.bancgs {
  position: fixed;
  top: 10px;
  left: 10px;
  width: 30px;
  opacity: 0.8;
  z-index: 200;
}
p {
  margin-block-start: 5px !important;
  margin-block-end: 5px !important;
}
.inputsw {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  z-index: 999;
  cursor: pointer;
}
.van-tab--active {
  color: #108ee9;
  background-color: #108ee9;
}
.van-tabs__line {
  display: none;
}
.van-cell {
  padding: 5px 8px;
}
.sdg .van-field__label {
  width: 0.2rem;
}
[class*='van-hairline']:after {
  border: none;
}
.sdgg .van-popup {
  border-radius: 15px 15px 0 0;
}

.stddss .van-field__control {
  font-size: 0.5rem;
}

.van-button--info {
  color: #fff;
  background-color: #cf866b;
  border: 1px solid #cf866b;
}

/* 登录弹窗样式 */
.login-modal-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.login-modal-content {
  position: relative;
  z-index: 10000;
  width: 90%;
  max-width: 400px;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
}


.van-tab {
  -webkit-box-flex: 1;
  -webkit-flex: 1 0 auto;
  flex: 1 0 auto;
  padding: 0 22px !important;
  background: #cfcccc2b !important;
  border-width: 0.02415rem;
  border-style: solid;
  border-radius: 0.19324rem;
  border-color: transparent;
  margin-right: 12px;
}
.van-tab__text {
  font-size: 15px;
}
</style>
