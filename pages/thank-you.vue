<template>
  <div>
    <div class="page gt-background-secondary gt-padding-top gt-padding-bottom">
      <div class="page__container">
        <h2>Thank you</h2>
        <p>Thanks for getting in touch. I will respond shortly if your email requires a response.</p>
      </div>
    </div>
    <gt-footer />
  </div>
</template>

<style lang="scss">
@import '../scss/_variables.scss';
@import '../scss/_mixins.scss';

.page {
  padding: $padding;
  &__container {
    margin: 0 auto;
    max-width: $siteWidth;
  }
}
</style>
