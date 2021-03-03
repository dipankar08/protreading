import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "../screen/.vue";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: "/",
    name: "Landing",
    component: () => import("../screen/LandingScreen.vue"),
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: () => import("../screen/DashboardScreen.vue"),
  },
  {
    path: "/screen",
    name: "Screen",
    component: () => import("../screen/ScreenScreen.vue"),
  },
  {
    path: "/backtest",
    name: "BackTest",
    component: () => import("../screen/BackTestScreen.vue"),
  },
  {
    path: "/settings",
    name: "Settings",
    component: () => import("../screen/SettingsScreen.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
