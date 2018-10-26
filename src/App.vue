<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import TransactionList from './components/TransactionList.vue'
import Heading from './components/Heading.vue'
import Accounts from './components/Accounts.vue'
import Login from './components/Login.vue'
import Transaction from './components/Transaction.vue'


export default {
  name: 'App',
  components: {
    Accounts, TransactionList, Heading, Login, Transaction
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: black;
  align-content: center;
  background-color: #d6d6d6;
}
</style>
