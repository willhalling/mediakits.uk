<template>
  <ul
    id="slider"
    class="CanvasSlider CanvasSlider__list CanvasSlider__list--full">
    <li
      v-scroll-to="'#top'"
      v-for="(theme, index) in formattedThemes"
      :key="index"
      :class="classes(theme.id)"
      class="CanvasSlider__item"
      @click="triggerThemeChange(theme.id, index)"
    >
      <canvas-container
        v-show="theme"
        ref="canvasContainer"
        :canvas-id="theme.id"
        :theme="theme"
        :image="userImage"
        :canvas-data="imageData"
        slider
        is-thumb
      />
      <span class="CanvasSlider__title">{{ theme.title }}</span>
    </li>
  </ul>
</template>

<script>
import { canvasMixin } from '~/mixins/canvasMixin'

import { mapGetters } from 'vuex'

export default {
  name: 'CanvasSlider',
  mixins: [canvasMixin],
  props: {
    currentTheme: {
      type: String,
      required: true
    },
    canvasData: {
      type: Object,
      required: true
    },
    themes: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      theme: '',
      activeTheme: '',
      formattedThemes: []
    }
  },
  computed: {
    ...mapGetters({
      userImage: 'user/image'
    }),
    imageData() {
      if (this.canvasData) {
        return {
          ...this.canvasData,
          width: 1080,
          height: 1080,
          thumb: true
        }
      }
    }
  },
  mounted() {
    this.activeTheme = this.currentTheme
    this.theme = this.themes.find(theme => theme.id === this.activeTheme)
    this.themes.map(theme => {
      this.formattedThemes.push(theme)
    })
  },
  methods: {
    classes(theme) {
      return {
        [`CanvasSlider__item--active`]: this.activeTheme === theme
      }
    },
    triggerThemeChange(theme) {
      this.activeTheme = theme
      this.$emit('on-change-theme', theme)
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/variables';
@import '../../../scss/layout';
@import '../../../scss/_mixins.scss';

$CanvasSliderSize: 100px;

.CanvasSlider {
  &__title {
    color: $white;
    letter-spacing: 0.03em;
    margin-top: 5px;
    text-align: center;
    display: block;
  }

  &__list {
    white-space: nowrap;
    overflow-y: hidden;
    overflow-x: auto;
    overflow-scrolling: touch;
    -webkit-overflow-scrolling: touch;
    max-width: $siteWidth;
    margin-left: auto;
    margin-right: auto;
    &::-webkit-scrollbar {
      display: none;
    }
  }

  &__item .canvasContainer__wrap {
    width: $CanvasSliderSize;
    // height: $CanvasSliderSize;
    display: block;
    display: inline-flex;
    pointer-events: none;
  }

  &__item {
    cursor: pointer;
    opacity: 0.5;
    width: $CanvasSliderSize;
    // height: $CanvasSliderSize;
    margin: 3px 3px 0 0;
    display: inline-block;
    transition: opacity 0.25s ease-in-out;
    &--active {
      opacity: 1;
    }
  }

}

// Tablet Styles
@include media-query('medium') {
  .CanvasSlider {
    // padding-left: $padding;
    // padding-right: $padding;
  }
}
</style>
