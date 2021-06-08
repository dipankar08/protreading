<template>
  <div class="d_fullscreen d_layout_col responsive_container">
    <div class="d_layout_col">
      <div class="info_box search_box d_layout_col d_align_center_all d_text_center">
        <div class="d_layout_row">
          <a-input-search placeholder="search filter" enter-button @search="onSearch" :loading="loading" v-model="search_query" />
          <a-button type="primary d_ml20" @click="create_dialog_visible = true">Create New </a-button>
        </div>
        <p class="d_text_caption d_mt10">(You can search from 15K defined filters or you can create your own. All the filter are public)</p>
      </div>
      <div class="info_box search_result" v-if="search_result.length > 0">
        <a-collapse default-active-key="1" :bordered="false">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel v-for="(item, index) of search_result" :key="index" :header="item.title">
            <p><b>Screener Rule:</b> {{ item.query_string || "No filter code is given" }}</p>
            <p><b>Screen Description:</b> {{ item.description || "Nothing provided" }}</p>
            <div slot="extra" class="d_layout_row">
              <a-tooltip class="d_ml10" title="Run this scan"><a-button type="primary" @click="openDialogWithScan(item)"> Run</a-button></a-tooltip>
              <a-tooltip class="d_ml10" title="Save this scan in your account"
                ><a-button type="primary" @click="saveScreen(item)" :loading="save_screen_loading">Save</a-button></a-tooltip
              >
              <a-tooltip class="d_ml10" title="Delete this scan"
                ><a-button type="primary" @click="deleteScreen(item)" :loading="save_screen_loading">Delete</a-button></a-tooltip
              >
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="info_box search_hints" v-else>
        <p>Here are the list of components filters</p>
      </div>
    </div>
    <!-- Create new  -->
    <a-modal
      width="80%"
      height="800px"
      title="Create New Filter"
      :visible="create_dialog_visible"
      @cancel="create_dialog_visible = false"
      :footer="null"
      class="create_dialog"
    >
      <div class="d_layout_col d_fullscreen">
        <ScanParser :query_html="history_query_html" filter_id="screen1" class="d_layout_fill d_layout_fill scan_filter" @OnChange="OnChangeFilter" />
        <div class="d_layout_row d_mt20 d_layout_right">
          <a-button type="primary" class="d_mr5" @click="refresh_count++">Run Scan</a-button>
          <a-button type="link" @click="save_scan_dialog = !save_scan_dialog">Or Save this scan</a-button>
        </div>
        <div class="save_block d_layout_col d_mt20 d_mb20" v-show="save_scan_dialog">
          <p>Please fillup the form and click save now! Once you save, it can be search by title or you can view from your account</p>
          <a-input v-model="title" placeholder="What is the title of the Scan" class="d_mt20"></a-input>
          <a-input v-model="description" placeholder="Write short description about the scan" class="d_mt20"></a-input>
          <a-select class="d_mt20" placeholder="Please select scan type" defaultValue="intraday-bullish" mode="multiple" v-model="tags">
            <a-select-option v-for="item in save_tag_list" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>
          <a-button type="primary" class="d_mt20" @click="save_scan">Save Now</a-button>
        </div>
        <FilterBox :notification="true" class="result d_mt20" :query_string="query_string" :refresh_count="refresh_count" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import ScanParser from "../helper/ScanParser";
import FilterBox from "@/helper/FilterBox";
import { search_scan, notification, liveAccountObject, save_scan, delete_scan } from "../helper/lib";
//import MdiButton from "../components/vue/MdiButton.vue";
export default {
  components: {
    ScanParser,
    FilterBox,
    //   MdiButton,
  },
  data() {
    return {
      // Data
      search_query: "",
      loading: false,
      save_screen_loading: false,
      search_result: [],
      history_query_html: "",

      // create
      save_scan_dialog: false,
      refresh_count: 0,
      create_dialog_visible: false,
      screen_filter: null,

      //save
      title: "",
      description: "",
      tags: [],
      loading_save: false,
      query_html: "",
      query_string: "",
      save_tag_list: [
        { key: "intraday-bullish", text: "Intraday Bullish" },
        { key: "intraday-bearish", text: "Intraday Bearish" },
        { key: "long-bullish", text: "Long Bullish" },
        { key: "long-bearish", text: "Long Bearish" },
      ],
    };
  },
  methods: {
    openDialogWithScan(item) {
      this.create_dialog_visible = true;
      this.history_query_html = item.query_html;
      this.query_string = item.query_string;
    },
    OnChangeFilter(value) {
      this.query_html = value.query_html;
      this.query_string = value.query_string;
    },
    saveScreen(item) {
      // item needs to covert from vue obj to normal obj
      this.save_screen_loading = true;
      liveAccountObject.pushToArray("saved_screen", JSON.parse(JSON.stringify(item), { req_type: "saved_screen_update" }));
    },
    deleteScreen(item) {
      let _this = this;
      delete_scan(
        item._id,
        function(d, org) {
          notification(_this, org);
          _this.onSearch();
        },
        function(e, org) {
          notification(_this, org);
        }
      );
    },
    onSearch() {
      let _this = this;
      _this.loading = true;
      search_scan(
        this.search_query,
        function(data, org) {
          notification(_this, org);
          _this.loading = false;
          _this.search_result = data;
        },
        function(error, org) {
          notification(_this, org);
          _this.loading = false;
          _this.search_result = [];
        }
      );
    },
    save_scan() {
      this.loading_save = true;
      let _this = this;
      if (this.title.trim().length == 0 && this.description.trim().length == 0 && this.query_string.length == 0) {
        notification(this, { status: "error", msg: "Please enter title, description and filter" });
        return;
      }
      save_scan(
        {
          title: this.title,
          description: this.description,
          tags: this.tags,
          query_string: this.query_string,
          query_html: this.query_html,
          columns: this.screen_column,
          author_id: liveAccountObject.get("user_id"),
        },
        function(data, org) {
          notification(_this, org);
          _this.loading_save = false;
        },
        function(err, org) {
          notification(_this, org);
          _this.loading_save = false;
        }
      );
    },
    accountDataObs(data, extra) {
      switch (extra?.req_type) {
        case "saved_screen":
          this.save_screen_loading = false;
          break;
      }
    },
  },
  mounted() {
    liveAccountObject.addObserver(this.accountDataObs);
  },
  destroyed() {
    liveAccountObject.removeObserver(this.accountDataObs);
  },
};
</script>
<style scoped lang="scss">
.ant-collapse-borderless {
  background-color: transparent;
}
.create_dialog {
  padding: 0px !important;
  .scan_filter {
    background: whitesmoke;
    padding: 5px 20px;
  }
  .result {
    border-top: 2px solid blueviolet;
  }
  .save_block {
    background: whitesmoke;
    padding: 20px;
  }
}
</style>
