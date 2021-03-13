<template>
  <div class="d_fullscreen d_layout_col console">
    <div class="bar d_layout_row d_layout_center">
      <a-select class="focus_group d_ml20" v-model="focus_group">
        <a-select-option v-for="item in focus_group_list" :key="item._id" :value="item.list">{{ item.name }}</a-select-option>
      </a-select>
      <a-select class="focus_group d_ml20" mode="multiple" v-model="chart_config">
        <a-select-option v-for="item in CHART_DISPLAY_CONFIG" :key="item.key" :value="item.key">{{ item.text }}</a-select-option>
      </a-select>
      <a-select class="focus_group d_ml20" v-model="candle_type">
        <a-select-option v-for="item in CANDLE_TYPE_LIST" :key="item.key" :value="item.key">{{ item.text }}</a-select-option>
      </a-select>
      <a-select class="focus_group d_ml20" v-model="duration">
        <a-select-option v-for="item in SHORT_CANDLE_DURATION" :key="item.key" :value="item.key">{{ item.text }}</a-select-option>
      </a-select>
      <p class="d_layout_fill"></p>
      <span class="mdi mdi-close mdi_btn" @click="openDashboard"></span>
    </div>
    <div class="body d_layout_fill d_layout_row">
      <div class="info_box holder" v-for="item in focus_group" :key="item">
        <chart :symbol="item" :candle_type="candle_type" :duration="duration" :display_config="display_config" />
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "../helper/Chart.vue";
import { DEFAULT_FOCUS_GROUP, CHART_DISPLAY_CONFIG, CANDLE_TYPE_LIST, SHORT_CANDLE_DURATION } from "../helper/const";
export default {
  components: { Chart },
  data() {
    return {
      focus_group_list: DEFAULT_FOCUS_GROUP,
      CANDLE_TYPE_LIST: CANDLE_TYPE_LIST,
      SHORT_CANDLE_DURATION: SHORT_CANDLE_DURATION,
      CHART_DISPLAY_CONFIG: CHART_DISPLAY_CONFIG,
      // const
      candle_type: "1d",
      duration: 30,
      focus_group: DEFAULT_FOCUS_GROUP[0].list,
      chart_config: ["candle", "volume"],
    };
  },
  methods: {
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
    //border-bottom: 1px solid #3f3b3b;
  }
  .mdi_btn {
    font-size: 27px;
    opacity: 1;
    padding: 10px;
  }
  .focus_group {
    width: 200px;
  }
  .body {
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
