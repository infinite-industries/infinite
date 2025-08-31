const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:7779",
    env: {
      api_url: "http://localhost:3003/v1",
      auth_url: "https://1nfinite.auth0.com/oauth/token",
      auth_audience: "https://1nfinite.auth0.com/api/v2/",
      auth_client_id: "PYKhof4U0jKE3v4h8xKSgihHz9atBE5O"
    },
    specPattern: 'e2e/**.js',
    fixturesFolder: "fixtures",
    screenshotsFolder: "screenshots",
    supportFile: "support/index.js",
    videosFolder: "videos",
    setupNodeEvents(on, config) {
      on('before:browser:launch', (browser, launchOptions) => {
        if (browser.family === 'firefox') {
          console.log(`\n\n\n\nbrowser is FF\n\n\n\n`)
          launchOptions.preferences['network.proxy.testing_localhost_is_secure_when_hijacked'] = true
        }
        return launchOptions
      })
      return config
    }
  }
})
