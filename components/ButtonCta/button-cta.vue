<template>
  <a 
    v-if="type === 'link'"
    :class="classes"
    :href="href"
    class="button"
    @click="onClick">
    <span 
      v-if="$slots.icon" 
      class="button__icon"><slot name="icon"/></span>
    <span 
      v-if="$slots.default" 
      class="button__text"><slot/></span>
  </a>
  <button 
    v-else
    :class="classes"
    :type="type"
    class="button"
    @click="onClick">
    <span 
      v-if="$slots.icon" 
      class="button__icon"><slot name="icon"/></span>
    <span 
      v-if="$slots.default" 
      class="button__text"><slot/></span>
  </button>
</template>

<script>
export default {
  name: 'ButtonCta',

  props: {
    text: {
      type: String
    },
    href: {
      type: String
    },
    type: {
      type: String,
      default: 'button'
    },
    full: {
      type: Boolean,
      default: false
    },
    icon: {
      type: String
    },
    disabled: {
      type: Boolean
    },
    added: {
      type: Boolean
    },
    fullHeight: {
      type: Boolean
    },
    round: {
      type: Boolean
    },
    theme: {
      type: String
    },
    noBorder: {
      type: Boolean,
      default: false
    },
    noRadius: {
      type: Boolean,
      default: false
    },
    radiusRight: {
      type: Boolean,
      default: false
    },
    pulse: {
      type: Boolean,
      default: false
    },
    active: {
      type: Boolean,
      default: false
    },
    imageUploader: {
      type: Boolean,
      default: false
    }
  },

  computed: {
    classes() {
      return {
        ['button--full']: this.full,
        ['button--left']: this.align,
        ['button--added']: this.added,
        ['button--disabled']: this.disabled,
        ['button--fullHeight']: this.fullHeight,
        [`button--theme--${this.theme}`]: this.theme,
        ['button--noBorder']: this.noBorder,
        ['button--noRadius']: this.noRadius,
        ['button--radiusRight']: this.radiusRight,
        ['button--round']: this.round,
        ['button--pulse']: this.pulse,
        ['button--active']: this.active,
        ['button--imageUploader']: this.imageUploader
      }
    }
  },

  methods: {
    onClick(event) {
      this.$emit('click', event)
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_colours.scss';
@import '../../scss/_mixins.scss';
@import '../../scss/typography.scss';

$button-added-color: $olive;
$button-download-color: #0dff92;
$button-danger-color: $scarlet;
$button-dark-color: $ebony;
$button-pulse-spacing: $padding * 1.5;
$button-pulse-timing: 1.5s;

.button {
  text-transform: uppercase;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  justify-content: center;
  border: 1px solid black;
  padding: $padding / 2;
  // padding-left: 0;
  letter-spacing: 0.094em;
  font-size: 1em;
  text-decoration: none;
  color: black;
  background-color: $white;
  cursor: pointer;
  transition: all $transition;
  border-radius: 0;
  box-sizing: border-box;
  text-align: center;
  font-family: $tertiaryFont;
  border: 1px solid $white;
  border-radius: $border-radius;
  width: 100%;
  font-weight: bold;

  &--round {
    border-radius: 50%;
    width: 64px;
    height: 64px;
    position: relative;
    .button__text {
      position: absolute;
      color: #535353;
      font-family: 'Roboto-Light';
      top: 72px;
    }
  }

  &--fullHeight {
    height: 100%;
  }

  &--disabled {
    cursor: not-allowed;
    pointer-events: none;
    opacity: 0.4;
  }

  &--noBorder {
    border: 0;
  }

  &--noRadius {
    border-radius: 0;
  }

  &--radiusRight {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }

  &--active {
    border-bottom-color: transparent;
    &:focus {
      outline: none;
    }
  }

  &--full {
    width: 100%;
  }

  &--pulse {
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.4);
    -webkit-animation: pulse $button-pulse-timing infinite cubic-bezier(0.66, 0, 0, 1);
    -moz-animation: pulse $button-pulse-timing infinite cubic-bezier(0.66, 0, 0, 1);
    -ms-animation: pulse $button-pulse-timing infinite cubic-bezier(0.66, 0, 0, 1);
    animation: pulse $button-pulse-timing infinite cubic-bezier(0.66, 0, 0, 1);
    &:hover {
      webkit-animation: none;
      -moz-animation: none;
      -ms-animation: none;
      animation: none;
    }
  }


  &--imageUploader {
    .button__text {
      font-size: $text-xxs;
      position: absolute;
      left: 50%;
      margin-left: $padding * 2;
    }
  }


  // Icons

  &__icon {
    display: flex;
    align-items: center;
  }

  &__icon,
  &__text {
    // padding-left: $padding / 2;
  }
  
  // Button themes

  &--theme--dark {
    background-color: $black;
    color: $white;
  }

  &--theme--light {
    background-color: $white;
    border: 1px solid $black;
    color: $button-dark-color;
  }

  &--theme--danger {
    background-color: $danger-button;
    color: $white;
  }

  &--theme--white-transparent {
    background-color: rgba(255, 255, 255, 0.75);
  }

  &--theme--transparent {
    background-color: transparent;
    color: $white;
  }

  &--theme--cta {
    background-color: $black;
  }

  &--theme--danger {
    background-color: $button-danger-color;
  }

  // End themes

  // Start CSS animations

  @-webkit-keyframes pulse {
    to {
      box-shadow: 0 0 0 $button-pulse-spacing rgba(0, 0, 0, 0);
    }
  }
  @-moz-keyframes pulse {
    to {
      box-shadow: 0 0 0 $button-pulse-spacing rgba(0, 0, 0, 0);
    }
  }
  @-ms-keyframes pulse {
    to {
      box-shadow: 0 0 0 $button-pulse-spacing rgba(0, 0, 0, 0);
    }
  }
  @keyframes pulse {
    to {
      box-shadow: 0 0 0 $button-pulse-spacing rgba(0, 0, 0, 0);
    }
  }
}
</style>
