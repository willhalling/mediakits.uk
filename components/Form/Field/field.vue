<template>
  <div>
    <form-group
      :class="classes"
      :style="fieldGroupStyles"
      @click="onClick"
    >
      <div
        v-if="name"
        class="field__header">
        <label class="field__label">{{ name }}
          <span
            v-if="required"
            class="required">*</span>
          <span
            v-if="isRangeSlider"
            class="field__rangeText gt-lowercase">({{ value }})</span>
        </label>
      </div>
      <textarea
        v-if="type === 'textarea'"
        :name="name"
        :placeholder="placeholder"
        :value="value"
        :style="styles"
        class="field__input"
        spellcheck="false"
        rows="5"
        @input="onInput($event.target.value)"
        @focus="isActive = true"
        @blur="isActive = false"
      />
      <input
        v-else
        :name="name"
        :placeholder="placeholder"
        :autofocus="autofocus"
        :value="value"
        :type="type"
        :min="min"
        :max="max"
        :step="step"
        :style="styles"
        class="field__input"
        spellcheck="false"
        @input="onInput($event.target.value)"
        @focus="isActive = true"
        @blur="isActive = false"
      >
    </form-group>
  </div>
</template>

<script>
export default {
  name: 'Field',
  props: {
    name: {
      type: String,
      required: false
    },
    value: {
      type: [String, Number],
      required: true
    },
    type: {
      type: String,
      required: true
    },
    placeholder: {
      type: String,
      required: false
    },
    autofocus: {
      type: String,
      required: false
    },
    disabled: {
      type: Boolean,
      required: false
    },
    required: {
      type: Boolean,
      required: false
    },
    font: {
      type: String,
      required: false
    },
    fontColour: {
      type: String,
      required: false
    },
    textAlign: {
      type: String,
      required: false
    },
    backgroundColour: {
      type: String,
      required: false
    },
    size: {
      type: Number,
      required: false
    },
    min: {
      type: Number,
      required: false
    },
    max: {
      type: Number,
      required: false
    },
    step: {
      type: Number,
      required: false
    },
    noMargin: {
      type: Boolean,
      required: false
    }
  },

  data() {
    return {
      isActive: false
    }
  },

  computed: {
    styles() {
      return {
        fontFamily: this.font ? this.font : null,
        fontSize: this.size ? this.size + 'px' : null,
        color: this.fontColour ? this.fontColour : null,
        textAlign: this.textAlign ? this.textAlign : null
      }
    },
    accessibleBackgroundColour() {
      if (
        this.backgroundColour === 'transparent' &&
        this.fontColour === '#FFFFFF'
      ) {
        return 'rgba(0,0,0,0.5)'
      }
      if (
        this.backgroundColour === 'transparent' &&
        this.fontColour === '#000000'
      ) {
        return 'rgba(255,255,255,0.5)'
      }
      return this.backgroundColour
    },
    fieldGroupStyles() {
      return {
        backgroundColor: this.accessibleBackgroundColour
      }
    },
    isRangeSlider() {
      return this.type == 'range'
    },
    classes() {
      return {
        [`field__group--active`]: this.active,
        [`field__group--noMargin`]: this.noMargin
      }
    }
  },

  methods: {
    onClick() {
      const input = this.$el.children[1]
      input.focus()
    },
    onInput(value) {
      const newValue = this.isRangeSlider ? parseInt(value) : value
      this.$emit('input', newValue)
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/variables.scss';
@import './field.scss';
</style>
