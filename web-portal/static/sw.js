importScripts('/_nuxt/workbox.4c4f5ca6.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/07f74e20b814570bf87b.js",
    "revision": "fc3b840fb30156b2d41d9401cd60f981"
  },
  {
    "url": "/_nuxt/087b7ae217384e980385.js",
    "revision": "164f2b4e3aeb50533901ef398fc2a6fb"
  },
  {
    "url": "/_nuxt/08bacc786ad2afb221a1.js",
    "revision": "7ae30a6114d80c61e68ba12dc93f2b12"
  },
  {
    "url": "/_nuxt/14d2a4cfb4336b2f031c.js",
    "revision": "c556adf3de980fef653d237ccc385547"
  },
  {
    "url": "/_nuxt/1521490b01368beebf89.js",
    "revision": "976fc2dd2c9dc4f5fa3d909a866c6ac6"
  },
  {
    "url": "/_nuxt/2803d526ff231fccca9d.js",
    "revision": "ae5272a06da4df4452f5668715e49068"
  },
  {
    "url": "/_nuxt/297e01f68cf553882cd8.js",
    "revision": "ccb7b11509551f75b70dab7375e78292"
  },
  {
    "url": "/_nuxt/2e145ded1034e8303407.js",
    "revision": "dfb8d404831bcfa074e4f2ce5ade3250"
  },
  {
    "url": "/_nuxt/394064ee19d333826e6b.js",
    "revision": "1818c15d64f42d33daffcc70ff517b3f"
  },
  {
    "url": "/_nuxt/70261d657534e35cde35.js",
    "revision": "8a8e7799b60ea72cf9ca04bc490d7e34"
  },
  {
    "url": "/_nuxt/716902dcb8604c0ec76e.js",
    "revision": "2c6dc2240ba5c260579622ef547d959b"
  },
  {
    "url": "/_nuxt/73c9ee0e20e0366ac348.js",
    "revision": "2c9cfbee798ec9567cbae97c3e822a9c"
  },
  {
    "url": "/_nuxt/81e7b5e5b6089b96a786.js",
    "revision": "153f8f3e5150396ce09298ca95606fb9"
  },
  {
    "url": "/_nuxt/92d00320647d722ab971.js",
    "revision": "21862a313e44782e374e1cd9e1c85276"
  },
  {
    "url": "/_nuxt/a646ee583bd68c339b0e.js",
    "revision": "97941b183958e65cacd335454e3a2679"
  },
  {
    "url": "/_nuxt/b246e41c0e43315f9f63.js",
    "revision": "28505b0582fbd8bfb295c65a5377fa46"
  },
  {
    "url": "/_nuxt/b58911384c1e6bcbbf16.js",
    "revision": "171b5d7212223060ea55a9a58386c787"
  },
  {
    "url": "/_nuxt/d52a4f5aa0f939ce14b7.js",
    "revision": "102bf2772e2f5806d81d504d296f5c4c"
  },
  {
    "url": "/_nuxt/e894fa052c904992425e.js",
    "revision": "a1b5a81a92c4a9388740b41328a9d0b9"
  },
  {
    "url": "/_nuxt/f8ad3670002936ffebcf.js",
    "revision": "c229bd0788bda43d377a0d08617930e6"
  }
], {
  "cacheId": "web-portal",
  "directoryIndex": "/",
  "cleanUrls": false
})

workbox.clientsClaim()
workbox.skipWaiting()

workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')
