<template>
    <div class="content">
      <form id="login" @submit="submit" v-on:submit.prevent>
        <h1>Login</h1>
        <p><label for="username" >Username</label> <input ref="username" id="username" type="text" v-model='username' placeholder="Username"/></p>
        <p><label for="password" >Password</label><input ref="password" id="password" type="password" v-model='password' placeholder="Password"/></p>
        <p>{{message}}</p>
        <p><input type="submit" value="Login" @click="submit"></p>
      </form>
    </div>
</template>
<script>
import Accounts from '@/components/Accounts'
import Router from 'vue-router'
import axios from 'axios'
import { authHeader } from '../_helpers/'
export default {
  name: 'Login',
  components: {
    Accounts
  },
  data() {
    return {
      username: "",
      password: "",
      message: "",
      submitEnabled: true
    }
  },
  methods: {
    submit() {
      const args = {
        'username': this.username,
        'password': this.password
      }
      // POST request to /api/token/ with username and password
      axios.post(this.$store.state.endpoints.obtainJWT, args).then((response) =>{
        console.log(response);
        // Store the token in the VueX state and local store through updateToken
        this.$store.commit('updateToken', {'access': response.data.access, 'refresh': response.data.refresh});
        // Save username for pulling profile
        this.$store.commit('updateUsername', username)
        // Pull user profile to get account number
         // GET http request with username argument to /api/profiles/
        axios.get(this.$store.state.endpoints.getUserProfile + this.username, {headers: authHeader()}).then((response)=>{
          // Saves profile JSON string object in state and local storage
          this.$store.commit('updateProfile', {account: response.data[0].account, id: response.data[0].id});
          // Move to transactions page
          this.$router.push('/transactions')
        }).catch((error)=>{
          console.log(error);
        });
      }).catch((error)=>{
        console.log("Login failed");
        this.clearFields();
        this.message = "Login failed";
        this.$refs.username.focus();
      });
    },
    clearFields() {
      this.username = "";
      this.password = "";
    }
  },
  mounted() {
    this.$store.commit('removeToken');
    this.$refs.username.focus();
  }
}

</script>
<style>
div.content {
  max-width: 60em;
  text-align: left;
  margin-left: auto;
  margin-right: auto;
}

</style>