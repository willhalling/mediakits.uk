export const quoteMixin = {
  computed: {
    dayOfTheYear() {
      const now = new Date()
      const start = new Date(now.getFullYear(), 0, 0)
      const difference = now - start
      const oneDay = 1000 * 60 * 60 * 24
      const day = Math.floor(difference / oneDay)
      return day
    },
    quoteDate() {
      const date = this.dateFromDay(2018, Number(this.quote.id))
      return this.formattedDate(date)
    }
  },
  methods: {
    dateFromDay(year, day) {
      const date = new Date(year, 0) // initialize a date in `year-01-01`
      return new Date(date.setDate(day)) // add the number of days
    },
    formattedDate(date) {
      // return moment(date).subtract(1, 'days').format('Do MMMM YYYY')
    }
  }
}
