<template>
  <div class="hero">
    <div class="hero__container">
      <div class="hero__column">
        <transition name="slide-fade-one">
          <div v-if="show.hero.heading" >
            <h1 class="hero__heading">Media Kits<span class="hero__heading--alt">Coming Soon</span></h1>
            <p class="hero__description">Boost your brand and business with an professional Media Kit. Add your email
            below to receive a free Media Kit and get exclusive access when we launch.
              <a
                v-scroll-to="'#newsletter'"
                class="hero__link"
                href>Start &darr;</a>
            </p>
          </div>
        </transition>
      </div>
      <div class="hero__column">
        <transition name="u-scale-in">
          <a
            href
            v-scroll-to="'#newsletter'"
            v-if="show.hero.image">
            <img
              class="hero__img"
              src="~assets/free-media-kit-pdf.jpg"
              alt="Baby Trio - photo collage example">
          </a>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Hero',
  props: {},
  data() {
    return {
      show: {
        hero: {
          heading: this.isMediumScreen ? false : true,
          image: this.isMediumScreen ? false : true
        }
      }
    }
  },
  computed: {},
  mounted() {
    setTimeout(() => {
      this.show.hero.heading = true
    }, 1000)
    setTimeout(() => {
      this.show.hero.image = true
    }, 500)
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_typography.scss';
@import '../../scss/_mixins.scss';

$heroHeight: 450px;

.hero {
  display: flex;
  align-items: center;
  background-color: #ffe6ee;
  padding: $padding * 2 $padding;

  &__container {
    height: 100%;
    display: grid;
    grid-gap: 50px;
    max-width: $siteWidth;
    margin: 0 auto;
  }

  &__column {
    justify-content: center;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  &__img {
    border-radius: $border-radius;
    display: block;
    max-width: 100%;
  }
  &__heading {
    color: #262626;
    font-size: $text-xxl;
    line-height: 1.25;
    &--alt {
      display: block;
      margin: $padding / 4 0;
      font-family: $secondaryFont;
    }
  }
  &__description {
    font-size: $text-m;
    line-height: 1.5;
    max-width: 320px;
  }
  &__link,
  &__link:focus {
    font-family: $tertiaryFont;
    color: #262626;
    display: block;
    margin-top: $padding;
    &:hover {
      text-decoration: underline;
    }
  }
}

@include media-query('small') {
  .hero {
    min-height: $heroHeight;
    &__container {
      grid-template-columns: 1fr 1fr;
    }
  }
}
</style>
