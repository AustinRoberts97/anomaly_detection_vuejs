<template>
    <div class="content">
        <heading/>
        <transactionList/>
    </div>
</template>
<script>
import TransactionList from '@/components/TransactionList'
import Heading from '@/components/Heading'
export default {
  name: 'Accounts',
  components: {
    TransactionList, Heading
  },
  
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