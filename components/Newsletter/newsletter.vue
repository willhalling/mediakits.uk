<template>
  <div 
    :class="classes" 
    class="Newsletter gt-margin-bottom-x-large">
    <h3 class="Newsletter__heading">{{ title }}</h3>
    <div 
      v-if="!success" 
      class="gt-margin-bottom">
      <p class="Newsletter__description">{{ description }}</p>
      <div class="Newsletter__container">
        <field
          v-model="email"
          class="Newsletter__field"
          type="email"
          placeholder="Enter your email"
        />
        <button-cta
          aria-label="Newsletter Sign up Submit"
          class="Newsletter__submit"
          radius-right
          @click.prevent="validateNewsletter">Sign Up</button-cta>
      </div>
    </div>
    <notification 
      v-if="error" 
      :message="error" />
    <notification 
      v-if="success" 
      :message="success" />
    <div v-if="success">
      <h3 class="Newsletter__heading">Download your free Media Kit&hellip;</h3>
      <p> <a
        href="./download/Blog-Media-Press-Kit-Template-qIQ6zYna1msx1N4h.zip"
        target="_blank">https://mediakits.uk/download/Blog-Media-Press-Kit-Template-qIQ6zYna1msx1N4h.zip</a></p>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Newsletter',
  props: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    theme: {
      type: String,
      default: 'light'
    }
  },
  data() {
    return {
      email: '',
      error: '',
      success: ''
    }
  },
  computed: {
    classes() {
      return {
        [`Newsletter--theme--${this.theme}`]: this.theme
      }
    }
  },
  methods: {
    ...mapActions({
      signUpUser: 'auth/signUpUser'
    }),
    validateNewsletter() {
      if (this.email === '') {
        this.error = 'You need to add your email.'
        return
      }
      this.newsletterSignup()
    },
    newsletterSignup() {
      console.log('newsletterSignup')
      this.signUpUser(this.email)
        .then(response => {
          console.log('signUpUser response', response)
          this.error = ''
          this.success = 'You have successfully signed up'
        })
        .catch(error => {
          this.error = error.message
        })
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
.Newsletter {
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
    .Newsletter__submit {
      border-color: #535353;
      background-color: #262626;
      color: #fff;
    }
  }
}

.Newsletter__submit {
  cursor: pointer;
  max-width: 120px;
  min-width: 100px;
  min-height: 100%;
  width: 20%;
}
</style>
