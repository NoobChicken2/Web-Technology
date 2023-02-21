import router from 'page';

import doCall from './fetchBackend.js';

import tokenStore from '../stores/tokenStore.js';
import auctionStore from "../stores/auctionStore.js";
import userStore from "../stores/userStore.js";

function isFormDetailValid (value) {
    if (value === undefined || value === '') {
        return false;
    } else if (value.indexOf(' ') > -1) {
        return false;
    }

    return true;
}

export function isFormValid (data) {
    if (!isFormDetailValid(data.username)) {
        return false;
    }

    if (!isFormDetailValid(data.password) || data.password.length < 8) {
        return false;
    }

    return true;
}

export async function tokenCall (data) {
    const login = await doCall('http://localhost:3000/token', 'POST', data);
    tokenStore.update((oldValue) => login);

    //Before rerouting I reset the auctionStore and the userStore
    const auctionData = await doCall('http://localhost:3000/auctions');
    auctionStore.update((oldValue) => auctionData);

    const userData = await doCall('http://localhost:3000/users');
    userStore.update((oldValue) => userData);

    router('/');
}
