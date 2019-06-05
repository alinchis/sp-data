<template>
  <section class="view-body">
    <section class="hero is-primary is-bold is-fullheight">
      <div class="hero-head">
      </div>
      <div closs="hero-body">
        <div class="container has-text-centered">
          <h1 class="title is-1">Spatial Planning Data</h1>
          <h2 class="subtitle">Public data. Cleaned. Enhanced.</h2>
        </div>
        <div class="has-text-centered button-box">
          <a @click="gotoQuery" class="button is-link is-medium">Enter</a>
        </div>
      </div>
      <div class="hero-foot has-text-centered">
        <p>2019 <strong>Spatial Planning Data</strong> developed by planners for planners.</p>
      </div>
    </section>
  </section>
</template>

<script>
export default {
  computed: {
    currentProjects () {
      return this.$store.state.counties
    }
  },
  methods: {
    gotoQuery () {
      this.$router.push({ name: 'query'})
    }
  }
}
</script>

<style lang="scss">
.button-box {
  padding: 1em 0 0 0;
}

.view-body {
  height: 100%;
}

</style>
