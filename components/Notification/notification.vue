<template>
  <div 
    :class="classes" 
    class="Notification">
    <div class="Notification__container">
      <p class="Notification__content">{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Notification',
  props: {
    type: {
      type: String,
      default: 'warning'
    },
    message: {
      type: String,
      required: true
    }
  },
  computed: {
    classes() {
      return {
        [`Notification__type--${this.type}`]: this.type
      }
    }
  },
  methods: {}
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';

.Notification {
  margin-bottom: $padding;
  &__container {
    color: $white;
    background-color: $black;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: $border-radius;
    padding: $padding;
    max-width: $siteWidth;
  }
  // Themes / types
  &__type {
    &--warning {
      color: $primary-background;
    }
  }
  &__content {
    font-weight: bold;
    font-family: $tertiaryFont;
    margin: 0;
  }
}
</style>
