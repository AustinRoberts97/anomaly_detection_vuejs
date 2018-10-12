<template>
    <div class="content">
        <h1>Login</h1>
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