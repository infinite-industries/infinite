// Simple fetch operation

self.addEventListener('install', function () {
  console.log('ServiceWorker Installed')
})

self.addEventListener('activate', function () {
  console.log('ServiceWorker Activated')
})

self.addEventListener('fetch', function () {
  console.log('ServiceWorker Fetching Content')
})
