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
  }
}
