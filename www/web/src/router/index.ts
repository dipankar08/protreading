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
    path: "/backtest",
    name: "backtest",
    component: () => import("../screen/BackTestScreen.vue"),
  },
  {
    path: "/settings",
    name: "settings",
    component: () => import("../screen/SettingsScreen.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
