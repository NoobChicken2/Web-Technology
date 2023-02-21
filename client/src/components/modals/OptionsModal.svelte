<script>
    import router from 'page';

    import auctionStore from '../../stores/auctionStore.js';
    import tokenStore from '../../stores/tokenStore.js';
    import loginStore from '../../stores/loginStore.js';
    import modalStateStore from '../../stores/ModalStateStore.js';
    import bidsStore from '../../stores/bidsStore.js';
    import userStore from '../../stores/userStore.js';

    import {fly, fade} from 'svelte/transition';
    import doCall from '../../utilities/fetchBackend.js';

    let isAdmin, usernameToggle = false, passwordToggle = false, passwordData = {}, usernameData = {};
    $: isAdmin = $loginStore.role === 'admin';
    let errors = {
        username: false,
        oldPassword: false,
        newPassword: false,
        repeatPassword: false
    }

    async function onSubmitUsername(event) {
        const formData = new FormData(event.target);

        for (let item of formData) {
            const [key, value] = item;
            usernameData[key] = value;
        }

        if (usernameData.username && usernameData.username.includes(' ')) {
            errors.username = true;
        } else {
            errors.username = false;
            const body = {
                username: usernameData.username
            }

            await doCall(`http://localhost:3000/users/${$loginStore.userId}`, 'PATCH', body);
            $userStore = await doCall('http://localhost:3000/users');
            logout();

            router('/authentication/login');
        }
    }

    async function onSubmitPassword(event) {
        const formData = new FormData(event.target);

        for (let item of formData) {
            const [key, value] = item;
            passwordData[key] = value;
        }

        const tokenBody = {
            username: $loginStore.payload.username,
            password: passwordData.oldPassword
        }

        try {
            await doCall('http://localhost:3000/token', 'POST', tokenBody);

            errors.oldPassword = false;

            if (passwordData.newPassword >= 8) {
                if (passwordData.newPassword.includes(' ')) {
                    errors.newPassword = true;
                } else if (passwordData.newPassword !== passwordData.repeatPassword) {
                    errors.repeatPassword = true;
                    errors.newPassword = true;
                } else {
                    errors.oldPassword = false;
                    errors.newPassword = false;
                    errors.repeatPassword = false;

                    const body = {
                        password: passwordData.newPassword
                    }

                    await doCall(`http://localhost:3000/users/${$loginStore.userId}`, 'PATCH', body);
                    $userStore = await doCall('http://localhost:3000/users');
                    logout();

                    router('/authentication/login');
                }
            } else {
                errors.newPassword = true;
                errors.repeatPassword = true;
            }
        } catch (e) {
            errors.oldPassword = true;
        }
    }

    function toggleUsername () {
        usernameToggle = !usernameToggle;
    }

    function togglePassword () {
        passwordToggle = !passwordToggle;
    }

    function logout() {
        $tokenStore.token = '';
        $loginStore.isLoggedIn = false;
        $loginStore.role = '';
        $loginStore.payload = {};
        $loginStore.bids = [];
        $loginStore.auctions = [];
        $loginStore.userId = '';
    }

    async function deleteAccount() {
        await doCall(`http://localhost:3000/users/${$loginStore.userId}`, 'DELETE');

        logout();

        $userStore = await doCall('http://localhost:3000/users')
        $auctionStore = await doCall('http://localhost:3000/auctions');
        $bidsStore = await doCall('http://localhost:3000/bids')
        $modalStateStore.optionsModal = false;
    }
</script>

<div id="myModal" class="modal" transition:fade>
    <div class="modal-content" in:fly={{y : -500}} out:fly={{y : -500}}>
        <span class="close" on:click>&times;</span>
        <p id="header">Account Options</p>
        {#if !usernameToggle && !passwordToggle}
            <section class="options">
                <button on:click={toggleUsername}>Change Username</button><br>
                <button class:admin={isAdmin} on:click={togglePassword}>Change Password</button><br>
                {#if $loginStore.role !== 'admin'}
                    <button id="delete" on:click={deleteAccount}>Delete Account</button><br>
                {/if}
            </section>
        {:else if usernameToggle}
            <form on:submit|preventDefault={onSubmitUsername}>
                <section class="username">
                    <p>Change your username</p>
                    <input class:error={errors.username} type="text" name="username" value={$loginStore.payload.username}><br>
                    <button>Change</button>
                    <button on:click={toggleUsername}>Cancel</button>
                </section>
            </form>
        {:else if passwordToggle}
            <form on:submit|preventDefault={onSubmitPassword}>
                <section class="password">
                    <p>Change your password</p>
                    <section class="password-input">
                        <label for="oldPassword">Old Password</label>
                        <input class:error={errors.oldPassword} type="password" name="oldPassword" id="oldPassword"><br>
                        <label for="newPassword">New Password</label>
                        <input class:error={errors.newPassword} type="password" name="newPassword" id="newPassword"><br>
                        <label for="repeatPassword">Repeat Password</label>
                        <input class:error={errors.repeatPassword} type="password" name="repeatPassword" id="repeatPassword"><br>
                    </section>
                    <button>Change</button>
                    <button on:click={togglePassword}>Cancel</button>
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

    section.options {
        text-align: center;
        justify-content: center;
    }

    section.username,
    section.password {
        text-align: center;
    }

    input {
        text-align: center;
        width: 40%;
        padding: 5px 5px;
    }

    .options > button {
        width: 30%;
        position: relative;
        top: 30%;
        padding: 10px 10px;
        margin: 0;
        background-color: white;
        text-align: center;
        color: #401E12;
        border: none;
        border-top: 1px solid black;
        cursor: pointer;
        transition: .3s;
    }

    button:hover,
    .username > button:hover,
    .password > button:hover {
        background-color: #005F8C;
        color: white;
    }

    button#delete,
    button.admin {
        border-bottom: 1px solid;
        margin-bottom: 30px;
    }

    button#delete:hover {
        background-color: red;
        color: white;
    }

    .username > button,
    .password > button {
        padding: 10px 10px;
        margin: 30px 20px;
        align-items: center;
        background-color: #D9CDBF;
        text-align: left;
        color: #401E12;
        border: 1px solid black;
        cursor: pointer;
        transition: .3s;
    }

    section.password-input {
        width: 60%;
        margin: 0 auto;
        text-align: left;
    }

    .password-input > label {
        margin-top: 10px;
    }

    .password-input > input {
        margin-top: 10px;
        margin-left: 40px;
        width: auto;
        position: relative;
    }

    input#oldPassword {
        left: 45px;
    }

    input#newPassword {
        left: 39px;
    }

    input#repeatPassword {
        left: 22px;
    }

    .error {
        border-color: red;
        background-color: #FF7A7A;
    }
</style>