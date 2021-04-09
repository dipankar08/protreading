<template>
  <div class="d_layout_col responsive_container">
    <template>
      <div class="info_box filter_box d_layout_col">
        <div class="d_layout_row d_mb20 d_layout_center">
          <p class="d_mr20">Symbol:</p>
          <a-select class="d_layout_fill" mode="tags" placeholder="Please select columns" v-model="symbol_list">
            <a-select-option v-for="item in all_symbol_list" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>
        </div>
        <div class="d_layout_row d_mb20 d_layout_center">
          <p class="d_mr20">Indictors:</p>
          <a-select class="d_layout_fill" mode="tags" placeholder="Please select columns" v-model="indicator_list">
            <a-select-option v-for="item in all_indicator_list" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>
        </div>
        <div class="d_layout_row d_mb20 d_layout_center">
          <p class="d_mr20">Candle Type:</p>
          <a-select class="d_layout_fill" v-model="candle_type">
            <a-select-option v-for="item in all_candle_type" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>
        </div>
        <div class="d_layout_row d_mb20 d_layout_center">
          <p class="d_mr20">Duration:</p>
          <a-select class="d_layout_fill" placeholder="Please select columns" v-model="duration">
            <a-select-option v-for="item in all_duration_list" :key="item.key">{{ item.text }}</a-select-option>
          </a-select>
        </div>
        <a-button type="primary" @click="compare" :loading="loading_update">Scan</a-button>
      </div>
      <div class="info_box d_mb40">
        <apexchart v-for="item in series_list" :key="item.symbol" width="100%" :options="item.options" :series="item.data"></apexchart>
      </div>
    </template>
  </div>
</template>
<script>
import { localEvent } from "@/components/webdev/typescript/localEvent";
import { compare, notification } from "../helper/lib";
import { NIFTY_200, INDICATOR_LIST, SHORT_CANDLE_DURATION, CANDLE_TYPE_LIST } from "../helper/const";
export default {
  components: {},
  data() {
    return {
      all_symbol_list: NIFTY_200,
      all_indicator_list: INDICATOR_LIST,
      symbol_list: [],
      indicator_list: [],
      all_candle_type: CANDLE_TYPE_LIST,
      all_duration_list: SHORT_CANDLE_DURATION,
      duration: 30,
      candle_type: "1d",

      loading_update: false,
      alert: null,
      series_list: [],
    };
  },
  methods: {
    compare() {
      let _this = this;
      _this.loading_update = true;
      compare(
        this.symbol_list,
        this.indicator_list,
        this.candle_type,
        this.duration,
        function(data, orgData) {
          notification(_this, orgData);
          _this.loading_update = false;
          console.log(data);
          let options = {
            stroke: {
              width: 1,
              curve: "straight",
            },
            chart: {
              height: 240,
              id: "unique",
              group: "synced",
              toolbar: {
                show: false,
              },
            },
            title: {
              text: "CandleStick Chart - Category X-axis",
              align: "left",
            },
            tooltip: {
              enabled: true,
            },
            dataLabels: {
              enabled: false,
            },
            xaxis: {
              labels: {
                show: false,
              },
              tooltip: {
                enabled: false,
              },
            },
            fill: {
              type: "gradient",
            },
            yaxis: {
              tooltip: {
                //enabled: false,
              },
            },
          };
          let series_list = [];
          let time_list = data.time;
          // Loop over symbols
          for (var x of Object.keys(data)) {
            if (x == "time") continue;
            let series = {
              name: x,
              data: [],
            };
            if (_this.indicator_list.indexOf("candle") != -1) {
              // pass
              let ts = [];
              for (var i = 0; i < time_list.length; i++) {
                ts.push({
                  x: new Date(time_list[i]),
                  y: [data[x].open[i], data[x].high[i], data[x].low[i], data[x].close[i]],
                });
              }
              series.data.push({ name: x, data: ts });
              options.chart.type = "candlestick";
              options.xaxis.type = "datetime";
            } else {
              // loop over indicator
              for (var y of Object.keys(data[x])) {
                series.data.push({
                  name: y,
                  data: data[x][y],
                });
              }
            }

            // option:
            options.title.text = x;
            options.chart.id = x;
            series.options = JSON.parse(JSON.stringify(options));
            series_list.push(series);
          }
          _this.series_list = series_list;
        },
        function(err, data) {
          notification(_this, data);
          _this.loading_update = false;
          _this.alert = { msg: err, status: err };
        }
      );
    },
  },
};
</script>
<style scoped lang="scss"></style>
