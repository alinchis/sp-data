<template>
  <section class="view-body">
    <section class="hero is-warning is-bold is-fullheight">
      <div class="hero-head">
      </div>

      <div class="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-1">Spatial Planning Data</h1>
          <h2 class="subtitle">Public data. Cleaned. Enhanced.</h2>
          <div class="buttons is-centered">
            <b-button
              @click="gotoQuery"
              type="is-dark"
              outlined>Enter</b-button>
          </div>
        </div>
      </div>
      <div class="hero-foot has-text-centered">
        <p class="has-text-dark">2019 <strong class="has-text-dark">Spatial Planning Tools</strong> developed by planners for planners.</p>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  computed: {
    currentProjects() {
      return this.$store.state.counties;
    },
  },
  methods: {
    gotoQuery() {
      this.$router.push({ name: 'query' });
    },
  },
};
</script>

<style lang="sass">
.button-box

.view-body
  height: 100%

</style>
