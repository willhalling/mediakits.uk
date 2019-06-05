<template>
  <header 
    :class="classes" 
    class="heading">
    <component :is="type">
      <span class="heading__prefix">{{ prefix }}</span>
      <slot/>
      <small 
        v-if="subheading" 
        class="heading__sub">{{ subheading }}</small>
    </component>
  </header>
</template>

<script>
export default {
  name: 'Heading',

  props: {
    prefix: {
      type: String
    },
    subheading: {
      type: String
    },
    type: {
      type: String,
      default: 'h1'
    },
    border: {
      type: [Boolean, Number],
      default: true
    },
    theme: {
      type: String
    }
  },

  computed: {
    classes() {
      return {
        [`heading--noBorder`]: this.border,
        [`heading--${this.theme}`]: this.theme
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';

.heading {
  font-weight: bold;
  margin: 0 0 1.25rem;
  padding: 0em;
  border-bottom: 1px solid $black;
  letter-spacing: 0.05em;
  line-height: 1;
  h1 {
    margin: 0 auto;
    padding: 1.25rem;
    max-width: $siteWidth;
  }
  &--noBorder {
    border: 0;
  }
  &__prefix {
    color: #666;
  }
  &__sub {
    font-size: 50%;
    font-weight: normal;
    color: #666;
  }
  &--dark {
    background-color: $black;
    h1,
    h2,
    h3 {
      color: $white;
    }
  }
}
</style>
