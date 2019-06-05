<template>
  <header
    id="header"
    :class="classes"
    class="gt-header"
  >
    <div class="gt-header__container gt-height-100">
      <h1 class="gt-header__logo">
        <a href="/">
          <logo :width="200" />
        </a>
      </h1>
      <transition name="u-fade-in">
        <div
          class="text-right"
        >
          <a
            aria-label="Open or close menu"
            href
            class="gt-flex gt-align-items-center gt-justify-content-flex-end gt-height-100"
            @click.prevent="toggleMobileMenu"
          >
            <div
              :class="{ 'gt-header__dots--active': menu.open }"
              class="gt-header__dots"
            >
              <div class="gt-header__dot"/>
            </div>
          </a>
        </div>
      </transition>
    </div>

    <transition name="menu-open">
      <ul
        v-if="menu.open"
        :class="['gt-header__menu', { 'gt-header__menu--active': menu.open}]">
        <li
          v-for="(item, index) in menu.items"
          :key="index"
          class="gt-header__menuItem">
          <nuxt-link 
            :to="item.link" 
            class="gt-header__menuItem__link">{{ item.title }}</nuxt-link>
        </li>
      </ul>
    </transition>

  </header>
</template>

<script>
export default {
  name: 'GtHeader',
  props: {
    active: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      menu: {
        open: false,
        items: [
          { title: 'Home', link: '/' },
          { title: 'About', link: '/about' },
          { title: 'Privacy', link: '/privacy' },
          { title: 'Feedback', link: '/feedback' }
        ]
      }
    }
  },
  computed: {
    classes() {
      return {
        ['gt-header--active']: this.active
      }
    }
  },
  methods: {
    toggleMobileMenu() {
      if (this.menu.open) {
        setTimeout(() => {
          this.menu.open = false
        })
      } else {
        this.menu.open = true
      }
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_colours.scss';
@import '../../scss/_mixins.scss';

$dotShapeSize: 0.857em;
$headerMenuTopMargin: 60px;

@keyframes header-height {
  0% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  100% {
    opacity: 0;
    transform: translate3d(0, -60px, 0);
  }
}

.gt-header {
  background-color: $primary-background;
  padding: 0 $padding;
  height: $headerHeight;
  // transition: all 0.6s ease-in-out;
  // transform: translate3d(0, -60px, 0);
  &--active {
    animation: header-height 1s forwards;
  }

  &__container {
    display: flex;
    justify-content: space-between;
    max-width: $siteWidth;
    margin: 0 auto;
  }

  &__logo {
    align-items: center;
    display: flex;
    cursor: pointer;
    height: 100%;
    margin: 0;
  }

  &__dot,
  &__dot:before,
  &__dot:after {
    position: absolute;
    width: $dotShapeSize;
    height: $dotShapeSize;
    border-radius: $dotShapeSize;
    background-color: $black;
  }

  &__dot {
    top: 50%;
    right: 0;
    margin-top: (-$dotShapeSize / 2);
    margin-left: (-$dotShapeSize / 2);
    background-color: $primary-colour;
    &:before,
    &:after {
      content: '';
    }
    &:before {
      right: $dotShapeSize + 0.357; // + 5px
      transition: right 0.3s ease-out;
      background-color: $secondary-colour;
    }
    &:after {
      left: $dotShapeSize + 0.357; // + 5px
      transition: left 0.3s ease-out;
      background-color: $secondary-colour;
    }
  }

  &__dots {
    position: relative;
    margin-right: $padding;
    &--active .gt-header__dot:before {
      right: -($dotShapeSize + 0.357);
    }
    &--active .gt-header__dot:after {
      left: -($dotShapeSize + 0.357);
    }
  }

  // Header Menu that opens when user clicks on 3 dots.
  // Associated animation can be found in _transitions.scss
  &__menu {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    flex-direction: column;
    top: $headerMenuTopMargin;
    left: 0;
    right: 0;
    bottom: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    padding: 0;
    z-index: 40;
    background-color: $secondary-colour;
    &--active {
      &:after {
        animation-name: sizeup-c;
        animation-direction: normal;
      }
      .opener__s {
        transition-delay: 0s;
        &:first-of-type,
        &:last-of-type {
          transform: rotate(0deg);
        }
      }
    }
  }

  &__menuItem {
    font-family: $tertiaryFont;
    font-size: $text-xl;
    &:first-child {
      margin-top: -($headerMenuTopMargin);
    }
    &__link {
      color: $white;
      display: block;
      text-decoration: none;
      margin-bottom: $padding / 2;
      transition: color $transition;
      &:hover,
      &:focus {
        color: $primary-colour;
      }
    }
  }
}

// Desktop styles
@include media-query('small') {
  .gt-header {
    // margin-bottom: $padding;
  }
}
</style>
