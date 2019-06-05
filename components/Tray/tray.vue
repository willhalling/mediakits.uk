<template>
  <div
    v-show="openTray"
    v-cloak
    class="tray"
  >
    <transition :name="direction">
      <div
        :class="{ 'tray__wrapper--active': active }"
        class="tray__wrapper"
      >
        <div class="tray__body tray__body--scroll">
          <slot name="tray-body" />
        </div>
        <div class="tray__footer">
          <div class="tray__meta">
            <slot name="tray-meta" />
          </div>
          <div class="tray__controls">
            <slot name="tray-controls"/>
          </div>
        </div>
      </div
        v-show="active">
    </transition>
  </div>
</template>

<script>
import {
  addDisableBodyScroll,
  removeDisableBodyScroll
} from '../../utils/scroll'

export default {
  name: 'Tray',
  props: {
    active: {
      type: Boolean,
      default: false
    },
    direction: {
      type: String,
      default: 'menu-open'
    }
  },
  data() {
    return {
      openTray: false
    }
  },
  updated() {
    if (this.active) {
      addDisableBodyScroll()
      this.openTray = true
    } else {
      removeDisableBodyScroll()
      setTimeout(() => {
        this.openTray = false
      }, 500)
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/variables';
@import '../../scss/mixins';
@import './tray.scss';
</style>
