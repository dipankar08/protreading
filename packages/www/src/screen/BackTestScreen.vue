<template>
  <div class="d_fullscreen d_layout_row">
    <div class="d_layout_col left">
      <p class="box_header">Back Test Rule</p>
      <div class="info_box d_mb20 filter d_layout_col">
        <a-alert info message="BackTest allows you test staregies for a given stock. Please answer the below question to perform back test"></a-alert>
        <p class="header_in_box d_mt20">1) Which Stock is under the test?</p>
        <a-select :default-value="symbol[0]" class="d_mt20" v-model="symbol">
          <a-select-option v-for="item in symbol_list" :key="item.key">
            {{ item.text }}
          </a-select-option>
        </a-select>
        <p class="header_in_box d_mt20 ">2) When you would buy?</p>
        <ScanParser filter_id="backtest_buy_filter" class="d_layout_fill d_mt20" @OnChange="OnChangeFilter1" />
        <p class="header_in_box d_mt20">3) When you would sell?</p>
        <ScanParser filter_id="backtest_sell_filter" class="d_layout_fill d_mt20" @OnChange="OnChangeFilter2" />
        <p class="header_in_box d_mt20">4) What candle you would like to consider?</p>
        <a-select :default-value="candle_type_list[0].key" class="d_mt20" v-model="candle_type">
          <a-select-option v-for="item in candle_type_list" :key="item.key">{{ item.text }}</a-select-option>
        </a-select>
        <p class="header_in_box d_mt20">5) What duration you want to consider?</p>
        <a-select :default-value="duration[0].key" class="d_mt20" v-model="duration">
          <a-select-option v-for="item in duration_type_list" :key="item.key">
            {{ item.text }}
          </a-select-option>
        </a-select>
        <a-button type="primary" class="d_mt20" @click="startTest">Start the back test now</a-button>
      </div>
    </div>
    <div class="d_layout_col right d_layout_fill">
      <p class="box_header">Profit/Loss Summary</p>
      <div class="info_box d_layout_col"></div>
      <p class="box_header">Order Book</p>
      <div class="info_box d_layout_col d_layout_fill">
        <a-alert class="d_mb20" type="error" :message="error" banner v-show="error != null" />
        <a-table d_fullwidth class="d_layout_fill" :columns="columns" :data-source="order_book" bordered :loading="loading"> </a-table>
      </div>
    </div>
  </div>
</template>
<script>
import ScanParser from "../helper/ScanParser";
import { perform_back_test, notification } from "../helper/lib";
import { DURATION_TYPE_LIST, CANDLE_TYPE_LIST, NIFTY_200 } from "../helper/const";
export default {
  components: {
    ScanParser,
  },
  data() {
    return {
      symbol: "TCS",
      entry_rule: "",
      exit_rule: "",
      duration: "180",
      candle_type: "1d",

      symbol_list: NIFTY_200,
      duration_type_list: DURATION_TYPE_LIST,
      candle_type_list: CANDLE_TYPE_LIST,

      error: null,
      loading: false,
      order_book: [],
      columns: [
        {
          title: "SL",
          dataIndex: "sl",
        },
        {
          title: "BuyDate",
          dataIndex: "buy_date",
        },
        {
          title: "Buy Price",
          dataIndex: "buy_price",
        },
        {
          title: "Sell Date",
          dataIndex: "sell_date",
        },
        {
          title: "Sell price",
          dataIndex: "sell_price",
        },
        {
          title: "Wait time",
          dataIndex: "cooling_period",
        },
        {
          title: "Return (%)",
          dataIndex: "per_change",
        },
      ],
    };
  },
  methods: {
    OnChangeFilter1(value) {
      console.log(value);
      this.entry_rule = value;
    },
    OnChangeFilter2(value) {
      console.log(value);
      this.exit_rule = value;
    },
    startTest() {
      let _this = this;
      this.loading = true;
      this.error = null;
      perform_back_test(
        this.symbol,
        this.candle_type,
        this.duration,
        this.entry_rule,
        this.exit_rule,
        function(data, org) {
          notification(_this, org);
          _this.order_book = data.order_book;
          _this.loading = false;
          _this.error = null;
        },
        function(error, org) {
          notification(_this, org);
          console.log(error);
          _this.loading = false;
          _this.error = error;
          _this.order_book = [];
        }
      );
    },
  },
};
</script>
<style scoped lang="scss">
.left {
  width: 500px;
  padding: 20px 15px;
}
.right {
  padding: 20px 30px;
}
.box_header {
  margin-bottom: 0px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 1px;
  opacity: 0.6;
  font-weight: bold;
}
.info_box {
  &.filter {
    min-height: 400px;
  }
  &.suggestion {
    min-height: 400px;
  }
  &.result {
    height: calc(100% - 80px);
  }
}
.header_in_box {
  font-size: 13.5px;
  color: #1890ff;
}
.d_fullwidth {
  width: 100%;
}
</style>
