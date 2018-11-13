import axios from 'axios';
import { authHeader } from '../_helpers/'
//const API_URL = 'http://localhost:8000';
const API_URL = 'http://django-env.zqqwi3vey2.us-east-1.elasticbeanstalk.com';

export class APIService{
    constructor(){

    }

    getTransactions(account) {
        const url = `${API_URL}/api/transactions/?account=${account}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    getTransaction(pk) {
        const url = `${API_URL}/api/transactions/${pk}/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    
    getUsers() {
        const url = `${API_URL}/api/users/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    getUser(pk) {
        const url = `${API_URL}/api/users/${pk}/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    getAdminTransactions() {
        const url = `${API_URL}/api/admin_transactions/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    setTransactionFraudFlag(id, new_flag) {
        const url = `${API_URL}/api/transactions/${id}/`;
        const args = {
            "fraud_flag": new_flag
        }
        return axios.patch(url, args).then(response => response.data);
    }

    getSimilarTransactions(id) {
        const url = `${API_URL}/api/similar_transactions/?id=${id}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    getAlerts(account) {
        const url = `${API_URL}/api/alerts/?account=${account}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    clearAlerts(account) {
        const url = `${API_URL}/api/clear_alerts/?account=${account}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    /* The other methods go here */
}