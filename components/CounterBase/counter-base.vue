<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="`0 0 ${viewboxWidth} ${viewboxHeight}`"
    :aria-label="iconName"
    xmlns="http://www.w3.org/2000/svg"
    role="presentation"
  >
    <counter-years
      v-if="isYearCounter"
      :colours="colours"
      :hightlighted-circle="hightlightedCircle" />
    <counter-days
      v-if="isDayCounter"
      :colours="colours"
      :hightlighted-circle="hightlightedCircle" />

    <counter-months
      v-else-if="isMonthCounter"
      :colours="colours"
      :hightlighted-circle="hightlightedCircle" />
  </svg>
</template>

<script>
import { ageMixin } from '~/mixins/ageMixin'

export default {
  name: 'CounterBase',
  mixins: [ageMixin],
  props: {
    colours: {
      type: Object,
      default: () => {
        return {
          primary: '#FFF',
          inActiveColour: '#252944'
        }
      }
    },
    iconName: {
      type: String,
      default: 'box'
    },
    width: {
      type: [Number, String],
      default: 523
    },
    height: {
      type: [Number, String],
      default: 66
    },
    viewboxWidth: {
      type: [Number, String],
      default: 523
    },
    viewboxHeight: {
      type: [Number, String],
      default: 66
    },
    iconColor: {
      type: String,
      //default: 'currentColor'
      default: '#000000'
    },
    activeColour: {
      type: String,
      required: true
    },
    age: {
      type: Object,
      default: () => {
        return {
          years: 0,
          months: 0,
          days: 0
        }
      }
    }
  },
  methods: {
    hightlightedCircle(index) {
      // if no years or months then display months
      if (this.isDayCounter) {
        return index === this.day
          ? this.activeColour
          : this.colours.inActiveColour
      }
      // if no years then display months
      if (this.isMonthCounter) {
        return index === this.month
          ? this.activeColour
          : this.colours.inActiveColour
      }
      // if 1 year or older display years
      if (this.isYearCounter) {
        return index === this.year
          ? this.activeColour
          : this.colours.inActiveColour
      }
    }
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
