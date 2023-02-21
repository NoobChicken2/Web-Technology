<script>
    import auctionStore from '../stores/auctionStore.js';
    import userStore from '../stores/userStore.js';

    import {findData} from '../utilities/utilities.js';

    import Images from '../components/auction/auctionlisting/Images.svelte';
    import AuctionDetails from '../components/auction/auctionlisting/AuctionDetails.svelte';
    import Bids from '../components/auction/auctionlisting/Bids.svelte';

    export let params;

    let currentAuction, backUpAuction, username, name, startingBid, user, itemType, image, id;

    currentAuction = findData($auctionStore, 'id', Number(params));
    username = findData($userStore, 'id', currentAuction.userId, 'username');

    function updateDetails() {
        backUpAuction = currentAuction;
        currentAuction = findData($auctionStore, 'id', Number(params));
    }

    $: if ($auctionStore) {
        updateDetails();
    }

    $: if (currentAuction === undefined) {
        currentAuction = backUpAuction;
    }
</script>

<main>
    <Images image={currentAuction.image} />
    <AuctionDetails name={currentAuction.name} owner={username} startingBid={currentAuction.startingBid} itemType={currentAuction.itemType} id={params} />
    <Bids id={params}/>
</main>


<style>
    main {
        display: flex;
    }
</style>
