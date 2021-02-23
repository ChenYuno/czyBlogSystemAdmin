import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    loginUser:{
      avatar: '',
      createTime: '',
      email: '',
      id: '',
      loginIp: '',
      password: '',
      regIp: '',
      roles: '',
      sign: '',
      state: '',
      updateTime: '',
      userName: ''
    }
  },
  mutations: {
    changeLoginUser(state,user) {
      state.loginUser = user;
    }
  },
  actions: {
  },
  modules: {
  }
})
