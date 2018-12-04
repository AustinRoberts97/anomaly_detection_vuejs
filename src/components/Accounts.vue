<template>
    <div class="content">
        <heading/>
        <transactionList/>
    </div>
</template>
<script>

// Main account page for the member portal
import TransactionList from '@/components/TransactionList'
import Heading from '@/components/Heading'
export default {
  name: 'Accounts',
  components: {
    TransactionList, Heading
  },
  data: {
    account: null,
    
  }
  
}
</script>
<style>
div.content {
  max-width: 65em;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
</style>