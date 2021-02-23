import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import topMenu from './layout/top-menu';
import 'animate.css';
import constants from "./utils/constants";

Vue.use(ElementUI);
Vue.prototype.blog_constants = constants;
Vue.config.productionTip = false;
Vue.component('topMenu', topMenu);
const axios = require('axios')
import http from './api/userApi';
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next();


  }else {
    http.checkToken()
        .then(result => {
          let res = result.data;

          if (res.code === http.success_code()) {
            if (res.data.data.roles === 'role_admin') {

                store.commit('changeLoginUser',res.data.data)
                console.log(store.state.loginUser)
              next();
            } else {
                http.doLogout();
                ElementUI.Message({
                    type: 'error',
                    message: '这是管理员登录界面!!!'
                })
            }
          } else {
            next({
              path: '/login'
            })
          }
        });
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
