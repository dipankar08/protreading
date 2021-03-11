<template>
  <div class="d_fullscreen d_layout_col responsive_container">
    <div class="d_layout_col">
      <div class="info_box search_box d_layout_col d_align_center_all d_text_center">
        <p class="d_text_hero d_mb20">Search Screen</p>
        <a-input-search placeholder="search filter" enter-button @search="onSearch" :loading="loading" />
      </div>
      <div class="info_box search_result" v-if="search_result.length > 0">
        <a-collapse default-active-key="1" :bordered="false">
          <template #expandIcon="props">
            <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
          </template>
          <a-collapse-panel v-for="(item, index) of search_result" :key="index" :header="item.title">
            <p><b>Screener Rule:</b> {{ item.filter || "No filter code is given" }}</p>
            <p><b>Screen Columns:</b> {{ item.columns }}</p>
            <p><b>Screen Id:</b> {{ item._id }}</p>
            <div slot="extra" class="d_layout_row">
              <a-button class="d_mr20" type="primary" @click="openUrl(`/screen?id=${item._id}`)"> Run this Screen</a-button>
              <a-button type="primary" @click="saveScreen(item)">Save this screen</a-button>
            </div>
          </a-collapse-panel>
        </a-collapse>
      </div>
      <div class="info_box search_hints" v-else>
        <p>Here are the list of common filters</p>
      </div>
    </div>
  </div>
</template>
<script>
import { search_scan, notification, liveAccountObject } from "../helper/lib";
export default {
  components: {},
  data() {
    return {
      loading: false,
      search_result: [],
    };
  },
  methods: {
    openUrl(data) {
      window.open(data, "_blank");
    },
    saveScreen(item) {
      // item needs to covert from vue obj to normal obj
      liveAccountObject.pushToArray("saved_screen", JSON.parse(JSON.stringify(item)));
    },
    onSearch(value) {
      let _this = this;
      _this.loading = true;
      search_scan(
        value,
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
  },
  mounted() {
    //this.get_scan();
  },
  updated() {
    console.log("updated1");
  },
};
</script>
<style scoped lang="scss">
.ant-collapse-borderless {
  background-color: transparent;
}
</style>
