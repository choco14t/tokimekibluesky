<script lang="ts">
  import {accountsDb} from "$lib/db";

  let message = $state('');

  async function deleteAccounts() {
      try {
          const pid = await accountsDb.delete();
          localStorage.removeItem('columns');
          localStorage.removeItem('accounts');

          message = 'Accounts and Profiles Delete was successful.'
      } catch (e) {
          message = e;
          console.log(e);
      }
  }

  async function deleteSettings() {
      localStorage.removeItem('settings');
      message = 'Settings Delete was successful.'
  }

  async function deleteAll() {
      await deleteAccounts();
      localStorage.clear();
      sessionStorage.clear();

      message = 'All Delete was successful.'
  }
</script>

<div class="app recovery-page">
  <h1>This is TOKIMEKI recovery page</h1>
  <p>リカバリー用ページ</p>

  <p>
    <button class="button" onclick={deleteAccounts}>Delete All Account and Profile</button>
    <button class="button" onclick={deleteSettings}>Delete All Settings</button>
    <button class="button" onclick={deleteAll}>Delete All</button>
  </p>

  <p>{message}</p>
</div>

<style lang="postcss">
  .recovery-page {

  }
</style>