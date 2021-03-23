<template>
  <div class="d_layout_col simple_table">
    <p class="title d_mb20" v-show="title.length > 0">{{ title }}</p>
    <table>
      <tr>
        <th v-for="(row, index) in Object.keys(data[0])" :key="index">{{ row }}</th>
      </tr>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="value in row" :key="value">{{ value }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    data: Array, // {key:, value:}
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.simple_table {
  .title {
    font-size: 23px;
  }
  width: 100%;
  table {
    font-family: Arial, Helvetica, sans-serif;
    border-collapse: collapse;
    width: 100%;

    td,
    th {
      border: 1px solid #ddd;
      padding: 8px;
    }

    tr:nth-child(even) {
      background-color: #f2f2f2;
    }

    tr:hover {
      background-color: #ddd;
    }

    th {
      padding-top: 12px;
      padding-bottom: 12px;
      text-align: left;
      background-color: #111111;
      color: white;
    }
  }
}
</style>
