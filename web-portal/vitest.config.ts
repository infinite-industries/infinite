import { defineVitestConfig } from '@nuxt/test-utils/config'

export default defineVitestConfig({
  test: {
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    globals: true,
    environment: 'nuxt',
    environmentOptions: {
      nuxt: {
        domEnvironment: 'jsdom',
      }
    },
    coverage: {
      enabled: true,
      include: [
        'components/**/*.vue',
        'composables/**/*.js',
        'pages/**/*.vue',
        'services/**/*.js'
      ]
    },
    watch: false
  }
})
