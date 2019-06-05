importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/app.js",
    "revision": "465a86a28facee5364e8ae8f9047f8a1"
  },
  {
    "url": "/_nuxt/commons.app.js",
    "revision": "4f4384f5e702e3585478a9af111371d7"
  },
  {
    "url": "/_nuxt/pages/about.js",
    "revision": "ceb33f39ddc8b123cf076a585d36b83c"
  },
  {
    "url": "/_nuxt/pages/admin/index.js",
    "revision": "b2460b0a90b1166a74b310e8d260c05f"
  },
  {
    "url": "/_nuxt/pages/admin/overlays.js",
    "revision": "525390fff6435fd2e07c80831304cba0"
  },
  {
    "url": "/_nuxt/pages/admin/upload.js",
    "revision": "4e0b1108cab928ad98a394b145252571"
  },
  {
    "url": "/_nuxt/pages/articles/add-date-or-age-stamp-to-your-photos.js",
    "revision": "abf3b27418516adcb29ea2f5eeccf566"
  },
  {
    "url": "/_nuxt/pages/feedback.js",
    "revision": "81df91ae1c5eab6e2c10d8cb4d2e0481"
  },
  {
    "url": "/_nuxt/pages/index.js",
    "revision": "5e96f61c3a7ba02c0da563886b973f23"
  },
  {
    "url": "/_nuxt/pages/logged-out.js",
    "revision": "dbdc271ecdc67f1333118106ceeab09a"
  },
  {
    "url": "/_nuxt/pages/login.js",
    "revision": "26ef3e4b136a7afa8f72792e0ad4e466"
  },
  {
    "url": "/_nuxt/pages/privacy.js",
    "revision": "8116d67dd657198a176cd44fd5d54650"
  },
  {
    "url": "/_nuxt/pages/thank-you.js",
    "revision": "6a808b5cb9e1ca1b67e3d717b4c079f9"
  },
  {
    "url": "/_nuxt/runtime.js",
    "revision": "01bc213b48bbb8ae68c532d8d639c1a8"
  },
  {
    "url": "/_nuxt/vendors.app.js",
    "revision": "1b082ad96836ff37bd704a1cc56a5cc6"
  }
], {
  "cacheId": "Baby-By-Month",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
