<template>
  <div class="d_layout_col alert responsive_container">
    <div class="d_layout_col page_header_block">
      <p class="header">Alerts</p>
      <div class="d_layout_row subheader">
        <a-button type="link" href="#new">Create New</a-button>
        <a-button type="link" href="#history">Your Alerts</a-button>
      </div>
    </div>

    <p class="header_out_box" id="new">Create New Alerts</p>
    <div class="info_box d_layout_col d_layout_center_all">
      <div class="d_layout_col d_mr20">
        <div class="new">
          <p>When</p>
          <a-select v-model="alert.indicator1">
            <a-select-option v-for="item in ALERT_INDICATOR_LIST" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>
          <p>of stock</p>
          <a-select v-model="alert.symbol">
            <a-select-option v-for="item in NIFTY_200" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>
          <p>is</p>

          <a-select v-model="alert.comparison">
            <a-select-option key=">" value=">">Greater Than</a-select-option>
            <a-select-option key="<" value="<">Less Than</a-select-option>
            <a-select-option key=">=" value=">=">Greater Than or equals</a-select-option>
            <a-select-option key="<=" value="<=">less than or equals</a-select-option>
          </a-select>
          <a-radio-group v-model="alert.indicator2_type">
            <a-radio value="value">Value</a-radio>
            <a-radio value="indicator">Indicator</a-radio>
          </a-radio-group>
          <a-input v-model="alert.indicator2_value" v-show="indicator2_type == 'value'"></a-input>
          <a-select v-model="alert.indicator2">
            <a-select-option v-for="item in ALERT_INDICATOR_LIST" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>

          <p>, Please notify me via</p>
          <a-select v-model="alert.notification_method">
            <a-select-option key="email" value="email">email</a-select-option>
          </a-select>
          <p>with subject name</p>
          <p>
            <a-input v-model="alert.name"></a-input>
          </p>
        </div>
        <a-button type="primary" class="d_mt20" @click="create_alert" :loading="loading">Save</a-button>
      </div>
    </div>
    <!-- Focus group -->
    <p class="header_out_box" id="history">All Alerts</p>
    <div class="info_box d_layout_col d_layout_center_all">
      <simple-table :data="alert_history" title="" :actions="['edit', 'delete']" @clickAction="onTableAction" />
    </div>
  </div>
</template>
<script>
import { downloadData, notification, liveAccountObject, alert_func } from "../helper/lib";
import { NIFTY_200, ALERT_INDICATOR_LIST } from "../helper/const";
//import InplaceEdit from "../components/vue/InplaceEdit.vue";
import { getRandomKey } from "@/components/webdev/typescript//utils";
import SimpleTable from "../components/vue/SimpleTable.vue";

export default {
  components: { SimpleTable },
  data() {
    return {
      alert: {
        name: "My Alert",
        symbol: "TCS.NS",
        indicator1: "open",
        indicator2_type: "value",
        comparison: ">",
        indicator2_value: 20,
        indicator2: "close",
        notification_method: "mail",
        user_id: "",
        condition: "",
        status: "active",
      },
      ALERT_INDICATOR_LIST: ALERT_INDICATOR_LIST,
      NIFTY_200: NIFTY_200,
      loading: false,
      alert_history: [{}],
      alert_history_raw: [],
    };
  },
  methods: {
    create_alert() {
      let _this = this;
      _this.loading = true;
      this.alert.user_id = liveAccountObject.get("user_id");
      this.alert.condition =
        this.alert.indicator2_type == "value"
          ? `indicator:5m:0:${this.alert.indicator1} ${this.alert.comparison} ${this.alert.indicator2_value}`
          : `indicator:5m:0:${this.alert.indicator1} ${this.alert.comparison} indicator:5m:0:${this.alert.indicator2}`;
      alert_func(
        "create_update",
        function(data, org) {
          notification(_this, org);
          _this.loading = false;
          _this.get_alert();
        },
        function(err, org) {
          notification(_this, org);
          _this.loading = false;
        },
        this.alert
      );
    },
    get_alert() {
      let _this = this;
      _this.loading = true;
      alert_func(
        "get",
        function(data, org) {
          notification(_this, org);
          _this.alert_history_raw = data;
          _this.alert_history = data.map(function(x) {
            return {
              name: x.name,
              symbol: x.symbol,
              condition: x.condition,
              status: x.status,
              _id: x._id,
            };
          });
          _this.loading = false;
        },
        function(err, org) {
          notification(_this, org);
          _this.loading = false;
        }
      );
    },
    onTableAction(action_type, value) {
      let _this = this;
      switch (action_type) {
        case "edit":
          this.alert = value;
          break;
        case "delete":
          alert_func(
            "delete",
            function(data, org) {
              notification(_this, org);
              _this.get_alert();
            },
            function(e, org) {
              notification(_this, org);
            },
            value
          );
      }
      confirm.log(value);
    },
  },
  mounted() {
    //liveAccountObject.addObserver(this.accountDataObs);
    this.get_alert();
  },
  destroyed() {
    // liveAccountObject.removeObserver(this.accountDataObs);
  },
  updated() {},
};
</script>
<style lang="scss">
.alert {
  .new {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    .ant-select-selection,
    input {
      border: 0;
      border-bottom: 1px dashed #11111120;
      background: transparent;
      border-radius: 0;
      width: auto;
      margin-right: 20px;
    }
    p {
      font-size: 16px;
      width: auto;
      padding-right: 10px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>
