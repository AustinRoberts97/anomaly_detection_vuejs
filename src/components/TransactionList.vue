/* es-lint disable */
<template>
    <div class="transactions">
        <div class="accounts">
            <h1>Account Summary</h1>
            <!--
            <div class="account">
                <h2>Totally Green Checking (Balance: $764.23)</h2>
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
                            
                            <tr v-for="transaction in transactions" @click="selectTransaction(transaction)" v-bind:key="transaction">
                                <td class="date">{{ transaction.local_tran_date }}</td>
                                <td>{{ transaction.card_acceptor_name }}</td>
                                <td>{{ transaction.card_acceptor_state}}</td>
                                <td>{{ transaction.post_amount}}</td>
                            </tr>
                        
                            <tr class="anomaly">
                                <td class="date">7/4/2018<img src="../assets/74841-200.png" width="17"></td>
                                <td>WAL Wal-Mart Store</td>
                                <td>KY</td>
                                <td>50.00</td>
                            </tr>
                            <tr class="anomaly">
                                <td class="date">7/4/2018<img src="../assets/74841-200.png" width="17"></td>
                                <td>WAL Wal-Mart Store</td>
                                <td>KY</td>
                                <td>46.00</td>
                            </tr>
                            <tr>
                                <td class="date">10/1/2018</td>
                                <td>US MEIJER #209</td>
                                <td>MI</td>
                                <td>191.04</td>
                            </tr>
                            <tr>
                                <td class="date">9/28/2018</td>
                                <td>US SPEEDWAY 02234 N C</td>
                                <td>MI</td>
                                <td>34.68</td>
                            </tr>
                            <tr class="anom_recurring">
                                <td class="date">9/27/2018<img src="../assets/question.png" width="13"></td>
                                <td>COMCAST</td>
                                <td>N/A</td>
                                <td>67.36</td>
                            </tr>
                            <tr>
                                <td class="date">9/27/2018</td>
                                <td>US MEIJER #209</td>
                                <td>MI</td>
                                <td>26.82</td>
                            </tr>
                            <tr>
                                <td class="date">9/27/2018</td>
                                <td>US SPEEDWAY 02234 N C</td>
                                <td>MI</td>
                                <td>6.67</td>
                            </tr>
                        </tbody>
                    </table>
                <h3>Show more</h3>
                </div>
            </div>
            -->
            <div v-for="(account, index) in transactionLists" v-bind:key="index" class="account">
                <h2>{{accountNames[index]}}</h2>
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
                            
                            <tr v-for="(transaction, index2) in account" v-if="index2 < listLengths[index]" @click="selectTransaction(transaction)" v-bind:key="index2" v-bind:class="{anomaly: transaction.fraud_flag == '1', fraud: transaction.fraud_flag == '3'}">
                                <td class="date">{{ transaction.local_tran_date }}</td>
                                <td>{{ transaction.card_acceptor_name }}</td>
                                <td>{{ transaction.card_acceptor_state}}</td>
                                <td>{{ transaction.post_amount}}</td>
                            </tr>
                            
                        </tbody>
                    </table>
                    <p v-if="account.length > 5"><button v-if="account.length > listLengths[index]" @click="showMore(index)" class="show">Show more</button>
                    <button class="show" v-if="listLengths[index] > 5" @click="showLess(index)">Show less</button></p>
                </div>
            </div>
        </div>
        <Transaction v-show="showModal" @close="showModal = false" v-if="this.selectedTransaction != null">
            <h3 slot="header">Transaction</h3>
            <div slot="body">
                <p>Date: {{this.selectedTransaction.local_tran_date}}</p>
                <p>Acceptor: {{this.selectedTransaction.card_acceptor_name}}</p>
                <p>Location: {{this.selectedTransaction.card_acceptor_street}}, {{this.selectedTransaction.card_acceptor_city}}, {{this.selectedTransaction.card_acceptor_state}}</p>
                <p>Amount: ${{this.selectedTransaction.post_amount}}</p>
            </div>
            <div slot="footer">
                <button
                    type="button"
                    class="btn-green"
                    @click="reportFraud"
                    aria-label="Report fraud"
                >
                Report Fraud
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
import Transaction from '@/components/Transaction'
import {APIService} from '../http/APIService';
const apiService = new APIService();

