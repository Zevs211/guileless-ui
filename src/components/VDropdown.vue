<template>
  <div class="relative">
    <div
      class="w-full cursor-pointer h-8 border-solid border-2 rounded-lg px-2 hover:bg-gray-200"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center justify-between">
        <span>{{ selectedValue }}</span>
        <span>▼</span>
      </div>
    </div>
    <div
      class="absolute w-full top-10 border-solid border-2 rounded-lg"
      v-if="isOpen"
    >
      <div v-for="(item, index) in options" :key="index">
        <div
          class="w-full h-8 cursor-pointer px-2 hover:bg-gray-200 "
          @click="select(index)"
        >
          {{ item[itemValue] }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VDropdown',
  props: {
    items: {
      type: Array,
      default: () => [],
    },
    itemValue: {
      type: String,
      default: 'value',
    },
  },
  data() {
    return {
      isOpen: false,
      selectedIndex: 0,
      savedOptions: [],
    }
  },
  computed: {
    options() {
      this.savedOptions = this.items
      if (typeof this.items[0] !== 'object') {
        this.savedOptions = this.items.map(item => ({
          [this.itemValue]: item,
        }))
      }
      return this.savedOptions
    },
    selectedValue() {
      if (this.savedOptions.length === 0) return '5'
      return this.savedOptions[this.selectedIndex][this.itemValue]
    },
  },
  methods: {
    select(index) {
      this.selectedIndex = index
      this.$emit('on-select', this.items[index])
      this.isOpen = false
    },
  },
}
</script>

<style lang="scss" scoped></style>
