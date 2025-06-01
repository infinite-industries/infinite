import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// this *must* be loaded client-only due to Quill's dependency on the document

export default defineNuxtPlugin({
  name: 'vue3-editor',
  async setup (nuxtApp) {
    nuxtApp.vueApp.component('QuillEditor', QuillEditor)
  }
})
