<template>
  <div class="justify-center items-center w-screen h-screen">
    <v-table :headers="headers" :items="desserts" />
  </div>
</template>

<script>
import VTable from '@/components/VTable.vue'
import MockedData from '@/mocks/mocked-table-data.json'

export default {
  name: 'Home',
  components: {
    VTable,
  },
  data() {
    return {
      headers: [
        {
          text: 'Dessert (100g serving)',
          align: 'start',
          filterable: false,
          value: 'name',
        },
        { text: 'Calories', value: 'calories' },
        { text: 'Fat (g)', value: 'fat' },
        { text: 'Carbs (g)', value: 'carbs' },
        { text: 'Protein (g)', value: 'protein' },
        { text: 'Iron (%)', value: 'iron' },
      ],
      desserts: MockedData,
    }
  },
}
</script>

<style lang="scss" scoped></style>
