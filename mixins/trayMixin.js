export const trayMixin = {
  data() {
    return {
      trays: {
        edit: {
          id: 'edit',
          open: false,
          current: ''
        },
        date: {
          id: 'date',
          open: false,
          current: ''
        },
        navigation: {
          id: 'navigation',
          open: false,
          current: ''
        }
      }
    }
  },
  methods: {
    toggleTray(type, id) {
      // console.log('toggleTray type', type)
      // console.log('toggleTray id', id)
      if (id === 'date') {
        type = 'date'
      }
      this.trays[type] = {
        ...this.trays[type],
        current: id,
        open: !this.trays[type].open
      }
    },
    closeTray(type) {
      const currentId = this.trays[type].current
      this.trays[type].open = false
      this.$refs.canvasContainer.discardActiveObject()
      // When we close the tray we call updateTheme to update the specific date/object
      if (currentId) {
        this.$refs.canvasContainer.updateTheme(currentId)
      }
    },
  }
}
