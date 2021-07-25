<template>
  <div class="container">
    <v-search @inputSearch="onSearch" />
    <div class="table">
      <div class="table__head" :style="columnsNumber">
        <span
          class="head__cell"
          @click="onColumnClick(head)"
          v-for="(head, index) in headers"
          :key="index"
        >
          <span>{{ head.text }}</span>
          <span v-if="head.value === sortingKey">{{ arrow }}</span>
        </span>
      </div>
      <div class="table__body">
        <div
          class="body__row"
          :style="columnsNumber"
          v-for="(row, rowIndex) in sortedRows"
          :key="rowIndex"
        >
          <span
            class="row__cell"
            v-for="(column, cellIndex) in headers"
            :key="cellIndex"
          >
            {{ getCellValue(row, column) }}
          </span>
        </div>
      </div>
    </div>

    <div class="pagination">
      <div class="pagination__pager">
        <div class="pager__arrow" @click="decrementPage"><span>❮</span></div>
        <span class="pager__text">{{ paginationText }}</span>
        <div class="pager__arrow" @click="incrementPage"><span>❯</span></div>
      </div>
      <v-dropdown
        class="pagination__select"
        :items="paginationOptions"
        @on-select="onItemsPerPageSelect"
      />
      <!-- <v-dropdown :items="['alaska', 'russia', 'usa']" />
      <v-dropdown :items="[false, true]" />
      <v-dropdown :items="[1, 2, 3, 4]" />
      <v-dropdown :items="[{ ff: 11 }, { ff: 22 }]" item-value="ff" /> -->
    </div>
  </div>
</template>

<script>
import VSearch from '@/components/VSearch.vue'
import VDropdown from '@/components/VDropdown.vue'
import { deepClone } from '@/helpers'

export default {
  name: 'VTable',
  components: {
    VSearch,
    VDropdown,
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
      paginationOptions: [{ value: 5 }, { value: 10 }, { value: 15 }],
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
    arrow() {
      if (this.sortingOrder === 1) {
        return '↑'
      }
      return '↓'
    },
    paginationText() {
      return `${this.currentPage} of ${this.totalPages}`
    },
  },
  created() {
    // this.rows = deepClone(this.items)
    const copyItems = deepClone(this.items)
    this.rows = copyItems.slice(0, 10)
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

<style lang="scss" scoped>
.container {
  width: 100%;
  padding-bottom: 80px;
}
.table {
  position: relative;
  width: 100%;
  height: 100%;

  &__head {
    width: 100%;
    display: grid;
    cursor: pointer;
    height: 48px;
    font-weight: bold;
    font-size: 18px;
    border-bottom: 1px solid #dddce3;
    height: 48px;
    .head {
      &__cell {
        display: flex;
        align-items: center;
      }
    }
  }
  &__body {
    width: 100%;
    display: flex;
    flex-direction: column;

    .body {
      &__row {
        display: grid;
        height: 40px;
        border-bottom: 1px solid #dddce3;
        &:hover {
          background-color: #dddce3;
        }
        .row {
          &__cell {
            display: flex;
            align-items: center;
            text-align: left;
            font-size: 16px;
          }
        }
      }
    }
  }
}
.pagination {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-top: 12px;
  &__select {
    width: 260px;
    margin-right: 18px;
  }
  &__pager {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 260px;
    margin-right: 18px;
    .pager {
      &__arrow {
        cursor: pointer;
      }
    }
  }
}
</style>
