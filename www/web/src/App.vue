<template>
  <div id="app" class="d_theme d_fullscreen grodok_treading d_responsive d_border_bottom" :class="hide_nav ? 'hide_nav' : ''">
    <Navigation class="nav" />
    <router-view class="main_container" />
    <div class="footer d_layout_col d_layout_center_all d_p20" :class="hide_nav ? 'hide_nav' : ''">
      <p class="d_mb20 responsive_container d_text_align_center">
        Price Data sourced from NSE feed, price updates are near real-time, unless indicated. We used AI amd machine learning to predict the market.
        Technical/Fundamental Analysis Charts & Tools provided for research purpose. Please be aware of the risk's involved in trading & seek
        independent advice, if necessary.
      </p>
      <p class="dmb20">Protreading.com .@2020 All right reserved.</p>
      <a href="https://dev.api.grodok.com:5000/clearcache"> click to clear the cache </a>
    </div>
    <a-modal :visible="chart_dialog_visible" title="Quick chart" :footer="null" @cancel="chart_dialog_visible = false" centered>
      <div class="d_layout_col">
        <chart candle_type="1d" duration="30" :symbol="chart_dialog_symbol" />
      </div>
    </a-modal>
  </div>
</template>
<script>
import Navigation from "./helper/Navigation.vue";
import { getCookie, setCookie } from "./common/helper.ts";
import { localEvent } from "./common/localEvent";
import { markLogin } from "./helper/lib";
import Chart from "./helper/Chart.vue";
export default {
  components: {
    Navigation,
    Chart,
  },
  data() {
    return {
      hide_nav: true,
      chart_dialog_visible: false,
      chart_dialog_symbol: null,
    };
  },
  methods: {
    handleLocalEvent(type, data) {
      switch (type) {
        case "auth":
          if (data) {
            this.$router.push({ name: "dashboard" }).catch(() => {});
            setCookie("auth", data, "json");
            markLogin(data.user_id);
          } else {
            this.$router.push({ name: "landing" }).catch(() => {});
            setCookie("auth", null);
          }
          break;
        case "chart_dialog":
          this.chart_dialog_visible = true;
          this.chart_dialog_symbol = data;
          break;
      }
    },
  },
  watch: {
    $route(to, from) {
      if (to.name == "landing" || to.name == "console") {
        this.hide_nav = true;
      } else {
        this.hide_nav = false;
      }
    },
  },
  created() {
    localEvent.notify("auth", getCookie("auth", "json"));
  },
  mounted() {
    localEvent.addObserver(this.handleLocalEvent);
  },
  destroyed() {
    localEvent.removeObserver(this.handleLocalEvent);
  },
  updated() {
    let url = new URL(window.location.href);
    let res = {};
    for (let key of url.searchParams.keys()) {
      res[key] = url.searchParams.get(key);
    }
    this.$router.push({ path: window.location.pathname.replace("/", ""), query: res }).catch(() => {});
    console.log("updated");
  },
};
</script>

<style lang="scss">
@import "common/d.scss";
@import "common/ant_override.scss";
.grodok_treading {
  &.hide_nav {
    .nav,
    .footer {
      display: none;
    }
    .main_container {
      padding: 0;
      height: 100%;
    }
  }

  .main_container {
    padding-left: 70px;
  }
  .active {
    color: #dd1070;
  }
  .header_section {
    color: #dd1070;
    font-size: 18px;
  }
  .header_in_box {
    color: #dd1070;
    font-size: 13.5px;
  }
  .header_out_box {
    margin-bottom: 0px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 1px;
    opacity: 0.6;
    font-weight: bold;
  }
  .mdi_btn {
    font-size: 18px;
    margin: 0px 5px;
    opacity: 0.5;
    cursor: pointer;
    &:hover {
      color: #dd1070;
      opacity: 1;
    }
  }
  .page_header_block {
    text-align: center;
    justify-content: center;
    align-items: center;
    margin-bottom: 20px;
    .header {
      font-weight: 700;
      font-size: 35px;
      color: #111111;
      line-height: 1;
      padding-bottom: 10px;
    }
    .subheader button {
      font-size: 14px;
    }
  }
}
</style>
