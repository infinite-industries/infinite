import { useRoute } from 'vue-router'

export const state = () => ({
  // string | null
  name: null,
  // { id: string; name: string; light_logo_url: string; dark_logo_url: string } | null
  partner: null,
  // boolean
  showOnlyPartnerEvents: false,
})

export const getters = {
  partner: (state) => {
    return state.partner
  },
  showOnlyPartnerEvents: (state) => {
    return state.showOnlyPartnerEvents ?? false;
  }
}

export const mutations = {
  SET_PARTNER: (state, payload) => {
    state.name = payload?.name ?? null
    state.partner = payload
  },
  SET_SHOW_ONLY_PARTNER_EVENTS: (state, payload) => {
    state.showOnlyPartnerEvents = payload && payload.toLowerCase() === "partner"
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
  }
}
