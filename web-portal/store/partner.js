import { useRoute } from 'vue-router'

export const state = () => ({
  // string | null
  name: null,
  // { id: string; name: string; light_logo_url: string; dark_logo_url: string } | null
  partner: null,
  // boolean
  showOnlyPartnerEvents: false,
  // Partners list query state
  getPartnersQuery: {
    isFetching: false,
    isSuccess: false,
    error: null,
    data: []
  }
})

export const getters = {
  partner: (state) => {
    return state.partner
  },
  showOnlyPartnerEvents: (state) => {
    return state.showOnlyPartnerEvents ?? false;
  },
  GetActivePartners: (state) => {
    return state.getPartnersQuery
  },
}

export const mutations = {
  SET_PARTNER: (state, payload) => {
    state.name = payload?.name ?? null
    state.partner = payload
  },
  SET_SHOW_ONLY_PARTNER_EVENTS: (state, payload) => {
    state.showOnlyPartnerEvents = payload && payload.toLowerCase() === "partner"
  },
  PARTNERS_FETCH_START(state) {
    state.getPartnersQuery.isFetching = true;
    state.getPartnersQuery.isSuccess = false;
    state.getPartnersQuery.error = null;
  },
  PARTNERS_FETCH_SUCCESS(state, data) {
    state.getPartnersQuery.data = Array.isArray(data?.partners) ? data.partners : [];
    state.getPartnersQuery.isFetching = false;
    state.getPartnersQuery.isSuccess = true;
  },
  PARTNERS_FETCH_FAIL(state, error) {
    state.getPartnersQuery.isFetching = false;
    state.getPartnersQuery.isSuccess = false;
    state.getPartnersQuery.error = error;
  }
}

export const actions = {
  LoadPartner: async (context) => {
    const { query } = useRoute();
    if (query.partner && query.partner !== context.state.name) {
      const { data, error } = await useAsyncData('partner-fetch', () =>
        useNuxtApp().$apiService.get(`/partners/name/${query.partner}`)
          .catch(() => null) // eat 404s to avoid breaking everything
      )

      if (error.value) {
        console.error(error, error.value)
      } else {
        context.commit('SET_PARTNER', data.value)
        if (typeof query.only !== 'undefined') {
          context.commit('SET_SHOW_ONLY_PARTNER_EVENTS', query.only)
        }
      }
    }
  },
  FetchPartners: function (context, { apiService } = {}) {
    context.commit('PARTNERS_FETCH_START')

    if (!apiService) {
      const error = new Error('apiService is required to fetch partner data')
      context.commit('PARTNERS_FETCH_FAIL', error)
      console.error(error)
      return Promise.reject(error)
    }

    return apiService.get('/authenticated/partners')
      .then((data) => {
        context.commit('PARTNERS_FETCH_SUCCESS', data)
      })
      .catch((error) => {
        context.commit('PARTNERS_FETCH_FAIL', error)
        // Global alert popup
        context.commit(
          'ui/SHOW_NOTIFICATIONS',
          {
            open: true,
            message: 'Hmmm... unable to get partner data. Please contact us and we will figure out what went wrong.'
          },
          { root: true })

        console.error(error)
      })
  }
}

export const FETCH_PARTNERS = 'partner/FetchPartners'
