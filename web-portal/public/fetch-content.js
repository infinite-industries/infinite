// Simple fetch operation

self.addEventListener('install', function(e) {
  console.log('ServiceWorker Installed')
})

self.addEventListener('activate', function(e) {
  console.log('ServiceWorker Activated')
})

self.addEventListener('fetch', function(e) {
  console.log('ServiceWorker Fetching Content')
})
