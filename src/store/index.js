import Vue from 'vue'
import Vuex from 'vuex'
import empRestAPI from "@/util/http-common.js";
import createPersistedState from "vuex-persistedstate";
import memberStore from "@/store/modules/memberStore";
Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    memberStore,
  },
  state: {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {}
  },
  getters: {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
  },
  mutations: {
    auth_request(state){
      state.status = 'loading'
    },
    auth_success(state, token, user){
      state.status = 'success'
      state.token = token
      state.user = user
    },
    auth_error(state){
      state.status = 'error'
    },
    logout(state){
      state.status = ''
      state.token = ''
    },
  },
  actions: {
    login({commit}, user){
      return new Promise((resolve, reject) => {
        commit('auth_request')
        empRestAPI.post('/api/users/login', user)
        .then(resp => {
          const token = resp.data.token
          const user = resp.data.user
          localStorage.setItem('token', token)
          empRestAPI.defaults.headers.common['Authorization'] = token  // axiosInstance에 header 설정
          commit('auth_success', { token, user})
          resolve(resp)
        })
        .catch(err => {
          commit('auth_error')
          localStorage.removeItem('token')
          reject(err)
        })
      })
    },
    logout({commit}){
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        delete empRestAPI.defaults.headers.common['Authorization']
        resolve()
      })
    }
  },
  plugins: [
    createPersistedState({
      // 브라우저 종료시 제거하기 위해 localStorage가 아닌 sessionStorage로 변경. (default: localStorage)
      storage: sessionStorage,
    }),
  ],
})
