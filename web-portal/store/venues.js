import {
  initializeVenuesEdited,
  initialQueryState,
  initialVenueUpdateQueries,
  setQueryFetching,
  setQueryStateFail,
  setQueryStateSuccess, setQueryUpdateSuccess, setQueryUpdating
} from '@/helpers/venue-store-helpers/queryState'
import { doVenueUpdate, replaceVenue } from '@/helpers/venue-store-helpers/doVenueUpdate'
import { COMMIT_SHOW_NOTIFICATIONS } from '@/store/ui'
import {
  moveVenueFromActiveToInactiveList,
  moveVenueFromInactiveToActiveList
} from '@/helpers/venue-store-helpers/moveVenueBetweenActiveInactive'

export const ACTIVE_VENUE_SELECTION = 'Active Venues'

export const state = () => {
  return {
    getActiveVenuesQuery: initialQueryState(),
    getDeletedVenuesQuery: initialQueryState(),
    getCoordinatesFromUrlQuery: initialQueryState(),
    deleteVenues: initialQueryState(),
    activateVenueQuery: initialQueryState(),
    venueUpdateQueries: initialVenueUpdateQueries(),
    venuesEdited: initializeVenuesEdited(),
    activeFilterState: ACTIVE_VENUE_SELECTION
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
    state.venuesEdited = initializeVenuesEdited()
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
    moveVenueFromActiveToInactiveList(state, id, venue)
  },
  VENUE_DELETE_FAIL: (state, payload) => {
    setQueryStateFail(state.deleteVenues, payload)
  },

  VENUE_ACTIVATE_START: (state) => {
    setQueryFetching(state.activateVenueQuery)
  },
  VENUE_ACTIVATE_SUCCESS: (state, { id, venue }) => {
    setQueryStateSuccess(state.activateVenueQuery, venue)
    moveVenueFromInactiveToActiveList(state, id, venue)
  },
  VENUE_ACTIVATE_FAIL: (state, payload) => {
    setQueryStateFail(state.activateVenueQuery, payload)
  },

  VENUE_UPDATE_START: (state, { id }) => {
    setQueryUpdating(state.venueUpdateQueries, id)
  },
  VENUE_UPDATE_SUCCESS: (state, { venue }) => {
    setQueryUpdateSuccess(state.venueUpdateQueries, venue.id, venue)
    state.venuesEdited[venue.id] = false

    doVenueUpdate(state, venue)
  },
  VENUE_UPDATE_FAIL: (state, { id, error }) => {
    setQueryStateFail(state.activateVenueQuery, id, error)
  },

  VENUE_REPLACE_START: (state, { id }) => {
    setQueryUpdating(state.venueUpdateQueries, id)
  },
  VENUE_REPLACE_SUCCESS: (state, { oldVenue, newVenue }) => {
    setQueryUpdateSuccess(state.venueUpdateQueries, oldVenue.id, newVenue)

    // update the active entry with the newly created venue
    state.getActiveVenuesQuery.data = replaceVenue(state.getActiveVenuesQuery.data, oldVenue.id, newVenue)

    // put the old venue on the deleted/inactive venue list
    state.getDeletedVenuesQuery.data.push(oldVenue)

    state.venuesEdited[oldVenue.id] = false
  },
  VENUE_REPLACE_FAIL: (state, { id, error }) => {
    setQueryStateFail(state.activateVenueQuery, id, error)
  },

  GPS_COORDINATES_FETCH_START: (state) => {
    setQueryFetching(state.getCoordinatesFromUrlQuery)
  },
  GPS_COORDINATES_FETCH_SUCCESS: (state, payload) => {
    state.venuesEdited = initializeVenuesEdited()
    setQueryStateSuccess(state.getCoordinatesFromUrlQuery, payload)
  },
  GPS_COORDINATES_FETCH_FAIL: (state, payload) => {
    setQueryStateFail(state.getCoordinatesFromUrlQuery, payload)
  },

  VENUE_CHANGE_ACTIVE_FILTER_STATE: (state, newFilterState) => {
    state.activeFilterState = newFilterState
  },

  // edits local state (not a remote update)
  VENUE_UPDATE: (state, { venue }) => {
    doVenueUpdate(state, venue)
    state.venuesEdited[venue.id] = true
  }
}

