<script>
    import router from 'page';

    import loginStore from '../../../stores/loginStore.js';
    import modalStateStore from '../../../stores/ModalStateStore.js';
    import bidsStore from '../../../stores/bidsStore.js';

    import doCall from '../../../utilities/fetchBackend.js';
    import {findData} from '../../../utilities/utilities.js';

    import CreateBidModal from '../../modals/CreateBidModal.svelte';
    import ModifyBidModal from '../../modals/ModifyAuctionModal.svelte';
    import ModifyBidAmountModal from '../../modals/ModifyBidAmountModal.svelte';

    export let name, owner, startingBid, itemType, id;

    let highestBid, modalMinBid, bids, currentUserBid;

    $: if ($loginStore.isLoggedIn && bids !== undefined && $loginStore) {
        currentUserBid = findData($loginStore.bids, 'auctionId', Number(id));
    }

    $: if (highestBid) {
        modalMinBid = Number(highestBid) + 1;
    } else {
        modalMinBid = startingBid + 1;
    }

    function placingBidCheck() {
        if ($loginStore.isLoggedIn) {
            $modalStateStore.createBidModal = true;
        } else {
            router('/authentication');
        }
    }

    async function updateBids() {
        bids = await doCall(`http://localhost:3000/bids/${id}`);

        if (bids.length !== 0) {
            highestBid = bids[0].amount;

            bids.forEach(item => {
                if (highestBid < item.amount) {
                    highestBid = item.amount;
                }
            });
        } else {
            highestBid = startingBid;
        }
    }

    $: console.log(highestBid, modalMinBid);

    $: if($bidsStore) {
        updateBids();
    }
</script>

<div class="details">
    <p class="name">{name}</p>
    <p>Owner: {owner}</p>
    <p>Category: {itemType}</p>
    <p>Starting Bid: {startingBid}</p>
    {#if highestBid !== startingBid}
        <p>Highest bid: {highestBid}</p>
    {:else}
        <p>There currently are no bids placed for this item</p>
    {/if}
    <div class="bid-button">
        {#if $loginStore.payload.username === owner || $loginStore.role === 'admin'}
            <button on:click={() => $modalStateStore.modifyAuctionModal = true}>Modify Auction</button>
        {/if}
        {#if currentUserBid}
            <p id="placedBid">You have already placed a bid</p>
        {:else}
            <button on:click={placingBidCheck}>Place Bid</button>
        {/if}
    </div>
</div>
{#if $modalStateStore.createBidModal}
    <CreateBidModal on:click={() => $modalStateStore.createBidModal = false} minValue={modalMinBid} auctionId={id} startingBid={startingBid}/>
{:else if $modalStateStore.modifyAuctionModal}
    <ModifyBidModal on:click={() => $modalStateStore.modifyAuctionModal = false} name={name} itemType={itemType} auctionId={id}/>
{:else if $modalStateStore.modifyBidModal}
    <ModifyBidAmountModal on:click={() => $modalStateStore.modifyBidModal = false} minValue={modalMinBid} auctionId={id} startingBid={startingBid}/>
{/if}


<style>
    div.details {
        width: 25%;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        padding: 1em;
        margin-left: auto;
        margin-right: auto;
    }

    .name {
        text-align: center;
        font-weight: bold;
    }

    button {
        width: 100%;
        padding: 20px 10px;
        margin: 10px 0;
        justify-content: space-between;
        background-color: #D9CDBF;
        text-align: center;
        color: #401E12;
        border: 1px solid black;
        cursor: pointer;
        transition: .3s;
    }

    button:hover {
        background-color: #005F8C;
        color: white;
    }

    p#placedBid {
        margin-top: 50px;
        font-weight: bold;
        text-align: center;
    }
</style>