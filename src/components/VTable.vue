<template>
  <div class="w-full pb-40">
    <v-input @inputSearch="onSearch" />
    <div class="relative w-full h-full">
      <div
        class="w-full grid cursor-pointer select-none border-b-2"
        :style="columnsNumber"
      >
        <span
          class="flex items-center py-2 font-bold"
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
        :items="paginationOptions"
        @on-select="onItemsPerPageSelect"
      />
      <!-- <v-dropdown :items="['alaska', 'russia', 'usa']" /> -->
      <!-- <v-dropdown :items="[false, true]" />
      <v-dropdown :items="[1, 2, 3, 4]" />
      <v-dropdown :items="[{ ff: 11 }, { ff: 22 }]" item-value="ff" /> -->
    </div>
  </div>
</template>

<script>
import VInput from '@/components/VInput.vue'
import VDropdown from '@/components/VDropdown.vue'
import { deepClone } from '@/helpers'
import { VALUE_ALL } from '@/consts'
import IconArrowDown from '@/icons/icon-arrow-down.vue'

export default {
  name: 'VTable',
  components: {
    VInput,
    VDropdown,
    IconArrowDown,
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
  },
  data() {
    return {
      modalVisible: false,
      rows: [],
      sortingKey: '',
      sortingOrder: 1,
      paginationOptions: [
        { value: 5 },
        { value: 10 },
        { value: 15 },
        { value: VALUE_ALL },
      ],
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
      if (value.value === VALUE_ALL) {
        this.rowsPerPage = { value: this.items.length }
        this.currentPage = 1
        this.totalPages = 1
        this.paginate()
        return
      }
      this.rowsPerPage = value
      this.currentPage = 1
      this.totalPages = Math.ceil(this.items.length / this.rowsPerPage.value)
      this.paginate()
    },
    paginate() {
      const rowsPerPage = this.rowsPerPage.value
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
