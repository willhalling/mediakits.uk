<template>
  <div 
    id="top" 
    class="home">
    <gt-header />
    <div class="home__container gt-padding-bottom-large">
      <hero />
      <div
        id="urlForm"
        class="home__urlForm">
        <url-form />
      </div>
    </div>
    <progress-nav
      :step="step"
      :disable-save="disableSaveButton"/>
    <how-it-works />
    <gt-footer />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { localStorageMixin } from '~/mixins/localStorageMixin'
import { progressNavMixin } from '~/mixins/progressNavMixin'
const axios = require('axios')
const CircularJSON = require('circular-json')
const cheerio = require('cheerio')

export default {
  name: 'Index',
  mixins: [localStorageMixin, progressNavMixin],
  transition: 'page',
  scrollToTop: true,
  data() {
    return {
      $: '',
    }
  },
  async asyncData({ params, query }) {
    const checkUrl = function(url) {
      if (!/^https?:\/\//i.test(url)) {
        return 'http://' + url
      }
      return query.url
    }
    const url = checkUrl(query.url)
    console.log('url', url)
    // debugger
    //console.log('params', params)
    if (query.url) {
      let scrape
      try {
        scrape = await axios.get(url)
      } catch (e) {
        console.error('Failure!')
        console.error(e)
      }

      let json = CircularJSON.stringify(scrape)
      return {
        json: JSON.parse(json)
      }
    }
  },
  computed: {
    ...mapGetters({
      step: 'global/step',
      userImage: 'user/image',
      userImages: 'user/images'
    })
  },
  mounted() {
    this.$store.commit('global/goToStep', 1)
    
    this.$store.subscribe((mutation, state) => {
      // Store the state object as a JSON string
      // Push user store module to local storage every time there is an update.
      // Hydration is done on initial load inside initialiseStore mutation which is inside user.js
      this.ls_pushStore(state.user)
    })
    if (!this.json) {
      return
    }
    this.$ = cheerio.load(this.json.data)

    this.updateWebsite()
  },
  methods: {
    updateWebsite() {
      const meta = this.$('meta')

      const keys = Object.keys(meta)

      let metaDescription
      let ogTitle

      keys.forEach(function(key) {
        if (
          meta[key].attribs &&
          meta[key].attribs.name &&
          meta[key].attribs.name === 'description'
        ) {
          console.log('meta[key].attribs.property', meta[key].attribs.property)
          metaDescription = meta[key].attribs.content
        }
      })

      keys.forEach(function(key) {
        if (
          meta[key].attribs &&
          meta[key].attribs.property &&
          meta[key].attribs.property === 'og:title'
        ) {
          ogTitle = meta[key].attribs.content
        }
      })

      console.log(metaDescription)
      console.log(ogTitle)

      /*
      this.website = {
        data: {
          title: this.$('title').text(),
          url: this.$route.query.url,
          email: '',
          description: metaDescription,
          stats: {
            social_media: {
              facebook: {
                username: '',
                total_followers: 5800
              },
              instagram: {
                username: '',
                total_followers: 5000
              },
              twitter: {
                username: '',
                total_followers: 2000
              },
              pinterest: {
                username: '',
                total_followers: 3000
              },
              total_followers: 25000
            },
            monthly_visitors: 25000,
            monthly_page_views: 35000,
            my_visitors: {
              males: '0%',
              females: '0%'
            }
          }
        }
      }
      
       */
    }
  }
}
</script>

<style lang="scss">
@import '../scss/_variables.scss';

.home {
  &__container {
    //min-height: 100vh;
  }
  &__urlForm {
    padding: $padding * 2 0 0;
    margin: 0 auto 0 auto;
    max-width: 800px;
  }
}
</style>
