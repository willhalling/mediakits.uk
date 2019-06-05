export function addDisableBodyScroll() {
  document.documentElement.classList.add('gt-scroll-disable')
  document.body.classList.add('gt-scroll-disable')
}

export function removeDisableBodyScroll() {
  document.documentElement.classList.remove('gt-scroll-disable')
  document.body.classList.remove('gt-scroll-disable')
}

// Thanks to https://stackoverflow.com/a/7557433/5628
// @todo: add this to a util file
export function isElementInViewport(el) {
  if (!el) {
    return
  }
  const rect = el.getBoundingClientRect()
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
