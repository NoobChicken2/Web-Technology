<script>
    import router from 'page';

    import auctionStore from '../../stores/auctionStore.js';
    import modalStateStore from '../../stores/ModalStateStore.js';

    import {fly, fade} from 'svelte/transition';
    import doCall from '../../utilities/fetchBackend.js';

    export let name, itemType, auctionId;

    let modifyData = {};

    async function onSubmit (event) {
        const formData = new FormData(event.target);

        for (let item of formData) {
            const [key, value] = item;
            modifyData[key] = value;
        }

        if (!modifyData.image) {
            delete modifyData.image;
        }

        await doCall(`http://localhost:3000/auctions/${auctionId}`, 'PATCH', modifyData);
        $auctionStore = await doCall('http://localhost:3000/auctions/');
        $modalStateStore.modifyAuctionModal = false;
    }

    async function deleteAuction() {
        await doCall(`http://localhost:3000/auctions/${auctionId}`, 'DELETE');

        $modalStateStore.modifyAuctionModal = false;
        $auctionStore = await doCall('http://localhost:3000/auctions');

        router('/');
    }
</script>

<div id="myModal" class="modal" transition:fade>
    <div class="modal-content" in:fly={{y : -500}} out:fly={{y : -500}}>
        <span class="close" on:click>&times;</span>
        <p id="header">Modify your auction listing</p>
        <form on:submit|preventDefault={onSubmit}>
            <section class="label">
                <div class="label">
                    <label for="itemName">Item Name:</label>
                    <input type='text' name="name" value={name} id="itemName">
                </div>
                <div class="label">
                    <label for="itemType">Category:</label>
                    <input type='text' name="itemType" value={itemType} id="itemType">
                </div>
                <div class="label">
                    <label for="image">Image:</label>
                    <input type='text' name="image" id="image" placeholder="Image URL">
                </div>
            </section>
            <section class="submit">
                <button>Save Changes</button>
            </section>
            <section class="delete">
                <button type="button" id="delete" on:click={deleteAuction}>Delete</button>
            </section>
        </form>
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
        text-align: center;
        font-weight: bold;
        font-size: 20px;
    }

    form {
        display: flex;
    }

    section.label {
        width: 60%;
    }

    section.submit, section.delete {
        width: 20%;
        text-align: center;
    }

    div.label {
        margin: 15px 0;
    }

    input {
        text-align: center;
        display: inline-block;
        width: 40%;
        padding: 5px 5px;
    }

    label {
        display: inline-block;
        width: 50%;
        text-align: left;
    }

    button {
        position: relative;
        top: 30%;
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

    button#delete {
        background-color: red;
        color: white;
    }

    button#delete:hover {
        background-color: #D9CDBF;
        color: #401E12;
    }
</style>