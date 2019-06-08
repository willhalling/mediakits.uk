<template>
  <div class="CanvasEdit">
    <div
      class="CanvasEdit__container">
      Canvas Edit
    </div>

  </div>
</template>

<script>
import COLOURS from '~/constants/colours'
import { mapGetters } from 'vuex'

export default {
  name: 'CanvasEdit',
  props: {
    websiteData: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {
    //this.colours.value = this.canvasData.style.colour
    //this.text.value = this.canvasData.style.text
  },
  methods: {
    onInput(value) {
      if (!value) {
        return
      }
      // Trigger Vue Reactivity to update theme object
      this.canvasData.style = {
        ...this.canvasData.style,
        text: value
      }
    },
    updateColour(value, type) {
      if (!value) {
        return
      }
      // Trigger Vue Reactivity to update theme object
      this.canvasData.style = {
        ...this.canvasData.style,
        colour: value
      }
      // If user clicks on sub colour4, close.
      if (type === 'variation') {
        this.colours.open = false
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/variables';
@import '../../../scss/layout';
@import '../../../scss/_mixins.scss';

.CanvasEdit {
}

// Desktop styles
@include media-query('small') {
  .CanvasEdit {
  }
}
</style>
