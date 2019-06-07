<template>
  <div 
    id="top" 
    class="home">
    <gt-header />
    <div class="home__container gt-padding-bottom-large">
      <hero />
      <how-it-works />
      <div 
        id="newsletter" 
        class="home__newsletter">
        <url-form />
        <pre>
          {{ websiteData }}
        </pre>
        <div v-if="step === 2">
          <canvas-app
            ref="canvasApp"
            :user-image="userImage"
            :user-images="userImages"
            :website-data="websiteData"
            :fonts-ready="true"
          />
        </div>
        <div v-if="step === 3">
          <download />
        </div>
        <progress-nav
          :step="step"
          :disable-save="disableSaveButton"
          @progress-previous="previousStep"
          @progress-next="nextStep"/>
      </div>
    </div>
    <gt-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
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
      $: '',
      websiteData: {
        title: 'Joanna Bloggs',
        url: 'http://www.joannabloggs.com',
        email: 'hello@joannabloggs.com',
        description:
          "I'm Katy, 30. I am married to Thomas and we " +
          'have one daughter, Daisy Blue. I love to share ' +
          'my views on parenting, products, family life, ' +
          'personal finance & more. I enjoy helping people ' +
          'make money, save money and change their lives ' +
          "for the better. I'm based in Essex and my posts " +
          'appeal to women aged 25-44 who want to ' +
          'manage their finances well.',
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
    }),
    disableSaveButton() {
      if (this.step > 1) {
        return false
      }
      return false
    }
  },
  mounted() {
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

    this.updateWebsiteData()
  },
  methods: {
    ...mapActions({
      nextStepAction: 'global/nextStepAction',
      previousStepAction: 'global/previousStepAction'
    }),
    updateWebsiteData() {
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

      this.websiteData = {
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
    },
    previousStep() {
      this.previousStepAction().then(() => {
        this.$router.push({ query: { step: this.step } })
        this.$scrollTo('#__nuxt', 0, { force: true })
      })
    },
    nextStep() {
      if (this.step === 2) {
        this.$store.commit('user/updateExistingUser', true)
        return this.$refs.canvasApp.parentGenerateImage()
      }
      this.nextStepAction().then(() => {
        this.$router.push({ query: { step: this.step } })
      })
    }
  }
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
    max-width: 800px;
  }
}
</style>
