<template>
  <div class="ProgressNav container">
    <button-cta
      v-if="step !== 1"
      aria-label="Previous step"
      theme="light"
      round
      @click.prevent="onPrevious"
    >
      <svg-base
        slot="icon"
        :viewbox-width="100"
        :viewbox-height="100"
        icon-name="SvgArrowPrev"
        width="32"
        height="32"
        colour="#000"
      >
        <component is="SvgArrowPrev"/>
      </svg-base>
      Back
    </button-cta>
    <button-cta
      v-scroll-to="'#top'"
      v-if="step !== 1"
      aria-label="Back to top"
      theme="light"
      round
    >
      <svg-base
        slot="icon"
        :viewbox-width="32"
        :viewbox-height="20"
        icon-name="SvgUpArrow"
        width="32"
        height="32"
        colour="#000"
      >
        <component is="SvgUpArrow"/>
      </svg-base>
      Top
    </button-cta>
    <button-cta
      v-if="step !== 3"
      :class="nextClasses"
      :disabled="disableSave"
      aria-label="Save Your Image"
      type="submit"
      theme="cta"
      round
      pulse
      no-border
      @click.prevent="onNext"
    >
      <svg-base
        slot="icon"
        :viewbox-width="100"
        :viewbox-height="100"
        :width="32"
        :height="32"
        icon-name="SvgArrowNext"
        colour="#132B37"
      >
        <component is="SvgArrowNext" />
      </svg-base>
      {{ nextText }}
    </button-cta>
    <button-cta
            v-if="step === 3"
            theme="cta"
            round
            pulse
            no-border
            @click="save">
      <svg-base
              slot="icon"
              :width="32"
              :height="32"
              icon-name="SvgDownload"
              colour="#000"
      >
        <component is="SvgDownload" />
      </svg-base>
      Download
    </button-cta>
  </div>
</template>

<script>
export default {
  name: 'ProgressNav',
  props: {
    step: {
      type: Number,
      required: true
    },
    disableSave: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  computed: {
    nextClasses() {
      return {
        ['ProgressNav__next']: this.step === 100
      }
    },
    nextText() {
      if (this.step === 1) {
        return 'Start'
      }
      if (this.step === 2) {
        return 'Save'
      }
      return 'Next'
    },
    imageSlug() {
      return this.$route.query.name ? this.$route.query.name : 'download'
    }
  },
  mounted() {},
  methods: {
    onPrevious() {
      this.$emit('progress-previous')
    },
    onNext() {
      if (this.step === 2) {
        this.$store.commit('global/updateLoading', true)
      }
      setTimeout(() => {
        this.$emit('progress-next')
      }, 500)
    },
    dataURLtoBlob(dataurl) {
      let arr = dataurl.split(','),
              mime = arr[0].match(/:(.*?);/)[1],
              bstr = atob(arr[1]),
              n = bstr.length,
              u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new Blob([u8arr], { type: mime })
    },
    save() {
      const downloadImage = sessionStorage.getItem('gt_canvas_img')
      const a = document.createElement('a')
      const blob = this.dataURLtoBlob(downloadImage)
      a.href = window.URL.createObjectURL(blob)
      a.download = `${this.imageSlug}.jpeg`
      a.click()
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';

.ProgressNav {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  justify-content: space-evenly;
  padding: $padding;
  &__next {
    margin-left: auto;
  }
}
</style>
