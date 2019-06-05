<template>
  <ul class="adminSidebar">
    <li
      v-for="(item, index) in links"
      :class="classes(item.link)"
      :key="index"
      class="adminSidebar__item"
    >
      <button-cta @click="goTo(item.link)">{{ item.name }}</button-cta>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'AdminSidebar',
  props: {
    active: {
      type: String,
      required: false
    }
  },
  data() {
    return {
      links: [
        {
          name: 'dashboard',
          link: '/admin'
        },
        {
          name: 'Upload',
          link: '/admin/upload'
        },
        {
          name: 'Overlays',
          link: '/admin/overlays'
        },
        {
          name: 'Log Out',
          link: '/logged-out'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    classes(link) {
      return {
        ['adminSidebar__item--active']: link === this.active
      }
    },
    goTo(path) {
      this.$router.push(path)
    }
  }
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';

.adminSidebar {
  &__item {
    margin-bottom: $padding / 2;
  }
}
</style>
