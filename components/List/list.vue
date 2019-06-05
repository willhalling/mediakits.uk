<template>
  <ul class="List">
    <li
      v-for="(item, index) in items"
      :class="{ 'List__item--odd': isOdd(index) }"
      :key="index"
      class="List__item"
    >
      <span class="List__key">{{ item.key }}</span>
      <span class="List__value">{{ item.value }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'List',
  props: {
    items: {
      type: Array
    }
  },
  methods: {
    isOdd(number) {
      return number % 2 === 1
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';

.List {
  border: 1px solid $white;
  &__item {
    display: flex;
    color: $white;
    padding: $padding;
    border-bottom: 1px solid $white;
    &:last-child {
      border: 0;
    }
    &--odd {
      background-color: $primary-background;
    }
  }
  &__key {
    font-family: bold;
    text-transform: uppercase;
    font-size: $text-s;
    width: 40%;
    align-items: center;
    font-family: $tertiaryFont;
  }
  &__value {
    margin-left: auto;
    width: 60%;
    justify-content: flex-end;
    text-align: right;
    line-height: 1.25;
  }
  &__key,
  &__value {
    display: flex;
  }
}
</style>
