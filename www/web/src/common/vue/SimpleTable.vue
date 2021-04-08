<template>
  <div class="d_layout_col simple_table">
    <p class="title d_mb20" v-if="title && title.length > 0" v-show="title && title.length > 0">{{ title }}</p>
    <table v-if="data.length > 0">
      <tr>
        <th v-for="(row, index) in Object.keys(data[0])" :key="index">{{ row }}</th>
        <th>Actions</th>
      </tr>
      <tr v-for="(row, index) in data" :key="index">
        <td v-for="value in row" :key="value">{{ value }}</td>
        <td>
          <a-button type="" v-for="value in actions" :key="value" @click="clickAction(value, row)"> {{ value }}</a-button>
        </td>
      </tr>
    </table>

    <p v-else>Error: No data found ( Did you login ? )</p>
  </div>
</template>

<script>
export default {
  props: {
    // Title of the table
    title: {
      type: String,
      default: "",
    },
    // data to be shown in the table
    data: {
      type: Array,
      default: () => [],
    },
    // action buttons
    actions: {
      type: Array,
      default: () => [],
    },
    // selection: Array, // this is a list of column you need to show DO IT in upper layer
  },
  methods: {
    clickAction(action_type, item) {
      this.$emit("clickAction", action_type, JSON.parse(JSON.stringify(item)));
    },
  },
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
