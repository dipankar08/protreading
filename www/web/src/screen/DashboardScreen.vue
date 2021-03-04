<template>
  <div class="d_layout_col pane_home responsive_container">
    <div class="d_layout_row">
      <p class="header_section d_layout_fill">Home</p>
      <a-button type="primary" @click="refresh_count++"><span class="mdi mdi-reload d_mr10"></span>Refresh</a-button>
    </div>
    <div class="d_layout_row d_fullscreen group responsive">
      <div class="info_box" v-for="item in filter_id_list" :key="item">
        <FilterBox :filter_id="item" :refresh_count="refresh_count" />
      </div>
    </div>
  </div>
</template>
<script>
import FilterBox from "@/helper/FilterBox";
export default {
  components: {
    FilterBox,
  },
  data() {
    return {
      refresh_count: 0,
      filter_id_list: ["603ae151001537253e14d305", "603ae109001537253e14d2cc", "603ae42f001537253e14d44f", "603ae3bb001537253e14d43d"],
    };
  },
};
</script>
<style scoped lang="scss">
.pane_home {
  .group {
    flex-wrap: wrap;
    .info_box {
      height: 400px;
      margin: 30px 0;
      padding: 0px;
      &:only-child {
      }
    }
  }
}
</style>
