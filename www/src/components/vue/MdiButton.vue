<template>
  <v-tooltip :title="hint" class="mdi_icon">
    <span class="mdi mdi_btn" :class="`${icon} ${size}`"></span>
  </v-tooltip>
</template>
<script>
export default {
  props: {
    icon: String,
    hint: String, // {key:, value:}
    size: String, // small, medium, large
  },
};
</script>
<style scoped lang="scss">
.mdi_icon {
  .mdi {
    padding: 10px;
    margin: 0px;
  }
}
</style>
