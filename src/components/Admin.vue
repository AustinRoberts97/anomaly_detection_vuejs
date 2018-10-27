<template>
    <div class="content">
        <heading/>
        <h3>Administration</h3>
        <div class="transactions">
            <div class="table">
                <table class="tranTable">
                    <thead class="top">
                        <tr>
                            <th style="width: 10em;" class="date">Date</th>
                            <th style="width: 20em;">Acceptor</th>
                            <th style="width: 70px;">State</th>
                            <th style="width: 8em;">Post Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(transaction, index) in transactions"  @click="selectTransaction(transaction)" 
                        v-bind:key="index" class="transaction">
                            <td class="date">{{ transaction.local_tran_date }}</td>
                            <td>{{ transaction.card_acceptor_name }}</td>
                            <td>{{ transaction.card_acceptor_state}}</td>
                            <td>{{ transaction.post_amount}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <Transaction v-show="showModal" @close="showModal = false" v-if="this.selectedTransaction != null">
            <h3 slot="header">Transaction</h3>
            <div slot="body">
                <p>Date: {{this.selectedTransaction.local_tran_date}}</p>
                <p>Acceptor: {{this.selectedTransaction.card_acceptor_name}}</p>
                <p>Location: {{this.selectedTransaction.card_acceptor_street}}, {{this.selectedTransaction.card_acceptor_city}}, {{this.selectedTransaction.card_acceptor_state}}</p>
                <p>Amount: ${{this.selectedTransaction.post_amount}}</p>
                <p>Fraudulent: {{this.selectedTransaction.fraud_flag}}</p>
            </div>
        </Transaction>
        
    </div>
</template>
<script>
import Heading from '@/components/Heading'
import Transaction from '@/components/Transaction'
import { APIService } from '../http/APIService';
const apiService = new APIService();
export default {
    name: 'Admin',
    components: {
        Heading, Transaction
    },
    data() {
        return {
            transactions: [],
            loading: false,
            showModal: false,
            selectedTransaction: null
        }
    },
    methods: {
        getAdminTransactions() {
            this.loading = true;
            console.log("getting admin transactions")
            apiService.getAdminTransactions().then((page) => {
                for (var i = 0; i < page.length; i++) {
                    var transaction = page[i];
                    this.transactions.push(transaction);
                }
                console.log(this.transactions);

                this.loading = false;
            });
        },
        selectTransaction(transaction) {
            console.log("click");
            this.selectedTransaction = transaction;
            this.showModal = true;
        },
    },
    mounted() {
        if (!this.$store.state.profile) {
            this.$router.push('/');
        }
        var profile = JSON.parse(this.$store.state.profile);
        console.log(profile);
        if (!profile.admin) {
            this.$router.push('/');
        } else {
            this.getAdminTransactions();
        }
        
    }
}
</script>