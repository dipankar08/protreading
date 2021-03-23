<template>
  <div class="d_layout_col pane_home d_m10">
    <div class="d_layout_row hide">
      <a-button type="primary" @click="refresh_count++"><span class="mdi mdi-reload d_mr10"></span>Refresh</a-button>
    </div>

    <div class="d_layout_row d_fullscreen d_layout_wrap tables">
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
      <div class="info_box"><simple-table :data="table_data" title="Sample Table" /></div>
    </div>
  </div>
</template>
<script>
//import FilterBox from "@/helper/FilterBox";
import SimpleTable from "@/common/vue/SimpleTable.vue";
export default {
  components: {
    //FilterBox,
    SimpleTable,
  },
  data() {
    return {
      table_data: [
        { name: "dip", roll: 1 },
        { name: "dip", roll: 1 },
        { name: "dip", roll: 1 },
        { name: "dip", roll: 1 },
        { name: "dip", roll: 1 },
      ],
      refresh_count: 0,
    };
  },
};
</script>
<style scoped lang="scss">
.pane_home {
  .tables {
    .info_box {
      height: 400px;
      width: calc(25% - 20px);
      margin: 10px;
      padding: 0px;
    }
  }
}
</style>
