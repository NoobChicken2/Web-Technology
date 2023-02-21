<script>
    import userStore from '../../stores/userStore.js';
    import loginStore from '../../stores/loginStore.js';
    import bidsStore from '../../stores/bidsStore.js';
    import modalStateStore from '../../stores/ModalStateStore.js';

    import {fly, fade} from 'svelte/transition';
    import doCall from '../../utilities/fetchBackend.js';
    import {findData, findDataArray} from '../../utilities/utilities.js';

    export let minValue, auctionId, startingBid;

    let sliderValue = minValue, maxValue = startingBid * 10;

    async function onSubmit (event) {
        let userId = findData($userStore, 'username', $loginStore.payload.username, 'id')
        let body = {
            amount: sliderValue
        }
        let bidId = findData($loginStore.bids, 'userId', userId, 'id');

        await doCall(`http://localhost:3000/bids/${auctionId}/${bidId}`, 'PATCH', body);
        $bidsStore = await doCall('http://localhost:3000/bids');
        $loginStore.bids = findDataArray($bidsStore, 'userId', $loginStore.userId);
        $modalStateStore.modifyBidModal = false;
    }

</script>

<div id="myModal" class="modal" transition:fade>
    <div class="modal-content" in:fly={{y : -500}} out:fly={{y : -500}}>
        <span class="close" on:click>&times;</span>
        <p id="header">Modify your bid</p>
        {#if minValue === undefined}
            <p>Loading...</p>
        {:else}
            <form on:submit|preventDefault={onSubmit}>
                <p id="sliderValue">Current value: {sliderValue}</p>
                <section>
                    <label for="slider">{minValue}</label>
                    <input type="range" min={minValue} max={maxValue} bind:value={sliderValue} class="slider" id="slider">
                    <label for="slider">{maxValue}</label><br>
                    <button>Change Bid</button>
                </section>
            </form>
        {/if}
    </div>
</div>

<style>
    .modal {
        display: block;
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
        background-color: #fefefe;
        margin: 10% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 40%;
        text-align: center;
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }

    p#header {
        font-weight: bold;
        font-size: 20px;
    }

    p#sliderValue {
        margin-bottom: 5px;
    }

    input[type=range] {
        position: relative;
        top: 3px;
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
    }

    button:hover {
        background-color: #005F8C;
        color: white;
    }
</style>