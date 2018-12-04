import axios from 'axios';
import { authHeader } from '../_helpers/'
//const API_URL = 'http://localhost:8000';
const API_URL = 'http://django-env.zqqwi3vey2.us-east-1.elasticbeanstalk.com';

// API calls for interfacing with the anomaly_detection Django web project.
// All API calls return database models in JSON format.
export class APIService{
    constructor(){

    }
    // Gets the transactions of a specific account in a JSON response
    getTransactions(account) {
        const url = `${API_URL}/api/transactions/?account=${account}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // Get a specific transaction by id 
    getTransaction(pk) {
        const url = `${API_URL}/api/transactions/${pk}/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // Gets all users in the system through the API
    getUsers() {
        const url = `${API_URL}/api/users/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // Gets a specific user by id
    getUser(pk) {
        const url = `${API_URL}/api/users/${pk}/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // API call for getting all of the transactions an admin needs to see
    getAdminTransactions() {
        const url = `${API_URL}/api/admin_transactions/`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // API call for changing the fraud flag on a specific transaction
    setTransactionFraudFlag(id, new_flag) {
        const url = `${API_URL}/api/transactions/${id}/`;
        const args = {
            "fraud_flag": new_flag
        }
        return axios.patch(url, args).then(response => response.data);
    }
    // API call for returning a list of transaction with the same retailer as the provide transaction id
    getSimilarTransactions(id) {
        const url = `${API_URL}/api/similar_transactions/?id=${id}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // Returns all alerts associated with a specified user account 
    getAlerts(account) {
        const url = `${API_URL}/api/alerts/?account=${account}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // Clears all alerts for a specified user account
    clearAlerts(account) {
        const url = `${API_URL}/api/clear_alerts/?account=${account}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }
    // Gets the retailers of a specified user account
    getRetailers(account) {
        const url = `${API_URL}/api/retailers/?account=${account}`;
        return axios.get(url, {headers: {}}).then(response => response.data);
    }

    /* The other methods go here */
}