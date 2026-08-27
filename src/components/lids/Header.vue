<template>
  <div data-v-8a75a126="" data-v-f531b812="" class="header" v-if="show">
    
    <div data-v-8a75a126="" class="header__top-wrapper" v-if="bankShow">
      <div data-v-8a75a126="" class="van-nav-bar van-nav-bar--fixed fixed-top rounded-corners nav-header" :class="{ 'has-bg': hasBg }">
        <div class="van-nav-bar__content">
          <div class="van-nav-bar__left" @click="$router.back()">
            <i class="van-icon van-icon-arrow-left van-nav-bar__arrow"></i>
          </div>
          <div class="van-nav-bar__title van-ellipsis">{{ title }}</div>
        </div>
      </div>
    </div>
    <div data-v-8a75a126="" class="header__top-wrapper" v-else>
      <div data-v-8a75a126="" class="van-nav-bar van-nav-bar--fixed rounded-corners nav-header">
        <div class="van-nav-bar__content">
          <div class="van-nav-bar__left" @click="$parent.goNav('/')">
            <div class="home-top-login"><img src="/static/image/uacPoGJlb02AMGnUAAAYLvRuglw960.png" alt="" class="logo" /></div>
          </div>
          <div class="van-nav-bar__title van-ellipsis"></div>
          <!-- 已登录 -->
          <div v-if="$store.state.token" class="van-nav-bar__right">
            <div class="header-style-home">
              <div class="header-style-login">
                <div class="home-money">
                  <div class="amount">{{ $store.state.userInfo.balance }}</div>

                  <svg @click="$parent.getUserInfoShowLoding()" style="width: 0.56rem; height: 0.56rem" aria-hidden="true" class="account-amount-refresh svg-icon svg-icon--mini-small svg-icon--refresh svg-icon--icon"><use xlink:href="#icon-refresh"></use></svg>
                </div>
                <div @click="transall" class="home-recharge startTheme-green" style="background: url('/static/image/uacPlmEAaMyAHbLrAAA6unmbQqs626.png'); min-width: 2rem; background-size: 100% 100% !important; height: 0.66rem; line-height: 0.66rem">一键回收</div>
              </div>
            </div>
          </div>
          <!-- 未登陆 -->
          <div v-else class="van-nav-bar__right">
            <div class="header-style-home">
              <div class="header-style-noLogin">
                <div class="home-login" @click="$parent.goNav('/login')" style="background: url('/static/image/uacPlmEAaMyAOg0kAAAgsrNqG9M230.png')">登录</div>
                <div class="home-register" @click="$parent.goNav('/login?type=1')" style="background: url('/static/image/uacPoGJhV7OAGmb4AAA6unmbQqs623.png')">注册</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Header',
  data() {
    return { bankShow: false,show:true,hasBg:false };
  },
  created() {
    let that = this;
    // that.uservip();
  },
  methods: {
    transall() {
      let that = this;
      that.$parent.showLoading();
      that.$apiFun
        .post('/api/transall', {})
        .then(res => {
          that.$parent.showTost(0, res.message);
          that.$parent.getUserInfoShowLoding();
          that.$parent.hideLoading();
        })
        .catch(res => {
          that.$parent.hideLoading();
        });
    },
    changPath() {
      let that = this;
      let path = this.$route.path;
      that.bankShow = false;
      that.title = '';
      that.show = true;
      that.hasBg = false;
      console.log(path);
      
      // 首页不显示页头
      if (path == '/') {
        that.bankShow = false;
        that.title = '';
        that.show = false;
        return;
      }
      
      // 需要显示页头的页面配置
      const pageTitles = {
        '/activityInfo': '活动详情',
        '/mine': '我的',
        '/userInfo': '个人信息',
        '/money': '资金明细',
        '/recharge': '充值',
        '/transfer': '转账',
        '/withdrawal': '提现',
        '/wallet': '钱包',
        '/addUsdtCard': '添加USDT',
        '/transRecord': '转账记录',
        '/betRecord': '投注记录',
        '/userCent': '会员中心',
        '/message': '消息',
        '/fanshui': '返水',
        '/activityRecord': '活动记录',
        '/welfare': '福利',
        '/app': 'APP下载',
        '/boutBallBet': '竞猜'
      };
      
      // 需要背景图片的页面列表
      const bgPages = [
        '/activityInfo', '/mine', '/userInfo', '/money', '/recharge',
        '/transfer', '/withdrawal', '/wallet', '/addUsdtCard',
        '/transRecord', '/betRecord', '/userCent', '/message', '/fanshui',
        '/activityRecord', '/welfare', '/app', '/boutBallBet'
      ];
      
      if (pageTitles[path]) {
        that.bankShow = true;
        that.title = pageTitles[path];
        that.show = true;
        // 明确检查是否在指定的背景图片页面列表中
        that.hasBg = bgPages.includes(path);
        console.log('页面:', path, '显示页头:', that.bankShow, '背景图片:', that.hasBg);
      } else {
        that.bankShow = false;
        that.title = '';
        that.show = false;
        that.hasBg = false;
      }
      
      // 处理特殊页面
      if (path == '/abouts') {
        that.bankShow = true;
        that.title = '';
        let type = this.$route.query.type;
        if (type == 5) {
          that.title = '条款与规则';
        }
        if (type == 6) {
          that.title = '隐私政策';
        }
      }
    },
  },
  updated() {
    let that = this;
  },
  mounted() {},
  watch: {
    //监听路由地址的改变
    $route: {
      immediate: true,
      handler() {
        let that = this;
        that.changPath();
      },
    },
  },
};
</script>
<style lang="scss" scoped>
// @import '../../../static/css/chunk-b7675268.a1b3941c.css';
.nav-header.has-bg {
  background-image: url(/static/css/top_area_bg-w1ddLS2U.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  
  .van-nav-bar__title {
    color: #fff;
  }
  
  .van-nav-bar__arrow {
    color: #fff;
  }
}
</style>
