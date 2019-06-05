<template>
  <div class="AdminFileRef">
    <h5 class="AdminFileRef__head">File {{ index + 1 }} of {{ total }}</h5>
    <div class="AdminFileRef__previewImg">
      <!-- <img
        :src="fileRef.url"
        class="AdminFileRef__img" > -->
      <simple-svg
        :filepath="fileRef.url"
        fill="#000"
        class="AdminFileRef__img"
        width="100px"
        height="100px"
      />
    </div>
    <field
      v-model="fileRef.name"
      :value="fileRef.name"
      name="File Name"
      type="text"
      placeholder="Enter file name..."
    />
    <field
      v-model="fileRef.description"
      :value="fileRef.description"
      name="Description"
      type="text"
      placeholder="Enter your description..."
    />
    <form-group name="Filters">
      <checkbox
        :options="checkbox.options"
        v-model="fileRef.filters"
        :values="fileRef.filters"
        @input="updateAllCheckboxes"/>
    </form-group>
    {{ fileRef.filters }}
  </div>
</template>

<script>
import { FILTERS } from '~/constants/filters'

export default {
  name: 'AdminFileRef',
  props: {
    index: {
      type: Number,
      default: 1
    },
    total: {
      type: Number,
      default: 1
    },
    fileRef: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      upload: {
        name: '',
        description: '',
        url: '',
        filters: []
      },
      checkbox: {
        options: []
      },
      filters: FILTERS
    }
  },
  mounted() {
    this.checkbox.options = [...FILTERS]
  },
  methods: {
    updateAllCheckboxes(checkboxes) {
      this.$emit('onUpdateCheckboxes', checkboxes)
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';

.AdminFileRef {
  padding: $padding * 2;
  margin-bottom: $padding;
  border: 1px solid $grey;
  &__head {
    color: $white;
  }
  &__previewImg {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff url('../../assets/checkerboard-pattern.svg') no-repeat 0 0;
    padding: $padding;
    margin-bottom: $padding;
  }
  &__img {
    display: block;
    margin: $padding auto;
    max-width: 100px;
  }
  &__last {
    .field__group {
      margin-bottom: 0;
    }
  }
}
</style>
