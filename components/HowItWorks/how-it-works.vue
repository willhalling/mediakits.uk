<template>
  <ol 
    class="HowItWorks">
    <li 
      v-for="(step, index) in steps"
      :class="classes(index)"
      :style="styles(index)"
      :key="index"
      class="HowItWorks__item"
    >
      <span class="HowItWorks__circle">
        <img
          v-if="index === 0"
          :alt="`Step ${index + 1}`"
          src="~assets/steps/1.svg">
        <img
          v-if="index === 1"
          :alt="`Step ${index + 1}`"
          src="~assets/steps/2.svg">
        <img
          v-if="index === 2"
          :alt="`Step ${index + 1}`"
          src="~assets/steps/3.svg">
      </span>
      <span class="HowItWorks__text">{{ step.text }}</span>
    </li>
  </ol>
</template>

<script>
export default {
  name: 'HowItWorks',
  props: {},
  data() {
    return {
      transitionDuration: 500,
      transitionDelay: 100,
      steps: [
        {
          name: 'SvgNumberOne',
          text: 'Enter your website address',
          colour: '#132B37'
        },
        {
          name: 'SvgNumberTwo',
          text: 'Add content & edit your design',
          colour: '#132B37'
        },
        {
          name: 'SvgNumberThree',
          text: 'Receive your Media Kit via email',
          colour: '#132B37'
        }
      ]
    }
  },
  mounted() {
    this.updateActiveClasses()
  },
  methods: {
    styles(index) {
      return {
        ['transition']: `all ${this.transitionDuration / 1000}s ${(this
          .transitionDelay /
          1000) *
          index}s`
      }
    },
    classes(index) {
      return [`HowItWorks__item--${index}`]
    },
    updateActiveClasses() {
      for (let i = 0; i < this.steps.length; i++) {
        setTimeout(() => {
          const element = document.getElementsByClassName(
            `HowItWorks__item--${i}`
          )
          if (element[0]) {
            element[0].classList.add('HowItWorks__item--active')
          }
        }, this.transitionDelay * i)
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';

.HowItWorks {
  color: $dark-grey;
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 50px;
  text-align: center;
  list-style: none;
  counter-reset: custom-counter;
  margin: $padding * 5 auto;
  max-width: $siteWidth;
  padding: 0;
  &__item {
    transition: all 0.66s ease-in-out;
    opacity: 0;
    &--active {
      opacity: 1;
    }
  }
  &__text {
    display: block;
    font-size: $text-l;
    padding-top: $padding;
  }
  &__circle {
    display: flex;
    align-items: center;
    justify-content: center;
    //background-color: #f3d549;
    border-radius: 50%;
    content: '0' counter(custom-counter);
    font-weight: bold;
    font-family: $tertiaryFont, serif;
    width: 100px;
    height: 100px;
    margin: 0 auto;
  }
  li {
    counter-increment: custom-counter;
    display: flex;
    font-family: $tertiaryFont;
    flex-direction: column;
    width: 100%;
    margin-bottom: $padding;
  }
}

// Tablet & Desktop styles
@include media-query('medium') {
  .HowItWorks {
    grid-template-columns: 1fr 1fr 1fr;
  }
}
</style>
