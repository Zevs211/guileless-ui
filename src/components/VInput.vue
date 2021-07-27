<template>
  <div>
    <input type="text" v-model="search" />
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: '',
    }
  },
  computed: {
    search: {
      get() {
        return this.inputValue
      },
      set(value) {
        this.inputValue = value
        this.$emit('inputSearch', this.inputValue)
      },
    },
  },
}
</script>

<style></style>
