// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import axios from 'axios'
import VueAxios from 'vue-axios'
import jwt_decode from 'jwt-decode'
import Vuex from 'vuex'
import { authHeader } from './_helpers/'

Vue.use(Vuex);
Vue.use(VueAxios, axios);

Vue.config.productionTip = false

// Define state and mutations in vuex store
const store = new Vuex.Store({
  state: {
    username: localStorage.getItem('username'),
    profile: localStorage.getItem('profile'),
    jwt_access: localStorage.getItem('access'),
    jwt_refresh: localStorage.getItem('refresh'),
    endpoints: {
      obtainJWT: 'http://127.0.0.1:8000/api/token/',
      refreshJWT: 'http://127.0.0.1:8000/api/token/refresh/',
      getUserProfile: 'http://127.0.0.1:8000/api/profiles/?username='
    }
  },
  mutations: {
    updateToken(state, newToken) {
      localStorage.setItem('access', newToken.access);
      localStorage.setItem('refresh', newToken.refresh);
      state.jwt_access = newToken.access;
      state.jwt_refresh = newToken.refresh;
      console.log("token updated " + newToken.access)
    },
    removeToken(state) {
      localStorage.removeItem('t');
      state.jwt_access = null;
      state.jwt_refresh = null;
    },
    updateUsername(state, username) {
      localStorage.setItem('username', username);
      state.username = username;
    },
    updateProfile(state, profile) {
      localStorage.setItem('profile', profile);
      state.profile = profile;
      console.log(profile);
    }
  },
  actions: {
    obtainToken(context, {username, password}) {
      const payload = {
        username: username,
        password: password
      }

      axios.post(this.state.endpoints.obtainJWT, payload).then((response) =>{
        console.log(response);
        this.commit('updateToken', {'access': response.data.access, 'refresh': response.data.refresh});
        console.log("header " + authHeader().Authorization)
        this.commit('updateUsername', username)
        this.dispatch('getProfile');
      }).catch((error)=>{
        console.log(error);
      })
    },
    refreshToken() {
      const payload = {
        'refresh': this.state.jwt_refresh
      }

      axios.post(this.state.endpoints.refreshJWT, payload).then((response)=>{
        this.commit('updateToken', {'access': response.data.access, 'refresh': response.data.refresh});
      }).catch((error)=>{
        console.log(error);
      });
    },
    inspectToken() {
      const token = this.state.jwt_access;
      if(token){
        const decoded = jwt_decode(token);
        const exp = decoded.exp;
        const orig_iat = decoded.orig_iat;

        if(exp - (Date.now()/1000) < 1800 && (Date.now()/1000) - orig_iat < 628200) {
          this.dispatch('refreshToken');
        } else if(exp - (Date.now()/1000) < 1800) {
          // Do nothing, do not refresh
        } else {
          // Prompt user to re-login, this covers condition where token is expired as well
        }
      }
    },
    getProfile() {
      const username = this.state.username;
      if (username){
        
        axios.get(this.state.endpoints.getUserProfile + username, {headers: authHeader()}).then((response)=>{
          this.commit('updateProfile', response.data.profile);
          console.log(response)
        }).catch((error)=>{
          console.log(error);
        });
      }
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  components: { App },
  template: '<App/>'
})