export const actions = {
  FetchActiveVenues: function (context) {
    context.commit('ACTIVE_VENUES_FETCH_START')

    return useNuxtApp().$apiService.get('/venues?includeDeleted=no')
      .then((data) => {
        context.commit('ACTIVE_VENUES_FETCH_SUCCESS', data.venues)
      })
      .catch((error) => {
        context.commit('ACTIVE_VENUES_FETCH_FAIL', error)

        // TODO (CAW): here for backwards compatability, one day we should rethink this and allow individual pages to handle error
        context.commit(
          'ui/SHOW_NOTIFICATIONS',
          {
            open: true,
            message: 'Hmmm... unable to get venue data. Please contact us and we will figure out what went wrong.'
          },
          { root: true })

        console.error(error)
      })
  },

  FetchDeletedVenues: function (context) {
    context.commit('DELETED_VENUES_FETCH_START')

    return useNuxtApp().$apiService.get('/venues?includeDeleted=only')
      .then((_response) => {
        context.commit('DELETED_VENUES_FETCH_SUCCESS', _response.venues)
      })
      .catch((error) => {
        context.commit('DELETED_VENUES_FETCH_FAIL', error)
      })
  },

  FetchGpsCoordinatesFromUrl: function (context, { street, city, state, zip }) {
    context.commit('GPS_COORDINATES_FETCH_START')

    return useNuxtApp().$apiService.post('/venues/get-gps-from-address', { street, city, state, zip })
      .then((response) => {
        context.commit('GPS_COORDINATES_FETCH_SUCCESS', response.gpsCoordinates)

        return response.gpsCoordinates
      })
      .catch((error) => {
        console.error('error fetching gps coordinates: ', error);
        context.commit('GPS_COORDINATES_FETCH_FAIL', error)
        context.commit(
          'ui/SHOW_NOTIFICATIONS',
          {
            open: true,
            message: 'Unable to get coordinates from url.'
          },
          { root: true })
      })
  },

  DeleteVenue: function (context, { id, idToken }) {
    context.commit('VENUE_DELETE_START')

    return useNuxtApp().$apiService.delete(`/authenticated/venues/${id}`, idToken)
      .then((response) => {
        context.commit('VENUE_DELETE_SUCCESS', { id, venue: response.venue })
      })
      .catch((error) => {
        context.commit(
          COMMIT_SHOW_NOTIFICATIONS,
          { open: true, message: `Failed to soft delete venue ${error}` },
          { root: true }
        )

        context.commit('VENUE_DELETE_FAIL', error)
      })
  },

  ActivateVenue: function (context, { id, idToken }) {
    context.commit('VENUE_ACTIVATE_START')

    return useNuxtApp().$apiService.put(`/authenticated/venues/${id}/activate`, null, idToken)
      .then((response) => {
        context.commit('VENUE_ACTIVATE_SUCCESS', { id, venue: response.venue })
      })
      .catch((error) => {
        context.commit(
          COMMIT_SHOW_NOTIFICATIONS,
          { open: true, message: `Failed to reactivate venue: ${error}` },
          { root: true }
        )

        context.commit('VENUE_ACTIVATE_FAIL', error)
      })
  },

  UpdateVenue: function (context, { venue, idToken }) {
    context.commit('VENUE_UPDATE_START', { id: venue.id })

    return useNuxtApp().$apiService.put(`/authenticated/venues/${venue.id}`, venue, idToken)
      .then((response) => {
        context.commit('VENUE_UPDATE_SUCCESS', { venue: response.venue })
      })
      .catch((error) => {
        context.commit(
          COMMIT_SHOW_NOTIFICATIONS,
          { open: true, message: `Failed to update venue: ${error}` },
          { root: true }
        )

        context.commit('VENUE_UPDATE_FAIL', error)
      })
  },

  ReplaceVenue: function (context, { oldVenue, newVenue, idToken }) {
    const id = oldVenue.id

    context.commit('VENUE_REPLACE_START', { id: oldVenue.id })

    useNuxtApp().$apiService.delete(`/authenticated/venues/${id}`, idToken)
      .then(() => {
        return useNuxtApp().$apiService.post('/venues', newVenue, idToken)
      }).then((response) => {
        context.commit('VENUE_REPLACE_SUCCESS', { oldVenue, newVenue: response.venue })
      })
      .catch((error) => {
        context.commit(
          COMMIT_SHOW_NOTIFICATIONS,
          { open: true, message: `Failed to replace venue ${error}` },
          { root: true }
        )

        context.commit('VENUE_REPLACE_FAIL', oldVenue.id, error)
      })
  }
}

export const COMMIT_VENUE_UPDATE = 'venues/VENUE_UPDATE'
export const COMMIT_VENUE_CHANGE_ACTIVE_FILTER_STATE = 'venues/VENUE_CHANGE_ACTIVE_FILTER_STATE'

export const FETCH_ACTIVE_VENUES = 'venues/FetchActiveVenues'
export const FETCH_DELETED_VENUES = 'venues/FetchDeletedVenues'
export const FETCH_GPS_COORDINATES_FROM_URL = 'venues/FetchGpsCoordinatesFromUrl'
export const UPDATE_VENUE = 'venues/UpdateVenue'
export const REPLACE_VENUE = 'venues/ReplaceVenue'
export const DELETE_VENUE = 'venues/DeleteVenue'
export const ACTIVATE_VENUE = 'venues/ActivateVenue'
