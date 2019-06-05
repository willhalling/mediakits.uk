<template>
  <div
    :class="classes"
    class="RadioButton"
  >
    <input
      :id="id"
      :checked="checked"
      :disabled="disabled"
      :name="name"
      :value="label"
      aria-hidden="true"
      type="radio"
      class="RadioButton__input"
      @input="onInput($event.target.value)"
    >
    <label 
      :for="id" 
      class="RadioButton__label">{{ label }}</label>
    <div class="RadioButton__check"/>
    <div 
      v-if="hasSlot" 
      class="RadioButton__slot">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RadioButton',
  props: {
    checked: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    required: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    classes() {
      return {
        'RadioButton--checked': this.checked
      }
    },
    hasSlot() {
      return this.$slots.default
    }
  },
  methods: {
    onInput(value) {
      this.$emit('input', value)
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/_variables.scss';

$RadioButtonSize: 35px;
$RadioButtonColor: #0dff92;

.RadioButton {
  position: relative;
  margin: $padding;
  input[type='radio'] {
    position: absolute;
    visibility: hidden;
  }

  /*
  &--checked {
    .RadioButton__check {
      border: 5px solid $RadioButtonColor;
      &::before {
        background: $RadioButtonColor;
      }
    }
    .RadioButton__label {
      color: $RadioButtonColor;
    }
  }
  */

  &__label {
    display: block;
    position: relative;
    font-weight: 300;
    font-size: 1.35em;
    padding-left: 50px;
    margin: 0 auto;
    height: 30px;
    z-index: 9;
    cursor: pointer;
    -webkit-transition: all 0.25s linear;
    height: $RadioButtonSize;
    display: flex;
    align-items: center;
    color: #aaa;
  }

  &__slot {
    padding-left: 80px;
  }

  &__check {
    display: block;
    position: absolute;
    border: 5px solid #aaa;
    border-radius: 100%;
    height: $RadioButtonSize;
    width: $RadioButtonSize;
    top: 0;
    left: 0;
    z-index: 5;
    transition: border 0.25s linear;
    -webkit-transition: border 0.25s linear;
    &::before {
      display: block;
      position: absolute;
      content: '';
      border-radius: 100%;
      height: 15px;
      width: 15px;
      top: 5px;
      left: 5px;
      margin: auto;
      transition: background 0.25s linear;
      -webkit-transition: background 0.25s linear;
    }
  }

  input[type='radio']:checked ~ .RadioButton__check {
    border: 5px solid $RadioButtonColor;
  }

  input[type='radio']:checked ~ .RadioButton__check::before {
    background: $RadioButtonColor;
  }

  input[type='radio']:checked ~ label {
    color: $RadioButtonColor;
  }
}
</style>
