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

// JSON web tokens are no longer being used on this project.


// Define state and mutations in vuex store
// Everything in state and local storage stored as JSON strings
// Need to JSON.parse profile and token when accessing
const store = new Vuex.Store({
  state: {
    // User's username for pulling profile
    username: localStorage.getItem('username'),
    // User's profile with attributes 'account' and 'id'
    profile: localStorage.getItem('profile'),
    // User's JWT with attributes 'access' and 'refresh'
    token: localStorage.getItem('token'),
    // API endpoints for user authentication/pulling profile
    endpoints: {
      obtainJWT: 'http://django-env.zqqwi3vey2.us-east-1.elasticbeanstalk.com/api/token/',
      refreshJWT: 'http://django-env.zqqwi3vey2.us-east-1.elasticbeanstalk.com/api/token/refresh/',
      getUserProfile: 'http://django-env.zqqwi3vey2.us-east-1.elasticbeanstalk.com/api/profiles/?username='
    }
  },
  mutations: {
    // Save new token in local storage and VUEX state
    updateToken(state, newToken) {
      // Store token as JSON stringified object
      localStorage.setItem('token', JSON.stringify(newToken));
      // Save stringified in state
      state.token = JSON.stringify(newToken);
      console.log("token updated " + state.token.access);
    },
    // Remove token from local storage and state
    removeToken(state) {
      localStorage.removeItem('token');
      state.token = null;
      console.log("token removed");
    },
    // Save the username in local storage and state
    updateUsername(state, username) {
      localStorage.setItem('username', username);
      state.username = username;
    },
    // Save the user's profile in local storage and state
    // JSON string object
    // must use JSON parse to access
    updateProfile(state, profile) {
      localStorage.setItem('profile', JSON.stringify(profile));
      state.profile = JSON.stringify(profile);
    }
  },
  actions: {
    // Logging in user. Use username and password and get jwt from api
    obtainToken(context, {username, password}) {
      const payload = {
        username: username,
        password: password
      }
      // POST request to /api/token/ with username and password
      axios.post(this.state.endpoints.obtainJWT, payload).then((response) =>{
        console.log(response);
        // Store the token in the VueX state and local store through updateToken
        this.commit('updateToken', {'access': response.data.access, 'refresh': response.data.refresh});
        // Save username for pulling profile
        this.commit('updateUsername', username)
        // Pull user profile to get account number
        this.dispatch('getProfile');
      }).catch((error)=>{
        console.log(error);
      })
    },
    // Obtains new JWT when the access token has expired
    refreshToken() {
      var token = JSON.parse(this.state.token);
      const payload = {
        'refresh': token.refresh
      }
      // POST request to /api/token/refresh/ with refresh token
      axios.post(this.state.endpoints.refreshJWT, payload).then((response)=>{
        this.commit('updateToken', {'access': response.data.access, 'refresh': response.data.refresh});
      }).catch((error)=>{
        console.log(error);
      });
    },
    // Looks at access token and checks if it has expired
    // If expired, refresh token
    // Will force login if refresh token is expired
    inspectToken() {
      var jwt = JSON.parse(this.state.token);
      const token = jwt.access;
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
    // Gets user profile and saves it to state and local storage
    getProfile() {
      const username = this.state.username;
      if (username){
        // GET http request with username argument to /api/profiles/
        axios.get(this.state.endpoints.getUserProfile + username, {headers: authHeader()}).then((response)=>{
          // Saves profile JSON string object in state and local storage
          this.commit('updateProfile', {account: response.data[0].account, id: response.data[0].id});
          // Move to transactions page
          router.push('/transactions')
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
