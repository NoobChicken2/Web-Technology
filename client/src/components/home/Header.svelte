<script>
    import tokenStore from '../../stores/tokenStore.js';
    import loginStore from '../../stores/loginStore.js';
    import modalStateStore from '../../stores/ModalStateStore.js';

    import {isLoggedIn} from '../../utilities/utilities.js';

    import OptionsModal from '../../components/modals/OptionsModal.svelte';

    function logout() {
        $tokenStore.token = '';
        $loginStore.isLoggedIn = false;
        $loginStore.role = '';
        $loginStore.payload = {};
        $loginStore.bids = [];
        $loginStore.auctions = [];
        $loginStore.userId = '';
    }
</script>

<header>
    <h1>Amazin</h1>
    <div>
        {#if !isLoggedIn($tokenStore.token)}
            <a href='/authentication'> <button>Login / Register</button> </a>
        {:else}
            <p>Logged in as</p>
            <p>{$loginStore.payload.username}</p>
            {#if $loginStore.role === 'admin'}
                <p><strong>(ADMIN)</strong></p>
            {/if}
            <button on:click={() => $modalStateStore.optionsModal = true}>Options</button>
            <button class="logout" on:click={logout}>Logout</button>
        {/if}
    </div>
</header>
{#if $modalStateStore.optionsModal}
    <OptionsModal on:click={() => $modalStateStore.optionsModal = false}/>
{/if}

<style>
    h1 {
        position: relative;
        left: 4%;
        margin-left: auto;
    }

    div {
        margin-left: auto;
        text-align: center;
        padding: 0;
        width: 100px;
    }

    p {
        margin-top: 0;
        margin-bottom: 0;
    }

    a {
        text-decoration: none;
    }

    header {
        align-items: center;
        display: flex;
        margin-bottom: 2em;
    }

    button {
        width: 100%;
        padding: 0 10px;
        margin: 0 auto;
        align-items: center;
        text-align: center;
        background-color: #D9CDBF;
        color: black;
        border: 1px solid black;
        cursor: pointer;
        transition: .3s;
    }

    button:hover {
        background-color: #005F8C;
        color: white;
    }

    button.logout {
        background-color: red;
        color: white;
    }

    button.logout:hover {
        background-color: #D9CDBF;
        color: #401E12;
    }
</style>