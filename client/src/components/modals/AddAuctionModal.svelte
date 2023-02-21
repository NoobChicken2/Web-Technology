<script>
    import userStore from '../../stores/userStore.js';
    import loginStore from '../../stores/loginStore.js';
    import auctionStore from '../../stores/auctionStore.js';
    import modalStateStore from '../../stores/ModalStateStore.js';

    import {fly, fade} from 'svelte/transition';
    import {findData} from '../../utilities/utilities.js';
    import doCall from '../../utilities/fetchBackend.js';

    let newEntryData = {};
    let errors = {
        image: false,
        name: false,
        startingBid: false,
        itemType: false
    };

    async function onSubmit(event) {
        const formData = new FormData(event.target);

        for (let item of formData) {
            const [key, value] = item;
            newEntryData[key] = value;
        }

        errors.startingBid = isNaN(newEntryData.startingBid) || newEntryData.startingBid === undefined || newEntryData.startingBid === '';
        errors.image = newEntryData.image === undefined || newEntryData.image === '' || newEntryData.image.includes(' ');
        errors.name = newEntryData.name === undefined || newEntryData.name === '';
        errors.itemType = newEntryData.itemType === undefined || newEntryData.itemType === '';

        if (!errors.startingBid && !errors.image && !errors.name && !errors.itemType) {
            const body = {
                name: newEntryData.name,
                startingBid: newEntryData.startingBid,
                userId: findData($userStore, 'username', $loginStore.payload.username, 'id'),
                itemType: newEntryData.itemType,
                image: newEntryData.image
            }

            await doCall('http://localhost:3000/auctions', 'POST', body);
            $auctionStore = await doCall('http://localhost:3000/auctions');
            $modalStateStore.addAuctionModal = false;
        }
    }
</script>

<div id="myModal" class="modal" transition:fade>
    <div class="modal-content" in:fly={{y : -500}} out:fly={{y : -500}}>
        <span class="close" on:click>&times;</span>
        <p>Add a new auction listing</p>
        <form on:submit|preventDefault={onSubmit}>
            <section class="auction-details">
                <div class="label">
                    <label for="image">Image URL</label>
                    <input type="text" class:error={errors.image} class="text-input" id="image" name="image"><br>
                </div>
                <div class="label">
                    <label for="name">Item name</label>
                    <input type="text" class:error={errors.name} class="text-input" id="name" name="name"><br>
                </div>
                <div class="label">
                    <label for="bid">Starting Bid</label>
                    <input type="text" class:error={errors.startingBid} class="text-input" id="bid" name="startingBid"><br>
                </div>
                <div class="label">
                    <label for="type">Category</label>
                    <input type="text" class:error={errors.itemType} class="text-input" id="type" name="itemType"><br>
                </div>
            </section>
            <section class="submit">
                <button>Create</button>
                <input type="reset" value="Clear">
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
        overflow: hidden;
        background-color: rgb(0,0,0);
        background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
        background-color: #fefefe;
        margin: 5% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
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

    form {
        display: flex;
        flex-wrap: wrap;
        margin-top: 30px;
    }

    section.auction-details {
        text-align: left;
        width: 75%;
    }

    div.label {
        margin-bottom: 20px;
    }

    input[type=text] {
        position: relative;
        width: 250px;
        padding: 10px 5px;
        text-align: center;
        left: 70px;
    }

    input#bid {
        left: 65px;
    }

    input#type {
        left: 82px;
    }

    input#image {
        width: 500px;
        text-align: left;
    }

    input.error {
        border-color: red;
        background-color: #FF7A7A;
    }

    label {
        margin-left: 50px;
    }

    button, input[type=reset] {
        position: relative;
        top: 40%;
        margin: auto 0;
        width: 100px;
        padding: 10px 0;
        cursor: pointer;
    }
</style>