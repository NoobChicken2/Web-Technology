import { writable } from "svelte/store";

export default writable ({
    addAuctionModal: false,
    createBidModal: false,
    modifyAuctionModal: false,
    modifyBidModal: false,
    optionsModal: false
});