export const FETCH_PARTNER_BY_NAME = 'FetchPartnerByName'

export const state = () => {
  return {
    partner: null,
    loading: false,
    error: null
  }
}

export const getters = {
  GetPartner: (state) => {
    return state.partner
  },
  IsPartnerLoading: (state) => {
    return state.loading
  },
  GetPartnerError: (state) => {
    return state.error
  }
}

export const mutations = {
  PARTNER_FETCH_START: (state) => {
    state.loading = true
    state.error = null
  },
  PARTNER_FETCH_SUCCESS: (state, partner) => {
    state.partner = partner
    state.loading = false
    state.error = null
  },
  PARTNER_FETCH_FAIL: (state, error) => {
    state.partner = null
    state.loading = false
    state.error = error
  },
  CLEAR_PARTNER: (state) => {
    state.partner = null
    state.loading = false
    state.error = null
  }
}

export const actions = {
  FetchPartnerByName: function (context, { partnerName }) {
    console.log('!!! in FETCH');
    context.commit('PARTNER_FETCH_START')

    return useNuxtApp().$apiService.get(`/partners/name/${partnerName}`)
      .then((response) => {
        context.commit('PARTNER_FETCH_SUCCESS', response)

        return response;
      })
      .catch((error) => {
        console.error('Error fetching partner by name:', error)
        context.commit('PARTNER_FETCH_FAIL', error)
        throw error
      })
  },

  ClearPartner: function (context) {
    context.commit('CLEAR_PARTNER')
  }
}
