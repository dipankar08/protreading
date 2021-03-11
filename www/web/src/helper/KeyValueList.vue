<template>
  <div class="d_layout_col key_value_list">
    <p class="title" v-show="title.length > 0">{{ title }}</p>
    <div class="d_layout_row d_mb10" v-for="item in items" :key="item.key">
      <p class="key d_mr20">{{ item.key }}:</p>
      <p class="d_layout_fill value">{{ item.value }}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    items: Array, // {key:, value:}
  },
};
</script>

<style lang="scss" scoped>
.key_value_list {
  .value {
    text-align: right;
    justify-content: flex-end;
  }
}
</style>
