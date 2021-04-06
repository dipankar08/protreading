<template>
  <div class="d_layout_col pane_home responsive_container">
    <div class="d_layout_row hide">
      <a-button type="primary" @click="refresh_count++"><span class="mdi mdi-reload d_mr10"></span>Refresh</a-button>
    </div>
    <div class="d_layout_col page_header_block">
      <p class="header">Home</p>
      <div class="d_layout_row subheader">
        <a-button type="link" href="#market"> Market Overview</a-button>
        <a-button type="link" href="#leader"> Leader board</a-button>
        <a-button type="link" href="#trends"> Market Trends</a-button>
        <a-button type="link" href="#vola"> Volatility Trends</a-button>
        <a-button type="link" href="#technical"> Technical Trends</a-button>
        <a-button type="link" href="#all_stocks"> All Stocks</a-button>
      </div>
    </div>
    <p class="header_out_box" id="market">Market Overview</p>
    <div class="info_box d_layout_row d_layout_equal d_responsive">
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Top Gainer</p>
        <price-table :data="summary.top_gainer.data" v-if="summary.top_gainer" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Top Looser</p>
        <price-table :data="summary.top_looser.data" v-if="summary.top_looser" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Top Active</p>
        <price-table :data="summary.top_active.data" v-if="summary.top_active" />
      </div>
    </div>

    <p class="header_out_box" id="leader">Leader board</p>
    <div class="info_box d_layout_row d_layout_equal">
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Only Buyer</p>
        <price-table :data="summary.only_buyer.data" v-if="summary.only_buyer" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Only Seller</p>
        <price-table :data="summary.only_seller.data" v-if="summary.only_seller" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">52 Week High</p>
        <price-table :data="summary.week_52_high.data" v-if="summary.week_52_high" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">52 Week Low</p>
        <price-table :data="summary.week_52_low.data" v-if="summary.week_52_low" />
      </div>
    </div>

    <p class="header_out_box" id="trends">Market Trends</p>
    <div class="info_box d_layout_row d_layout_equal">
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">3 days uptrend</p>
        <price-table :data="summary.uptrend_3_days.data" v-if="summary.uptrend_3_days" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">3 days downtread</p>
        <price-table :data="summary.downtrend_3_days.data" v-if="summary.downtrend_3_days" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Overbought</p>
        <price-table :data="summary.overbought.data" v-if="summary.overbought" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">OverSold</p>
        <price-table :data="summary.oversold.data" v-if="summary.oversold" />
      </div>
    </div>

    <p class="header_out_box" id="vola">Volatility Trends</p>
    <div class="info_box d_layout_row d_layout_equal">
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Top Volume</p>
        <price-table :data="summary.high_volume.data" v-if="summary.high_volume" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">High Low Gap</p>
        <price-table :data="summary.high_low_gap.data" v-if="summary.high_low_gap" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">ATR Analysis</p>
        <price-table :data="summary.avarage_true_range.data" v-if="summary.avarage_true_range" />
      </div>
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Normalized ATR</p>
        <price-table :data="summary.normalized_avarage_true_range.data" v-if="summary.normalized_avarage_true_range" />
      </div>
    </div>

    <p class="header_out_box" id="technical">Trend Reversal(Down to Up)</p>
    <div class="info_box d_layout_row d_layout_equal">
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Parabolic SAR Reversal</p>
        <price-table :data="summary.psar_up.data" v-if="summary.psar_up" />
      </div>
    </div>

    <p class="header_out_box">Trend Reversal(Up to Down)</p>
    <div class="info_box d_layout_row d_layout_equal">
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">Parabolic SAR Reversal</p>
        <price-table :data="summary.psar_down.data" v-if="summary.psar_down" />
      </div>
    </div>

    <p class="header_out_box" id="all_stocks">All_Data</p>
    <div class="info_box d_layout_row d_layout_equal">
      <div class="d_layout_col info_box_holder">
        <p class="header_in_box">All Data</p>
        <price-table :data="summary.all_data.data" v-if="summary.all_data" />
      </div>
    </div>
    <p class="last_update"><b>Note: </b>{{ last_update }}</p>
  </div>
</template>
<script>
import PriceTable from "../common/vue/PriceTable.vue";
import { get_scan_for_id, get_summary, notification } from "../helper/lib";
//import FilterBox from "@/helper/FilterBox";
// import SimpleTable from "@/common/vue/SimpleTable.vue";
export default {
  components: {
    PriceTable,
    //FilterBox,
    //SimpleTable,
  },
  data() {
    return {
      refresh_count: 0,
      last_update: "We don't know the last update",
      summary: {
        top_gainer: { data: [] },
        top_looser: { data: [] },
        top_active: { data: [] },
        only_buyer: { data: [] },
        only_seller: { data: [] },
        week_52_high: { data: [] },
        week_52_low: { data: [] },
      },
    };
  },
  mounted() {
    let _this = this;
    get_summary(
      function(data, org) {
        notification(_this, org);
        console.log(data);
        _this.summary = data;
        _this.last_update = Object.keys(org.data_timestamp)
          .map(function(x) {
            return `${x} data updated on ${org.data_timestamp[x]}.  `;
          })
          .join("");
      },
      function(err, org) {
        notification(_this, org);
      }
    );
  },
};
</script>
<style scoped lang="scss">
.pane_home {
  .last_update {
    color: #ef6464;
    font-size: 12px;
  }
  .info_box {
    padding: 0px;
    .info_box_holder {
      padding: 20px;
      &:nth-child(even) {
        //background-image: linear-gradient(-20deg, #fc6076 0%, #ff9a44 100%);
      }
      &:nth-child(odd) {
        //background-image: linear-gradient(-225deg, #fffeff 0%, #d7fffe 100%);
      }
      .header_in_box {
        font-size: 18px;
        color: black;
        padding-bottom: 20px;
      }
    }
  }
}
</style>
