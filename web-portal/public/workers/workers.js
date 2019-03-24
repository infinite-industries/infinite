// This implementation of service workers is literally just here to "show"
// the browsers that we are fetching something.
// We are trying to get a prompt from Chrome to alert the user that they can
// add Infinite Industries as a button of their mobile device desktop


// Register Service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./fetch-content.js', { scope: '/' })
    .then(function() {
      console.log('Service Worker Registered')
    })
    .catch(function(err) {
      console.log('Service Worker Failed to Register', err)
    })

}
