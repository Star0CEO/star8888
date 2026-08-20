// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import apiFun from "@/http/api.js";
// 引入 我们准备好的 store
import store from '@/store/index.js'
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css'
// Vue.use(ElementUI);
import  "amfe-flexible";
import Vant from 'vant';
import 'vant/lib/index.css';
Vue.use(Vant);

// 引入多语言支持
import VueI18n from 'vue-i18n';
Vue.use(VueI18n);

// 导入语言文件
const messages = {
    en: require('../lang/en.json'),
    pt: require('../lang/pt.json'),
    th: require('../lang/th.json'),
    vi: require('../lang/vi.json')
};

// 创建i18n实例
const i18n = new VueI18n({
    locale: 'en', // 默认语言
    fallbackLocale: 'en',
    messages
});



// 全局注册
Vue.prototype.$apiFun = apiFun;//请求接口api

Vue.config.productionTip = false

router.afterEach((to, from, next) => {
  
  window.scrollTo(0, 0);//每到一个新的页面 就自动回顶
  if(document.querySelector(".index-page")){
    document.querySelector(".index-page").scrollTo(0, 0) ;//

  }
});
router.beforeEach((to, from, next) => {
  let token = sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '';
  if (to.matched.some(res => res.meta.requireAuth)) { // 验证是否需要登陆
    if (sessionStorage.getItem('token')) { // 查询本地存储信息是否已经登陆
      next();
    } else {
      // 不跳转到login页面，而是通过App组件的事件来弹出登录弹窗
      // 这里需要在App组件中处理
      next(false); // 阻止路由跳转
      // 触发全局事件，通知App组件弹出登录弹窗
      window.dispatchEvent(new CustomEvent('showLoginModal', { detail: { redirect: to.fullPath } }));
    }
  } else {
    next();
  }


});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,//使用store
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
