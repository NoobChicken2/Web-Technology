<script>
    import tokenStore from "../stores/tokenStore.js";
    import loginStore from '../stores/loginStore.js';
    import userStore from '../stores/userStore.js';
    import bidsStore from '../stores/bidsStore.js';
    import auctionStore from "../stores/auctionStore.js";

    import {findData, isLoggedIn, findDataArray} from '../utilities/utilities.js';
    import {onMount} from 'svelte';
    import doCall from '../utilities/fetchBackend.js';

    import AuctionListing from '../components/auction/Auction.svelte';
    import Filter from '../components/home/Filters.svelte';

    $: if (isLoggedIn($tokenStore.token)) {
        const payload = $tokenStore.token.split('.')[1];

        $loginStore.payload = JSON.parse(atob(payload));

        $loginStore.payload.roles.forEach(item => {
            if (item === 'admin') {
                $loginStore.role = 'admin';
            } else {
                $loginStore.role = 'user';
            }
        })

        $loginStore.userId = findData($userStore, 'username', $loginStore.payload.username, 'id');
        $loginStore.bids = findDataArray($bidsStore, 'userId', $loginStore.userId);
        $loginStore.auctions = findDataArray($auctionStore, 'userId', $loginStore.userId);
    }
</script>

<Filter />
<AuctionListing />
