import { useStore } from "vuex"

/**
 * useLegacyStoreFetch calls one or more Vuex store actions only once during
 * page load
 *
 * This is a util wrapper for handling the pre-Nuxt 3 way we fetched data with
 * the no-longer-supported `fetch` Nuxt-supplied lifecycle hook. It takes one
 * or more action names and dispatches them in parallel, returning a promise
 * that resolves when they have completed. When the promise has resolved, the
 * store state should be fully populated and ready to be referenced.
 *
 * Don't use this with new pages/code -- it should only be used to ease the
 * Nuxt 2 -> 3 migration
 *
 * @param key {string} - unique key for `callOnce`
 * @param actions {string | string[]} - one or more store actions to be called
 */
export default function useLegacyStoreFetch(key, actions) {
  const store = useStore()
  return callOnce(key, () =>
    Array.isArray(actions)
      ? Promise.all(actions.map((action) => store.dispatch(action)))
      : store.dispatch(actions)
  , { mode: 'navigation' })
}
