import { useRoute } from 'vue-router'

export const state = () => ({
  // string | null
  name: null,
  // { id: string; name: string; light_logo_url: string; dark_logo_url: string } | null
  partner: null
})

export const getters = {
  partner: (state) => {
    return state.partner
  }
}

export const mutations = {
  SET_PARTNER: (state, payload) => {
    state.name = payload?.name ?? null
    state.partner = payload
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
      }
    }
  }
}
