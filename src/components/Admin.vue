<template>
    <div class="content">
        <heading/>
        <div class="transactions">
            <h1>Administration</h1>
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
                            <td>{{ parseFloat(transaction.post_amount).toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>


        <Transaction v-show="showModal" @close="showModal = false" v-if="this.selectedTransaction != null" class="dialog"> 
            <h3 slot="header">Transaction</h3>
            <div slot="body" v-if="!similarView">
                <p>Date: {{this.selectedTransaction.local_tran_date}}</p>
                <p>Acceptor: {{this.selectedTransaction.card_acceptor_name}}</p>
                <p>Location: {{this.selectedTransaction.card_acceptor_street}}, {{this.selectedTransaction.card_acceptor_city}}, {{this.selectedTransaction.card_acceptor_state}}</p>
                <p>Amount: ${{parseFloat(this.selectedTransaction.post_amount).toFixed(2)}}</p>
            </div>
            <div slot="body" v-if="similarView" class="simView">
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
                        <tr v-for="(transaction, index) in similarTransactions" 
                        v-bind:key="index" class="transaction">
                            <td class="date">{{ transaction.local_tran_date }}</td>
                            <td>{{ transaction.card_acceptor_name }}</td>
                            <td>{{ transaction.card_acceptor_state}}</td>
                            <td>{{ parseFloat(transaction.post_amount).toFixed(2)}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer" v-if="!similarView">
                <button
                    type="button"
                    class="lbtn-green"
                    @click="viewSimilar"
                    aria-label="View similar"
                >
                View similar transactions
                </button>
                <button
                    type="button"
                    class="btn-green"
                    @click="flagFraud"
                    aria-label="Flag fraud"
                >
                Flag as fraud
                </button>
                <button
                    type="button"
                    class="btn-green"
                    @click="flagNormal"
                    aria-label="Flag normal"
                >
                Flag as normal
                </button>
                <button
                    type="button"
                    class="btn-green"
                    @click="close"
                    aria-label="Close modal"
                >
                Close
                </button>
            </div>
            <div slot="footer" v-if="similarView">
                <button
                    type="lbutton"
                    class="lbtn-green"
                    @click="backSimilar"
                    aria-label="Back"
                >
                Back
                </button>
                <button
                    type="button"
                    class="btn-green"
                    @click="flagFraud"
                    aria-label="Flag fraud"
                >
                Flag as fraud
                </button>
                <button
                    type="button"
                    class="btn-green"
                    @click="flagNormal"
                    aria-label="Flag normal"
                >
                Flag as normal
                </button>
                <button
                    type="button"
                    class="btn-green"
                    @click="close"
                    aria-label="Close modal"
                >
                Close
                </button>
            </div>
        </Transaction>
        
    </div>
</template>
<script>
// Admin portal page

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
            selectedTransaction: null,
            similarView: false,
            similarTransactions: []
        }
    },
    methods: {
        // Uses the admin API call and stores the transactions in memory to display them
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
        // Selects a specific transaction when clicked and opens the dialog box
        selectTransaction(transaction) {
            console.log("click");
            this.selectedTransaction = transaction;
            this.showModal = true;
        },
        // Close the dialog box
        close() {
            this.showModal = false;
            this.similarView = false;
            this.similarTransactions = []
        },
        // Uses the setTransactionFraudFlag API call to change a transactions flag to 3 for fraud
        flagFraud() {
            console.log('flag fraud');
            console.log(this.selectedTransaction.id);
            apiService.setTransactionFraudFlag(this.selectedTransaction.id, 3).then((page) => {
                apiService.getAdminTransactions().then((page) => {
                    this.transactions = [];
                    for (var i = 0; i < page.length; i++) {
                        var transaction = page[i];
                        this.transactions.push(transaction);
                    }
                    console.log(this.transactions);

                    this.loading = false;
                    });
            })
        },
        // Sets transaction fraud flag to 0 for normal
        flagNormal() {
            console.log('flag normal');
            console.log(this.selectedTransaction.id);
            apiService.setTransactionFraudFlag(this.selectedTransaction.id, 0).then((page) => {
                apiService.getAdminTransactions().then((page) => {
                    this.transactions = [];
                    for (var i = 0; i < page.length; i++) {
                        var transaction = page[i];
                        this.transactions.push(transaction);
                    }
                    console.log(this.transactions);
                    this.showModal = false;

                    this.loading = false;
                    });
            })
        },
        // Uses similar transactions api call to get transactions with the same retailer.
        viewSimilar() {
            console.log('view similar');
            apiService.getSimilarTransactions(this.selectedTransaction.id).then((page) => {
                console.log(page);
                this.similarTransactions = [];
                for (var i = 0; i < page.length; i++) {
                        var transaction = page[i];
                        this.similarTransactions.push(transaction);
                    }
                this.similarView = true;
            })
        },
        backSimilar() {
            this.similarView = false;
            this.similarTransactions = [];
        }
    },
    mounted() {
        // Return to login if a profile isn't loaded
        if (!this.$store.state.profile) {
            this.$router.push('/');
        }
        var profile = JSON.parse(this.$store.state.profile);
        console.log(profile);
        // Make sure the user is an admin, return to login if not
        if (!profile.admin) {
            this.$router.push('/');
        } else {
            this.getAdminTransactions();
            
        }
        
    }
}
</script>
<style>
.dialog {
    overflow-y: auto
}
div.content {
  max-width: 65em;
  text-align: center;
  margin-left: auto;
  margin-right: auto;
}
table.tranTable {
    border: #ffffff;
    border-collapse: separate;
    border-spacing: 0 0.5em;
}
table.tranTable td {
    padding-top: 0.7em;
    padding-bottom: 0.7em;
    background-color: #efefef;
    margin-top: 2em;
    margin-bottom: 0.5em;
}
table.tranTable th {
    padding-top: 0.7em;
    padding-bottom: 0.7em;
    background-color: #ffffff;
}
div.simView {
    overflow-y: auto;
    max-height: 40em;
}

</style>