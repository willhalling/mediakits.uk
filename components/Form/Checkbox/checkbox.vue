<template>
  <ul 
    :class="classes"
    class="Checkbox"><li 
      v-for="(option, index) in options" 
      :key="index">
      <input 
        :id="index" 
        :value="option"
        v-model="checked"
        type="checkbox" 
        @change="onChange">
      <label :for="index">{{ option.name }}</label>
    </li>

    {{ values }}
  </ul>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    options: {
      type: Array,
      required: true
    },
    values: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      checked: this.values
    }
  },
  computed: {
    classes() {
      return {
        'Checkbox--checked': this.checked
      }
    }
  },
  updated() {
    this.$nextTick(() => {
      this.checked = this.values
    })
  },
  methods: {
    onChange() {
      this.$emit('input', this.checked)
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/_variables.scss';

.Checkbox {
}
</style>
