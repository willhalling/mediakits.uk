<template>
  <div class="DatePicker">
    <div
      v-if="!error"
      class="DatePicker__preview">
      {{ previewAge }}
    </div>
    <div 
      v-if="date"
      class="DatePicker__group">
      <div class="DatePicker__item">
        <dropdown
          v-if="formOptions.day.length > 1"
          v-model="fields.day"
          :error="formError"
          :options="formOptions.day"
          :initial-selection="formOptions.dropdownDefaults.day"
          name="day"
          choose-text="Day"
          @input="onInput()"
        />
      </div>
      <div class="DatePicker__item">
        <dropdown
          v-model="fields.month"
          :error="formError"
          :options="formOptions.month"
          :initial-selection="formOptions.dropdownDefaults.month"
          name="month"
          class="DatePicker__item"
          choose-text="Month"
          @input="onInput()"
        />
      </div>
      <div class="DatePicker__item">
        <dropdown
          v-model="fields.year"
          :error="formError"
          :options="formOptions.year"
          :initial-selection="formOptions.dropdownDefaults.year"
          name="year"
          class="DatePicker__item"
          choose-text="Year"
          @input="onInput()"
        />
      </div>
    </div>
    <div 
      v-if="error" 
      class="DatePicker__error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { isValidDate } from '~/utils/date'
const dateFormat = require('dateformat')
import { localStorageMixin } from '~/mixins/localStorageMixin'
import { mapGetters } from 'vuex'

let MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'July',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

Array.range = (start, end) =>
  Array.from({ length: end - start }, (v, k) => {
    const year = Math.abs(k - end)
    return {
      name: year,
      value: year
    }
  })

export default {
  name: 'DatePicker',
  mixins: [localStorageMixin],
  props: {
    formError: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formOptions: {
        month: [],
        year: [],
        day: [],
        dropdownDefaults: {
          day: 0,
          month: 0,
          year: 0
        }
      },
      today: '',
      fields: {
        day: '',
        month: '',
        year: ''
      },
      error: '',
      date: null
    }
  },
  scrollToTop: true,

  computed: {
    ...mapGetters({
      photoDate: 'user/photoDate',
      rawBirthday: 'user/rawBirthday',
      age: 'user/age'
    }),
    classes() {
      return {
        [`DatePicker--error`]: this.formError
      }
    },
    previewDate() {
      return dateFormat(this.rawBirthday, 'dddd d mmmm, yyyy')
    },
    previewAge() {
      return this.age.text
    }
  },

  mounted() {
    // Need to reset photo date when going back to step 1, so previewAge is correct
    this.$store.commit('user/updatePhotoDate', new Date())
    this.$store.commit('user/resetImage')
    this.$store.commit('user/resetImages')
    // End reset

    
    this.date = this.getDate()
    this.formOptions.day = this.getDays()
    this.formOptions.month = this.getMonths()
    this.formOptions.year = this.getYears()

    // Update local state so fields are pre-populated
    this.updateDatePickerFields()

    this.updateFormOptions()

    this.formOptions.dropdownDefaults = {
      day: this.date.getDate(),
      month: this.date.getMonth() + 1,
      year: this.date.getFullYear()
    }
  },

  methods: {
    getDate() {
      if (this.rawBirthday) {
        return new Date(this.rawBirthday)
      }
      return new Date()
    },
    getDays(currentDate) {
      const date = currentDate ? currentDate : this.date
      return new Array(
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
      )
        .fill(1)
        .map((value, index) => {
          return {
            name: value + index,
            value: value + index
          }
        })
    },
    getMonths() {
      return MONTHS.map((month, index) => {
        return {
          name: month,
          value: index + 1
        }
      })
    },
    getYears() {
      return Array.range(1983, new Date().getFullYear())
    },
    updateDatePickerFields() {
      this.fields = {
        day: this.date.getDate(),
        month: this.date.getMonth() + 1,
        year: this.date.getFullYear()
      }
    },
    convertObjectToDate(dateObject) {
      const dateString = `${dateObject.month}/${dateObject.day}/${
        dateObject.year
      }`
      return new Date(dateString)
    },
    onInput() {
      this.updateFormOptions()
      const date = this.convertObjectToDate(this.fields)
      this.$emit('on-update-birthday', date)
    },
    // updateFormOptions fn trims the days/months so user cannot select a birthday in the future
    // (means we don't have to display an error message
    updateFormOptions() {
      const currentDate = this.previewDate
        ? new Date(this.previewDate)
        : this.date
      const today = new Date()
      // When changing months need to change number of days displayed
      this.formOptions.day = this.getDays(currentDate)

      // If is current year we need to format months depending on what month it is.
      const isCurrentYear = today.getFullYear() === Number(this.fields.year)
      const isCurrentMonth = today.getMonth() + 1 === Number(this.fields.month)

      const monthName = this.formOptions.month[currentDate.getMonth()]
      /*
      let potentialFutureDate = `${currentDate.getDate()} ${
        monthName.name
      }, ${todayYear}`
      potentialFutureDate = new Date(potentialFutureDate)

      const isPotentialFutureDate = potentialFutureDate > todayDate

      if (isPotentialFutureDate) {
        this.formOptions.year = this.formOptions.year.map((item, index) => {
          return {
            ...item
          }
        })
      } else {
        this.formOptions.year = this.getYears()
      }
       */
      if (isCurrentYear) {
        // disable dates that are in the future
        this.formOptions.month = this.formOptions.month.map((item, index) => {
          return {
            ...item
          }
        })
        if (isCurrentMonth) {
          // disable dates that are in the future
          this.formOptions.day = this.formOptions.day.map((item, index) => {
            return {
              ...item
            }
          })
          this.formOptions.dropdownDefaults.day = this.formOptions.day.length
        }
      } else {
        this.formOptions.month = this.getMonths()
        this.formOptions.day = this.getDays(currentDate)
      }
    },
    dateFormat: dateFormat
  }
}
</script>

<style lang="scss">
@import '../../../scss/_variables.scss';
@import '../../../scss/_colours.scss';
@import '../../../scss/_mixins.scss';

.DatePicker {
  &__group {
    padding-top: $padding / 2;
    text-align: center;
  }
  &__item {
    margin-bottom: $padding;
  }
  &__preview,
  &__error {
    color: $white;
    font-style: italic;
    font-size: $text-s;
    text-align: center;
    margin-bottom: $padding;
  }
  &__error {
    color: $danger-button;
  }
  .field__input {
    border: 1px solid $white;
    padding: $padding / 2;
    width: 100%;
  }
  &__input {
    &--noLeftRightBorder.field__input {
      border-left: 0;
      border-right: 0;
    }
  }
}
// Desktop styles
@include media-query('small') {
  .DatePicker {
    &__group {
      display: flex;
      justify-content: space-between;
      margin: 0 auto $padding auto;
      width: 360px;
    }
    &__item {
      margin-bottom: 0;
    }
  }
}
</style>
