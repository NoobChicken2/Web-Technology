<script>
    import { tokenCall } from '../utilities/formUtils.js';

    let loginData = {};
    let error = false;

    async function onSubmit (event) {
        const formData = new FormData(event.target);

        for (let item of formData) {
            const [key, value] = item;
            loginData[key] = value;
        }

        try {
            await tokenCall(loginData);
        } catch (e) {
            error = true;
        }
    }
</script>

<form on:submit|preventDefault={onSubmit}>
    <h1>Login</h1>
    <input type="text" class:error={error} class="username" name="username" placeholder="Username">
    <input type="password" class:error={error} class="password" name="password" placeholder="Password">
    <br><button class="submit">Sign in</button><br>
</form>

<style>
    form {
        text-align: center;
        position: relative;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        height: 500px;
        width: 400px;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        display: inline-block;
        padding: 0;
    }

    h1 {
        margin-top: 50px;
        margin-bottom: 50px;
    }

    input {
        text-align: center;
        width: 60%;
        height: 30px;
        margin-bottom: 15px;
    }

    input.error {
        border-color: red;
        background-color: #FF7A7A;
    }

    input:-webkit-autofill.error,
    input:-webkit-autofill:hover.error,
    input:-webkit-autofill:focus.error,
    input:-webkit-autofill:active.error  {
        -webkit-box-shadow: 0 0 0 40px #FF7A7A inset !important;
    }

    .submit {
        margin-top: 30px;
        width: 30%;
        padding-top: 10px;
        padding-bottom: 10px;
    }
</style>