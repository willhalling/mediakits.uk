<template>
  <div class="Download">
    <div>
      <img
        :src="downloadImage"
        class="gt-border-white gt-margin-bottom">
    </div>
    <div>
      <list
        :items="imageInfo"
        class="gt-margin-bottom-x-large" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Download',
  data() {
    return {
      downloadImage: null,
      imageInfo: null
    }
  },

  computed: {
    ...mapGetters({
      isTouchDevice: 'user/isTouchDevice'
    }),
    imageSlug() {
      return this.$route.query.name ? this.$route.query.name : 'download'
    }
  },

  mounted() {
    this.downloadImage = sessionStorage.getItem('gt_canvas_img')
    this.getImageInfo()
    setTimeout(() => {
      this.$store.commit('global/updateLoading', false)
    }, 500)
  },
  methods: {
    getImageInfo() {
      if (this.downloadImage) {
        const img = new Image()
        img.onload = () => {
          this.imageInfo = [
            { key: 'Size (w x h)', value: `${img.width} x ${img.height}` },
            // { key: 'File Size', value: '5mb' },
            { key: 'File type', value: 'JPEG' },
            { key: 'File name', value: `${this.imageSlug}.jpeg` }
          ]
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
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';

.Download {
  max-width: $siteWidth;
  padding: 0 $padding;
  margin: 0 auto;
}

// Desktop Styles
@include media-query('medium') {
  .Download {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: $padding;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>