export default {
    name: 'TransactionList',
    components: {
        Transaction,
    },
    data() {
        return {
            listLengths: [],
            showModal: false,
            transactions: [],
            selectedTransaction: null,
            loading: false,
            user: null,
            transactionLists: [],
            accountNames: ["Debit Card (Balance: $843.29)", "Credit Card (Balance: $2,423)", "Debit Card (Balance: $1,146)"]
        };
    },
    methods: {
        selectTransaction(transaction) {
            console.log("click");
            this.selectedTransaction = transaction;
            this.showModal = true;
        },
        getUser() {
            this.loading = true;
            console.log("getting user");
            apiService.getUser(4).then((page) => {
                this.user = page;
                //console.log(page)
                //console.log(this.user)
                this.loading = false;
                this.getUserTransactions();
            });
        },
        getUserTransactions() {
            // Called after user is pulled
            // Will fill transaction list with transactions from user's list
            this.loading = true;
            console.log("Getting user's transactions")
            var profile = JSON.parse(this.$store.state.profile);
            console.log(profile);
            apiService.getTransactions(profile.account).then((page) => {
                
                // Transactions are sorted by processor account
                // For each processor account, create list and add corresponding transactions
                // Then add list to transactionLists 
                var card_number = "1";
                var tran_list = [];
                for (var i = 0; i < page.length; i++) {
                    var transaction = page[i];
                    if (i == 0) {
                        card_number = transaction.processor_account;
                    }
                    if (transaction.processor_account != card_number) {
                        card_number = transaction.processor_account;
                        console.log(tran_list)
                        this.transactionLists.push(tran_list);
                        
                        tran_list = [];
                    }
                    if (transaction.processor_account == card_number) {
                        tran_list.push(transaction);
                    }

                }
                console.log(tran_list)
                this.transactionLists.push(tran_list);

                // For each transaction list, set their default list length to 5
                var that = this;
                this.transactionLists.forEach(function(transactionList) {
                    that.listLengths.push(5);
                });
                console.log(this.listLengths);
                this.loading = false;
                
            })
        },
        showMore(index) {
            this.listLengths[index] += 5;
            console.log("show more on index " + index);
            this.$forceUpdate();
        },
        showLess(index) {
            this.listLengths[index] -= 5;
            this.$forceUpdate();
        },
        close() {
            this.showModal = false;
        },
        reportFraud() {
            console.log('report fraud');
            console.log(this.selectedTransaction.id);
            apiService.setTransactionFraudFlag(this.selectedTransaction.id, 2).then((page) => {
                this.getUserTransactions();
            });
        }
    },
    mounted() {
        if (!this.$store.state.profile) {
            this.$router.push('/');
        } else {
            this.getUserTransactions();
        }
        
    },
}

</script>

<style>
div.transactions {
    align-content: center;
    background-color: #ffffff;
    padding-left: 2em;
    min-height: 120em;
    
}
div.admin {
    max-width: 38em;
    min-width: 10em;
    float: right;
    margin-left: 1em;
    margin-right: 2.1em;
    
}
div.admin a {
    color: #003300;
}
div.panel {
    text-align: left;
    background-color: #cccccc;
    border: solid 0.2em #474747;
    margin-bottom: 2em;
    padding-left: 1em;
}
div.accounts {
    text-align: left;
    float: left;
    max-width: 38em;
    min-width: 20em;
    margin-right: 1em;

}
div.accounts h1 {
    margin-left: 1em;

}
div.account {
    background-color: #cccccc;
    border: solid 0.2em #474747;
    margin-bottom: 2em;
}
table.tranTable {
    border: #ffffff;
    border-collapse: separate;
    border-spacing: 0 0.5em;
}
h1 {
    margin-top: 0;
    padding-top: 1em;
}

div.accounts h2 {
    background-color: #cccccc;
    padding-top: 1em;
    padding-bottom: 1em;
    padding-left: 1em;
    margin-bottom: 0;
    margin-top: 0;

}
div.account button.show {
    margin-bottom: 0;
    margin-left: 1.4em;
    background: none;
    border: none;
    padding: 0;
    font-size: 1.1em;
}
div.account button.show:hover {
    color:#003300;
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
.date {
    padding-left: 1em;
}
tr.anomaly td img {
    padding-top: 0em;
    vertical-align: bottom;
    margin-left: 1.5em;
}
tr.fraud td {
    background-color: rgb(221, 139, 138)
}
tr.anomaly td {
    background-color:bisque;
}
tr.anom_recurring td img {
    padding-top: 0em;
    vertical-align: bottom;
    margin-left: 1.1em;
}
</style>