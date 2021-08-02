<template>
  <div class="relative" v-click-outside="close">
    <div
      class="w-full cursor-pointer h-8 border-solid border-2 rounded-lg px-2 hover:bg-gray-200"
      @click="isOpen = !isOpen"
    >
      <div class="flex items-center justify-between">
        <span>{{ selectedValue }}</span>
        <span>▼</span>
      </div>
    </div>
    <transition name="fade">
      <div
        class="absolute w-full top-10 border-solid border-2 rounded-lg bg-white"
        v-if="isOpen"
      >
        <div v-for="(item, index) in savedOptions" :key="index">
          <div
            class="w-full h-8 cursor-pointer px-2 hover:bg-gray-200 "
            @click="select(index)"
          >
            {{ item[itemValue] }}
          </div>
        </div>
      </div>
    </transition>
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
    selectedValue() {
      return this.savedOptions[this.selectedIndex][this.itemValue]
    },
  },
  watch: {
    items() {
      this.processOptions()
    },
  },
  created() {
    this.processOptions()
  },
  mounted() {
    this.select(0)
  },
  methods: {
    select(index) {
      this.selectedIndex = index
      this.$emit('on-select', this.items[index])
      this.isOpen = false
    },
    close() {
      this.isOpen = false
    },
    processOptions() {
      this.savedOptions = this.items
      if (typeof this.items === 'function') {
        throw new Error('Options array elements cannot be a function')
      }
      if (typeof this.items[0] !== 'object') {
        this.savedOptions = this.items.map(item => ({
          [this.itemValue]: item,
        }))
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
