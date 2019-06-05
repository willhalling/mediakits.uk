export const adminMixin = {
  beforeMount() {
    const user = this.ls_pullUser()
    if (!user) {
      this.$router.push('/')
    }
  }
}
