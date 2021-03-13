import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../screen/.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "landing",
    component: () => import("../screen/LandingScreen.vue"),
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: () => import("../screen/DashboardScreen.vue"),
  },
  {
    path: "/screen",
    name: "screen",
    component: () => import("../screen/ScreenScreen.vue"),
  },
  {
    path: "/screens",
    name: "screens",
    component: () => import("../screen/BrowseScreenScreen.vue"),
  },
  {
    path: "/backtest",
    name: "backtest",
    component: () => import("../screen/BackTestScreen.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../screen/SettingsScreen.vue"),
  },
  {
    path: "/relate",
    name: "relate",
    component: () => import("../screen/RelateScreen.vue"),
  },
  {
    path: "/console",
    name: "console",
    component: () => import("../screen/ConsoleScreen.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
