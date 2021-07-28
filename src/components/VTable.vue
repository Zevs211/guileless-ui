<template>
  <div class="w-full shadow-md pb-4">
    <div class="px-4 flex items-center w-full">
      <v-input class="w-full" @inputSearch="onSearch" />
      <icon-search class="ml-4" />
    </div>
    <div class="relative w-full h-full">
      <div
        class="w-full grid cursor-pointer select-none border-b-2"
        :style="columnsNumber"
      >
        <span
          class="flex items-center justify-between py-2 font-bold"
          :class="[{ 'pl-4': index === 0 }, { 'pl-2': index !== 0 }]"
          @click="onColumnClick(head)"
          v-for="(head, index) in headers"
          :key="index"
        >
          <span>{{ head.text }}</span>
          <icon-arrow-down
            class="transition-transform"
            v-if="head.value === sortingKey"
            :class="{ 'transform -rotate-180': sortingOrder === 1 }"
          />
        </span>
      </div>
      <div class="flex flex-col w-full">
        <div
          class="grid border-b-2 h-10 hover:bg-gray-200"
          :style="columnsNumber"
          v-for="(row, rowIndex) in sortedRows"
          :key="rowIndex"
        >
          <span
            class="flex items-center text-left text-base"
            :class="[{ 'pl-4': cellIndex === 0 }, { 'pl-2': cellIndex !== 0 }]"
            v-for="(column, cellIndex) in headers"
            :key="cellIndex"
          >
            {{ getCellValue(row, column) }}
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-row-reverse w-full mt-3">
      <div class="flex flex-row justify-between mr-8 w-60">
        <div class="cursor-pointer" @click="decrementPage"><span>❮</span></div>
        <span>{{ paginationText }}</span>
        <div class="cursor-pointer" @click="incrementPage"><span>❯</span></div>
      </div>
      <v-dropdown
        class="mr-8 w-60"
        :items="internalPaginationOptions"
        @on-select="onItemsPerPageSelect"
      />
    </div>
  </div>
</template>

<script>
import VInput from '@/components/VInput.vue'
import VDropdown from '@/components/VDropdown.vue'
import { deepClone } from '@/helpers'
import { VALUE_ALL } from '@/consts'
import IconArrowDown from '@/icons/icon-arrow-down.vue'
import IconSearch from '@/icons/icon-search.vue'

export default {
  name: 'VTable',
  components: {
    VInput,
    VDropdown,
    IconArrowDown,
    IconSearch,
  },
  props: {
    headers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    paginationOptions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      modalVisible: false,
      rows: [],
      sortingKey: '',
      sortingOrder: 1,
      internalPaginationOptions: [],
      rowsPerPage: null,
      currentPage: 1,
      totalPages: 1,
    }
  },
  computed: {
    columnsNumber() {
      const columnsLength = this.headers.length
      return `grid-template-columns: repeat(${columnsLength}, 1fr);`
    },
    sortedRows() {
      return this.rows.sort((a, b) => {
        const left = a[this.sortingKey]
        const right = b[this.sortingKey]
        if (typeof a[this.sortingKey] === 'string') {
          if (left.toLowerCase() > right.toLowerCase()) {
            return 1 * this.sortingOrder
          }
          if (left.toLowerCase() < right.toLowerCase()) {
            return -1 * this.sortingOrder
          }
          return 0
        }
        return (left - right) * this.sortingOrder
      })
    },
    paginationText() {
      return `${this.currentPage} of ${this.totalPages}`
    },
  },
  created() {
    this.internalPaginationOptions = [...this.paginationOptions, VALUE_ALL]
    const copyItems = deepClone(this.items)
    this.rows = copyItems.slice(0, 5)
    this.totalPages = Math.ceil(this.items.length / this.rows.length)
  },
  methods: {
    getCellValue(row, column) {
      return row[column.value]
    },
    onColumnClick(head) {
      if (this.sortingKey === head.value) {
        this.sortingOrder *= -1
        return
      }
      this.sortingOrder = 1
      this.sortingKey = head.value
    },
    onSearch(searchValue) {
      const filteredRows = this.items.filter(item => {
        return Object.values(item).some(fieldValue =>
          `${fieldValue}`.toLowerCase().includes(searchValue.toLowerCase()),
        )
      })
      this.rows = deepClone(filteredRows)
    },
    onItemsPerPageSelect(value) {
      if (value === VALUE_ALL) {
        this.rowsPerPage = this.items.length
        this.currentPage = 1
        this.totalPages = 1
        this.paginate()
        return
      }
      this.rowsPerPage = value
      this.currentPage = 1
      this.totalPages = Math.ceil(this.items.length / this.rowsPerPage)
      this.paginate()
    },
    paginate() {
      const rowsPerPage = this.rowsPerPage
      const pagedRows = this.items.slice(
        (this.currentPage - 1) * rowsPerPage,
        this.currentPage * rowsPerPage,
      )
      this.rows = deepClone(pagedRows)
    },
    decrementPage() {
      this.currentPage = Math.max(this.currentPage - 1, 1)
      this.paginate()
    },
    incrementPage() {
      this.currentPage = Math.min(this.currentPage + 1, this.totalPages)
      this.paginate()
    },
  },
}
</script>

<style lang="scss" scoped></style>
