<!--
Code picker inspired by:
@Lewitje
https://codepen.io/Lewitje/pen/zqVaPY
-->
<template>
  <div class="colorPicker">
    <ul
      v-for="(colorArray, type) in colors"
      :key="type"
      :class="[`colorPicker--${type}`]"
      class="colorPicker__list"
    >
      <li
        v-for="(color, index) in colorArray"
        :key="index"
        class="colorPicker__listItem"
      >
        <label>
          <input
            :name="color.value"
            :value="color.value"
            v-model="color.value"
            type="radio"
            class="colorPicker__input"
            @click="onChange($event, type)">
          <div class="colorPicker__button">
            <span
              :class="type === 'base' ? baseClasses(color.value) : variationClasses(color, index)"
              :style="type === 'base' ? baseStyles(color.value) : variationStyles(color.value, index)"
              class="colorPicker__buttonSpan"/>
          </div>
        </label>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'ColorPicker',

  props: {
    name: {
      type: String,
      default: 'Colour'
    },
    selected: {
      type: String,
      required: false
    },
    showTransparentColour: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      variationColors: null,
      colors: {
        base: [
          {
            value: 'transparent',
            active: true
          },
          {
            value: [0, 0, 0],
            active: true
          },
          {
            value: [255, 255, 255],
            active: true
          },
          {
            value: [46, 204, 113],
            active: true
          },
          {
            value: [52, 152, 219],
            active: true
          },
          {
            value: [155, 89, 182],
            active: true
          },
          {
            value: [52, 73, 94],
            active: true
          },
          {
            value: [241, 196, 15],
            active: true
          },
          {
            value: [230, 126, 34],
            active: true
          },
          {
            value: [231, 76, 60],
            active: true
          }
        ],
        variation: []
      },
      lightModifier: 20,
      darkModifier: 0,
      transitionDuration: 200,
      transitionDelay: 25,
      variationTotal: 10,
      state: {
        activeHexColor: '',
        activeBaseRgbColor: '',
        activeRgbColor: '',
        variation: {
          activeRgbColor: ''
        }
      }
    }
  },

  watch: {
    selected() {
      const color = this.hexToRgb(this.selected)
      if (!color) {
        return
      }
      const colorArray = [color.r, color.g, color.b]

      // only create variations if base color

      const isBaseColor =
        this.isArrayInArray(this.colors.base, colorArray) &&
        !this.isArrayInArray(this.colors.variation, colorArray)

      // this.state.variation.activeRgbColor = `${color.r},${color.g},${color.b}`

      if (isBaseColor) {
        this.state.activeBaseRgbColor = `${color.r},${color.g},${color.b}`
        this.hideVariations(() => {
          this.createVariations(colorArray, () => {
            // this.setDelays(() => {
            this.showVariations()
            // })
          })
        })
      }
    }
  },

  methods: {
    // @todo: add this to util
    isArrayInArray(arr, item) {
      const item_as_string = JSON.stringify(item)
      const contains = arr.some(function(ele) {
        return JSON.stringify(ele.value) === item_as_string
      })
      return contains
    },
    baseClasses(colour) {
      if (this.selected && this.hexToRgb(this.selected)) {
        return {
          ['colorPicker__buttonSpan--active']:
            colour.toString() === this.state.activeBaseRgbColor,
          ['colorPicker__buttonSpan--border']: colour.toString() === '0,0,0' // if black
        }
      }
    },
    variationClasses(colour) {
      if (this.selected && this.hexToRgb(this.selected)) {
        return {
          ['colorPicker__buttonSpan--active']:
            colour.value.toString() === this.state.variation.activeRgbColor,
          ['colorPicker__buttonSpan--border']:
            colour.value.toString() === '0,0,0', // if black
          ['colorPicker__buttonSpan--visible']: colour.active
        }
      }
    },
    baseStyles(colour) {
      if (colour === 'transparent') {
        return {
          ['background-image']: `url(${require('../../assets/checkerboard-pattern.svg')})`
        }
      }
      return {
        ['background-color']: `rgb(${colour.join()})`
      }
    },
    variationStyles(colour, index) {
      return {
        ['background-color']: `rgb(${colour.join()})`,
        ['transition']:
          'transform ' +
          this.transitionDuration / 1000 +
          's ' +
          (this.transitionDelay / 1000) * index +
          's'
      }
    },
    componentToHex(c) {
      const hex = c.toString(16)
      return hex.length == 1 ? '0' + hex : hex
    },
    rgbToHex(r, g, b) {
      return (
        '#' +
        this.componentToHex(r) +
        this.componentToHex(g) +
        this.componentToHex(b)
      )
    },
    hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result
        ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          }
        : null
    },
    onChange(event, type) {
      this.state.variation.activeRgbColor = ''
      const rgbArray = event.target.value.split(',')
      const hexColor = this.rgbToHex(
        Number(rgbArray[0]),
        Number(rgbArray[1]),
        Number(rgbArray[2])
      )
      this.updateColour(hexColor, type)
    },
    createVariations(color, callback) {
      this.colors.variation = []
      for (let i = 0; i < this.variationTotal; i++) {
        let newColor = []
        for (let x = 0; x < color.length; x++) {
          let modifiedColor = color[x] - 100 + this.lightModifier * i

          if (modifiedColor <= 0) {
            modifiedColor = 0
          } else if (modifiedColor >= 255) {
            modifiedColor = 255
          }

          newColor.push(modifiedColor)
        }
        this.colors.variation.push({
          value: newColor,
          active: false
        })
      }

      callback()
    },
    showVariations() {
      let newColors
      setTimeout(() => {
        newColors = this.colors.variation.map(color => {
          return {
            ...color,
            active: true
          }
        })
        this.colors.variation = newColors
      }, this.transitionDelay * this.variationTotal)
    },
    hideVariations(callback) {
      this.colors.variation = this.colors.variation.map(color => {
        return {
          ...color,
          active: false
        }
      })
      // debugger
      setTimeout(() => {
        callback()
      }, this.transitionDelay * this.variationTotal)
    },
    updateColour(colour, type) {
      const updatedColour = colour ? colour : event.target.value

      if (type === 'variation') {
        this.state.variation.activeRgbColor = event.target.value
      }

      this.state.activeHexColor = updatedColour
      this.$emit('input', updatedColour, type)
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';

$colorPickerBaseSize: 25px;
$colorPickerVariationSize: 40px;
$cpBorderColour: #232323;
$cpBorderActiveColour: $dark-orange;

.colorPicker {
  background-color: $primary-background;
  border: 1px solid $white;
  border-top: 0;
  padding: $padding 0;
  transition: height 250ms ease-in-out;
  &__list {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    margin: $padding / 2 0 0;
  }

  &__listItem {
    height: $colorPickerBaseSize;
    margin-bottom: $padding / 2;
  }
  &__input {
    display: none;
  }
  &__inputs {
    padding: $padding;
    display: flex;
    .field__group {
      // height: 100%;
    }
  }
  &__inputHex {
    width: 75%;
  }
  &__preview {
    border: 1px solid $grey;
    border-left: 0;
    width: 25%;
  }
  &__button {
    display: inline-block;
    position: relative;
    width: $colorPickerBaseSize;
    height: $colorPickerBaseSize;
    margin: 0 $padding / 2 0 0;
    cursor: pointer;
  }
  &__buttonSpan {
    display: block;
    position: absolute;
    width: $colorPickerBaseSize;
    height: $colorPickerBaseSize;
    padding: 0;
    // top: 50%;
    // left: 50%;
    // transform: translate(-50%, -50%);
    // transform: scale(1, 1);
    border-radius: 50%;
    // box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
    // transition: $transition;
    &:hover,
    &--active {
      // padding: $padding;
      transform: scale(1.3, 1.3) !important;
      // border: 2px solid #fff;
    }
    &--border {
      border: 1px solid $white;
    }
  }
  &--variation {
    .colorPicker__listItem {
      height: $colorPickerVariationSize;
    }
    .colorPicker__button,
    .colorPicker__buttonSpan {
      width: $colorPickerVariationSize;
      height: $colorPickerVariationSize;
    }
    .colorPicker__buttonSpan {
      transform: scale(0, 0);
      &--visible {
        transform: scale(1, 1);
      }
    }
  }
}
</style>
