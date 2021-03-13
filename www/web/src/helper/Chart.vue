<template>
  <div class="d_layout_col">
    <div class="d_layout_row"></div>
    <img :src="img" />
  </div>
</template>
<script>
import { load_chart } from "./lib";
export default {
  props: {
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
  methods: {
    loadChart() {
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

<style scoped></style>
