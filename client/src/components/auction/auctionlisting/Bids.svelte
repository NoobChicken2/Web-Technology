<script>
    import userStore from '../../../stores/userStore.js';
    import loginStore from '../../../stores/loginStore.js';
    import auctionStore from '../../../stores/auctionStore.js';
    import modalStateStore from '../../../stores/ModalStateStore.js';
    import bidsStore from '../../../stores/bidsStore.js';

    import {findData, findDataArray} from '../../../utilities/utilities.js';
    import doCall from '../../../utilities/fetchBackend.js';

    import Box from '../../box/BidsBox.svelte';
    import ModifyBidAmountModal from '../../modals/ModifyBidAmountModal.svelte';

    export let id;

    let bids, isEmpty, startingBid, minValue;

    async function getBids() {
        bids = await doCall(`http://localhost:3000/bids/${id}`);

        startingBid = findData($auctionStore, 'id', Number(id), 'startingBid');

        for (let i = 0; i < bids.length; i++) {
            for (let j = 0; j < $userStore.length; j++) {
                if ($userStore[j].id === bids[i].userId) {
                    bids[i].username = $userStore[j].username;
                }
            }
        }

        if (bids.length === 0) {
            isEmpty = true;
        }
    }

    $: if ($bidsStore) {
        getBids();
        isEmpty = false;
    }

    function modify(bidAmount) {
        $modalStateStore.modifyBidModal = true;
        minValue = bidAmount;
    }

    async function deleteBid() {
        let bidId = findData($loginStore.bids, 'userId', $loginStore.userId, 'id');

        await doCall(`http://localhost:3000/bids/${id}/${bidId}`, 'DELETE');
        $bidsStore = await doCall('http://localhost:3000/bids');
        $loginStore.bids = findDataArray($bidsStore, 'userId', $loginStore.userId);
    }
</script>

<div>
    {#if isEmpty}
        <p class="empty"> There are currently no bids placed for this item</p>
    {:else if bids === undefined}
        <p>Loading bids...</p>
    {:else}
        {#each bids as item}
            <Box>
                <section class="details">
                    <p class="details">Username: {item.username}</p>
                    <p class="details">Amount: {item.amount}</p>
                </section>
                {#if $loginStore.role === 'admin' || ($loginStore.isLoggedIn && $loginStore.payload.username === item.username)}
                    <section class="modify">
                        <button on:click={() => {modify(item.amount)}}>Modify</button>
                    </section>
                    <section class="delete">
                        <button class="delete" on:click={deleteBid}>Delete</button>
                    </section>
                {/if}
            </Box>
        {/each}
    {/if}
</div>
{#if $modalStateStore.modifyBidModal}
    <ModifyBidAmountModal on:click={() => $modalStateStore.modifyBidModal = false} minValue={minValue} startingBid={startingBid} auctionId={id} />
{/if}

<style>
    div {
        width: 30%;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        padding: 1em;
        margin-left: auto;
        margin-right: 1em;
        max-height: 500px;
        overflow-x: hidden;
        overflow-y: auto;
    }

    p.details {
        margin: 0;
    }

    .empty {
        text-align: center;
        font-weight: bold;
        margin-top: 2em;
    }

    section.details {
        width: 50%;
    }

    section.modify, section.delete {
        width: 25%;
        text-align: center;
    }

    button {
        padding: 10px 10px;
        margin: 10px 0;
        justify-content: space-between;
        background-color: #D9CDBF;
        text-align: center;
        color: #401E12;
        border: 1px solid black;
        cursor: pointer;
        transition: .3s;
        position: relative;
        top: -15%;
    }

    button:hover {
        background-color: #005F8C;
        color: white;
    }

    button.delete {
        background-color: red;
        color: white;
    }

    button.delete:hover {
        background-color: #D9CDBF;
        color: #401E12;
    }
</style>