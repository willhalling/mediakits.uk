<template>
  <div class="CanvasEdit">
    <div
      class="CanvasEdit__container">
      <form>

        <span 
          v-for="(item, index) in website.data" 
          :key="index">
          <field
            v-if="item.value"
            :type="item.type"
            v-model="item.value"
            :name="item.name"
            placeholder="Enter text" />
        </span>

      </form>

    </div>

  </div>
</template>

<script>
import COLOURS from '~/constants/colours'
import { mapGetters } from 'vuex'

export default {
  name: 'CanvasEdit',
  props: {
    website: {
      type: Object,
      required: true
    }
  },
  data() {
    return {}
  },
  computed: {},
  mounted() {},
  methods: {
    onInput(value, name) {
      console.log('onInput')
      // Trigger Vue Reactivity to update theme object
      this.website.data = {
        ...this.website.data,
        [name]: {
          value: value
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/variables';
@import '../../../scss/layout';
@import '../../../scss/_mixins.scss';

.CanvasEdit {
}

// Desktop styles
@include media-query('small') {
  .CanvasEdit {
  }
}
</style>
