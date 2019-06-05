<template>

  <span
    :class="classes"
    class="gt-dropdown">
    <select
      :aria-label="name"
      v-model="selected"
      :id="name"
      :name="name"
      class="gt-dropdown__select"
      @change="onChange"
    >
      <option
        :value="null"
        disabled>{{ chooseText }}</option>
      <option
        v-for="(option, index) in options"
        :key="index"
        :value="option.value"
        :disabled="option.disabled"
      >
        {{ option.name }}
      </option>
    </select>
  </span>

</template>

<script>
export default {
  name: 'Dropdown',

  props: {
    options: {
      type: Array
    },
    default: {
      type: String
    },
    name: {
      type: String
    },
    error: {
      type: Boolean
    },
    initialSelection: {
      type: Number
    },
    chooseText: {
      type: String,
      default: 'Choose'
    }
  },

  data() {
    return {
      selected: this.initialSelection
    }
  },

  computed: {
    classes() {
      return {
        [`gt-dropdown--error`]: this.error
      }
    }
  },

  methods: {
    onChange(event) {
      this.$emit('input', event.target.value)
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/variables.scss';

.gt-dropdown {
  position: relative;

  &__select {
    appearance: none;
    border-radius: 8px;
    border-color: $white;
    padding: $padding;
    background-color: transparent;
    color: $white;
    font-size: $text-s;
    min-width: 100px;

    &:focus {
      outline: none;
      box-shadow: 0px 0px 2px blue;
    }

    option {
      appearance: none;
    }

  }

  &--error {
    .gt-dropdown__select {
      border-color: red
    }
  }

  &:after {
    content: ' ';
    width: 16px;
    height: 10px;
    background: url("data:image/svg+xml,%3Csvg fill='%23FFF' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 9.87'%3E%3Cpolygon class='cls-1' points='14.13 0 8 6.13 1.87 0 0 1.87 8 9.87 16 1.87 14.13 0'/%3E%3C/svg%3E")
      no-repeat;
    position: absolute;
    top: 50%;
    right: 14px;
    margin-top: -5px;
  }

  &--hasFormName {
    &:after {
      top: 58px;
    }
  }
}
</style>
