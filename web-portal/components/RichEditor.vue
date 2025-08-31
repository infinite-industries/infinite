<template>
  <div>
    <quill-editor
      v-model:content="model"
      content-type="html"
      :toolbar="toolbar"
      theme="snow"
      class="rich-editor"
      v-bind="$attrs"
    />

  </div>
</template>

<script setup>
  const model = defineModel()
  defineOptions({
    inheritAttrs: false
  })

  // custom toolbar based on the defaults in the old Vue 2 wrapper we've always
  // used
  // https://github.com/davidroyer/vue2-editor/blob/master/src/helpers/default-toolbar.js
  const toolbar = [
    [{ header: [false, 1, 2, 3, 4, 5, 6] }],
    ["bold", "italic", "underline", "strike"],
    [
      { align: "" },
      { align: "center" },
      { align: "right" },
      { align: "justify" }
    ],
    ["blockquote", "code-block"],
    // checklists aren't really useful for events
    [{ list: "ordered" }, { list: "bullet" } /*, { list: "check" } */],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ color: [] }, { background: [] }],
    // we don't have an image/video upload solution, and base64-encoding is...
    // problematic for our database instance
    // this doesn't prevent copy-paste of HTML with images but should minimize
    // deliberate media uploads
    ["link" /*, "image", "video" */],
    ["clean"]
  ]
</script>

<style scoped>
  /* styling copied from old Vue 2 wrapper */
  :deep(.rich-editor) .ql-editor {
    min-height: 200px;
  }
</style>
