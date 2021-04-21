import Vue from 'vue'
import Vuex from 'vuex'
import admin from './modules/admin'
Vue.use(Vuex)

const store = new Vuex.Store({

  states: {
    // 存储token
    Authorization: localStorage.getItem('Authorization') ? localStorage.getItem('Authorization') : '',
    breadcrumb: [],
    paramsMessage: {}
  },

  mutations: {
    // 修改token，并将token存入localStorage
    changeLogin (state, user) {
      state.Authorization = user.Authorization
      localStorage.setItem('Authorization', user.Authorization)
    },
    setBreadCrumb (state, breadlist) {
      state.breadcrumb = breadlist
      localStorage.setItem('breadcrumb', JSON.stringify(breadlist))
    },
    setParamsMessage (state, params) {
      state.message = params
      localStorage.setItem('paramsMessage', JSON.stringify(params))
    }
  },
  modules: {
    admin
  }
})

export default store
