<template>
  <span style="display: flex;">
    <img
      :width="width" 
      :height="height" 
      class="logo"
      alt="Baby By Month"
      src="../../assets/logo.svg">
  </span>
</template>

<script>
export default {
  name: 'Logo',
  props: {
    width: {
      type: Number,
      default: 52
    },
    height: {
      type: Number,
      default: 22
    }
  },
  data: () => ({}),
  mounted() {}
}
</script>

<style lang="scss">
.logo {
}
</style>
