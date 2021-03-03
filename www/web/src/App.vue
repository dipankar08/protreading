<template>
  <div id="app" class="d_theme">
    <Navigation class="nav" />
    <router-view class="main_container d_fullscreen" />
  </div>
</template>
<script>
import Navigation from "./helper/Navigation";
export default {
  components: {
    Navigation,
  },
};
</script>

<style lang="scss">
@import "common/d.scss";
.nav {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
}
.main_container {
  padding-top: 55px;
}
</style>
