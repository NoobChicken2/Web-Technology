<script>
    import auctionStore from '../../stores/auctionStore.js';
    import userStore from '../../stores/userStore.js';
    import loginStore from '../../stores/loginStore.js';
    import modalStateStore from "../../stores/ModalStateStore";

    import doCall from '../../utilities/fetchBackend.js';
    import {findData} from '../../utilities/utilities.js';

    import Modal from '../modals/AddAuctionModal.svelte';


    let searchData = {}, queryNotFound = false, isEmpty = false;

    $: if ($auctionStore === undefined || $auctionStore.length === 0) {
        isEmpty = true;
    }

    function search (event) {
        const formData = new FormData(event.target);

        for (let item of formData) {
            const [key, value] = item;
            searchData[key] = value;
        }
    }

    async function getAuctionData (name) {
        if (!name) {
            $auctionStore = await doCall('http://localhost:3000/auctions');
            queryNotFound = false;
            console.log('Fetch done');
        } else {
            try {
                $auctionStore = await doCall(`http://localhost:3000/auctions?name=${name}`);
                queryNotFound = false;
                console.log('Query Fetch done');
            } catch (e) {
                queryNotFound = true;
            }
        }
    }


    $: if (searchData.itemName !== undefined && searchData.itemName !== '') {
        getAuctionData(searchData.itemName);
    } else if (searchData.itemName === '') {
        getAuctionData();
    }

    async function deleteAuction(id) {
        await doCall(`http://localhost:3000/auctions/${id}`, 'DELETE');

        //Refresh the auctionStore
        $auctionStore = await doCall('http://localhost:3000/auctions');
    }

    async function deleteAll() {
        await doCall(`http://localhost:3000/auctions`, 'DELETE');

        //Refresh the auctionStore
        $auctionStore = await doCall('http://localhost:3000/auctions');
    }
</script>

{#if $loginStore.role === 'admin'}
    <span id="deleteAll" on:click={deleteAll}>X</span>
{/if}
<form on:submit|preventDefault={search}>
    <input id="Search" type="text" name="itemName" placeholder="Search.."><br>
</form>
{#if isEmpty}
    <section>
        <p>There are currently no auctions available</p>
        {#if !$loginStore.isLoggedIn}
            <p>You must log in before you can create a new listing</p>
        {/if}
    </section>
{/if}
<div class="listings">
    {#if queryNotFound}
        <p id="query">Item could not be found!</p>
    {:else if $auctionStore === undefined}
        <p>... waiting</p>
    {:else}
        {#each $auctionStore as item}
            <div class="items">
                <a href='/auction/{item.id}'><img src={item.image} alt="Listing image" /></a>
                <p>Name: {item.name}</p>
                <p>Username: {findData($userStore, 'id', item.userId, 'username')}</p>
                <p>Starting bid: {item.startingBid}</p>
                <p>Category: {item.itemType}</p>
                {#if $loginStore.payload.username === findData($userStore, 'id', item.userId, 'username') || $loginStore.role === 'admin'}
                    <span class="delete" on:click={() => deleteAuction(item.id)}>X</span>
                {/if}
            </div>
        {/each}
    {/if}
    {#if $loginStore.isLoggedIn && $auctionStore !== undefined && !queryNotFound}
        <div class="items" id="add">
            <button><span class="add" on:click={() => $modalStateStore.addAuctionModal = true}>+</span></button>
        </div>
    {/if}
</div>
{#if $modalStateStore.addAuctionModal}
    <Modal on:click={() => $modalStateStore.addAuctionModal = false} />
{/if}

<style>
    .items {
        height: 300px;
        width: 200px;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        padding: 1em;
        margin: 1em 2em;
        justify-content: center;
        text-align: left;
        position: relative;
    }

    div.items#add {
        border: none;
        box-shadow: none;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .listings {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    img {
        height: 150px;
        width: 100%;
    }

    p {
        font-size: 14px;
        font-weight: bold;
        margin-top: 15px;
        margin-bottom: 5px;
    }

    input {
        background-image: url('https://media.istockphoto.com/vectors/search-magnifying-glass-icon-symbol-vector-illustration-vector-id1136192849?k=20&m=1136192849&s=612x612&w=0&h=SiBu1uPksRbRS5yZBhv6X5vi5-x_OF8UcLtPl24v5_o=');
        background-position: 2px 2px;
        background-repeat: no-repeat;
        background-size: 30px 30px;
        margin: 1em 2em;
        padding: 0.5em 2em;
        width: 90%;
        position: relative;
        right: 8px;
        font-size: 18px;
    }

    span.delete {
        position: absolute;
        cursor: pointer;
        bottom: 20px;
        right: 25px;
        font-size: 20px;
        font-weight: bold;
        color: red;
    }

    span.add {
        font-size: 200px;
        padding: 0;
        margin: 0;
        line-height: 135px;
        height: 35px;
    }

    span#deleteAll {
        position: absolute;
        cursor: pointer;
        bottom: 480px;
        right: 50px;
        font-size: 30px;
        font-weight: bold;
        color: red;
    }

    button {
        width: 130px;
        height: 130px;
        padding: 0;
        background: transparent;
        border: none;
        cursor: pointer;
    }
</style>