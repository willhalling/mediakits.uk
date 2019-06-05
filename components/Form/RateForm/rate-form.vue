<template>
  <div class="gt-margin-bottom-x-large">
    <h3 class="gt-colour-white">Rate this website!</h3>
     <transition name="fade">
  <form v-if="!formSent" class="RateForm" ref="ratingForm" action="/" name="ratingForm" method="POST"
        netlify-honeypot="bot-field4" @submit.prevent="submitRating">
    <svg style="display: none;" xmlns="http://www.w3.org/2000/svg">
      <symbol id="star" viewBox="0 0 24 24">
        <title>Rating star icon</title>
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
      </symbol>
    </svg>
    <input
            type="hidden"
            name="form-name"
            value="ratingForm">
    <p style="display: none;">
      <label>Don’t fill this out if you're human: <input name="bot-field4"></label>
    </p>
    <div class="RateForm__rating">
      <!--
      <span v-for="index in ratingItems" :key="index">
        <input type="radio" class="RateForm__rating__data" :id="`rate-${index}-star--svg`" name="rating" :value="index" />
        <label class="RateForm__rating__star"
               :aria-label="`rate ${index} stars`"
               :for="`rate-${index}-star--svg`"
               :accesskey="index" :tabindex="index">
          <svg><use xlink:href="#star"></use></svg>
        </label>
      </span>
      -->

      <input type="radio" class="RateForm__rating__data" id="rate-5-star--svg" name="rating" v-model="form.rating"
             value="5"/>
      <label class="RateForm__rating__star"
             aria-label="rate 5 stars"
             for="rate-5-star--svg"
             accesskey="5" tabindex="5">
        <svg><use xlink:href="#star"></use></svg>
      </label>

      <input type="radio" class="RateForm__rating__data" id="rate-4-star--svg" name="rating" v-model="form.rating"
             value="4"/>
      <label class="RateForm__rating__star"
             aria-label="rate 4 stars"
             for="rate-4-star--svg"
             accesskey="4" tabindex="4">
        <svg><use xlink:href="#star"></use></svg>
      </label>

      <input type="radio" class="RateForm__rating__data" id="rate-3-star--svg" name="rating" v-model="form.rating"
             value="3"/>
      <label class="RateForm__rating__star"
             aria-label="rate 3 stars"
             for="rate-3-star--svg"
             accesskey="3" tabindex="3">
        <svg><use xlink:href="#star"></use></svg>
      </label>

      <input type="radio" class="RateForm__rating__data" id="rate-2-star--svg" name="rating" v-model="form.rating"
             value="2"/>
      <label class="RateForm__rating__star"
             aria-label="rate 2 stars"
             for="rate-2-star--svg"
             accesskey="2" tabindex="2">
        <svg><use xlink:href="#star"></use></svg>
      </label>

      <input type="radio" class="RateForm__rating__data" id="rate-1-star--svg" name="rating" v-model="form.rating"
             value="1"/>
      <label class="RateForm__rating__star"
             aria-label="rate 1 stars"
             for="rate-1-star--svg"
             accesskey="1" tabindex="1">
        <svg><use xlink:href="#star"></use></svg>
      </label>

    </div>
    <field type="textarea" name="ratingMessage" v-model="form.message"
           placeholder="Enter feedback, leave email if you need a response."/>
    <button-cta
            type="submit"
    >
      Submit feedback
    </button-cta>
    
  </form>
     </transition>
  <notification v-if="formInfo" :message="formInfo"/>
  </div>
</template>

<script>
export default {
  name: 'RateForm',

  data() {
    return {
      formInfo: '',
      formSent: false,
      form: {
        rating: 0,
        message: ''
      }
    }
  },

  methods: {
    submitRating() {
      if (this.form.message === '') {
        this.formInfo = 'You need to add a message.'
        return
      }

      this.postRatingToNetlify()
    },
    encode(data) {
      return Object.keys(data)
              .map(
                      key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`
              )
              .join('&')
    },
    postRatingToNetlify() {
      const action = this.$refs.ratingForm.action
      const formData = new FormData(this.$refs.ratingForm) // reference to form element
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
                this.formInfo = 'Thanks for your feedback.'
                this.formSent = true
              })
    },
  }
}
</script>

<style lang="scss">
@import '../../../scss/_variables.scss';
.RateForm {
  margin-bottom: $padding * 2;
  /**
  * STAR-RATING
  *
  **/
  &__rating {
    $ICON_SIZE: 32px;
    $ICON_COLOR: black;
    $ICON_COLOR_isHOVER: #FDD835;
    $ICON_COLOR_isSELECTED: #FF9800;
    $ICON_COLOR_isACTIVE: red;

    display: inline-flex;
    flex-direction: row-reverse;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: $padding;


    /**
    * Hide input[type="radio"] elements
     **/
    &__data {
      position:absolute;
      left:-10000px;
      top:auto;
      width:1px;
      height:1px;
      overflow:hidden;
    }


    /**
    * Basics for the star container
     **/
    &__star {
      color: black;
      transition: color      0.1s cubic-bezier(0.0, 0.0, 0.2, 1),
      transition 0.24s cubic-bezier(0.0, 0.0, 0.2, 1),
      opacity    0.24s cubic-bezier(0.0, 0.0, 0.2, 1);

      will-change: color, transform;
    }

    /**
     * Setup SVG star icons
     * 1. Make SVG star dependent on currently use color
     * 2. Smoother color change (fast out, slow in)
     **/
    svg {
      width: $ICON_SIZE;
      height: $ICON_SIZE;
      margin: 2px;
      fill: currentColor; /* 1 */
      transition: 160ms cubic-bezier(0.4, 0, 0.2, 1); /* 2 */
      cursor: pointer;
    }

    /**
     * Set color for "checked" / selected state
     **/
    &__data:checked ~ &__star {
      color: $ICON_COLOR_isSELECTED;
    }

    /**
     * Color change on hover
     * 1. This very star
     * 2. The previous stars
     **/
    &__star#{&}__star:hover, /* 1 */
    &__star:hover ~ &__star, /* 2 */ {
      color: $ICON_COLOR_isHOVER;
    }

    /**
     * Indicate change by short change of color on selected star
     * 1. Sadly we need to be a little specific to override the selected state color :(
     **/
    &__star#{&}__star:active /* 1 */ {
      color: $ICON_COLOR_isACTIVE;
      transform: scale(1.4);
      opacity: .3;
    }
  }

}
</style>
