<template>
    <header>
        <div class="header">
            <img class="logo" src="../assets/msufcu_logo_white-01.svg" width="120" height="90">
            <div class="headTable">
                <p class="images"><img v-if="alerts.length == 0" src="../assets/messages.png" @click="showAlerts()"><img v-if="alerts.length > 0" src="../assets/messagesAlert.png" @click="showAlerts()"><img src="../assets/manage.png"><router-link class="button" to="/">Sign Out</router-link></p>
                <p class="captions"><span class="alertCaption">Alerts</span><span class="manageCaption">Manage</span></p>
            </div>
            <h3>Transaction and Anomaly Monitoring</h3>
        </div>
        <Transaction v-show="showAlertDialog" @close="showAlertDialog = false" class="dialog">
            <h3 slot="header">Alerts</h3>
            <div slot="body" class="alerts">
                <table class="alertTable">
                    <thead class="top">
                        <tr>
                            <th style="width: 80em;">Message</th>
                            <th style="width: 20em;">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(alert, index) in alerts" v-bind:key="index" class="alert">
                            <td>{{alert.message}}</td>
                            <td>{{alert.date}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div slot="footer">
                <button
                    v-if="alerts.length > 0"
                    type="button"
                    class="btn-green"
                    @click="clearAlerts()"
                    aria-label="Clear alerts"
                >
                Clear alerts
                </button>
                <button
                    type="button"
                    class="btn-green"
                    @click="closeAlertDialog()"
                    aria-label="Close modal"
                >
                Close
                </button>
            </div>
        </Transaction>
    </header>
</template>

<script>
import {APIService} from '../http/APIService';
import Transaction from '@/components/Transaction'
const apiService = new APIService();
export default {
    name: 'Heading',
    components: {
        Transaction
    },
    mounted() {
        console.log("header mounted");
    },
    data() {
        return {
            alerts: [],
            showAlertDialog: false,
        }
        
    },
    methods: {
        showAlerts() {
            this.showAlertDialog = true;
            console.log("show alerts");
            console.log(this.showAlertDialog);
        },
        getAlerts() {
            var profile = JSON.parse(this.$store.state.profile);
            apiService.getAlerts(profile.account).then((page) => {
                console.log(page);
                this.alerts = page;
            });
        },
        clearAlerts() {
            var profile = JSON.parse(this.$store.state.profile);
            apiService.clearAlerts(profile.account).then((page) => {
                console.log(page);
                this.closeAlertDialog();
                
            });
        },
        closeAlertDialog() {
            this.showAlertDialog = false;
            this.$forceUpdate();
        }
    
    },
    mounted() {
        this.getAlerts();
    } 
    
}
</script>

<style>
div.header {
    background-color: #004F39;
    text-align: left;
    color: #ffffff;
}
img.logo {
    margin-left: 2em;
    float: left;
}
div.header h3 {
    color: #ffffff;
    padding-left: 2em;
    margin-bottom: 0;
    margin-top: 0;
}
a.alerts {
    background-image: url('../assets/messages.png');
    height: 160px;
    
}
div.headTable {
    text-align: right;
    margin-right: 3em;
    padding-top: 1em;
}
div.headTable img {
    margin-left: 1em;
    margin-right: 1em;
}
p.captions {
    margin-top: 0;
    margin-bottom: 0;
}
p.images {
    margin-bottom: 0;
}
p.images img {
    margin-right: 2em;
}
a.button {
    color: #ffffff;
    border: solid 0.1em #ffffff;
    text-decoration: none;
    display: inline-block;
    vertical-align: top;
    margin-top: 0.2em;
    padding: 0.5em 0.5em 0.5em 0.5em;
}
span.alertCaption {
    margin-right: 2.4em;
}
span.manageCaption {
    margin-right: 6.5em;
}
.dialog {
    overflow-y: auto
}
div.alerts {
    max-width: 40em;
    overflow-y: auto;
    max-height: 40em;
}
table.alertTable {
    border: #ffffff;
    border-collapse: separate;
    border-spacing: 0 0.5em;
}
table.alertTable td {
    padding-top: 0.7em;
    padding-bottom: 0.7em;
    background-color: #efefef;
    margin-top: 2em;
    margin-bottom: 0.5em;
}
table.alertTable th {
    padding-top: 0.7em;
    padding-bottom: 0.7em;
    background-color: #ffffff;
}


</style>