<template>
  <div id="app" class="d_theme d_fullscreen grodok_treading d_responsive" :class="hide_nav ? 'hide_nav' : ''">
    <Navigation class="nav" />
    <router-view class="main_container d_fullscreen " />
  </div>
</template>
<script>
import Navigation from "./helper/Navigation.vue";
import { getCookie, setCookie } from "./common/helper.ts";
import { localEvent } from "./common/localEvent";
import { markLogin } from "./helper/lib";
export default {
  components: {
    Navigation,
  },
  data() {
    return {
      hide_nav: true,
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
            this.hide_nav = false;
          } else {
            this.$router.push({ name: "landing" }).catch(() => {});
            this.hide_nav = true;
            setCookie("auth", null);
          }
          break;
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
    .nav {
      display: none;
    }
    .main_container {
      padding: 0;
    }
  }
  .nav {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10;
  }
  .main_container {
    padding-top: 55px;
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
    &:hover {
      color: #dd1070;
      opacity: 1;
    }
  }
}
</style>
