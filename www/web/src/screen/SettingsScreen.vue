<template>
  <div class="d_layout_col pane_home responsive_container">
    <p class="header_out_box">Your Account Information</p>
    <div class="info_box d_layout_row d_layout_center_all">
      <div class="d_layout_col d_mr20">
        <a-avatar :src="auth.img" class="d_mb10" />
        <div class="d_mb10 d_layout_row d_layout_center">
          <b class="d_mr20">Name:</b><inplace-edit :value="account_data.name" @onUpdate="onUpdateName"></inplace-edit>
        </div>
        <p class="d_mb10"><b>UserId: </b>{{ auth.user_id }}</p>
        <a-button class="d_mt10 d_spacer" type="primary" @click="logout">Logout</a-button>
      </div>
    </div>
    <p class="header_out_box">Focus Stock</p>
    <div class="info_box d_layout_col d_layout_center_all">
      <div class="d_layout_col">
        <key-value-list title="" :items="focus_group_history"></key-value-list>
        <a-button type="primary" @click="focus_group_dialog_visible = true">Create New Group</a-button>
      </div>
      <div class="d_layout_col"></div>
    </div>
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
    <!-- Models -->
    <a-modal
      title="Create Focus Group"
      :visible="focus_group_dialog_visible"
      :confirm-loading="focus_group_loading"
      @ok="createFocusGroup"
      @cancel="focus_group_dialog_visible = false"
    >
      <div class="d_layout_col">
        <p class="d_mb5">What is the name of the group?</p>
        <a-input class="d_mb10" v-model="focus_group_new_name"></a-input>
        <p class="d_mb5">What is your top 4 or 8 stocks</p>
        <a-select class="d_layout_fill" v-model="focus_group_new_list" mode="multiple">
          <a-select-option v-for="item in NIFTY_200" :key="item.key">{{ item.text }}</a-select-option>
        </a-select>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { localEvent } from "../common/localEvent";
import KeyValueList from "../helper/KeyValueList.vue";
import { downloadData, notification, liveAccountObject } from "../helper/lib";
import { NIFTY_200 } from "../helper/const";
import InplaceEdit from "../common/vue/InplaceEdit.vue";

export default {
  components: { KeyValueList, InplaceEdit },
  data() {
    return {
      // focus group.
      focus_group_new_name: "Unnamed",
      focus_group_new_list: [],
      focus_group_loading: false,
      focus_group_dialog_visible: false,
      focus_group_history: [],

      // const
      NIFTY_200: NIFTY_200,
      loading_update: false,
      auth: localEvent.get("auth"),
      account_data: {
        name: "loading",
      },
    };
  },
  methods: {
    logout() {
      localEvent.notify("auth", null);
    },
    onUpdateName(name) {
      liveAccountObject.set("name", name);
    },
    createFocusGroup() {
      //LD_MyFocusGroupItems.push({ key: this.focus_group_new_name, value: this.focus_group_new_list });
    },
    downloadData(time, duration) {
      let _this = this;
      _this.loading_update = true;
      downloadData(
        time,
        duration,
        function(data, orgData) {
          notification(_this, orgData);
          _this.loading_update = false;
        },
        function(err, data) {
          notification(_this, data);
          _this.loading_update = false;
        }
      );
    },
    accountDataObs(data) {
      this.account_data.name = data.name;
    },
  },
  mounted() {
    liveAccountObject.addObserver(this.accountDataObs);
  },
  destroyed() {
    liveAccountObject.removeObserver(this.accountDataObs);
  },
  updated() {},
};
</script>
<style scoped lang="scss"></style>
