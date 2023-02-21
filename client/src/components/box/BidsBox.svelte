<div class="box">
    <slot></slot><!-- content should be injected here -->
</div>

<style>
    .box {
        width: 90%;
        height: 10%;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        padding: 1em;
        display: flex;
        margin: 0 0.5em 1em 0.5em;
        background-color: white;
    }
</style>