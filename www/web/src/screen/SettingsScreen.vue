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
    <!-- Focus group -->
    <p class="header_out_box">Focus Stock</p>
    <div class="info_box d_layout_col d_layout_center_all">
      <div class="d_layout_row d_fullwidth d_mb20">
        <p class="d_layout_fill">Your current Focus group are as below:</p>
        <a-button type="primary" @click="focus_group_dialog_visible = true">Create New Group</a-button>
      </div>
      <div class="d_layout_col d_fullwidth">
        <key-value-list title="" :items="focus_group" @onClickAction="onFocusGroupClickAction" action_icon="mdi-delete-outline"></key-value-list>
      </div>
    </div>

    <!-- Saved Screen -->
    <p class="header_out_box">Saved Screen</p>
    <div class="info_box d_layout_col d_layout_center_all">
      <div class="d_layout_row d_fullwidth d_mb20">
        <p class="d_layout_fill">Your saved screen ( You can add more screen from screen page)</p>
        <a-button type="primary" @click="findMoreScreen">Find More Screen</a-button>
      </div>
      <div class="d_layout_col d_fullwidth">
        <key-value-list title="" :items="saved_screen" @onClickAction="onSavedScreenClickAction" action_icon="mdi-delete-outline"></key-value-list>
      </div>
    </div>

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
import KeyValueList from "../common/vue/KeyValueList.vue";
import { downloadData, notification, liveAccountObject } from "../helper/lib";
import { NIFTY_200 } from "../helper/const";
import InplaceEdit from "../common/vue/InplaceEdit.vue";
import { getRandomKey } from "../common/utils";

export default {
  components: { KeyValueList, InplaceEdit },
  data() {
    return {
      // focus group.
      focus_group_new_name: "Unnamed",
      focus_group_new_list: [],
      focus_group_loading: false,
      focus_group_dialog_visible: false,
      focus_group: [],
      saved_screen: [],

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
      liveAccountObject.pushToArray("focus_group", {
        name: this.focus_group_new_name,
        list: this.focus_group_new_list,
        _id: getRandomKey(),
      });
    },
    onFocusGroupClickAction(data) {
      liveAccountObject.popFromArray("focus_group", data._id);
    },
    onSavedScreenClickAction(data) {
      liveAccountObject.popFromArray("saved_screen", data._id);
    },
    findMoreScreen() {},

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
      if (data.focus_group) {
        this.focus_group = data.focus_group.map((x) => {
          return { _id: x._id, key: x.name, value: x.list };
        });
      }
      if (data.saved_screen) {
        this.saved_screen = data.saved_screen.map((x) => {
          return { _id: x._id, key: x.title, value: x.filter };
        });
      }
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
