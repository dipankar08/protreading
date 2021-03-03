<template>
  <div class="template d_layout_col d_fullscreen">
    <div class="d_layout_row header">
      <p class="d_layout_fill">{{ title }}</p>
      <span class="mdi mdi_btn mdi-link"></span>
      <span class="mdi mdi_btn mdi-reload" @click="reload"></span>
    </div>
    <a-table
      class="d_layout_fill"
      :columns="table_columns"
      :data-source="table_data"
      :bordered="false"
      :pagination="false"
      :scroll="{ x: false, y: 300 }"
      :loading="table_loading"
    >
    </a-table>
  </div>
</template>
<script>
import { get_scan_for_id, perform_scan, getColFormatForData } from "./lib";
export default {
  props: {
    filter_id: String,
    refresh_rate: Number,
    refresh_count: Number,
  },
  data() {
    return {
      title: "Loading...",
      filter: "loading...",
      columns: [],
      filter_columns: ["symbol", "close", "change"],
      table_loading: false,
      table_columns: [],
      table_data: [],
    };
  },
  watch: {
    refresh_count(newVal) {
      this.reload();
    },
  },
  methods: {
    reload() {
      let _this = this;
      _this.table_loading = true;
      perform_scan(
        this.filter,
        this.columns,
        function(data, orgData) {
          _this.table_data = data;
          _this.table_columns = _this.getColFormatForData(data[0]);
          _this.table_loading = false;
        },
        function(error, orgError) {
          _this.table_loading = false;
        }
      );
    },
    getColFormatForData(data) {
      return getColFormatForData(data);
    },
  },
  mounted() {
    let _this = this;
    get_scan_for_id(
      this.filter_id,
      function(data, orgData) {
        _this.title = data[0].title;
        _this.filter = data[0].filter;
        _this.columns = data[0].columns || [];
        for (var x of _this.filter_columns) {
          _this.columns.push(x);
        }
        console.log(data);
        _this.reload();
      },
      function(error) {
        console.log(error);
      }
    );
  },
};
</script>
<style lang="scss" scoped>
.header {
  font-size: 16px;
  padding: 10px;
  border-bottom: 1px solid #11111111;
  .mdi {
    padding: 0px 10px;
    cursor: pointer;
  }
}
</style>
