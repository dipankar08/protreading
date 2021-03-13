<template>
  <div class="d_fullscreen d_layout_col console">
    <div class="bar d_layout_row d_layout_center">
      <a-select class="d_ml20" v-model="focus_group">
        <a-select-option v-for="item in focus_group_list" :key="item._id" :value="item.list">{{ item.name }}</a-select-option>
      </a-select>
      <a-select class="width_75 d_ml20" v-model="candle_type">
        <a-select-option v-for="item in CANDLE_TYPE_LIST" :key="item.key" :value="item.key">{{ item.text }}</a-select-option>
      </a-select>
      <a-select class="width_75 d_ml20" v-model="duration">
        <a-select-option v-for="item in SHORT_CANDLE_DURATION" :key="item" :value="item">{{ item }}</a-select-option>
      </a-select>

      <p class="d_layout_fill"></p>
      <span class="d_ml20"> Auto Refresh </span>
      <a-switch class="d_ml10" size="small" @change="onAutoRefreshChange" />
      <span class="mdi mdi-reload mdi_btn" hint="reload" @click="refresh_count++"></span>
      <span class="mdi mdi-close mdi_btn d_ml20" @click="openDashboard"></span>
    </div>
    <div class="body d_layout_fill d_layout_row">
      <div class="info_box holder" v-for="item in focus_group" :key="item">
        <chart :symbol="item" :candle_type="candle_type" :duration="duration" :display_config="display_config" :reload="refresh_count" />
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "../helper/Chart.vue";
import { DEFAULT_FOCUS_GROUP, CANDLE_TYPE_LIST } from "../helper/const";
import { liveAccountObject } from "../helper/lib";
export default {
  components: { Chart },
  data() {
    return {
      focus_group_list: liveAccountObject.get("focus_group") || DEFAULT_FOCUS_GROUP,
      CANDLE_TYPE_LIST: CANDLE_TYPE_LIST,
      SHORT_CANDLE_DURATION: ["14", "28", "45", "60"],
      // const
      candle_type: "1d",
      duration: 14,
      focus_group: DEFAULT_FOCUS_GROUP[0].list,
      chart_config: ["candle", "volume"],
      // config
      auto_refresh: null,
      refresh_count: 0,
    };
  },
  watch: {
    candle_type(newVal) {
      this.refresh_count++;
    },
  },
  methods: {
    onAutoRefreshChange(value) {
      console.log(value);
      let _this = this;
      if (value) {
        this.auto_refresh = setTimeout(function() {
          _this.refresh_count++;
        }, 1000);
      } else {
        clearTimeout(this.auto_refresh);
      }
    },
    openDashboard() {
      this.$router.push({ name: "dashboard" }).catch(() => {});
    },
    onFocusGroupChange() {},
  },
};
</script>

<style lang="scss" scoped>
.console {
  //background: #1d2126;
  color: #111111;
  .bar {
    color: white;
    background: #dd472c;
    width: 100%;
    height: 44px;
    position: fixed;
    top: 0;
    z-index: 1;
    //border-bottom: 1px solid #3f3b3b;
  }
  .mdi_btn {
    font-size: 27px;
    opacity: 1;
    padding: 10px;
  }
  .width_75 {
    width: 75px;
  }
  .body {
    padding-top: 45px;
    flex-wrap: wrap;
    .holder {
      width: calc(33% - 20px);
      padding: 10px;
      margin: 10px;
      flex-wrap: wrap;
    }
  }
}
</style>
