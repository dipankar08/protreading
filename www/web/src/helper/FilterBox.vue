<template>
  <div class="template d_layout_col d_fullscreen">
    <div class="d_layout_row header">
      <p class="d_layout_fill">{{ title }}</p>
      <a-select v-model="dropdown_column" class="select" mode="multiple">
        <a-select-option v-for="item in LATEST_SCREEN_COLUMNS_LIST" :key="item.key" :value="item.key">{{ item.text }}</a-select-option>
      </a-select>
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
import { LATEST_SCREEN_COLUMNS_LIST } from "./const";
import _ from "underscore";
export default {
  props: {
    filter_id: String,
    refresh_rate: Number,
    refresh_count: Number,
  },
  data() {
    return {
      dropdown_column: ["symbol", "close", "change"],
      title: "Loading...",
      filter: "loading...",
      table_loading: false,
      table_columns: [],
      table_data: [],
      LATEST_SCREEN_COLUMNS_LIST: LATEST_SCREEN_COLUMNS_LIST,
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
        _.union(this.dropdown_column),
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
        _this.dropdown_column = _.union(data[0].columns || [], ["symbol", "close", "change"]);
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
  .select {
    min-width: 200px;
  }
}
</style>
