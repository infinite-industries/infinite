/* eslint-disable */
import { initialQueryState, setQueryFetching, setQueryStateFail, setQueryStateSuccess } from '../helpers/queryState'
import { ApiService } from '../services/ApiService'

export const UPSERT_ADMIN_EVENT_METADATA = 'event-admin-metadata/UpsertEventAdminMetadata'

export const state = () => {
  return {
    getAllAdminEventMetaDataQuery: initialQueryState(),
    upsertEventMetaDataQuery: initialQueryState()
  }
}

export const getters = {
  GetAllAdminEventMetadataQuery: (state) => {
    return state.getAllAdminEventMetaDataQuery
  },

  GetUpsertEventMetaDataQuery: (state) => {
    return state.upsertEventMetaDataQuery
  }
}

export const mutations = {
  GET_ALL_ADMIN_EVENT_METADATA_FETCH_START: (state) => {
    setQueryFetching(state.getAllAdminEventMetaDataQuery)
  },
  GET_ALL_ADMIN_EVENT_METADATA_FETCH_SUCCESS: (state, payload) => {
    setQueryStateSuccess(state.getAllAdminEventMetaDataQuery, payload)
  },
  GET_ALL_ADMIN_EVENT_METADATA_FETCH_FAIL: (state, payload) => {
    setQueryStateFail(state.getAllAdminEventMetaDataQuery, payload)
  },

  GET_UPSERT_EVENT_METADATA_QUERY_FETCH_START: (state) => {
    setQueryFetching(state.upsertEventMetaDataQuery)
  },
  GET_UPSERT_EVENT_METADATA_FETCH_SUCCESS: (state, payload) => {
    setQueryStateSuccess(state.upsertEventMetaDataQuery, payload)
  },
  GET_UPSERT_EVENT_METADATA_FETCH_FAIL: (state, payload) => {
    setQueryStateFail(this.upsertAdminMetadata(state, payload))
  }
}

export const actions = {
  UpsertEventAdminMetadata: (context, { eventId, isProblem, idToken }) => {
    context.commit('GET_UPSERT_EVENT_METADATA_QUERY_FETCH_START')

    console.log('!!! isProblem: ' + isProblem)

    return ApiService.put(`/authenticated/events/${eventId}/admin-metadata`, { isProblem }, idToken)
      .then((response) => {
        context.commit('GET_UPSERT_EVENT_METADATA_FETCH_SUCCESS', response.data.eventAdminMetadata)
      })
      .catch((error) => {
        context.commit('GET_UPSERT_EVENT_METADATA_FETCH_FAIL', error)
      })
  }
}
