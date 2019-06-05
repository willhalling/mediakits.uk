export const ageMixin = {
  computed: {
    year() {
      return this.age.years
    },
    month() {
      return this.age.months
    },
    day() {
      return this.age.days
    },
  },
  methods: {
    isDayCounter(age) {
      return age.years === 0 && age.months === 0
    },
    isWeekCounter(age) {
      return age.days >= 7 && age.days < 31
    },
    isMonthCounter(age) {
      return age.years === 0
    },
    isYearCounter(age) {
      return age.years > 0
    },
    numberPath(age) {
      console.log('numberPath', age)
      if (this.isYearCounter(age)) {
        return 'years'
      }
      if (this.isDayCounter(age)) {
        if (this.isWeekCounter(age)){
          return 'weeks'
        }
        return 'days'
      } else if (this.isMonthCounter(age)) {
        return 'months'
      }
    }
  }
}
