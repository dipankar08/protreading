<template>
  <div class="d_layout_col pane_home responsive_container">
    <a-alert class="d_mb20" show-icon :message="alert.msg" v-if="alert" :type="alert.status" closable></a-alert>
    <p class="header_out_box">Your Account Information</p>
    <div class="info_box d_layout_col"></div>
    <p class="header_out_box">Update the cache</p>
    <div class="info_box d_layout_col">
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 5 Min</p>
        <a-button type="primary" @click="downloadData('5m')" :loading="loading_update">Update 5 Min</a-button>
      </div>
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 15 Min Data</p>
        <a-button type="primary" @click="downloadData('15m')" :loading="loading_update">Update 15 Min</a-button>
      </div>
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 1h cache</p>
        <a-button type="primary" @click="downloadData('1h')" :loading="loading_update">Update 1H Min</a-button>
      </div>
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 1d cache</p>
        <a-button type="primary" @click="downloadData('1d')" :loading="loading_update">Update 1D </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { downloadData } from "../helper/lib";
export default {
  components: {},
  data() {
    return {
      loading_update: false,
      alert: null,
    };
  },
  methods: {
    downloadData(time, duration) {
      let _this = this;
      _this.loading_update = true;
      downloadData(
        time,
        duration,
        function(data, orgData) {
          _this.loading_update = false;
          _this.alert = { msg: orgData.msg, status: orgData.status };
        },
        function(err, data) {
          _this.loading_update = false;
          _this.alert = { msg: err, status: err };
        }
      );
    },
  },
};
</script>
<style scoped lang="scss">
.pane_home {
  .group {
    flex-wrap: wrap;
    .info_box {
      width: calc(33% - 20px);
      height: 400px;
      margin: 10px;
      padding: 0px;
    }
  }
}
</style>
