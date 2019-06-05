export const canvasMixin = {
  methods: {
    goToTheme(id) {
      // console.log('goToTheme', id)
      this.$router.push({ path: '/', query: { theme: id } })
    }
  }
}
