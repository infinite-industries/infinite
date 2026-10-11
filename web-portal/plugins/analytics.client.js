import {
  blockTrackingForMe,
  enableTrackingForMe,
  load,
  trackEvent,
  trackGoal,
  trackPageview
} from 'fathom-client'

/**
 * Central place for enabling analytics suites
 */
export default defineNuxtPlugin({
  name: 'analytics',
  async setup (nuxtApp) {
    const FATHOM_SITE_ID = nuxtApp.$config.public.fathomSiteId
    nuxtApp.vueApp.use({
      install(app) {
        app.config.globalProperties.$analytics = new Analytics(FATHOM_SITE_ID)
      }
    })
  }
})

class Analytics {
  constructor(fathomSiteId) {
    this.siteId = fathomSiteId
    if (fathomSiteId) {
      load(fathomSiteId, {
        // Fathom can hook into the History API directly to track navigation
        // without us having to hook it into Vue Router directly
        spa: 'auto',
        // BUT, this seems to be necessary to ensure Fathom gets the right
        // route on such navigations
        // (specifically, this disables checking the head for a
        // link[rel=canonical], in favor of just using the raw URL -- may be
        // an issue later but for now it's probably avoiding a timing issue
        // with updating the head)
        canonical: false
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
   * Track a specific event e.g. clicks on a particulr button, using the
   * legacy `trackGoal` approach
   *
   * @deprecated Fathom does not support this flow for new events
   */
  trackGoal (goal, value) {
    if (this.siteId) {
      trackGoal(goal, value)
    }
  }

  /**
   * Track a specific event e.g. clicks on a particular button
   *
   * @param {string} event - event name to be recorded (human-readable string)
   * @param {Object} [options]
   * @param {number} [options._value] - "value" of event in cents
   */
  trackEvent (event, options) {
    if (this.siteId) {
      trackEvent(event, options)
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
