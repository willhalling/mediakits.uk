export default function ({ store, route, redirect }) {
  const isMediumSize = process.client
    ? window.matchMedia('(min-width: 1024px)')
    : true
  store.commit('global/updateIsMediumSize', isMediumSize)
}
