<template>
  <div class="inplaceedit">
    <a-input v-model="value1" :disabled="disabled">
      <a-tooltip slot="suffix" title="Click to Edit" @click="onEdit">
        <a-icon :type="disabled ? 'edit' : 'save'" style="color: rgba(0,0,0,.45)" />
      </a-tooltip>
    </a-input>
  </div>
</template>

<script>
export default {
  props: ["value"],
  data() {
    return {
      disabled: true,
      value1: this.value,
    };
  },
  watch: {
    value(newVal) {
      this.value1 = newVal;
    },
  },
  methods: {
    onEdit() {
      this.disabled = !this.disabled;
      if (this.disabled) {
        this.$emit("input", this.value1);
        this.$emit("onUpdate", this.value1);
      }
    },
  },
};
</script>

<style lang="scss">
.inplaceedit {
  .ant-input-disabled {
    background: transparent;
    border: transparent;
    color: black;
  }
}
</style>
