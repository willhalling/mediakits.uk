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
          description="Sign up to get your Media Kit template delivered straight to your inbox" />
      </div>
    </div>
    <gt-footer />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { localStorageMixin } from '~/mixins/localStorageMixin'
import { getAge, getAgeString } from '~/utils/date'
import Notification from '../components/Notification/notification'
import Newsletter from '../components/Newsletter/newsletter'

export default {
  name: 'Index',
  mixins: [localStorageMixin],
  transition: 'page',
  scrollToTop: true,
  data() {
    return {
      errorMessage: '',
      show: {
        stepOne: {
          birthday: false,
          howItWorks: false,
          progress: false
        }
      }
    }
  },
  computed: {},
  mounted() {},
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
