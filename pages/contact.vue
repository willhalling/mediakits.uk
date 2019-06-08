<template>
  <div>
    <gt-header />
    <heading>Contact Easy Media Kit team</heading>
    <div class="Contact gt-padding-bottom">
      <div class="Contact__container gt-colour-white gt-padding-bottom-xlarge">
        <form
          ref="contactForm"
          action="/thank-you"
          name="contact"
          method="POST"
          netlify-honeypot="bot-field3"
          netlify
          @submit.prevent="submitForm"
        >
          <input 
            type="hidden" 
            name="form-name" 
            value="contact" >
          <p style="display: none;">
            <label>Don’t fill this out if you're human: <input name="bot-field3" ></label>
            <input
              :value="`Contact Form submission from ${formData.name} form`"
              name="subject"
            >
          </p>
          <field
            v-model="formData.name"
            name="name"
            type="text"
            placeholder="Name"
          />
          <field
            v-model="formData.email"
            name="email"
            type="email"
            placeholder="Email"
          />
          <field
            v-model="formData.message"
            name="message"
            type="textarea"
            placeholder="Your message"
          />
          <transition name="u-fade-in">
            <notification v-if="formError"  :message="formError" />
          </transition>
          <div class="gt-text-center">
            <button-cta 
              theme="cta"
              round
              pulse
              no-border
              type="submit">
              <svg-base
                slot="icon"
                :viewbox-width="448"
                :viewbox-height="448"
                :width="32"
                :height="32"
                icon-name="SvgSendIcon"
                colour="#FFF"
              >
                <component is="SvgSendIcon" />
              </svg-base>
              Send
            </button-cta>
          </div>
        </form>
      </div>
    </div>
    <gt-footer />
  </div>
</template>

<script>
export default {
  name: 'Contact',
  transition: 'page',
  data() {
    return {
      formError: false,
      formData: {
        name: '',
        email: '',
        message: ''
      }
    }
  },
  head() {
    return {
      title: 'Contact | Easy Media Kit',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Get in touch with any questions or feedback you have about Easy Media Kit.'
        }
      ]
    }
  },
  methods: {
    submitForm() {
      if (this.formData.name === '') {
        this.formError = 'You need to add a name.'
        return
      }
      if (this.formData.email === '') {
        this.formError = 'You need to add a email.'
        return
      }
      if (this.formData.message === '') {
        this.formError = 'You need to add a message.'
        return
      }

      this.postToNetlify()
    },
    encode(data) {
      return Object.keys(data)
              .map(
                      key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
              )
              .join('&')
    },
    postToNetlify() {
      const action = this.$refs.contactForm.action
      const formData = new FormData(this.$refs.contactForm) // reference to form element
      const data = {} // need to convert it before using not with XMLHttpRequest
      for (let [key, val] of formData.entries()) {
          Object.assign(data, {[key]: val})
      }
      this.$axios
              .post(action, this.encode(data), {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
              })
              .then(() => {
                this.$router.push('/thank-you')
              })
    },
  }
}
</script>

<style lang="scss">
@import '../scss/variables/colours__OLD';
@import '../scss/variables';
.Contact {
  padding: $padding;
  &__container {
    margin: 0 auto;
    max-width: $siteWidth;
  }
  &__formError {
    color: $error-text;
  }
}
</style>
