<template>
    <div class="content">
        <h1>Login</h1>
        <p><input v-model='username' placeholder="Username"></p>
        <p><input v-model='password' placeholder="Password"></p>
        <p>{{message}}</p>
        <p><input type="button" value="Login" @click="submit"></p>
        <router-link to="/transactions">Go to transactions</router-link>
    </div>
</template>
<script>
import Accounts from '@/components/Accounts'
import Router from 'vue-router'
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
      this.$store.dispatch('obtainToken', args).then(() => {
        console.log('try');
        
      });
    }
  }
}

</script>
<style>
div.content {
  max-width: 60em;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
</style>