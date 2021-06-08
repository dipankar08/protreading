<template>
  <div class="d_layout_col price_table">
    <div class="d_layout_row d_layout_space_between row" v-for="(item, index) in data" :key="index">
      <div class="d_layout_col d_mr10">
        <p class="name" @click="openChart(item.symbol)">{{ item.name }}</p>
        <p class="symbol">{{ item.symbol }}</p>
      </div>
      <div class="d_layout_col">
        <p class="close" v-bind:class="item.change > 0 ? 'green' : 'red'">{{ item.close }}</p>
        <p class="change" v-bind:class="item.change > 0 ? 'green' : 'red'">{{ item.change }}%</p>
      </div>
    </div>
  </div>
</template>

<script>
import { localEvent } from "@/components/webdev/typescript/localEvent";
export default {
  props: {
    data: Array, // {key:, value:}
  },
  methods: {
    openChart(symbol) {
      localEvent.notify("chart_dialog", symbol);
    },
  },
};
</script>

<style lang="scss" scoped>
.price_table {
  .row {
    padding: 15px 0;
    border-bottom: 1px solid #11111111;
    .name {
      color: #11111199;
      font-size: 15px;
      line-height: 1.5;
      &:hover {
        color: #dd0f70;
        cursor: pointer;
      }
    }
    .symbol {
      color: #11111144;
      font-size: 12px;
      line-height: 1.5;
    }
    .close {
      color: #11111199;
      font-size: 16px;
      line-height: 1.5;
      text-align: right;
    }
    .change {
      color: #11111166;
      font-size: 12px;
      line-height: 1.5;
      text-align: right;
    }
    .green {
      color: rgb(7, 148, 7);
    }
    .red {
      color: rgb(219, 38, 38);
    }
  }
}
</style>
