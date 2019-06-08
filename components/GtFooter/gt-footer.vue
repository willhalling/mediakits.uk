<template>
  <div class="footer">
    <no-ssr>
      <cookie-law></cookie-law>
    </no-ssr>
    <p class="footer__copyright">
      &copy; {{ year }} EasyMediaKit.io
    </p>
  </div>
</template>

<script>
  import CookieLaw from 'vue-cookie-law'


export default {
  name: 'GtFooter',
  components: { CookieLaw },
  computed: {
    year() {
      const date = new Date()
      return date.getFullYear()
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';
.footer {
  font-size: $text-xs;
  font-family: 'Roboto-Light';
  padding: $padding;
  text-align: center;
}
</style>
