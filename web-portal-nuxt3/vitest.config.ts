import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
      }
    },
    watch: false
  }
})
