<template>
  <div>
    <div class="search__box">
      <input
        :value="search"
        :placeholder="`Search ${totalOverlays} overlays...`"
        aria-label="Search Overlays"
        class="search__input"
        @input="updateSearch"
        @focus="state.active = true"
        @blur="state.active = false"
      >
    </div>
    <div
      class="search__wrap">
      <div class="search__container">
        <transition-group name="u-fade-in">
          <svg-stickers
            :key="1"
            :icons="filteredStickers"
            :admin="admin"
            @addSvg="onAddSvg"
            @removeSvg="onRemoveSvg"
          />
          <spinner 
            v-if="loading" 
            :key="2" />
          <div
            v-if="noResults && !delay"
            :key="3"
            class="search__noResults">{{ noResultsText }}</div>
          <button-cta
            v-if="search"
            :disabled="!moreResults"
            :key="4"
            class="gt-margin-bottom"
            @click="handleUpdateFilter(search)"
          >
            <span v-if="moreResults">Load more</span>
            <span v-else>All Loaded</span>
          </button-cta>
        </transition-group>
      </div>
      <div class="search__filters">
        <span class="search__filterItem search__filterText">Filter by:</span>
        <a
          v-scroll-to="'#slider'"
          v-for="(filter, index) in filters"
          :key="index"
          class="search__filterItem search__link"
          href
          @click.prevent="handleUpdateFilter(filter.name)">{{ filter.name }} <span class="search__filterItem__sub">({{ filter.length }})</span></a>
      </div>
    </div>
  </div>
</template>

<script>
import {
  GRATITUDE_STICKERS,
  NEW_BABY_STICKERS,
  PREGNANCY_STICKERS,
  OTHER_STICKERS,
  EMOJI_STICKERS,
  PHRASES_STICKERS
} from '../../../constants/svg-stickers'
import Spinner from '../../Spinner/spinner'

export default {
  name: 'Search',
  components: { Spinner },
  props: {
    placeholder: {
      type: String,
      required: false
    },
    filters: {
      type: Array,
      required: true
    },
    svgs: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    },
    moreResults: {
      type: Boolean,
      default: true
    },
    admin: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      state: {
        active: false,
        success: false,
        error: false
      },
      search: null,
      delay: true
    }
  },

  computed: {
    filteredStickers() {
      return this.svgs.map(svg => {
        return {
          ...svg,
          added: false
        }
      })
    },
    noResults() {
      return this.svgs.length < 1 && this.search
    },
    noResultsText() {
      return `No results for "${this.search}".`
    },
    totalOverlays() {
      if (this.filters) {
        return this.filters.reduce((sum, { length }) => sum + length, 0)
      }
    }
  },

  methods: {
    onClick() {
      const input = this.$el.children[1]
      input.focus()
    },
    onInput(value) {
      this.$emit('input', value)
    },
    onAddSvg(svg) {
      this.$emit('onAddSvg', svg)
    },
    onRemoveSvg(svg) {
      this.$emit('onRemoveSvg', svg)
    },
    handleUpdateFilter(filter) {
      this.reset()
      this.search = filter
      this.$emit('onUpdateFilter', filter)
      this.trackSearch(this.search)
    },
    reset() {
      this.state.active = false
      this.state.success = false
      this.state.error = false
    },
    trackSearch(value) {
      // Google analytics tracking
      this.$router.push({ query: { q: value } })
    },
    noSearchTextDelay() {
      setTimeout(() => {
        this.delay = false
      }, 500)
    },
    updateSearch(e) {
      this.reset()
      this.search = e.target.value
      // Only search when search string is NOT empty
      this.$emit('onUpdateSearch', this.search)
      this.trackSearch(this.search)
      this.noSearchTextDelay()
    }
  }
}
</script>

<style lang="scss">
@import '../../../scss/variables.scss';
@import './search.scss';
</style>
