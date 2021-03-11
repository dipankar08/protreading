<template>
  <div class="d_layout_row navigation_menu d_no_responsive">
    <router-link to="/dashboard">
      <p class="d_layout_row menu_item d_no_responsive" @click="section = 'screen'" :class="section == 'screen' ? 'active' : ''">
        <span class="mdi mdi-filter"></span>
        <span>Dashboard</span>
      </p>
    </router-link>
    <router-link to="/relate">
      <p class="d_layout_row menu_item d_no_responsive" @click="section = 'relate'" :class="section == 'screen' ? 'active' : ''">
        <span class="mdi mdi-filter"></span>
        <span>Relate</span>
      </p>
    </router-link>

    <router-link to="/screens">
      <p class="d_layout_row menu_item d_no_responsive" @click="section = 'screens'" :class="section == 'screens' ? 'active' : ''">
        <span class="mdi mdi-filter"></span>
        <span>Screen</span>
      </p>
    </router-link>
    <router-link to="/backtest">
      <p class="d_layout_row menu_item d_no_responsive" @click="section = 'backtest'" :class="section == 'backtest' ? 'active' : ''">
        <span class="mdi mdi-history"></span>
        <span>Test</span>
      </p>
    </router-link>
    <p class="d_layout_fill" />
    <router-link to="/settings">
      <p class="d_layout_row menu_item d_no_responsive" @click="section = 'settings'" :class="section == 'settings' ? 'active' : ''">
        <span class="mdi mdi-tune-variant"></span>
        <span>Settings</span>
      </p>
    </router-link>
    <!--
    <p class="d_layout_row menu_item" @click="section = 'analyst'" :class="section == 'analyst' ? 'active' : ''">
      <span class="mdi mdi-layers-triple"></span>
      <span>Analyst</span>
    </p>
    <p class="d_layout_row menu_item" @click="section = 'social'" :class="section == 'social' ? 'active' : ''">
      <span class="mdi mdi-signal-variant"></span>
      <span>Social</span>
    </p>
   -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      section: "",
    };
  },
};
</script>
<style scoped lang="scss">
.navigation_menu {
  height: 44px;
  background: #dd1070;
  color: white;
  left: 0;
  width: 100%;
  position: fixed;
  align-items: center;
  .mdi {
    font-size: 24px;
    margin-right: 10px;
  }
  .menu_item {
    margin: 0 auto;
    text-align: center;
    align-items: center;
    padding: 0px 10px;
    opacity: 0.8;
    cursor: pointer;
    color: white !important;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
