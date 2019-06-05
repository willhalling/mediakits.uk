<template>
  <form-group :name="name">
    <ul class="alignmentSelector gt-padding-top-1/2">
      <li
        v-for="(item, index) in positions"
        v-if="options"
        :class="classes(item.value)"
        :key="index"
        class="alignmentSelector__item"
      >
        <label
          :for="item.value"
          class="alignmentSelector__label"
        >
          <input 
            :id="item.value"
            :value="item.value"
            v-model="currentPosition"
            type="radio"
            class="alignmentSelector__input"
            name="alignment"
            @click="onChange"
          >
        </label>
      </li>
    </ul>
  </form-group>
</template>

<script>
export default {
  name: 'AlignmentSelector',
  props: {
    name: {
      type: String,
      default: 'Alignment'
    },
    selected: {
      type: [String, Object],
      required: true
    },
    options: {
      type: Array,
      default: () => [
        {
          value: 'topLeft',
          selected: false
        },
        {
          value: 'topMiddle',
          selected: false
        },
        {
          value: 'topRight',
          selected: false
        },
        {
          value: 'middleLeft',
          selected: false
        },
        {
          value: 'middle',
          selected: false
        },
        {
          value: 'middleRight',
          selected: false
        },
        {
          value: 'bottomLeft',
          selected: false
        },
        {
          value: 'bottomMiddle',
          selected: false
        },
        {
          value: 'bottomRight',
          selected: false
        }
      ]
    }
  },
  data() {
    return {
      positions: null,
      currentPosition: null
    }
  },
  mounted() {
    this.positions = this.options
    this.currentPosition = this.selected
    this.updateCurrentPosition(this.selected)
  },
  methods: {
    classes(position) {
      return {
        ['alignmentSelector__item--active']: position === this.selected
      }
    },
    updateCurrentPosition(selected) {
      this.positions = this.positions.map(item => {
        return {
          value: item.value,
          selected: selected === item.value
        }
      })
    },
    onChange(event) {
      this.currentPosition = event.target.value
      this.updateCurrentPosition(this.currentPosition)
      this.$emit('input', this.currentPosition)
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';

$alignment-selector-color: $dark-orange;

.alignmentSelector {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-between;
  @include media-query('small') {
    width: 50%;
  }
  &__item {
    border: 1px solid $white;
    list-style: none;
    display: inline-block;
    width: calc(1 / 3 * 100% - (1 - 1 / 3) * #{$padding});
    box-sizing: border-box;
    margin-bottom: $padding;
    &--active {
      background-color: $alignment-selector-color;
    }
  }
  &__label {
    display: block;
    padding: $padding;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
  &__input {
    display: none;
  }
}
</style>
