import {
  blockTrackingForMe,
  enableTrackingForMe,
  load,
  trackGoal,
  trackPageview
} from 'fathom-client'

/**
 * Central place for enabling analytics suites
 */
export default ({ $config }, inject) => {
  const FATHOM_SITE_ID = $config.FATHOM_SITE_ID
  inject('analytics', new Analytics(FATHOM_SITE_ID))
}

class Analytics {
  constructor(fathomSiteId) {
    this.siteId = fathomSiteId
    if (fathomSiteId) {
      load(fathomSiteId, {
        spa: 'auto'
      })
    }
  }

  /**
   * Manually track a page view (you probably don't need to do this)
   */
  trackPageView (...args) {
    if (this.siteId) {
      trackPageview(...args)
    }
  }

  /**
   * Track a specific event e.g. clicks on a particular button
   */
  trackEvent (goal, value) {
    if (this.siteId) {
      trackGoal(goal, value)
    }
  }

  /**
   * Enable analytics for this session (persisted to LocalStorage)
   */
  enable () {
    if (this.siteId) {
      enableTrackingForMe()
    }
  }

  /**
   * disable analytics for this user (persisted to LocalStorage)
   */
  disable () {
    if (this.siteId) {
      blockTrackingForMe()
    }
  }
}
