import { mapActions, mapGetters } from 'vuex'

export const searchMixin = {
  data() {
    return {
      searchConfig: {
        loading: false,
        options: {
          limit: 0,
          show: 9,
          type: ''
        },
        filter: {},
        search: {},
        moreResults: false
      }
    }
  },
  computed: {
    ...mapGetters({
      filters: 'database/filters',
      svgs: 'database/svgs'
    })
  },
  mounted() {
    this.getFilters().then(() => {
      this.searchConfig.loaded = true
    })
  },
  methods: {
    ...mapActions({
      getFilters: 'database/getFilters',
      getSvgsByFilter: 'database/getSvgsByFilter',
      getSvgsBySearch: 'database/getSvgsBySearch'
    }),
    updateSvgsByFilter(filterName) {
      // console.log('updateSvgs with filter', filterName)
      if (
        this.searchConfig.options.type === 'search' ||
        this.searchConfig.filter.name !== filterName
      ) {
        this.searchConfig.filter.startAfter = null
        this.resetSvgs()
      }
      this.searchConfig.loading = true
      this.searchConfig.options.limit = +this.searchConfig.options.show
      this.searchConfig.options.type = 'filter'
      this.searchConfig.filter = {
        ...this.searchConfig.filter,
        name: filterName,
        limit: this.searchConfig.options.limit
      }
      // console.log('this.searchConfig.filter', this.searchConfig.filter)
      this.getSvgsByFilter(this.searchConfig.filter).then(response => {
        setTimeout(() => {
          this.searchConfig.loading = false
          this.searchConfig.moreResults = true
          this.searchConfig.filter.startAfter = response.lastVisible
          // console.log('this.svgs', response)
          if (response.svgs.length < 1 && !response.lastVisible) {
            this.searchConfig.moreResults = false
          }
        }, 500)
      })
    },
    resetSvgs() {
      this.searchConfig.moreResults = false
      return this.$store.commit('database/resetSvgs')
    },
    updateSvgsBySearch(searchName) {
      // console.log('updateSvgs with search', searchName)
      this.resetSvgs()
      if (searchName.length < 1) {
        return
      }
      this.searchConfig.loading = true
      this.searchConfig.options.type = 'search'
      this.searchConfig.search = {
        ...this.searchConfig.search,
        name: searchName
      }
      this.getSvgsBySearch(this.searchConfig.search).then(response => {
        setTimeout(() => {
          this.searchConfig.loading = false
          // console.log('search response', response)
        }, 500)
      })
    }
  }
}
