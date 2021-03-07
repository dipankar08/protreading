<template>
  <div class="d_fullscreen d_layout_col responsive_container">
    <div class="d_layout_col">
      <div class="d_layout_row d_layout_center">
        <p class="header_out_box d_layout_fill">
          <span class="d_link" @click="left_pane = 'recent'"> Recent Filter</span>
        </p>
        <a-button class="d_ml10 d_spacer" type="primary" @click="left_pane = 'create'">Create New</a-button>
        <a-button class="d_ml10 d_spacer" type="primary" @click="left_pane = 'recent'">Recent</a-button>
      </div>
      <div class="info_box filter d_layout_col d_layout_fill d_mt20" v-show="left_pane == 'create'">
        <p class="header_in_box d_mb10 ">1) What is your columns?</p>
        <a-select mode="tags" placeholder="Please select columns" :default-value="['indicator:1d:0:close']" @change="handleUpdateColumn">
          <a-select-option v-for="item in screen_columns_list" :key="item.key">{{ item.text }}</a-select-option>
        </a-select>
        <p class="header_in_box d_mt20 d_mb10 ">2) What is your filter?</p>
        <ScanParser filter_id="screen1" class="d_layout_fill d_layout_fill" @OnChange="OnChangeFilter" />
        <div class="d_layout_row d_layout_equal d_mt20">
          <a-button type="primary d_mr20 d_spacer" @click="perform_scan" :loading="loading_scan">Scan</a-button>
          <a-button type="primary d_mr20 d_spacer" @click="save_scan" :loading="loading_save">Save</a-button>
        </div>
      </div>
      <!-- RECENT -->
      <div class="info_box d_mb20 filter d_layout_col d_layout_fill recent" v-show="left_pane == 'recent'">
        <a-collapse default-active-key="1" :bordered="false">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel v-for="(item, index) of recent_scans" :key="index" :header="item.title">
            <p>Filter Code: {{ item.filter }}</p>
            <p>Columns: {{ item.columns }}</p>
            <p>ID:: {{ item._id }}</p>
            <div slot="extra" class="d_layout_row">
              <span class="mdi mdi_btn mdi-play" @click="runRecent(item.filter, item.columns)"></span>
              <span class="mdi mdi_btn mdi-delete" @click="deleteScan(item._id)"></span>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
    </div>
    <div class="d_layout_col right d_layout_fill">
      <p class="header_out_box">Result</p>
      <div class="info_box result d_layout_col">
        <a-alert class="d_mb20" type="error" :message="error_scan" banner v-show="error_scan != null" />
        <div class="d_layout_row d_mb20 d_layout_space_between">
          <p>{{ result.length }} item found</p>
          <p class="d_layoout_fill"></p>
          <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
        </div>
        <a-table class="d_layout_fill d_mb20 d_full_width" :columns="columns" :data-source="result" bordered :loading="loading_scan"> </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import ScanParser from "../helper/ScanParser";
import { perform_scan, save_scan, get_scan, delete_scan, getColFormatForData } from "../helper/lib";
import { SCREEN_COLUMNS_LIST } from "../helper/const";
export default {
  components: {
    ScanParser,
  },
  data() {
    return {
      left_pane: "create",
      error: null,
      loading: false,
      screen_filter: "",
      screen_column: ["symbol", "close"],
      screen_columns_list: SCREEN_COLUMNS_LIST,
      columns: [],
      all_result: [],
      result: [],
      save_scan_list: [],

      // update
      loading_update: false,
      error_update: null,

      // scan
      loading_scan: false,
      error_scan: null,

      // save
      loading_save: false,
      error_save: null,
      recent_scans: [],
    };
  },
  methods: {
    handleUpdateColumn(data) {
      this.screen_column = data;
    },

    get_scan() {
      let _this = this;
      get_scan(
        function(data, orgData) {
          _this.recent_scans = data;
        },
        function(err, org) {}
      );
    },
    deleteScan(id) {
      let _this = this;
      delete_scan(
        id,
        function(data, orgData) {
          _this.get_scan();
        },
        function(err, org) {}
      );
    },
    save_scan() {
      this.loading_save = true;
      this.error_save = null;
      let _this = this;
      var title = prompt("What is the Name of the filter", "");
      if (title != null && title.length > 0) {
        save_scan(
          { title: title, filter: this.screen_filter, columns: this.screen_column },
          function() {
            _this.loading_save = false;
            _this.error_save = null;
          },
          function() {
            _this.loading_save = false;
            _this.error_save = "Not able to save the filter";
          }
        );
      }
    },
    onSearch(value) {
      if (value.length == 0) {
        this.result = this.all_result;
      } else {
        this.result = this.all_result.filter((x) => x.symbol.indexOf(value) != -1);
      }
    },
    OnChangeFilter(value) {
      console.log(value);
      this.screen_filter = value;
    },
    perform_scan() {
      this.runRecent(this.screen_filter, []);
    },
    runRecent(filter, columns) {
      let _this = this;
      this.loading_scan = true;
      this.error_scan = null;
      let col = this.screen_column;
      for (var x of columns) {
        col.push(x);
      }
      perform_scan(
        filter,
        col,
        function(data, orgData) {
          console.log(data);
          _this.result = data;
          _this.all_result = data;
          _this.loading_scan = false;
          _this.error_scan = null;
          _this.columns = _this.getColsForData(data[0]);
        },
        function(error, orgError) {
          console.log(error);
          _this.loading_scan = false;
          _this.error_scan = error;
        }
      );
    },
    getColsForData(data) {
      return getColFormatForData(data);
    },
  },
  mounted() {
    this.get_scan();
  },
};
</script>
<style scoped lang="scss">
.info_box {
  &.filter {
  }
  &.suggestion {
  }
  &.result {
    padding: 30px 5px;
  }
  &.recent {
    padding: 20px 0;
  }
}

.ant-collapse-borderless {
  background-color: transparent;
}
</style>
