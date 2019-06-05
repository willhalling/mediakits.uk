<template>
  <div class="GenerateImage container gt-flex gt-align-items-center gt-justify-content-space-between">
    <progress-nav
      :step="step"
      @progress-next="nextStep"/>
      <!--
    <button-cta
      v-scroll-to="'#header'"
      aria-label="Back to top"
      theme="light"
      round
    >
      <svg-base
        slot="icon"
        :viewbox-width="32"
        :viewbox-height="20"
        icon-name="SvgUpArrow"
        width="32"
        height="32"
        colour="#000"
      >
        <component is="SvgUpArrow"/>
      </svg-base>
    </button-cta>
    <button-cta
      aria-label="Save Your Image"
      type="submit"
      theme="cta"
      round
      no-border
      @click.prevent="handleGenerateImage"
    >
      <svg-base
        slot="icon"
        :viewbox-width="20"
        :viewbox-height="32"
        :width="32"
        :height="32"
        icon-name="SvgRightArrow"
        colour="#000"
      >
        <component is="SvgRightArrow" />
      </svg-base>
    </button-cta>
    -->
  </div>
</template>

<script>
export default {
  name: 'GenerateImage',
  props: {
    image: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    handleGenerateImage() {
      this.$emit('onGenerateImage')
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/_variables.scss';
@import '../../../scss/_mixins.scss';
.GenerateImage {
  margin: $padding * 2 auto;
  padding-bottom: $padding * 3;
  &__field {
    margin: $padding $padding 0 80px;
    @include media-query('medium') {
      max-width: 50%;
    }
  }
  &__privacyText {
    margin: 0 auto;
    max-width: 600px;
    p {
      margin-bottom: $padding / 2;
    }
    a {
      color: $white;
      text-decoration: none;
    }
  }
}
</style>
