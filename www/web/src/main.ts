import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import VueApexCharts from "vue-apexcharts";

Vue.use(Antd);

Vue.use(VueApexCharts);
Vue.component("apexchart", VueApexCharts);

Vue.config.productionTip = false;
(window as any).vue = new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
