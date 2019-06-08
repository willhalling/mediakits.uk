import { mapGetters } from 'vuex'

export const progressNavMixin = {
  computed: {
    ...mapGetters({
      step: 'global/step'
    }),
    disableSaveButton() {
      if (this.step > 1) {
        return false
      }
      return false
    }
  },
  methods: {
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
