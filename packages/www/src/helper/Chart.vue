<template>
  <div class="d_layout_col">
    <div class="d_layout_row header d_layout_center">
      <p class="d_layout_fill">
        <span>{{ symbol }} </span>&#183;<span>{{ candle_type }} </span>&#183;<span>{{ duration }} </span>&#183;
      </p>
      <span class="mdi mdi-reload mdi_btn" @click="loadChart(true)"></span>
    </div>
    <img :src="img" v-show="!loading" />
    <content-placeholders v-show="loading">
      <content-placeholders-heading :img="true" />
      <content-placeholders-text :lines="3" />
    </content-placeholders>
  </div>
</template>
<script>
import { load_chart } from "./lib";
export default {
  props: {
    reload: Number, // trigger reload from outside
    symbol: String,
    candle_type: String,
    duration: Number,
    display_config: Object, // give the icon when you want to make some action like edit/delete
  },
  data() {
    return {
      loading: false,
      error: null,
      img: "",
    };
  },
  watch: {
    reload(newVal) {
      this.loadChart();
    },
    symbol(newVal) {
      this.loadChart();
    },
    candle_type(newVal) {
      this.loadChart();
    },
    duration(newVal) {
      this.loadChart();
    },
    display_config(newVal) {
      this.loadChart();
    },
  },
  methods: {
    loadChart(reload) {
      let _this = this;
      if (!this.symbol) {
        _this.error = "Please pass some symbol";
        return;
      }
      _this.loading = true;
      _this.error = null;
      let config = Object.assign({}, this.display_config);
      config.candle_type = this.candle_type || "1d";
      config.duration = this.duration || "10";
      load_chart(
        this.symbol,
        this.candle_type,
        this.duration,
        reload ? "1" : "0",
        function(data) {
          _this.loading = false;
          _this.error = null;
          _this.img = data;
        },
        function(error) {
          _this.error = error;
          _this.loading = false;
        }
      );
    },
  },
  mounted() {
    this.loadChart();
  },
};
</script>

<style scoped lang="scss">
.header {
  font-size: 14px;
  letter-spacing: 2px;
  opacity: 0.9;
  margin-bottom: 10px;
}
</style>
