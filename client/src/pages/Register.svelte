<script>
    import doCall from "../utilities/fetchBackend.js";
    import { tokenCall, isFormValid } from '../utilities/formUtils.js';

    let registerData = {};
    let errors = {
        username: false,
        password: false
    };

    function onSubmit (event) {
        const formData = new FormData(event.target);
        let allRegisterData = {};

        for (let item of formData) {
            const [key, value] = item;
            if (key !== 'confirmpassword') {
                registerData[key] = value;
            }
            allRegisterData[key] = value;
        }

        if (allRegisterData.password === allRegisterData.confirmpassword) {
            if (isFormValid(registerData)) {
                errors.username = false;
                registerCall();
            } else {
                if (!registerData.username || registerData.username.indexOf(' ') > -1) {
                    errors.username = true;
                }
                if (!registerData.password || registerData.password.indexOf(' ') > -1) {
                    errors.password = true;
                }
            }
        } else {
            errors.password = true
            errors.username = false;
        }
    }

    async function registerCall() {
        try {
            await doCall('http://localhost:3000/users', 'POST', registerData);
            await tokenCall(registerData);
        } catch (e) {
            errors.username = true;
            errors.password = false;
            console.log('Fetch Error');
        }
    }


</script>

<form on:submit|preventDefault={onSubmit}>
    <h1>Registration</h1>
    <input type="text" class:error={errors.username} class="username" name="username" placeholder="Username"><br>
    <input type="password" class:error={errors.password} class="password" name="password" placeholder="Password"><br>
    <input type="password" class:error={errors.password} class="password" name="confirmpassword" placeholder="Confirm Password"><br>
    <button>Sign up</button>
</form>

<style>
    h1 {
        margin-top: 50px;
        margin-bottom: 50px;
    }

    input {
        text-align: center;
        width: 40%;
        height: 30px;
        margin-bottom: 15px;
    }

    input[type=text].error {
        border-color: red;
        background-color: #FF7A7A;
    }

    input[type=password].error {
        border-color: red;
        background-color: #FF7A7A;
    }

    button {
        margin-top: 30px;
        width: 20%;
        padding-top: 10px;
        padding-bottom: 10px;
    }
</style>