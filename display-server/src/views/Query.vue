<template>
  <div class="page-container">
    <h1>Welcome to Query area!</h1>
  </div>

</template>

<script>
export default {
  data: () => ({
    search_field: '',
    selected: {},
    headers: [
      { text: 'SIRUTA', value: 'siruta', align: 'left', sortable: false },
      { text: 'UAT', value: 'name', align: 'left', sortable: false }
    ]
  }),

  props: {

  },

  computed: {

  },

  methods: {

  },

  mounted() {
    // hide space before search field
  }
}

</script>

<style lang="scss" scoped>

</style>
