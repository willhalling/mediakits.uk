<template>
  <div 
    :class="classes" 
    class="UrlForm gt-margin-bottom-x-large">
    <h3 class="UrlForm__heading">Enter URL to start</h3>
    <div 
      v-if="!success" 
      class="gt-margin-bottom">
      <div class="UrlForm__container">
        <field
          v-model="form.url"
          class="UrlForm__field"
          type="url"
          placeholder="Enter url"
        />
        <button-cta
          aria-label="UrlForm Sign up Submit"
          class="UrlForm__submit"
          radius-right
          @click.prevent="submitUrl">Submit</button-cta>
      </div>
    </div>
    <notification 
      v-if="error" 
      :message="error" />
    <notification 
      v-if="success" 
      :message="success" />
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'UrlForm',
  props: {
    theme: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {
      form: {
        url: ''
      },
      error: '',
      success: '',
      website: {
        data: {}
      }
    }
  },
  computed: {
    classes() {
      return {
        [`UrlForm--theme--${this.theme}`]: this.theme
      }
    }
  },
  methods: {
    submitUrl() {
      console.log('submitUrl')
      this.$axios.get(this.form.url).then(response => {
        // `response` is an HTTP response object, whose body is contained in it's `data` attribute

        // This will print the HTML source code to the console
        console.log(response.data)
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
.UrlForm {
  &__container {
    display: flex;
  }
  &__field {
    width: 80%;
    .field__group {
      border-top-left-radius: $border-radius;
      border-bottom-left-radius: $border-radius;
      margin-bottom: 0;
    }
  }
  &__description {
    text-align: left;
  }
  &--theme--light {
    .field__group {
      border: 1px solid #d91851;
    }
    .field__group,
    .field__input {
      background-color: $white;
      color: #d91851;
    }
    .field__input {
      &::placeholder {
        color: #535353;
      }
    }
    .UrlForm__submit {
      border-color: #535353;
      background-color: #262626;
      color: #fff;
    }
  }
}

.UrlForm__submit {
  cursor: pointer;
  max-width: 120px;
  min-width: 100px;
  min-height: 100%;
  width: 20%;
}
</style>
