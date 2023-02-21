<script>
    import auctionStore from '../../stores/auctionStore.js';
    import userStore from '../../stores/userStore.js';

    import {findAllCategories, findData} from '../../utilities/utilities.js';
    import doCall from '../../utilities/fetchBackend.js';

    export let filterName;

    let allAuctionData, categoriesData, categories = [], searchData = {}, queryNotFound, isOpen = false, checkedValue;

    // Username Searchbar
    function search (event) {
        const formData = new FormData(event.target);

        for (let item of formData) {
            const [key, value] = item;
            searchData[key] = value;
        }
    }

    let userId;
    $: userId = findData($userStore, 'username', searchData.username, 'id');

    $: if (searchData.username !== undefined && searchData.username !== '') {
        getAuctionData(userId, 'userId');
    } else if (searchData.username === '') {
        getAuctionData();
    }

    //Checkbox filters
    let checkBoxFilters = {};
    let count = 0;

    allAuctionData = $auctionStore;
    categoriesData = findAllCategories(allAuctionData);

    for (const key in categoriesData) {
        checkBoxFilters[key] = false;
        categories[count] = key + " " + "(" + categoriesData[key] + ")";
        count++;
    }

    function getCheckedValue () {
        for (const key in checkBoxFilters) {
            if (checkBoxFilters[key] === true && checkedValue !== key) {
                return key;
            }
        }
    }

    function clearCheckedValues(value) {
        for (const key in checkBoxFilters) {
            if (key !== value) {
                checkBoxFilters[key] = false;
            }
        }
    }

    function isChecked() {
        for (const key in checkBoxFilters) {
            if (checkBoxFilters[key] === true) {
                return true;
            }
        }
        return false;
    }

    $: if (checkBoxFilters) {
            checkedValue = getCheckedValue();
            clearCheckedValues(checkedValue);
            if (checkedValue !== undefined) {
                getAuctionData(checkedValue, 'itemType');
            }
            if (!isChecked()) {
                getAuctionData();
            }
    }

    // Set the new auction data value function
    async function getAuctionData (value, query) {
        if (!value) {
            $auctionStore = await doCall('http://localhost:3000/auctions');
            if (query === 'userId') queryNotFound = false;
            console.log('Fetch done');
        } else {
            try {
                $auctionStore = await doCall(`http://localhost:3000/auctions?${query}=${value}`);
                if (query === 'userId') queryNotFound = false;
                console.log('Query Fetch done');
            } catch (e) {
                if (query === 'userId') queryNotFound = true;
            }
        }
    }
</script>

<button class:active={isOpen} class="accordion" on:click={() => {isOpen = !isOpen}}>
    <p>{filterName}</p>
    {#if isOpen}
        <span class="icon">&minus;</span>
    {:else}
        <span class="icon">&plus;</span>
    {/if}
</button>
{#if filterName === 'Category'}
        <section class:openPanel={isOpen} id="categories" class="panel">
            {#each categories as category}
                <div>
                    <input type="checkbox" id={category} bind:checked={checkBoxFilters[category.split(' ')[0]]}>
                    <label for={category}>{category}</label>
                </div>
            {/each}
        </section>
{:else if filterName === 'Username'}
    <section class:openPanel={isOpen} id="username" class="panel">
        <form on:submit|preventDefault={search}>
            <input id="search" type="text" name="username" placeholder="Search..">
        </form>
    </section>
{/if}

<style>
    button.accordion {
        width: 100%;
        padding: 0 10px;
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #D9CDBF;
        text-align: left;
        color: #401E12;
        border: 1px solid black;
        cursor: pointer;
        transition: .3s;
    }

    button.accordion.active,
    .accordion:hover {
        background-color: #005F8C;
        color: white;
    }

    section.panel {
        height: 0;
        overflow: hidden;
        transition: all .5s;
    }

    section.openPanel {
        height: 300px;
        box-shadow: inset 0 0 5px black;
    }

    section.openPanel#username {
        height: 45px;
        box-shadow: inset 0 0 5px black;
    }

    input[type=text] {
        background-image: url('https://media.istockphoto.com/vectors/search-magnifying-glass-icon-symbol-vector-illustration-vector-id1136192849?k=20&m=1136192849&s=612x612&w=0&h=SiBu1uPksRbRS5yZBhv6X5vi5-x_OF8UcLtPl24v5_o=');
        background-position: 1px 3px;
        background-repeat: no-repeat;
        background-size: 15px 15px;
        margin: 0.5em 0;
        padding: 5px 1.2em;
        width: 70%;
    }

    div {
        align-items: start;
        text-align: left;
    }
</style>
