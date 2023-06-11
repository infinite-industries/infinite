/**
 * Central place for enabling analytics suites
 */
export default ({ $config }, inject) => {
  const FATHOM_SITE_ID = $config.FATHOM_SITE_ID
  console.log(FATHOM_SITE_ID)
  inject('analytics', new Analytics(FATHOM_SITE_ID))
}

class Analytics {
  constructor(fathomSiteId) {
    this.siteId = fathomSiteId
    // TODO: load Fathom (consider https://npmjs.com/package/fathom-client)
    // TODO: how to short-circuit here if ID not provided?
  }

  trackPageView (...args) {
    // TBD
  }

  trackGoal (...args) {
    // TBD
  }

  enable () {
    // TBD
  }

  disable () {
    // TBD
  }

  setConfig ({ fathomSiteId }) {
    if (fathomSiteId) {
      // TBD
    }
  }
}
