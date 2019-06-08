<template>
  <div>
    <gt-header />
    <heading>About Easy Media Kit</heading>
    <div class="AboutPage gt-padding-top gt-padding-bottom">
      <div class="AboutPage__content">
        <p>Easy Media Kit is an online media kit maker for your business. It’s super easy to generate a professional media kit for your website. Ideal for professional creative people. </p>
      </div>
    </div>
<gt-footer /></div></template>

<script>
export default {
  name: 'About',
  transition: 'page',
  head() {
    return {
      title: 'About Easy Media Kit',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content:
            'Easy Media Kit is an online media kit maker for your business. It’s super easy to generate a professional media kit for your website. Ideal for professional creative people.'
        }
      ]
    }
  },
  mounted() {}
}
</script>

<style lang="scss">
@import '../scss/typography.scss';
@import '../scss/variables.scss';
@import '../scss/mixins.scss';
.AboutPage {
  padding: $padding;
  &__content {
    font-weight: normal;
    max-width: $siteWidth;
    margin: 0 auto;
    padding: 0;
    text-align: left;
    p:not(.gt-text-center) {
      text-align: left;
      padding: 0;
    }
    a,
    a:focus {
      color: $primary-colour;
      text-decoration: none;
    }
  }
}
@include media-query('medium') {
  .AboutPage {
    padding: 0;
    &__content {
    }
  }
}
</style>
