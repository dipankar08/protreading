<template>
  <div class="d_layout_col pane_home responsive_container">
    <a-alert class="d_mb20" show-icon :message="alert.msg" v-if="alert" :type="alert.status" closable></a-alert>
    <p class="header_out_box">Your Account Information</p>
    <div class="info_box d_layout_col d_layout_center_all">
      <div class="d_layout_col d_layout_center_all" v-if="auth != null">
        <a-avatar :src="auth.img" class="d_mb10" />
        <p class="d_mb10"><b>Name: </b>{{ auth.user_name }}</p>
        <p class="d_mb10"><b>UserId: </b>{{ auth.user_id }}</p>
        <a-button class="d_mt10 d_spacer" type="primary" @click="logout">Logout</a-button>
      </div>
      <p v-else>You have not logged in!</p>
    </div>
    <p class="header_out_box">Your Saved Scan</p>
    <div class="info_box d_layout_col d_layout_center_all"></div>
    <p class="header_out_box">Your Alert</p>
    <div class="info_box d_layout_col d_layout_center_all"></div>
    <p class="header_out_box">Your BackTest</p>
    <div class="info_box d_layout_col d_layout_center_all"></div>
    <p class="header_out_box">Update the cache</p>
    <div class="info_box d_layout_col">
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 5 Min</p>
        <a-button type="primary d_spacer" @click="downloadData('5m')" :loading="loading_update">Update 5 Min</a-button>
      </div>
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 15 Min Data</p>
        <a-button type="primary d_spacer" @click="downloadData('15m')" :loading="loading_update">Update 15 Min</a-button>
      </div>
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 1h cache</p>
        <a-button type="primary d_spacer" @click="downloadData('1h')" :loading="loading_update">Update 1H Min</a-button>
      </div>
      <div class="d_layout_row d_layout_center d_mb10">
        <p class="d_layout_fill">Update 1d cache</p>
        <a-button type="primary d_spacer" @click="downloadData('1d')" :loading="loading_update">Update 1D </a-button>
      </div>
    </div>
  </div>
</template>
<script>
import { localEvent } from "../common/localEvent";
import { downloadData } from "../helper/lib";
export default {
  components: {},
  data() {
    return {
      loading_update: false,
      alert: null,
      auth: localEvent.get("auth"),
    };
  },
  methods: {
    logout() {
      localEvent.notify("auth", null);
    },
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
<style scoped lang="scss"></style>
