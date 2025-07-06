import { initialQueryState, setQueryFetching, setQueryStateFail, setQueryStateSuccess } from '../helpers/venue-store-helpers/queryState'

export const UPSERT_ADMIN_EVENT_METADATA = 'event-admin-metadata/UpsertEventAdminMetadata'

export const state = () => {
  return {
    getAllAdminEventMetaDataQuery: initialQueryState(),
    upsertEventMetaDataQuery: initialQueryState()
  }
}

export const mutations = {
  GET_UPSERT_EVENT_METADATA_QUERY_FETCH_START: (state) => {
    setQueryFetching(state.upsertEventMetaDataQuery)
  },
  GET_UPSERT_EVENT_METADATA_FETCH_SUCCESS: (state, payload) => {
    setQueryStateSuccess(state.upsertEventMetaDataQuery, payload)
  },
  GET_UPSERT_EVENT_METADATA_FETCH_FAIL: (state, payload) => {
    console.error('error updating admin metadata: ' + payload)
    setQueryStateFail(state, payload)
  }
}

export const actions = {
  UpsertEventAdminMetadata: function (context, { eventId, isProblem, idToken }) {
    context.commit('GET_UPSERT_EVENT_METADATA_QUERY_FETCH_START')

    return useNuxtApp().$apiService.put(`/authenticated/events/${eventId}/admin-metadata`, { isProblem }, idToken)
      .then((response) => {
        context.commit('admin/UPDATE_ADMIN_METADATA', { eventId, newMetaDateEntry: response.data.eventAdminMetadata }, { root: true })
        context.commit('GET_UPSERT_EVENT_METADATA_FETCH_SUCCESS', response.data.eventAdminMetadata)
      })
      .catch((error) => {
        context.commit('GET_UPSERT_EVENT_METADATA_FETCH_FAIL', error)
        context.commit('ui/SHOW_NOTIFICATIONS', {
          open: true,
          message: `there was a problem updating the admin event metadata: "${error}"`
        }, { root: true })
      })
  }
}
