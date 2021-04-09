<template>
  <div class="d_layout_col key_value_list">
    <p class="title" v-show="title.length > 0">{{ title }}</p>
    <div class="d_layout_row d_mb20 d_layout_center d_border_bottom" v-for="item in items" :key="item._id">
      <p class="key d_mr20">{{ item.key }}:</p>
      <p class="d_layout_fill value">{{ item.value }}</p>
      <p class="d_ml20 action" v-if="action_icon" @click="onClickAction(item._id)"><span class="mdi" :class="action_icon"></span></p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    items: Array, // {key:, value:}
    action_icon: String, // give the icon when you want to make some action like edit/delete
  },
  methods: {
    onClickAction(_id) {
      this.$emit("onClickAction", { _id: _id }); // when you click the action, this will trigger
    },
  },
};
</script>

<style lang="scss" scoped>
.key_value_list {
  .value {
    text-align: right;
    justify-content: flex-end;
  }
  .action {
    font-size: 20px;
    padding: 10px;
    cursor: pointer;
    opacity: 0.5;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
