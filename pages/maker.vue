<template>
  <div>
    <gt-header />
    <canvas-app
      ref="canvasApp"
      :user-image="userImage"
      :user-images="userImages"
      :website-data="websiteData"
      :fonts-ready="true"
    />

    <progress-nav
      :step="step"
      :disable-save="disableSaveButton"
      @progress-previous="previousStep"
      @progress-next="nextStep"/>
    
<gt-footer /></div></template>

<script>
import { mapGetters } from 'vuex'
import { progressNavMixin } from '~/mixins/progressNavMixin'

export default {
  name: 'Maker',
  mixins: [progressNavMixin],
  transition: 'page',
  head() {
    return {
      title: 'Easy Media Kit Online Maker',
      meta: [
        // hid is used as unique identifier. Do not use `vmid` for it as it will not work
        {
          hid: 'description',
          name: 'description',
          content: 'Online media kit maker for your business.'
        }
      ]
    }
  },
  computed: {
    ...mapGetters({
      step: 'global/step',
      userImage: 'user/image',
      userImages: 'user/images',
      websiteData: 'user/websiteData'
    })
  },
  mounted() {
    this.$store.commit('global/goToStep', 2)
  },
  methods: {
    nextStep() {
      if (this.step === 2) {
        this.$store.commit('user/updateExistingUser', true)
        return this.$refs.canvasApp.parentGenerateImage()
      }
    }
  }
}
</script>

<style lang="scss">
@import '../scss/typography.scss';
@import '../scss/variables.scss';
@import '../scss/mixins.scss';
.Maker {
}
@include media-query('medium') {
  .Maker {
  }
}
</style>
