<script src="../../../mixins/adminMixin.js">
</script>
<template>
  <ul class="canvasStickers">
    <li
      v-for="(icon, index) in icons"
      :key="index"
      class="canvasStickers__item"
    >
      <a 
        v-scroll-to="'#header'" 
        href="" 
        @click="handleSvgClick(icon.name)">
        <simple-svg
          :filepath="icon.download_url"
          :fill="'#FFF'"
          :id="icon.name"
          :data-url="icon.download_url"
          :data-svg-id="icon.id"
          width="100px"
          height="100px"
        />
      </a>
      <button-cta
        v-if="admin"
        full
        theme="danger"
        @click="handleSvgRemove({ id: icon.id, name: icon.name } )"
      >
        Remove
      </button-cta>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'SvgStickers',
  props: {
    icons: {
      type: Array,
      required: true
    },
    admin: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    updateIcon(name) {
      const currentIconIndex = this.icons.findIndex(item => item.name === name)
      this.icons[currentIconIndex].added = true
      setTimeout(() => {
        this.icons[currentIconIndex].added = false
      }, 2000)
    },
    handleSvgClick(name) {
      this.updateIcon(name)
      this.$emit('addSvg', name)
    },
    handleSvgRemove(svg) {
      this.$emit('removeSvg', svg)
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/variables';
@import '../../../scss/_mixins.scss';

.canvasStickers {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  &__item {
    border: 1px solid $dark-grey;
    list-style: none;
    display: inline-block;
    width: calc(1 / 2 * 100% - (1 - 1 / 2) * #{$padding});
    text-align: center;
    box-sizing: border-box;
    margin-bottom: $padding;
    height: 100%;
    svg {
      padding: $padding;
    }
    @include media-query('small') {
      width: calc(1 / 3 * 100% - (1 - 1 / 3) * #{$padding});
    }
  }
  &__svg {
    padding: $padding / 2;
  }
}
</style>
