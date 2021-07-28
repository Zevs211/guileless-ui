<template>
  <div>
    <input
      class="mb-4 w-full h-8 px-0 outline-none border-b border-transparent transition-colors focus:border-black"
      type="text"
      placeholder="Search ..."
      v-model="search"
    />
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
