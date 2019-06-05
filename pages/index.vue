<template>
  <div 
    id="top" 
    class="home">
    <div class="home__container gt-padding-bottom-large">
      <hero />
      <div 
        id="newsletter" 
        class="home__newsletter">
        <newsletter 
          title="Get your FREE Media Kit"
          description="Sign up to download your free Media Kit template" />

        <url-form />
        {{ websiteData }}
      </div>
    </div>
    <gt-footer />
  </div>
</template>

<script>
import { localStorageMixin } from '~/mixins/localStorageMixin'
const axios = require('axios')
const CircularJSON = require('circular-json')
const cheerio = require('cheerio')

export default {
  name: 'Index',
  mixins: [localStorageMixin],
  transition: 'page',
  scrollToTop: true,
  data() {
    return {
      $: ''
    }
  },
  async asyncData({ params, query }) {
    console.log('query', query)
    let scrape
    try {
      scrape = await axios.get(query.url)
    } catch (e) {
      console.error('Failure!')
      console.error(e)
    }

    let json = CircularJSON.stringify(scrape);
    return {
      websiteData: json
    }
  },
  computed: {},
  mounted() {
    this.$ = cheerio.load(this.websiteData)
    console.log('this.$', this.$)
    console.log(this.$("title").text());
  },
  methods: {}
}
</script>

<style lang="scss">
@import '../scss/_variables.scss';

.home {
  &__container {
    min-height: 100vh;
  }
  &__newsletter {
    padding: $padding * 2;
    margin: 0 auto 0 auto;
    max-width: 540px;
  }
}
</style>
