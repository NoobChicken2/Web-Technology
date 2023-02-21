<script>
  import router from 'page';

  import Home from './pages/Home.svelte';
  import Authentication from './pages/Authentication.svelte';
  import Auction from './pages/Auction.svelte';
  import Login from './pages/Login.svelte';
  import Register from './pages/Register.svelte';

  import Header from './components/home/Header.svelte';

  let page;
  let params;
  let currentRoute;

  router('/', (ctx) => {
    page = Home;
    currentRoute = ctx.pathname;
  });

  router('/authentication', (ctx) => {
    page = Authentication;
    currentRoute = ctx.pathname;
  });

  router('/auction/:id', (ctx) => {
      page = Auction;
      currentRoute = ctx.pathname;
      params = ctx.params.id;
  });

  router('/authentication/login', (ctx) => {
      page = Login;
      currentRoute = ctx.pathname;
  });

  router('/authentication/register', (ctx) => {
      page = Register;
      currentRoute = ctx.pathname;
  });

  router.start();
</script>

<main>
    {#if page !== Authentication && page !== Login}
        <Header />
    {/if}
    <svelte:component this={page} {params}/>
</main>

<style>
  :root {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: bisque;
  }

  main {
    padding: 1em;
    margin: 0 auto;
  }
</style>
