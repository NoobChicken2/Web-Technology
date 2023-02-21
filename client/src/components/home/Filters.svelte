<script>
    import FilterOptions from './FilterOptions.svelte';

    let filters = ['Username', 'Category'];
</script>

<div class="box">
    <h1>Filter by</h1>
    {#each filters as filter}
        <FilterOptions filterName={filter} />
    {/each}
</div>

<style>
    .box {
        text-align: center;
        width: 10%;
        border: 1px solid #aaa;
        border-radius: 2px;
        box-shadow: 2px 2px 8px rgba(0,0,0,0.1);
        padding: 1em;
        margin: 0.2em 1em 1em 1em;
        float: left;
    }
</style>