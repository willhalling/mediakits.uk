<template>
  <div
    :class="{ active: isActive }"
    class="field__group"
    @click="onClick">
    <label class="field__label">{{ name }}</label>
    <slot>This is fallback content</slot>
  </div>
</template>

<script>
export default {
  name: 'FormGroup',

  props: {
    name: {
      type: String
    },
    isActive: {
      type: Boolean
    }
  },

  methods: {
    onClick() {
      this.$emit('formGroupClicked')
    }
  }
}
</script>
