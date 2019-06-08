<template>
  <div>
    <gt-header />
    <canvas-download />
    <progress-nav
      :step="step"
      :disable-save="disableSaveButton"
      @progress-next="nextStep"
    />
    
<gt-footer /></div></template>

<script>
import { mapGetters } from 'vuex'
import { progressNavMixin } from '~/mixins/progressNavMixin'

export default {
  name: 'Download',
  mixins: [progressNavMixin],
  transition: 'page',
  head() {
    return {
      title: 'Download | Easy Media Kit Maker',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Download your online media kit maker for your business.'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      step: 'global/step',
      userImage: 'user/image',
      userImages: 'user/images',
      website: 'user/website'
    })
  },
  mounted() {
    this.$store.commit('global/goToStep', 3)
  },
  methods: {}
}
</script>

<style lang="scss">
@import '../scss/typography.scss';
@import '../scss/variables.scss';
@import '../scss/mixins.scss';
.Download {
}
@include media-query('medium') {
  .Download {
  }
}
</style>
