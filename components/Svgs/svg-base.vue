<template>
  <svg 
    :width="width"
    :height="height"
    :viewBox="`0 0 ${viewboxWidth} ${viewboxHeight}`"
    :aria-label="iconName"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
  >
    <!-- <title :id="iconName" lang="en">{{ iconName }}</title> -->
    <g :fill="!noFill ? colour : null">
      <slot />
    </g>
  </svg>
</template>

<script>
export default {
  name: 'SvgBase',
  props: {
    colour: {
      type: String,
      default: '#FFFFFF'
    },
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 18
    },
    height: {
      type: [Number, String],
      default: 18
    },
    viewboxWidth: {
      type: [Number, String],
      default: 100
    },
    viewboxHeight: {
      type: [Number, String],
      default: 100
    },
    iconColor: {
      type: String,
      //default: 'currentColor'
      default: '#000000'
    },
    noFill: {
      type: Boolean,
      default: false
    },
  }
}
</script>

<style>
svg {
  display: inline-block;
  vertical-align: baseline;
  margin-bottom: -2px; /* yes, I'm that particular about formatting */
}
</style>
