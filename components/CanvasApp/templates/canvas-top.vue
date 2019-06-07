<template>
  <div class="CanvasTop">
    <div
      class="CanvasTop__container">
      <div class="gt-flex gt-justify-content-space-between">
        <div class="gt-width-full gt-max-width-72">
          <button-cta
            :active="nav.text.open"
            full-height
            theme="dark"
            no-radius
            @click="openEditText"
          >
            <svg-base
              slot="icon"
              icon-name="SvgTextIcon"
              width="32"
              height="26"
              colour="#FFF"
            >
              <component is="SvgTextIcon"/>
            </svg-base>
          </button-cta>
        </div>
        <div class="gt-width-full">
          <button-cta
            aria-label="Change Background"
            class="gt-border-left-none gt-border-right-none"
            full
            full-height
            no-radius
            image-uploader
            :disabled="numberOfImages > 5"
            theme="dark"
            @click="triggerParentBackgroundClick"
          >
            <svg-base
              slot="icon"
              :width="36"
              :height="34"
              :viewbox-width="100"
              :viewbox-height="80"
              icon-name="SvgFrameLandscape"
              colour="#FFF"
            >
              <component is="SvgFrameLandscape"/>
            </svg-base>
            {{numberOfImages}}/6
          </button-cta>
        </div>
        <div class="gt-width-full gt-max-width-72">
          <button-cta
            :active="colours.open"
            aria-label="Edit Date"
            full-height
            no-radius
            theme="dark"
            @click="openEditColour"
          >
            <svg-base
              slot="icon"
              :viewbox-width="100"
              :viewbox-height="100"
              icon-name="SvgColourWheel"
              width="32"
              height="32"
              colour="#FFF"
              no-fill
            >
              <component is="SvgColourWheel"/>
            </svg-base>
          </button-cta>
        </div>
      </div>
      <transition-expand>
        <div
          v-if="nav.text.open"
          class="CanvasTop__edit"
        >
          <textarea
            v-model="text.value"
            :style="textareaStyles"
            class="CanvasTop__field"
            type="text"
            name="ageText"
            @input="onInput($event.target.value)"/>
        </div>
        <div 
          v-if="canvasData && colours.open"
          class="CanvasTop__colours">
          <color-picker
            v-model="colours.value"
            :selected="colours.value"
            :colors="constants.COLOURS"
            name="Colour"
            @input="updateColour"
          />
        </div>
      </transition-expand>
    </div>
  </div>
</template>

<script>
import COLOURS from '~/constants/colours'
import { mapGetters } from 'vuex'

export default {
  name: 'CanvasTop',
  props: {
    canvasData: {
      type: Object,
      required: true
    },
    nav: {
      type: Object,
      required: true
    },
    numberOfImages: {
      type: Number,
      required: false
    },
    font: {
      type: String,
      defaukt: ''
    }
  },
  data() {
    return {
      text: {
        open: false,
        value: ''
      },
      colours: {
        value: '',
        open: false
      },
      constants: {
        ...COLOURS
      }
    }
  },
  computed: {
    ...mapGetters({
      age: 'user/age'
    }),
    textareaStyles() {
      return {
        fontFamily: this.font ? this.font : null
      }
    }
  },
  mounted() {
    this.colours.value = this.canvasData.style.colour
    this.text.value = this.canvasData.style.text
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
    openEditColour() {
      this.text.open = false
      this.colours.open = !this.colours.open
      this.updateColour()
    },
    openEditText() {
      if (this.nav.text.open) {
        this.$store.commit('global/canvasNavClose', 'text')
      } else {
        this.$store.commit('global/canvasNavOpen', 'text')
      }
    },
    triggerParentBackgroundClick() {
      this.$emit('on-background-click')
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

.CanvasTop {
  margin: 0 auto;
  max-width: $siteWidth;

  @include media-query('medium') {
    // padding: 0 $padding;
  }

  &__edit {
    background: $black;
    border: 1px solid $white;
    border-top-color: $black;
  }
  &__field {
    background-color: transparent;
    border: 0;
    color: $white;
    font-size: $text-m;
    padding: $padding;
    overflow: hidden;
    width: 100%;
    height: 100%;
  }
}

// Desktop styles
@include media-query('small') {
  .CanvasTop {
    // padding-top: $padding;
  }
}
</style>
