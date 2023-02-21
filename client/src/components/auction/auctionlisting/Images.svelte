<script>
    export let image;
</script>

<div>
    <img src={image} alt="Item Image"><br>
</div>

<style>
    div {
        text-align: center;
        width: 30%;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        padding: 1em;
        margin-right: auto;
        height: 500px;
    }

    img {
        max-width: 80%;
    }
</style>