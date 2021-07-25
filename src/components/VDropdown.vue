<template>
  <div class="container">
    <div class="container__select" @click="isOpen = !isOpen">
      <div class="select__content">
        <span>{{ selectedValue }}</span>
        <span>▼</span>
      </div>
    </div>
    <div class="container__dropdown" v-if="isOpen">
      <div v-for="(item, index) in options" :key="index">
        <div class="dropdown__element" @click="select(index)">
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
      if (this.savedOptions.length === 0) return ''
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

<style lang="scss" scoped>
.container {
  width: 100%;
  position: relative;
  &__select {
    width: 100%;
    height: 32px;
    cursor: pointer;
    border: 1px solid #dddce3;
    border-radius: 5px;
    padding: 0 8px;
    &:hover {
      background-color: #dddce3;
    }
    .select {
      &__content {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
  &__dropdown {
    position: absolute;
    top: 36px;
    width: 100%;
    border: 1px solid #dddce3;
    border-radius: 5px;
    .dropdown {
      &__element {
        width: 100%;
        height: 32px;
        padding: 0 8px;
        cursor: pointer;
        &:hover {
          background-color: #dddce3;
        }
      }
    }
  }
}
</style>
