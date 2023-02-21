import { writable } from "svelte/store";

export default writable ({
    isLoggedIn: false,
    role: '',
    payload: {},
    bids: [],
    auctions: [],
    userId: ''
});