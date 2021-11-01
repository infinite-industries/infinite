import { ApiService } from '../services/ApiService'
import { initialQueryState, setQueryFetching, setQueryStateFail, setQueryStateSuccess } from './utils/queryState'

export const state = () => {
  return {
    getActiveVenuesQuery: initialQueryState(),
    getDeletedVenuesQuery: initialQueryState(),
    deleteVenues: initialQueryState()
  }
}

export const getters = {
  GetAllActiveVenues: (state) => {
    return state.getActiveVenuesQuery
  },
  GetDeletedVenues: (state) => {
    return state.getDeletedVenuesQuery
  }
}

export const mutations = {
  ACTIVE_VENUES_FETCH_START: (state) => {
    setQueryFetching(state.getActiveVenuesQuery)
  },
  ACTIVE_VENUES_FETCH_SUCCESS: (state, payload) => {
    setQueryStateSuccess(state.getActiveVenuesQuery, payload)
  },
  ACTIVE_VENUES_FETCH_FAIL: (state, payload) => {
    setQueryStateFail(state.getActiveVenuesQuery, payload)
  },

  DELETED_VENUES_FETCH_START: (state) => {
    setQueryFetching(state.getDeletedVenuesQuery)
  },
  DELETED_VENUES_FETCH_SUCCESS: (state, payload) => {
    setQueryStateSuccess(state.getDeletedVenuesQuery, payload)
  },
  DELETED_VENUES_FETCH_FAIL: (state, payload) => {
    setQueryStateFail(state.getDeletedVenuesQuery, payload)
  },

  VENUE_DELETE_START: (state) => {
    setQueryFetching(state.deleteVenues)
  },
  VENUE_DELETE_SUCCESS: (state, { id, venue }) => {
    setQueryStateSuccess(state.deleteVenues, venue)

    if (state.getActiveVenuesQuery.isSuccess && !state.getActiveVenuesQuery.isFetching) {
      state.getActiveVenuesQuery.data = state.getActiveVenuesQuery.data.filter(venue => venue.id !== id)
    }

    if (state.getDeletedVenuesQuery.isSuccess && !state.getDeletedVenuesQuery.isFetching) {
      state.getDeletedVenuesQuery.data.push(venue)
    }
  },
  VENUE_DELETE_FAIL: (state, payload) => {
    setQueryStateFail(state.deleteVenues, payload)
  }
}

export const actions = {
  FetchActiveVenues: (context) => {
    context.commit('ACTIVE_VENUES_FETCH_START')

    return ApiService.get('/venues?includeDeleted=no')
      .then((_response) => {
        context.commit('ACTIVE_VENUES_FETCH_SUCCESS', _response.data.venues)
      })
      .catch((error) => {
        context.commit('ACTIVE_VENUES_FETCH_FAIL', error)
      })
  },

  FetchDeletedVenues: (context) => {
    context.commit('DELETED_VENUES_FETCH_START')

    return ApiService.get('/venues?includeDeleted=only')
      .then((_response) => {
        context.commit('DELETED_VENUES_FETCH_SUCCESS', _response.data.venues)
      })
      .catch((error) => {
        context.commit('DELETED_VENUES_FETCH_FAIL', error)
      })
  },

  DeleteVenue: (context, { id, idToken }) => {
    context.commit('VENUE_DELETE_START')

    return ApiService.delete(`/authenticated/venues/${id}`, idToken)
      .then((response) => {
        context.commit('VENUE_DELETE_SUCCESS', { id, venue: response.data.venue })
      })
      .catch((error) => {
        context.commit('VENUE_DELETE_FAIL', error)
      })
  }
}

export const FETCH_ACTIVE_VENUES = 'venues/FetchActiveVenues'
export const FETCH_DELETED_VENUES = 'venues/FetchDeletedVenues'
export const DELETE_VENUE = 'venues/DeleteVenue'
