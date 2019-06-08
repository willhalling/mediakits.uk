<template>
  <div class="CanvasDownload">
    <spinner v-if="loading" />
    <div 
      v-if="imageInfo" 
      class="CanvasDownload__container">
      <img
        :src="downloadImage"
        class="gt-border-white gt-margin-bottom">
      <div>
        <list :items="imageInfo"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'CanvasDownload',
  data() {
    return {
      downloadImage: null,
      imageInfo: null
    }
  },

  computed: {
    ...mapGetters({
      isTouchDevice: 'user/isTouchDevice',
      loading: 'global/loading'
    }),
    imageSlug() {
      return this.$route.query.name ? this.$route.query.name : 'download'
    }
  },

  mounted() {
    this.$store.commit('global/updateLoading', true)
    this.downloadImage = sessionStorage.getItem('gt_canvas_img')
    this.getImageInfo()
  },
  methods: {
    getImageInfo() {
      if (this.downloadImage) {
        const img = new Image()
        img.onload = () => {
          this.imageInfo = [
            { key: 'Size (w x h)', value: `${img.width} x ${img.height} (300 DPI)` },
            // { key: 'File Size', value: '5mb' },
            { key: 'File type', value: 'PDF' },
            { key: 'File name', value: `${this.imageSlug}.pdf` }
          ]
          setTimeout(() => {
            this.$store.commit('global/updateLoading', false)
          }, 500)
        }
        img.src = this.downloadImage
      }
    },
    share() {
      let url = document.location.href
      const canonicalElement = document.querySelector('link[rel=canonical]')
      if (canonicalElement !== null) {
        url = canonicalElement.href
      }
      navigator.share({ url: url })
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/_variables.scss';
@import '../../../scss/_mixins.scss';

.CanvasDownload {
  background-color: #dedede;
  padding-top: $padding * 2;
  &__container {
    max-width: $siteWidth;
    padding: $padding;
    margin: 0 auto;
  }
}

// Desktop Styles
@include media-query('medium') {
  .CanvasDownload {
    padding-left: 0;
    padding-right: 0;
    &__container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-gap: $padding * 2;
      padding: 0;
    }
  }
}
</style>
