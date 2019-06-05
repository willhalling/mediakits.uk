<template>
  <section 
    :style="styles" 
    :class="classes" 
    class="FeaturedImage">
    <div 
      v-if="content.title" 
      class="FeaturedImage__content">
      <h2 class="FeaturedImage__title">
        <nuxt-link :to="`/news/${content.slug}`">{{ content.title }}</nuxt-link>
      </h2>
      <ul class="FeaturedImage__tags">
        <li 
          v-for="(tag, index) in content.tags" 
          :key="index" 
          class="FeaturedImage__tagItem">
          <span>{{ tag.name }}</span>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'FeaturedImage',
  props: {
    content: {
      type: Object,
      required: true
    },
    wideImage: {
      type: Boolean,
      required: false
    }
  },
  computed: {
    styles() {
      return {
        [`backgroundImage`]: `url(${this.content.featuredImage.file.url})`
      }
    },
    classes() {
      return {
        [`FeaturedImage--wideImage`]: this.wideImage
      }
    }
  }
}
</script>

<style lang="scss">
/*
.FeaturedImage {
  background-color: $black;
  background-size: cover;
  margin: 0 auto 56px auto;
  position: relative;
  display: flex;
  align-items: flex-end;
  min-height: 400px;
  &:after {
    content: ' ';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(to bottom, transparent, $black);
    opacity: 0.5;
  }
  &__title {
    margin-bottom: 32px;
    @media (max-width: $desktop-start) {
      margin-bottom: 24px;
      font-size: $hex-mobile-h3;
      line-height: 1.33;
    }
  }
  &__tagItem {
    display: inline;
    margin-right: 40px;
    font-family: 'HeimatSans';
    font-size: $hex-button;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  &__content {
    padding: 32px;
    padding-top: 0;
    z-index: 1;
  }

  span,
  a {
    color: $white;
    text-decoration: none;
  }

  a:hover,
  a:focus {
    text-decoration: underline;
  }
}
// Desktop Styles
@media (min-width: $desktop-start) {
  .FeaturedImage {
    background-size: 100%;
    width: 1170px;
    height: 720px;
    margin-bottom: 110px;
    &--wideImage {
      width: 100%;
      &:after {
        display: none;
      }
    }
    &__content {
      padding: 64px;
    }
  }
}
*/
</style>
